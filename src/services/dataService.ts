import type { 
  DataCategory, 
  SearchIndexItem, 
  SearchResult, 
  DataFile, 
  IndexFile,
  Spell,
  Monster,
  Item
} from '../types';
import { SimpleSearchService } from './simpleSearchService';
import { CacheService } from './cacheService';

class DataServiceClass {
  private indexCache = new Map<DataCategory, SearchIndexItem[]>();
  private dataCache = new Map<string, any[]>();
  
  // Category configuration
  private categoryConfig: Record<DataCategory, {
    hasIndex: boolean;
    basePath: string;
    dataKey: string;
    isSubfolder?: boolean;
  }> = {
    spell: { hasIndex: true, basePath: '/data/spells', dataKey: 'spell', isSubfolder: true },
    class: { hasIndex: true, basePath: '/data/class', dataKey: 'class', isSubfolder: true },
    monster: { hasIndex: true, basePath: '/data/bestiary', dataKey: 'monster', isSubfolder: true },
    background: { hasIndex: false, basePath: '/data', dataKey: 'background' },
    item: { hasIndex: false, basePath: '/data', dataKey: 'item' },
    feat: { hasIndex: false, basePath: '/data', dataKey: 'feat' },
    race: { hasIndex: false, basePath: '/data', dataKey: 'race' },
    action: { hasIndex: false, basePath: '/data', dataKey: 'action' },
    adventure: { hasIndex: false, basePath: '/data', dataKey: 'adventure' },
    deity: { hasIndex: false, basePath: '/data', dataKey: 'deity' },
    condition: { hasIndex: false, basePath: '/data', dataKey: 'condition' },
    reward: { hasIndex: false, basePath: '/data', dataKey: 'reward' },
    'variant-rule': { hasIndex: false, basePath: '/data', dataKey: 'variantRule' },
    table: { hasIndex: false, basePath: '/data', dataKey: 'table' },
  };

  async loadIndex(category: DataCategory): Promise<SearchIndexItem[]> {
    // Check memory cache first
    if (this.indexCache.has(category)) {
      return this.indexCache.get(category)!;
    }

    // Check persistent cache
    const cachedIndex = await CacheService.getCachedIndex(category);
    if (cachedIndex) {
      this.indexCache.set(category, cachedIndex);
      await SimpleSearchService.buildCategoryIndex(cachedIndex, category);
      return cachedIndex;
    }

    const config = this.categoryConfig[category];
    let indexItems: SearchIndexItem[] = [];

    if (config.hasIndex) {
      // Load from index file
      indexItems = await this.loadFromIndex(category, config);
    } else {
      // Load from main data file
      indexItems = await this.loadFromMainFile(category, config);
    }

    // Cache the result in memory and persistently
    this.indexCache.set(category, indexItems);
    await CacheService.cacheIndex(category, indexItems);
    
    // Build search index
    await SimpleSearchService.buildCategoryIndex(indexItems, category);
    
    return indexItems;
  }

