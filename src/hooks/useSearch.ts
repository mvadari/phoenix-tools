import { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../services';
import type { DataCategory, SearchResult, SearchIndexItem } from '../types';

interface UseSearchOptions {
  category?: DataCategory;
  filters?: {
    source?: string;
    level?: number;
    school?: string;
    type?: string;
    cr?: string;
    rarity?: string;
  };
  debounceMs?: number;
}

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  indexItems: SearchIndexItem[];
}

let initializationPromise: Promise<void> | null = null;

export function useSearch(options: UseSearchOptions = {}): UseSearchResult {
  const { category, filters, debounceMs = 300 } = options;
  
  // Memoize filters to prevent infinite re-renders
  const stableFilters = useMemo(() => filters || {}, [filters]);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [indexItems, setIndexItems] = useState<SearchIndexItem[]>([]);

  // Initialize data and search indices
  useEffect(() => {
    const initializeSearch = async () => {
      if (initializationPromise) {
        await initializationPromise;
        setInitialized(true);
        return;
      }

      initializationPromise = (async () => {
        try {
          setLoading(true);
          setError(null);

          if (category != null) {
            // Load specific category
            const categoryItems = await DataService.loadIndex(category);
            setIndexItems(categoryItems);
          } else {
            // Load global index
            const allItems = await DataService.loadGlobalIndex();
            setIndexItems(allItems);
          }
        } catch (err) {
          console.error('Failed to initialize search:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize search');
        } finally {
          setLoading(false);
        }
      })();

      await initializationPromise;
      setInitialized(true);
    };

    initializeSearch();
  }, [category]);

  // Debounced search
  useEffect(() => {
    if (!initialized || !query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        // Get search results
        const searchResults = Object.keys(stableFilters).length > 0
          ? await DataService.searchWithFilters(query, category, stableFilters)
          : await DataService.search(query, category);

        // Get suggestions
        const searchSuggestions = DataService.getSuggestions(query, category);

        setResults(searchResults);
        setSuggestions(searchSuggestions);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, category, stableFilters, initialized, debounceMs]);

  // Update suggestions when query changes (faster than full search)
  useEffect(() => {
    if (!initialized || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const suggestions = DataService.getSuggestions(query, category);
    setSuggestions(suggestions);
  }, [query, category, initialized]);

  const setQueryCallback = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    query,
    setQuery: setQueryCallback,
    results,
    suggestions,
    loading,
    error,
    initialized,
    indexItems
  };
}