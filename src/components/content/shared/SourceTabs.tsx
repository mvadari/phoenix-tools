import React, { useState } from 'react';

interface SourceTabsProps {
  sources: { [source: string]: any };
  availableSources?: string[];
  onSourceChange: (source: string, content: any) => void;
  primarySource?: string;
}

export default function SourceTabs({ 
  sources, 
  availableSources, 
  onSourceChange, 
  primarySource 
}: SourceTabsProps) {
  // Determine available sources from either the availableSources prop or the keys of sources
  const sourceList = availableSources || Object.keys(sources);
  
  // Determine the initial source (prefer primary, then PHB, then first available)
  const getInitialSource = (): string => {
    if (primarySource && sourceList.includes(primarySource)) {
      return primarySource;
    }
    if (sourceList.includes('PHB')) {
      return 'PHB';
    }
    return sourceList[0];
  };

  const [activeSource, setActiveSource] = useState(getInitialSource());

  // Call the callback with the initial source on mount
  React.useEffect(() => {
    if (sources[activeSource]) {
      onSourceChange(activeSource, sources[activeSource]);
    }
  }, []); // Only run on mount

  const handleSourceChange = (source: string) => {
    setActiveSource(source);
    onSourceChange(source, sources[source]);
  };

  // If only one source, don't show tabs
  if (sourceList.length <= 1) {
    return null;
  }

  const getSourceDisplayName = (source: string): string => {
    const displayNames: { [key: string]: string } = {
      'PHB': 'Player\'s Handbook',
      'MM': 'Monster Manual',
      'DMG': 'Dungeon Master\'s Guide',
      'XGTE': 'Xanathar\'s Guide to Everything',
      'TCE': 'Tasha\'s Cauldron of Everything',
      'VGM': 'Volo\'s Guide to Monsters',
      'MTF': 'Mordenkainen\'s Tome of Foes',
      'SCAG': 'Sword Coast Adventurer\'s Guide',
      'FTOD': 'Fizban\'s Treasury of Dragons'
    };
    return displayNames[source] || source;
  };

  return (
    <div className="source-tabs" style={{
      marginBottom: '1.5rem',
      borderBottom: '2px solid #dee2e6'
    }}>
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {sourceList.map(source => (
          <button
            key={source}
            onClick={() => handleSourceChange(source)}
            style={{
              padding: '0.75rem 1rem',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              backgroundColor: activeSource === source ? '#007bff' : '#f8f9fa',
              color: activeSource === source ? 'white' : '#495057',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeSource === source ? '600' : '400',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (activeSource !== source) {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }
            }}
            onMouseOut={(e) => {
              if (activeSource !== source) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }
            }}
          >
            <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{source}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              {getSourceDisplayName(source)}
            </span>
          </button>
        ))}
      </div>
      
      {sourceList.length > 1 && (
        <div style={{
          fontSize: '0.8rem',
          color: '#6c757d',
          fontStyle: 'italic',
          marginTop: '0.25rem'
        }}>
          This item appears in {sourceList.length} source{sourceList.length > 1 ? 's' : ''}. 
          Click tabs to view differences.
        </div>
      )}
    </div>
  );
}