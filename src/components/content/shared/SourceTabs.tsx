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
    <div className="source-tabs">
      <div className="tab-container">
        {sourceList.map(source => (
          <button
            key={source}
            onClick={() => handleSourceChange(source)}
            className={`source-tab ${activeSource === source ? 'active' : 'inactive'}`}
          >
            <span className="source-code">{source}</span>
            <span className="source-name">
              {getSourceDisplayName(source)}
            </span>
          </button>
        ))}
      </div>
      
      {sourceList.length > 1 && (
        <div className="tab-info">
          This item appears in {sourceList.length} source{sourceList.length > 1 ? 's' : ''}. 
          Click tabs to view differences.
        </div>
      )}
    </div>
  );
}