import lunr from 'lunr';
import type { SearchIndexItem, SearchResult, DataCategory } from '../types';

interface SearchIndex {
  index: lunr.Index;
  items: SearchIndexItem[];
  documentsById: Map<string, SearchIndexItem>;
}

class SimpleSearchServiceClass {
  private indices = new Map<string, SearchIndex>();
  private globalIndex: SearchIndex | null = null;

  createIndex(items: SearchIndexItem[], category?: DataCategory): SearchIndex {
    const documentsById = new Map<string, SearchIndexItem>();
    
    // Create Lunr index
    const index = lunr(function() {
      this.ref('id');
      this.field('name', { boost: 15 }); // Increased boost for exact name matches
      this.field('searchableText', { boost: 5 }); // High boost for content text
      this.field('type', { boost: 4 }); // Increased for types like "flying"
      this.field('school', { boost: 4 });
      this.field('category', { boost: 3 });
      this.field('source', { boost: 2 });
      this.field('rarity', { boost: 2 });

      // Add documents to index
      items.forEach((item, idx) => {
        const id = `${item.name}_${item.source}_${idx}`;
        const doc = {
          id,
          name: item.name,
          source: item.source,
          category: item.category,
          type: item.type || '',
          school: item.school || '',
          rarity: item.rarity || '',
          searchableText: item.searchableText || '' // Include enhanced searchable content
        };

        documentsById.set(id, item);
        this.add(doc);
      });
    });

    const searchIndex: SearchIndex = { 
      index, 
      items, 
      documentsById 
    };
    
    // Cache the index
    const key = category || 'global';
    this.indices.set(key, searchIndex);
    
    return searchIndex;
  }

  async buildCategoryIndex(items: SearchIndexItem[], category: DataCategory): Promise<void> {
    this.createIndex(items, category);
  }

  async buildGlobalIndex(items: SearchIndexItem[]): Promise<void> {
    this.globalIndex = this.createIndex(items);
  }

