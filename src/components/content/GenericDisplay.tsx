import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';

interface GenericDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function GenericDisplay({ result, content, onClose }: GenericDisplayProps) {
  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        {content.entries && <ContentEntries entries={content.entries} />}
        
        {/* Generic display of other properties */}
        {Object.entries(content).map(([key, value]: [string, any]) => {
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