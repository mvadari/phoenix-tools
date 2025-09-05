import { useState, useCallback } from 'react';
import { DataService } from '../services';
import type { SearchResult } from '../types';

interface ContentState {
  data: { [source: string]: any } | null; // Multiple sources per item
  loading: boolean;
  error: string | null;
  availableSources?: string[]; // Track which sources have this item
}

export function useContentLoader() {
  const [contentStates, setContentStates] = useState<Map<string, ContentState>>(new Map());

  const loadContent = useCallback(async (result: SearchResult): Promise<ContentState> => {
    const key = `${result.category}-${result.name}`; // Remove source from cache key
    
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
      // Load index to find all sources that contain this item
      const indexItems = await DataService.loadIndex(result.category);
      
      const matchingIndexItems = indexItems.filter(item => {
        // Exact match
        if (item.name === result.name || item.name.toLowerCase() === result.name.toLowerCase()) {
          return true;
        }
        
        // Handle URL slug matches by normalizing both names the same way createSlug does
        const normalizeForSlugMatch = (text: string): string => {
          return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens (same as createSlug)
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
        };
        
        const itemNormalized = normalizeForSlugMatch(item.name);
        const resultNormalized = normalizeForSlugMatch(result.name);
        
        
        return itemNormalized === resultNormalized;
      });

      if (matchingIndexItems.length === 0) {
        throw new Error(`Item "${result.name}" not found in any ${result.category} data sources`);
      }
      

      // Get unique sources that contain this item
      const availableSources = [...new Set(matchingIndexItems.map(item => item.source))];
      
      // Load full data from all sources that contain this item
      const allSourceData: { [source: string]: any } = {};
      
      for (const source of availableSources) {
        try {
          const fullData = await DataService.loadFullData(result.category, source);
          const foundItem = fullData.find(item => {
            // Exact match
            if (item.name === result.name || item.name.toLowerCase() === result.name.toLowerCase()) {
              return true;
            }
            
            // Handle URL slug matches using same normalization as above
            const normalizeForSlugMatch = (text: string): string => {
              return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            };
            
            const itemNormalized = normalizeForSlugMatch(item.name);
            const resultNormalized = normalizeForSlugMatch(result.name);
            
            return itemNormalized === resultNormalized;
          });
          
          if (foundItem) {
            allSourceData[source] = foundItem;
          }
        } catch (sourceError) {
          console.warn(`Failed to load from source ${source}:`, sourceError);
        }
      }

      if (Object.keys(allSourceData).length === 0) {
        throw new Error(`Item "${result.name}" could not be loaded from any source`);
      }

      const successState: ContentState = { 
        data: allSourceData, 
        loading: false, 
        error: null,
        availableSources
      };
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
    const key = `${result.category}-${result.name}`; // Remove source from cache key
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