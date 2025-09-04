import React, { useState } from 'react';
import { useSearch } from '../hooks';
import { useContentLoader } from '../hooks/useContentLoader';
import type { DataCategory, SearchResult as SearchResultType } from '../types';
import SearchInput from './SearchInput';
import CategoryFilter from './CategoryFilter';
import SearchResults from './SearchResults';
import ContentDisplay from './ContentDisplay';

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | undefined>();
  const [selectedResult, setSelectedResult] = useState<SearchResultType | null>(null);
  
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
    debounceMs: 300 
  });

  const { loadContent, getContentState } = useContentLoader();

  // Calculate category counts from search results when searching, otherwise from all index items
  const categoryCounts = React.useMemo(() => {
    const sourceData = query.trim() ? results : indexItems;
    return sourceData.reduce((counts, item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
      return counts;
    }, {} as Record<DataCategory, number>);
  }, [indexItems, results, query]);

  const handleResultSelect = async (result: SearchResultType) => {
    setSelectedResult(result);
    // Content will be loaded when ContentDisplay component mounts
    await loadContent(result);
  };

  const handleCloseContent = () => {
    setSelectedResult(null);
  };

  const contentState = selectedResult ? getContentState(selectedResult) : null;

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
          onChange={setQuery}
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
        onCategoryChange={setSelectedCategory}
        counts={categoryCounts}
      />

      <SearchResults
        results={results}
        loading={loading}
        error={error}
        query={query}
        onResultSelect={handleResultSelect}
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

      {/* Content Modal */}
      {selectedResult && (
        <div>
          {contentState?.loading && (
            <div className="content-modal-overlay" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div className="loading" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px'
              }}>
                Loading {selectedResult.name}...
              </div>
            </div>
          )}
          
          {contentState?.error && (
            <div className="content-modal-overlay" onClick={handleCloseContent} style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div className="error" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '400px'
              }}>
                <h3>Error Loading Content</h3>
                <p>{contentState.error}</p>
                <button onClick={handleCloseContent}>Close</button>
              </div>
            </div>
          )}
          
          {contentState?.data && (
            <ContentDisplay
              result={selectedResult}
              content={contentState.data}
              onClose={handleCloseContent}
            />
          )}
        </div>
      )}
    </div>
  );
}