import type { SearchResult, DataCategory } from '../types';

/**
 * Converts a string to a URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Converts a slug back to a more readable format for matching
 */
export function slugToText(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .toLowerCase();
}

/**
 * Creates a URL path for a piece of content
 */
export function createContentPath(result: SearchResult): string {
  const categorySlug = createSlug(result.category);
  const sourceSlug = createSlug(result.source);
  const nameSlug = createSlug(result.name);
  
  return `/${categorySlug}/${sourceSlug}/${nameSlug}`;
}

/**
 * Parses URL parameters to extract content information
 */
export interface ContentParams {
  category: DataCategory;
  source: string;
  slug: string;
}

export function parseContentParams(params: { category?: string; source?: string; slug?: string }): ContentParams | null {
  if (!params.category || !params.source || !params.slug) {
    return null;
  }

  // Convert category slug back to DataCategory
  const category = params.category as DataCategory;
  
  return {
    category,
    source: params.source,
    slug: params.slug
  };
}

/**
 * Creates a search result from URL parameters for content loading
 */
export function createSearchResultFromParams(params: ContentParams, name?: string): SearchResult {
  return {
    name: name || slugToText(params.slug),
    source: params.source,
    category: params.category,
    score: 1,
    matches: []
  };
}

/**
 * Validates if a category string is a valid DataCategory
 */
export function isValidCategory(category: string): category is DataCategory {
  const validCategories = [
    'spell', 'class', 'monster', 'background', 'item', 'feat', 'race',
    'action', 'adventure', 'deity', 'condition', 'reward', 'variant-rule', 'table'
  ];
  return validCategories.includes(category);
}