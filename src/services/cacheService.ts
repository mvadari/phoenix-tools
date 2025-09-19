import localforage from 'localforage';
import type { SearchIndexItem, DataCategory } from '../types';

interface CacheMetadata {
  timestamp: number;
  version: string;
  category: DataCategory;
  source?: string;
}

interface CachedData<T = any> {
  metadata: CacheMetadata;
  data: T;
}

class CacheServiceClass {
  private readonly CACHE_VERSION = '2.2.0'; // Updated for enhanced search index
  private readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
  
  private indexStore: LocalForage;
  private dataStore: LocalForage;
  private metadataStore: LocalForage;

  constructor() {
    // Configure separate stores for different types of data
    this.indexStore = localforage.createInstance({
      name: '5etools',
      storeName: 'search_indices',
      description: 'Search index data for D&D 5e content'
    });

    this.dataStore = localforage.createInstance({
      name: '5etools',
      storeName: 'content_data',
      description: 'Full content data for D&D 5e items'
    });

    this.metadataStore = localforage.createInstance({
      name: '5etools',
      storeName: 'cache_metadata',
      description: 'Cache metadata and timestamps'
    });
  }

  // Index caching methods
  async cacheIndex(category: DataCategory, items: SearchIndexItem[]): Promise<void> {
    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      version: this.CACHE_VERSION,
      category
    };

    const cachedData: CachedData<SearchIndexItem[]> = {
      metadata,
      data: items
    };

    await this.indexStore.setItem(category, cachedData);
  }

  async getCachedIndex(category: DataCategory): Promise<SearchIndexItem[] | null> {
    try {
      const cachedData: CachedData<SearchIndexItem[]> | null = await this.indexStore.getItem(category);
      
      if (cachedData == null || !this.isValidCache(cachedData.metadata)) {
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.warn(`Failed to retrieve cached index for ${category}:`, error);
      return null;
    }
  }

  // Full data caching methods
  async cacheFullData(category: DataCategory, source: string, data: any[]): Promise<void> {
    const key = `${category}-${source}`;
    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      version: this.CACHE_VERSION,
      category,
      source
    };

    const cachedData: CachedData<any[]> = {
      metadata,
      data
    };

    await this.dataStore.setItem(key, cachedData);
  }

  async getCachedFullData(category: DataCategory, source: string): Promise<any[] | null> {
    try {
      const key = `${category}-${source}`;
      const cachedData: CachedData<any[]> | null = await this.dataStore.getItem(key);
      
      if (!cachedData || !this.isValidCache(cachedData.metadata)) {
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.warn(`Failed to retrieve cached data for ${category}/${source}:`, error);
      return null;
    }
  }

  // Global index caching
  async cacheGlobalIndex(items: SearchIndexItem[]): Promise<void> {
    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      version: this.CACHE_VERSION,
      category: 'spell' // dummy category for global index
    };

    const cachedData: CachedData<SearchIndexItem[]> = {
      metadata,
      data: items
    };

    await this.indexStore.setItem('global', cachedData);
  }

  async getCachedGlobalIndex(): Promise<SearchIndexItem[] | null> {
    try {
      const cachedData: CachedData<SearchIndexItem[]> | null = await this.indexStore.getItem('global');
      
      if (!cachedData || !this.isValidCache(cachedData.metadata)) {
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.warn('Failed to retrieve cached global index:', error);
      return null;
    }
  }

  // Cache validation
  private isValidCache(metadata: CacheMetadata): boolean {
    const now = Date.now();
    const age = now - metadata.timestamp;
    
    // Check version compatibility
    if (metadata.version !== this.CACHE_VERSION) {
      return false;
    }

    // Check expiry
    if (age > this.CACHE_EXPIRY_MS) {
      return false;
    }

    return true;
  }

  // Cache management
  async clearCache(): Promise<void> {
    await Promise.all([
      this.indexStore.clear(),
      this.dataStore.clear(),
      this.metadataStore.clear()
    ]);
  }

  async clearFullDataCache(category: DataCategory, source: string): Promise<void> {
    const key = `${category}-${source}`;
    await this.dataStore.removeItem(key);
  }

  async getCacheStats(): Promise<{
    indexCount: number;
    dataCount: number;
    totalSize: string;
  }> {
    try {
      const [indexKeys, dataKeys] = await Promise.all([
        this.indexStore.keys(),
        this.dataStore.keys()
      ]);

      // Estimate size (rough calculation)
      let totalItems = 0;
      for (const key of indexKeys) {
        const data = await this.indexStore.getItem(key);
        if (data && (data as any).data) {
          totalItems += (data as any).data.length;
        }
      }

      for (const key of dataKeys) {
        const data = await this.dataStore.getItem(key);
        if (data && (data as any).data) {
          totalItems += (data as any).data.length;
        }
      }

      // Rough size estimation (each item ~1KB average)
      const estimatedSizeKB = totalItems * 1;
      let sizeStr: string;
      if (estimatedSizeKB > 1024) {
        sizeStr = `${(estimatedSizeKB / 1024).toFixed(1)} MB`;
      } else {
        sizeStr = `${estimatedSizeKB} KB`;
      }

      return {
        indexCount: indexKeys.length,
        dataCount: dataKeys.length,
        totalSize: sizeStr
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        indexCount: 0,
        dataCount: 0,
        totalSize: '0 KB'
      };
    }
  }

  async clearExpiredCache(): Promise<void> {
    try {
      const [indexKeys, dataKeys] = await Promise.all([
        this.indexStore.keys(),
        this.dataStore.keys()
      ]);

      const expiredIndexKeys: string[] = [];
      for (const key of indexKeys) {
        const data = await this.indexStore.getItem(key);
        if (data && (data as any).metadata && !this.isValidCache((data as any).metadata)) {
          expiredIndexKeys.push(key);
        }
      }

      const expiredDataKeys: string[] = [];
      for (const key of dataKeys) {
        const data = await this.dataStore.getItem(key);
        if (data && (data as any).metadata && !this.isValidCache((data as any).metadata)) {
          expiredDataKeys.push(key);
        }
      }

      // Remove expired items
      await Promise.all([
        ...expiredIndexKeys.map(key => this.indexStore.removeItem(key)),
        ...expiredDataKeys.map(key => this.dataStore.removeItem(key))
      ]);

      if (expiredIndexKeys.length > 0 || expiredDataKeys.length > 0) {
        console.log(`Cleared ${expiredIndexKeys.length} expired index items and ${expiredDataKeys.length} expired data items`);
      }
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }

  // Initialize cache on app start
  async initialize(): Promise<void> {
    try {
      // Clear expired items on startup
      await this.clearExpiredCache();
      console.log('Cache service initialized');
    } catch (error) {
      console.error('Failed to initialize cache service:', error);
    }
  }
}

export const CacheService = new CacheServiceClass();