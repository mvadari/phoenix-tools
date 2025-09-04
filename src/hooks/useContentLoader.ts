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

  const loadContent = useCallback(async (result: SearchResult): Promise<ContentState> => {
    const key = `${result.category}-${result.source}-${result.name}`;
    
    // Check if already loading or loaded and return early if so
    let shouldProceed = true;
    let existingState: ContentState | undefined;
    
    setContentStates(prev => {
      existingState = prev.get(key);
      if (existingState?.loading || existingState?.data) {
        shouldProceed = false;
        return prev;
      }
      
      // Set loading state
      const loadingState: ContentState = { data: null, loading: true, error: null };
      return new Map(prev).set(key, loadingState);
    });
    
    if (!shouldProceed && existingState) {
      return existingState;
    }

    try {
      // First try to load from the specified source
      let fullData: any[] = [];
      let foundItem: any = null;
      
      try {
        fullData = await DataService.loadFullData(result.category, result.source);
        foundItem = fullData.find(item => {
          // Exact match
          if (item.name === result.name || item.name.toLowerCase() === result.name.toLowerCase()) {
            return true;
          }
          
          // Handle URL slug matches - convert both to comparable formats
          const itemSlug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          const resultSlug = result.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          
          return itemSlug === resultSlug;
        });
      } catch (sourceError) {
        console.warn(`Failed to load from source ${result.source}, trying to find item across all sources`);
      }

      // If not found in the specified source, try to find it by searching through the index
      if (!foundItem) {
        // Load the full index to find the correct source
        const indexItems = await DataService.loadIndex(result.category);
        const indexItem = indexItems.find(item => {
          // Exact match
          if (item.name === result.name || item.name.toLowerCase() === result.name.toLowerCase()) {
            return true;
          }
          
          // Handle URL slug matches
          const itemSlug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          const resultSlug = result.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          
          return itemSlug === resultSlug;
        });
        
        if (indexItem) {
          // Try loading from the correct source found in index
          try {
            fullData = await DataService.loadFullData(result.category, indexItem.source);
            foundItem = fullData.find(item => {
              // Exact match
              if (item.name === result.name || item.name.toLowerCase() === result.name.toLowerCase()) {
                return true;
              }
              
              // Handle URL slug matches
              const itemSlug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              const resultSlug = result.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              
              return itemSlug === resultSlug;
            });
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
            foundItem = fullData.find(item => {
              // Exact match
              if (item.name === result.name || item.name.toLowerCase() === result.name.toLowerCase()) {
                return true;
              }
              
              // Handle URL slug matches
              const itemSlug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              const resultSlug = result.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              
              return itemSlug === resultSlug;
            });
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
  }, []);

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