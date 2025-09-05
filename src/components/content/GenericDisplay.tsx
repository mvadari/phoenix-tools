import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import { useState } from 'react';
import SourceTabs from './shared/SourceTabs';

interface GenericDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function GenericDisplay({ result, content, onClose }: GenericDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const actualContent = isMultiSource ? currentContent : content;

  if (isMultiSource && !currentContent) {
    // Show source tabs and wait for selection
    return (
      <BaseContentDisplay result={result} content={null} onClose={onClose}>
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          Select a source above to view content
        </div>
      </BaseContentDisplay>
    );
  }

  return (
    <BaseContentDisplay result={result} content={actualContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="content-body">
        {actualContent.entries && <ContentEntries entries={actualContent.entries} />}
        
        {/* Generic display of other properties */}
        {Object.entries(actualContent).map(([key, value]: [string, any]) => {
          if (key === 'entries' || key === 'name' || key === 'source' || key === 'page') {
            return null; // Skip these as they're handled elsewhere
          }
          
          if (typeof value === 'string' || typeof value === 'number') {
            return (
              <div key={key} className="detail-row">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </div>
            );
          }
          
          if (Array.isArray(value)) {
            return (
              <div key={key} className="detail-row">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value.join(', ')}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    </BaseContentDisplay>
  );
}