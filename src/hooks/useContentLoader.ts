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
      // First try to load from the specified source
      let fullData: any[] = [];
      let foundItem: any = null;
      
      try {
        fullData = await DataService.loadFullData(result.category, result.source);
        foundItem = fullData.find(item => 
          item.name === result.name || 
          item.name.toLowerCase() === result.name.toLowerCase()
        );
      } catch (sourceError) {
        console.warn(`Failed to load from source ${result.source}, trying to find item across all sources`);
      }

      // If not found in the specified source, try to find it by searching through the index
      if (!foundItem) {
        // Load the full index to find the correct source
        const indexItems = await DataService.loadIndex(result.category);
        const indexItem = indexItems.find(item => 
          item.name.toLowerCase() === result.name.toLowerCase() ||
          item.name === result.name
        );
        
        if (indexItem) {
          // Try loading from the correct source found in index
          try {
            fullData = await DataService.loadFullData(result.category, indexItem.source);
            foundItem = fullData.find(item => 
              item.name === result.name || 
              item.name.toLowerCase() === result.name.toLowerCase()
            );
          } catch (indexSourceError) {
            console.warn(`Failed to load from index source ${indexItem.source}`);
          }
        }
      }

      // If still not found, try common default sources
      if (!foundItem) {
        const defaultSources = ['PHB', 'MM', 'DMG', 'XGTE', 'TCE'];
        for (const defaultSource of defaultSources) {
          try {
            fullData = await DataService.loadFullData(result.category, defaultSource);
            foundItem = fullData.find(item => 
              item.name === result.name || 
              item.name.toLowerCase() === result.name.toLowerCase()
            );
            if (foundItem) {
              break;
            }
          } catch (error) {
            // Continue to next default source
            continue;
          }
        }
      }

      if (!foundItem) {
        throw new Error(`Item "${result.name}" not found in any ${result.category} data sources`);
      }

      const successState: ContentState = { data: foundItem, loading: false, error: null };
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