import { useState, useCallback } from 'react';
import { DataService } from '../services';
import type { SearchResult } from '../types';

interface ContentState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

export function useContentLoader() {
  const [contentStates, setContentStates] = useState<Map<string, ContentState>>(new Map());

  const loadContent = useCallback(async (result: SearchResult) => {
    const key = `${result.category}-${result.source}-${result.name}`;
    
    // Check if already loading or loaded
    const existingState = contentStates.get(key);
    if (existingState?.loading || existingState?.data) {
      return existingState;
    }

    // Set loading state
    const loadingState: ContentState = { data: null, loading: true, error: null };
    setContentStates(prev => new Map(prev).set(key, loadingState));

    try {
      // Load full data for the category/source
      const fullData = await DataService.loadFullData(result.category, result.source);
      
      // Find the specific item
      const item = fullData.find(item => 
        item.name === result.name || 
        item.name.toLowerCase() === result.name.toLowerCase()
      );

      if (!item) {
        throw new Error(`Item "${result.name}" not found in ${result.category} data`);
      }

      const successState: ContentState = { data: item, loading: false, error: null };
      setContentStates(prev => new Map(prev).set(key, successState));
      
      return successState;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load content';
      const errorState: ContentState = { data: null, loading: false, error: errorMessage };
      setContentStates(prev => new Map(prev).set(key, errorState));
      
      return errorState;
    }
  }, [contentStates]);

  const getContentState = useCallback((result: SearchResult): ContentState | null => {
    const key = `${result.category}-${result.source}-${result.name}`;
    return contentStates.get(key) || null;
  }, [contentStates]);

  const clearCache = useCallback(() => {
    setContentStates(new Map());
  }, []);

  return {
    loadContent,
    getContentState,
    clearCache
  };
}