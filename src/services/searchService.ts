import elasticlunr from 'elasticlunr';
import type { SearchIndexItem, SearchResult, DataCategory } from '../types';

interface SearchIndex {
  index: elasticlunr.Index<SearchIndexItem>;
  items: SearchIndexItem[];
}

class SearchServiceClass {
  private indices = new Map<string, SearchIndex>();
  private globalIndex: SearchIndex | null = null;

  createIndex(items: SearchIndexItem[], category?: DataCategory): SearchIndex {
    // Create ElasticLunr index
    const index = elasticlunr<SearchIndexItem>(function() {
      this.addField('name');
      this.addField('source');
      this.addField('category');
      this.addField('type');
      this.addField('school');
      this.addField('rarity');
      this.setRef('name');
    });

    // Add documents to index
    items.forEach((item, idx) => {
      try {
        index.addDoc({
          ...item,
          // ElasticLunr requires a unique ref, use combination of name and index
          name: `${item.name}_${idx}`,
        });
      } catch (error) {
        console.warn('Failed to add document to search index:', item.name, error);
      }
    });

    const searchIndex: SearchIndex = { index, items };
    
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
    fields?: string[];
    fuzzy?: boolean;
  } = {}): SearchResult[] {
    if (!query.trim()) return [];

    const {
      limit = 20,
      fields = ['name', 'source', 'type', 'school'],
      fuzzy = true
    } = options;

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
      // Configure search options
      const searchOptions: any = {};
      
      // Add field-specific boosts
      const fieldBoosts = {
        name: 10,     // Name matches are most important
        source: 2,    // Source matches are less important
        type: 3,      // Type matches are moderately important
        school: 3     // School matches are moderately important
      };

      // Build field configuration for search
      fields.forEach(field => {
        if (fieldBoosts[field as keyof typeof fieldBoosts]) {
          searchOptions[field] = {
            boost: fieldBoosts[field as keyof typeof fieldBoosts],
            bool: 'OR',
            expand: fuzzy
          };
        }
      });

      // Perform the search
      const results = searchIndex.index.search(query, searchOptions);
      
      // Convert results to SearchResult format
      const searchResults: SearchResult[] = results
        .slice(0, limit)
        .map(result => {
          // Find the original item by parsing the ref
          const originalName = result.ref.replace(/_\d+$/, '');
          const item = searchIndex.items.find(item => 
            item.name === originalName || 
            item.name.toLowerCase() === originalName.toLowerCase()
          );

          if (!item) {
            console.warn('Could not find original item for search result:', result.ref);
            return null;
          }

          return {
            ...item,
            score: result.score,
            matches: this.extractMatches(query, item, fields)
          } as SearchResult;
        })
        .filter((result): result is SearchResult => result !== null);

      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  private extractMatches(query: string, item: SearchIndexItem, fields: string[]): string[] {
    const matches: string[] = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);

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

export const SearchService = new SearchServiceClass();