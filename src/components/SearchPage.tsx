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

  // Convert index items to display format for showing all items
  const allItemsForDisplay = React.useMemo(() => {
    if (!selectedCategory) {
      // Show all items when no category selected
      return indexItems.map(item => ({
        ...item,
        score: 1, // Default score for non-search display
        matches: []
      } as SearchResultType));
    } else {
      // Filter by selected category
      return indexItems
        .filter(item => item.category === selectedCategory)
        .map(item => ({
          ...item,
          score: 1,
          matches: []
        } as SearchResultType));
    }
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
        <div className="search-stats" style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '0.9rem',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Search index contains {indexItems.length.toLocaleString()} items across {Object.keys(categoryCounts).length} categories
        </div>
      )}
    </div>
  );
}