  private async loadFromIndex(category: DataCategory, config: any): Promise<SearchIndexItem[]> {
    try {
      const indexResponse = await fetch(`${config.basePath}/index.json`);
      if (!indexResponse.ok) throw new Error(`Failed to load ${category} index`);
      
      const indexData: IndexFile = await indexResponse.json();
      const indexItems: SearchIndexItem[] = [];

      // Load minimal data from each source file to build search index
      for (const [source, filename] of Object.entries(indexData)) {
        try {
          const fileResponse = await fetch(`${config.basePath}/${filename}`);
          if (!fileResponse.ok) continue;
          
          const fileData: DataFile = await fileResponse.json();
          const items = fileData[config.dataKey] || [];
          
          // Convert to search index items
          for (const item of items) {
            if (item && item.name) {
              try {
                indexItems.push(this.createSearchIndexItem(item, category, source));
              } catch (error) {
                console.warn(`Skipping invalid item in ${filename}:`, item, error);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to load ${filename} for indexing:`, error);
        }
      }

      return indexItems;
    } catch (error) {
      console.error(`Error loading ${category} index:`, error);
      return [];
    }
  }

  private async loadFromMainFile(category: DataCategory, config: any): Promise<SearchIndexItem[]> {
    try {
      const response = await fetch(`${config.basePath}/${category}s.json`);
      if (!response.ok) throw new Error(`Failed to load ${category} data`);
      
      const fileData: DataFile = await response.json();
      const items = fileData[config.dataKey] || [];
      
      return items.map((item: any) => 
        this.createSearchIndexItem(item, category, item.source || 'Unknown')
      );
    } catch (error) {
      console.error(`Error loading ${category} data:`, error);
      return [];
    }
  }

  private createSearchIndexItem(item: any, category: DataCategory, source: string): SearchIndexItem {
    try {
      const baseItem: SearchIndexItem = {
        name: item.name || 'Unknown',
        source,
        category,
        page: item.page,
      };

      // Add category-specific metadata
      switch (category) {
        case 'spell':
          const spell = item as Spell;
          return { 
            ...baseItem, 
            level: spell.level ?? undefined, 
            school: spell.school || undefined 
          };
        
        case 'monster':
          const monster = item as Monster;
          return { 
            ...baseItem, 
            cr: monster.cr ?? undefined, 
            type: this.getMonsterType(monster.type) 
          };
        
        case 'item':
          const itemData = item as Item;
          return { 
            ...baseItem, 
            type: itemData.type || undefined, 
            rarity: itemData.rarity || undefined 
          };
        
        default:
          return baseItem;
      }
    } catch (error) {
      console.warn(`Failed to create search index item for ${item.name || 'unknown'} in ${category}:`, error);
      // Return minimal item to prevent complete failure
      return {
        name: item.name || 'Unknown',
        source,
        category,
        page: item.page,
      };
    }
  }

  private getMonsterType(type: string | { type: string; tags?: string[] } | undefined | null): string {
    if (!type) return 'unknown';
    return typeof type === 'string' ? type : (type.type || 'unknown');
  }

  async loadFullData(category: DataCategory, source: string): Promise<any[]> {
    const cacheKey = `${category}-${source}`;
    
    // Check memory cache first
    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey)!;
    }

    // Check persistent cache
    const cachedData = await CacheService.getCachedFullData(category, source);
    if (cachedData) {
      this.dataCache.set(cacheKey, cachedData);
      return cachedData;
    }

    const config = this.categoryConfig[category];
    
    try {
      let filename: string;
      
      if (config.hasIndex) {
        // Load index to get filename
        const indexResponse = await fetch(`${config.basePath}/index.json`);
        if (!indexResponse.ok) throw new Error(`Failed to load ${category} index`);
        
        const indexData: IndexFile = await indexResponse.json();
        filename = indexData[source];
        
        if (!filename) {
          throw new Error(`Source ${source} not found in ${category} index`);
        }
      } else {
        filename = `${category}s.json`;
      }

      const response = await fetch(`${config.basePath}/${filename}`);
      if (!response.ok) throw new Error(`Failed to load ${filename}`);
      
      const fileData: DataFile = await response.json();
      const items = fileData[config.dataKey] || [];
      
      // Cache the result in memory and persistently
      this.dataCache.set(cacheKey, items);
      await CacheService.cacheFullData(category, source, items);
      return items;
    } catch (error) {
      console.error(`Error loading full data for ${category}/${source}:`, error);
      return [];
    }
  }

  async loadGlobalIndex(): Promise<SearchIndexItem[]> {
    // Check persistent cache first
    const cachedGlobal = await CacheService.getCachedGlobalIndex();
    if (cachedGlobal) {
      await SimpleSearchService.buildGlobalIndex(cachedGlobal);
      return cachedGlobal;
    }

    const allCategories: DataCategory[] = [
      'spell', 'class', 'monster', 'background', 'item', 'feat', 'race'
    ];
    
    const allItems: SearchIndexItem[] = [];
    
    for (const category of allCategories) {
      try {
        const categoryItems = await this.loadIndex(category);
        allItems.push(...categoryItems);
      } catch (error) {
        console.error(`Failed to load ${category} for global index:`, error);
      }
    }
    
    // Cache global index and build search index
    if (allItems.length > 0) {
      await CacheService.cacheGlobalIndex(allItems);
      await SimpleSearchService.buildGlobalIndex(allItems);
    }
    
    return allItems;
  }

  async search(query: string, category?: DataCategory): Promise<SearchResult[]> {
    return SimpleSearchService.search(query, category);
  }

  async searchWithFilters(
    query: string,
    category?: DataCategory,
    filters: {
      source?: string;
      level?: number;
      school?: string;
      type?: string;
      cr?: string;
      rarity?: string;
    } = {}
  ): Promise<SearchResult[]> {
    return SimpleSearchService.searchWithFilters(query, category, filters);
  }

  getSuggestions(query: string, category?: DataCategory): string[] {
    return SimpleSearchService.getSuggestions(query, category);
  }

  // Cache management methods
  async clearCache(): Promise<void> {
    this.indexCache.clear();
    this.dataCache.clear();
    await CacheService.clearCache();
  }

  async getCacheStats() {
    return await CacheService.getCacheStats();
  }

  async initialize(): Promise<void> {
    await CacheService.initialize();
  }
}

export const DataService = new DataServiceClass();