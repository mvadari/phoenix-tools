import type { SearchResult as SearchResultType } from '../types';
import SearchResult from './SearchResult';

interface SearchResultsProps {
  results: SearchResultType[];
  loading?: boolean;
  error?: string | null;
  query?: string;
  onResultSelect?: (result: SearchResultType) => void; // Made optional
  allItems?: SearchResultType[]; // All available items to show when no query
}

export default function SearchResults({ 
  results, 
  loading = false, 
  error = null, 
  query = '',
  onResultSelect,
  allItems = []
}: SearchResultsProps) {
  if (error) {
    return (
      <div className="search-results">
        <div className="error">
          <strong>Search Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="search-results">
        <div className="loading">
          Searching...
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    if (allItems.length === 0) {
      return (
        <div className="search-results">
          <div className="search-help" style={{
            textAlign: 'center',
            color: '#6c757d',
            padding: '2rem',
            fontStyle: 'italic'
          }}>
            Loading content...
          </div>
        </div>
      );
    }

    // Show all items when no query
    const displayItems = allItems.slice(0, 50); // Limit to first 50 items for performance
    
    return (
      <div className="search-results">
        <div className="results-header" style={{
          marginBottom: '1rem',
          padding: '0.5rem 0',
          borderBottom: '1px solid #dee2e6',
          color: '#6c757d'
        }}>
          Showing {displayItems.length} of {allItems.length.toLocaleString()} items
          {allItems.length > 50 && (
            <span style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}>
              (start typing to search all items)
            </span>
          )}
        </div>

        <div 
          className="simple-results"
          style={{
            maxHeight: '60vh',
            overflowY: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: '6px'
          }}
        >
          {displayItems.map((result, index) => (
            <SearchResult
              key={`${result.name}-${result.source}-${index}`}
              result={result}
              onSelect={onResultSelect}
            />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results">
        <div className="no-results" style={{
          textAlign: 'center',
          color: '#6c757d',
          padding: '2rem'
        }}>
          <div>No results found for "<strong>{query}</strong>"</div>
          <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
            Try searching with different keywords or check your spelling.
          </div>
        </div>
      </div>
    );
  }

  // Group results by category for better organization
  const groupedResults = results.reduce((groups, result) => {
    if (!groups[result.category]) {
      groups[result.category] = [];
    }
    groups[result.category].push(result);
    return groups;
  }, {} as Record<string, SearchResultType[]>);

  const categoryOrder = ['spell', 'monster', 'item', 'class', 'background', 'feat', 'race', 'action'];
  const sortedCategories = Object.keys(groupedResults).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const shouldGroupByCategory = Object.keys(groupedResults).length > 1 && results.length > 10;

  return (
    <div className="search-results">
      <div className="results-header" style={{
        marginBottom: '1rem',
        padding: '0.5rem 0',
        borderBottom: '1px solid #dee2e6',
        color: '#6c757d'
      }}>
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
      </div>

      {shouldGroupByCategory ? (
        // Grouped view for many results
        <div className="grouped-results">
          {sortedCategories.map(category => (
            <div key={category} className="category-group" style={{ marginBottom: '2rem' }}>
              <h3 style={{
                textTransform: 'capitalize',
                color: '#495057',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {category}s ({groupedResults[category].length})
              </h3>
              <div className="category-results">
                {groupedResults[category].map((result, index) => (
                  <SearchResult
                    key={`${result.name}-${result.source}-${index}`}
                    result={result}
                    onSelect={onResultSelect}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Simple list view for fewer results
        <div className="simple-results">
          {results.map((result, index) => (
            <SearchResult
              key={`${result.name}-${result.source}-${index}`}
              result={result}
              onSelect={onResultSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}