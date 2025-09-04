import React from 'react';
import type { SearchResult as SearchResultType } from '../types';

interface SearchResultProps {
  result: SearchResultType;
  onSelect: (result: SearchResultType) => void;
}

export default function SearchResult({ result, onSelect }: SearchResultProps) {
  const handleClick = () => {
    onSelect(result);
  };

  const formatMetadata = (): string[] => {
    const meta: string[] = [result.source];
    
    if (result.page) {
      meta.push(`p. ${result.page}`);
    }
    
    // Add category-specific metadata
    switch (result.category) {
      case 'spell':
        if (result.level !== undefined) {
          meta.push(result.level === 0 ? 'Cantrip' : `Level ${result.level}`);
        }
        if (result.school) {
          meta.push(result.school);
        }
        break;
        
      case 'monster':
        if (result.cr !== undefined) {
          meta.push(`CR ${result.cr}`);
        }
        if (result.type) {
          meta.push(result.type);
        }
        break;
        
      case 'item':
        if (result.type) {
          meta.push(result.type);
        }
        if (result.rarity) {
          meta.push(result.rarity);
        }
        break;
    }
    
    return meta;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      spell: '#8b5cf6',
      monster: '#ef4444', 
      item: '#f59e0b',
      class: '#10b981',
      background: '#06b6d4',
      feat: '#f97316',
      race: '#ec4899',
      action: '#6366f1'
    };
    return colors[category] || '#6b7280';
  };

  const highlightMatches = (text: string): React.ReactNode => {
    // This is a simple implementation - could be enhanced to highlight actual matches
    return text;
  };

  return (
    <div className="result-item" data-category={result.category} onClick={handleClick}>
      <div className="result-header">
        <div className="result-name">
          {highlightMatches(result.name)}
        </div>
        <div 
          className="result-category"
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'capitalize',
            backgroundColor: getCategoryColor(result.category) + '20',
            color: getCategoryColor(result.category),
            marginLeft: '8px'
          }}
        >
          {result.category}
        </div>
      </div>
      
      <div className="result-meta">
        {formatMetadata().join(' • ')}
      </div>
      
      {result.matches && result.matches.length > 0 && (
        <div className="result-matches" style={{
          fontSize: '0.8rem',
          color: '#6c757d',
          marginTop: '4px'
        }}>
          Matches: {result.matches.join(', ')}
        </div>
      )}
      
      <div className="result-score" style={{
        fontSize: '0.7rem',
        color: '#adb5bd',
        textAlign: 'right',
        marginTop: '4px'
      }}>
        Score: {result.score.toFixed(2)}
      </div>
    </div>
  );
}