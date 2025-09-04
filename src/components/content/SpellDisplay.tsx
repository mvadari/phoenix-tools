import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';

interface SpellDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function SpellDisplay({ result, content, onClose }: SpellDisplayProps) {
  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        <div className="spell-details">
          {content.level !== undefined && (
            <div className="detail-row">
              <strong>Level:</strong> {content.level === 0 ? 'Cantrip' : content.level}
            </div>
          )}
          {content.school && (
            <div className="detail-row">
              <strong>School:</strong> {content.school}
            </div>
          )}
          {content.time && (
            <div className="detail-row">
              <strong>Casting Time:</strong> {
                Array.isArray(content.time) ? 
                  content.time.map((t: any) => `${t.number} ${t.unit}`).join(', ') :
                  'Unknown'
              }
            </div>
          )}
          {content.range && (
            <div className="detail-row">
              <strong>Range:</strong> {
                (content.range.distance ? 
                  (content.range.distance.amount
                    ? `${content.range.distance.amount} ${content.range.distance.type}`
                    : content.range.distance.type)
                  + `, ${content.range.type}` :
                  content.range.type)
              }
            </div>
          )}
          {content.components && (
            <div className="detail-row">
              <strong>Components:</strong> {
                [
                  content.components.v && 'V',
                  content.components.s && 'S',
                  content.components.m && (typeof content.components.m === 'string' ? `M (${content.components.m})` : 'M')
                ].filter(Boolean).join(', ')
              }
            </div>
          )}
          {content.duration && (
            <div className="detail-row">
              <strong>Duration:</strong> {
                Array.isArray(content.duration) ?
                  content.duration.map((d: any) => 
                    d.duration ? `${d.duration.amount} ${d.duration.type}` : d.type
                  ).join(', ') :
                  'Unknown'
              }
            </div>
          )}
        </div>

        {content.entries && <ContentEntries entries={content.entries} />}
        
        {content.entriesHigherLevel && (
          <div className="higher-level-entries">
            <ContentEntries entries={content.entriesHigherLevel} />
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}