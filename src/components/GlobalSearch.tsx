import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function GlobalSearch({ isMobile = false, isOpen = false, onToggle }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch();
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
      if (isMobile && onToggle) onToggle();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      inputRef.current?.blur();
      if (isMobile && onToggle) onToggle();
    }
  };

  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <div className={`global-search ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="global-search-input"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? "Search D&D content..." : "Search spells, monsters, items..."}
        />

        <div className="search-input-icons">
          <button
            className="search-button"
            onClick={handleSearch}
            title="Search"
          >
            🔍
          </button>
        </div>
      </div>

      {isMobile && (
        <button
          className="mobile-search-close"
          onClick={onToggle}
          aria-label="Close search"
        >
          ✕
        </button>
      )}
    </div>
  );
}