  search(query: string, category?: DataCategory, options: {
    limit?: number;
    fuzzy?: boolean;
  } = {}): SearchResult[] {
    if (!query.trim()) return [];

    const { limit = 20, fuzzy = true } = options;

    // Get the appropriate index
    let searchIndex: SearchIndex | null = null;
    
    if (category) {
      searchIndex = this.indices.get(category) || null;
    } else {
      searchIndex = this.globalIndex;
    }

    if (!searchIndex) {
      console.warn(`Search index not found for category: ${category || 'global'}`);
      return [];
    }

    try {
      // Build search query
      let searchQuery = query;
      if (fuzzy) {
        // Add fuzzy matching for each term
        const terms = query.split(/\s+/).filter(term => term.length > 0);
        searchQuery = terms.map(term => {
          if (term.length >= 3) {
            return `${term}~1 ${term}*`; // fuzzy + wildcard for 3+ chars
          } else {
            return `${term}*`; // just wildcard for very short terms
          }
        }).join(' ');
      }

      // Perform the search
      const results = searchIndex.index.search(searchQuery);
      
      // Convert results to SearchResult format
      const rawResults: SearchResult[] = results
        .map(result => {
          const item = searchIndex!.documentsById.get(result.ref);
          
          if (!item) {
            console.warn('Could not find original item for search result:', result.ref);
            return null;
          }

          return {
            ...item,
            score: result.score,
            matches: this.extractMatches(query, item)
          } as SearchResult;
        })
        .filter((result): result is SearchResult => result !== null);

      // Deduplicate results by name+category, keeping the best score from primary sources
      const deduplicatedResults = this.deduplicateSearchResults(rawResults);
      
      return deduplicatedResults.slice(0, limit);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  private deduplicateSearchResults(results: SearchResult[]): SearchResult[] {
    const resultMap = new Map<string, SearchResult>();
    
    // Source priority (PHB is highest priority, then official books, then others)
    const getSourcePriority = (source: string): number => {
      const priorities: { [key: string]: number } = {
        'PHB': 100,
        'MM': 90,
        'DMG': 90,
        'XGTE': 80,
        'TCE': 80,
        'VGM': 70,
        'MTF': 70,
        'SCAG': 60,
        'FTOD': 50
      };
      return priorities[source] || 10; // Default low priority for unknown sources
    };

    for (const result of results) {
      const key = `${result.category}:${result.name.toLowerCase()}`;
      const existing = resultMap.get(key);
      
      if (!existing) {
        // First occurrence of this item
        const enhancedResult = {
          ...result,
          availableSources: [result.source] // Track all sources
        };
        resultMap.set(key, enhancedResult);
      } else {
        // Duplicate found - merge sources and pick best result
        const existingPriority = getSourcePriority(existing.source);
        const newPriority = getSourcePriority(result.source);
        
        // Add this source to the available sources list
        if (!existing.availableSources) existing.availableSources = [existing.source];
        if (!existing.availableSources.includes(result.source)) {
          existing.availableSources.push(result.source);
        }
        
        // Keep the result with higher priority source, or higher score if same priority
        if (newPriority > existingPriority || 
            (newPriority === existingPriority && result.score > existing.score)) {
          resultMap.set(key, {
            ...result,
            availableSources: existing.availableSources
          });
        }
      }
    }
    
    // Convert map back to array and sort by score
    return Array.from(resultMap.values())
      .sort((a, b) => b.score - a.score);
  }

  private extractMatches(query: string, item: SearchIndexItem): string[] {
    const matches: string[] = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);

    const fields = ['name', 'source', 'type', 'school', 'category', 'searchableText'];
    
    fields.forEach(field => {
      const value = (item as any)[field];
      if (typeof value === 'string') {
        const valueLower = value.toLowerCase();
        
        // Check for exact phrase match
        if (valueLower.includes(queryLower)) {
          matches.push(`${field}:exact`);
          return;
        }
        
        // Check for word matches
        queryWords.forEach(word => {
          if (valueLower.includes(word)) {
            matches.push(`${field}:${word}`);
          }
        });
      }
    });

    return [...new Set(matches)]; // Remove duplicates
  }

  // Advanced search with filters
  searchWithFilters(
    query: string, 
    category?: DataCategory,
    filters: {
      source?: string;
      level?: number;
      school?: string;
      type?: string;
      cr?: string;
      rarity?: string;
    } = {},
    options: {
      limit?: number;
      fuzzy?: boolean;
    } = {}
  ): SearchResult[] {
    // First perform the text search
    let results = this.search(query, category, options);

    // Apply filters
    if (Object.keys(filters).length > 0) {
      results = results.filter(item => {
        // Source filter
        if (filters.source && item.source !== filters.source) {
          return false;
        }

        // Level filter (for spells)
        if (filters.level !== undefined && item.level !== filters.level) {
          return false;
        }

        // School filter (for spells)
        if (filters.school && item.school !== filters.school) {
          return false;
        }

        // Type filter
        if (filters.type && item.type !== filters.type) {
          return false;
        }

        // CR filter (for monsters)
        if (filters.cr && item.cr?.toString() !== filters.cr) {
          return false;
        }

        // Rarity filter (for items)
        if (filters.rarity && item.rarity !== filters.rarity) {
          return false;
        }

        return true;
      });
    }

    return results;
  }

  // Get suggestions for autocomplete
  getSuggestions(query: string, category?: DataCategory, limit = 5): string[] {
    if (!query.trim()) return [];

    const searchIndex = category ? 
      this.indices.get(category) : 
      this.globalIndex;

    if (!searchIndex) return [];

    // Get items that start with the query
    const suggestions = searchIndex.items
      .filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()))
      .map(item => item.name)
      .slice(0, limit);

    // If we don't have enough suggestions, try partial matches
    if (suggestions.length < limit) {
      const partialMatches = searchIndex.items
        .filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) &&
          !suggestions.includes(item.name)
        )
        .map(item => item.name)
        .slice(0, limit - suggestions.length);
      
      suggestions.push(...partialMatches);
    }

    return [...new Set(suggestions)];
  }

  // Clear all indices
  clearIndices(): void {
    this.indices.clear();
    this.globalIndex = null;
  }

  // Check if index exists
  hasIndex(category?: DataCategory): boolean {
    const key = category || 'global';
    return category ? 
      this.indices.has(key) : 
      this.globalIndex !== null;
  }
}

export const SimpleSearchService = new SimpleSearchServiceClass();