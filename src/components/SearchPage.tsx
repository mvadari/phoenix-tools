import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks';
import type { DataCategory, SearchResult as SearchResultType } from '../types';
import SearchInput from './SearchInput';
import CategoryFilter from './CategoryFilter';
import SearchResults from './SearchResults';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | undefined>();
  
  // Initialize state from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category') as DataCategory;
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);
  
  const { 
    query, 
    setQuery, 
    results, 
    suggestions, 
    loading, 
    error, 
    initialized,
    indexItems 
  } = useSearch({ 
    category: selectedCategory,
    debounceMs: 300,
    initialQuery: searchParams.get('q') || ''
  });

  // Update URL when search parameters change
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    updateSearchParams(newQuery, selectedCategory);
  };

  const handleCategoryChange = (newCategory: DataCategory | undefined) => {
    setSelectedCategory(newCategory);
    updateSearchParams(query, newCategory);
  };

  const updateSearchParams = (currentQuery: string, currentCategory: DataCategory | undefined) => {
    const newParams = new URLSearchParams();
    if (currentQuery.trim()) {
      newParams.set('q', currentQuery);
    }
    if (currentCategory) {
      newParams.set('category', currentCategory);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Calculate category counts from search results when searching, otherwise from all index items
  const categoryCounts = React.useMemo(() => {
    const sourceData = query.trim() ? results : indexItems;
    return sourceData.reduce((counts, item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
      return counts;
    }, {} as Record<DataCategory, number>);
  }, [indexItems, results, query]);

  // Deduplicate function (same logic as SimpleSearchService)
  const deduplicateIndexItems = (items: typeof indexItems): SearchResultType[] => {
    const resultMap = new Map<string, SearchResultType>();
    
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

    for (const item of items) {
      const key = `${item.category}:${item.name.toLowerCase()}`;
      const existing = resultMap.get(key);
      
      const searchResult: SearchResultType = {
        ...item,
        score: 1, // Default score for non-search display
        matches: []
      };
      
      if (!existing) {
        // First occurrence of this item
        const enhancedResult = {
          ...searchResult,
          availableSources: [item.source] // Track all sources
        };
        resultMap.set(key, enhancedResult);
      } else {
        // Duplicate found - merge sources and pick best result
        const existingPriority = getSourcePriority(existing.source);
        const newPriority = getSourcePriority(item.source);
        
        // Add this source to the available sources list
        if (!existing.availableSources) existing.availableSources = [existing.source];
        if (!existing.availableSources.includes(item.source)) {
          existing.availableSources.push(item.source);
        }
        
        // Keep the result with higher priority source, or higher score if same priority
        if (newPriority > existingPriority) {
          resultMap.set(key, {
            ...searchResult,
            availableSources: existing.availableSources
          });
        }
      }
    }
    
    // Convert map back to array and sort by name
    return Array.from(resultMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Convert index items to display format for showing all items
  const allItemsForDisplay = React.useMemo(() => {
    const itemsToProcess = selectedCategory ? 
      indexItems.filter(item => item.category === selectedCategory) : 
      indexItems;
    
    return deduplicateIndexItems(itemsToProcess);
  }, [indexItems, selectedCategory]);

  if (!initialized) {
    return (
      <div className="search-container">
        <div className="loading">
          Loading search indices...
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <div className="search-header">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          suggestions={suggestions}
          loading={loading}
          placeholder={selectedCategory ? 
            `Search ${selectedCategory}s...` : 
            "Search all D&D 5e content..."
          }
        />
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        counts={categoryCounts}
      />

      <SearchResults
        results={results}
        loading={loading}
        error={error}
        query={query}
        allItems={allItemsForDisplay}
      />

      {initialized && indexItems.length > 0 && (
        <div className="search-stats">
          Search index contains {indexItems.length.toLocaleString()} items across {Object.keys(categoryCounts).length} categories
        </div>
      )}
    </div>
  );
}