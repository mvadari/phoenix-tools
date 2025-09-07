import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult as SearchResultType } from '../types';
import { createContentPath } from '../utils/routing';

interface SearchResultProps {
  result: SearchResultType;
  onSelect?: (result: SearchResultType) => void; // Made optional for backward compatibility
}

export default function SearchResult({ result, onSelect }: SearchResultProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onSelect) {
      // Backward compatibility - if onSelect is provided, use it
      onSelect(result);
    } else {
      // Navigate to the content page
      const path = createContentPath(result);
      navigate(path);
    }
  };

  const formatMetadata = (): string[] => {
    // Show primary source and indicate if there are additional sources
    const primarySource = result.source;
    const additionalSources = result.availableSources?.filter(s => s !== primarySource) || [];
    
    let sourceText = primarySource;
    if (additionalSources.length > 0) {
      sourceText += ` (+${additionalSources.length} more)`;
    }
    
    const meta: string[] = [sourceText];
    
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

  const formatCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      spell: 'Spell',
      monster: 'Bestiary',
      item: 'Item',
      class: 'Class',
      background: 'Background',
      feat: 'Feat',
      race: 'Race',
      action: 'Action',
      deity: 'Deity',
      condition: 'Condition',
      optionalfeature: 'Optional Feature',
      vehicle: 'Vehicle',
      reward: 'Reward',
      psionics: 'Psionic',
      adventure: 'Adventure',
      'variant-rule': 'Variant Rule',
      table: 'Table'
    };
    return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };


  const highlightMatches = (text: string): React.ReactNode => {
    // This is a simple implementation - could be enhanced to highlight actual matches
    return text;
  };

  return (
    <div className="result-item" data-category={result.category} onClick={handleClick}>
      <div className="result-header">
        <div className="result-name">
          {highlightMatches(result.name)} ({formatCategoryName(result.category)})
        </div>
        <div 
          className="result-category"
          data-category={result.category}
        >
          {formatCategoryName(result.category)}
        </div>
      </div>
      
      <div className="result-meta">
        {formatMetadata().join(' • ')}
      </div>

      {result.availableSources && result.availableSources.length > 1 && (
        <div className="available-sources">
          Available in: {result.availableSources.join(', ')}
        </div>
      )}
      
      {result.matches && result.matches.length > 0 && (
        <div className="result-matches">
          Matches: {result.matches.join(', ')}
        </div>
      )}
    </div>
  );
}