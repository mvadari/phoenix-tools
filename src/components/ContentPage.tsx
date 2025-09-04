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
    loadContent(result).catch((err) => {
      console.error('Failed to load content:', err);
      setError(`Failed to load content: ${err.message}`);
    });
  }, [params, loadContent]);

  const handleClose = () => {
    navigate('/');
  };

  if (error) {
    return (
      <div className="content-error" style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '2rem'
      }}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" style={{
          color: '#007bff',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '1rem'
        }}>
          ← Back to Search
        </Link>
      </div>
    );
  }

  if (!searchResult) {
    return (
      <div className="content-loading" style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '2rem'
      }}>
        <div>Loading content...</div>
      </div>
    );
  }

  const contentState = getContentState(searchResult);

  if (contentState?.loading) {
    return (
      <div className="content-loading" style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '2rem'
      }}>
        <div>Loading {searchResult.name}...</div>
      </div>
    );
  }

  if (contentState?.error) {
    return (
      <div className="content-error" style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '2rem'
      }}>
        <h2>Error Loading Content</h2>
        <p>{contentState.error}</p>
        <Link to="/" style={{
          color: '#007bff',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '1rem'
        }}>
          ← Back to Search
        </Link>
      </div>
    );
  }

  if (!contentState?.data) {
    return (
      <div className="content-not-found" style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '2rem'
      }}>
        <h2>Content Not Found</h2>
        <p>The requested content could not be found.</p>
        <Link to="/" style={{
          color: '#007bff',
          textDecoration: 'none',
          padding: '0.5rem 1rem',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '1rem'
        }}>
          ← Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="content-page">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb" style={{
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Search
        </Link>
        <span style={{ margin: '0 0.5rem', color: '#6c757d' }}>→</span>
        <span style={{ color: '#6c757d', textTransform: 'capitalize' }}>
          {searchResult.category}
        </span>
        <span style={{ margin: '0 0.5rem', color: '#6c757d' }}>→</span>
        <span style={{ fontWeight: 'bold' }}>
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