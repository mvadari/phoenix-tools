import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useContentLoader } from '../hooks/useContentLoader';
import { parseContentParams, createSearchResultFromParams, isValidCategory } from '../utils/routing';
import ContentDisplay from './ContentDisplay';
import type { SearchResult } from '../types';

export default function ContentPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { loadContent, getContentState } = useContentLoader();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const contentParams = parseContentParams(params);
    
    if (!contentParams) {
      setError('Invalid content URL');
      return;
    }

    if (!isValidCategory(contentParams.category)) {
      setError(`Invalid category: ${contentParams.category}`);
      return;
    }

    // Create a search result from URL params for content loading
    const result = createSearchResultFromParams(contentParams);
    setSearchResult(result);
    
    // Load the content
    loadContent(result).then((contentState) => {
      // Update the search result with discovered available sources
      if (contentState?.availableSources && contentState.availableSources.length > 0) {
        setSearchResult(prevResult => ({
          ...prevResult!,
          availableSources: contentState.availableSources
        }));
      }
    }).catch((err) => {
      console.error('Failed to load content:', err);
      setError(`Failed to load content: ${err.message}`);
    });
  }, [params, loadContent]);

  const handleClose = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="content-error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-to-search-link">
          ← Back to Search
        </Link>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className="content-loading">
        <div>Loading content...</div>
      </div>
    );
  }

  const contentState = getContentState(searchResult);

  if (contentState?.loading) {
    return (
      <div className="content-loading">
        <div>Loading {searchResult.name}...</div>
      </div>
    );
  }

  if (contentState?.error) {
    return (
      <div className="content-error">
        <h2>Error Loading Content</h2>
        <p>{contentState.error}</p>
        <Link to="/" className="back-to-search-link">
          ← Back to Search
        </Link>
      </div>
    );
  }

  if (!contentState?.data) {
    return (
      <div className="content-not-found">
        <h2>Content Not Found</h2>
        <p>The requested content could not be found.</p>
        <Link to="/" className="back-to-search-link">
          ← Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="content-page">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          Search
        </Link>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-category">
          {searchResult.category}
        </span>
        <span className="breadcrumb-separator">→</span>
        <span className="breadcrumb-current">
          {searchResult.name}
        </span>
      </div>

      <ContentDisplay
        result={searchResult}
        content={contentState.data}
        onClose={handleClose}
      />
    </div>
  );
}