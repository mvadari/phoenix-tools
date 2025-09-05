import { useState } from 'react';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { Link } from 'react-router-dom';
import SourceTabs from './shared/SourceTabs';

interface ActionDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function ActionDisplay({ result, content, onClose }: ActionDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single action object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like action objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const actionContent = isMultiSource ? currentContent : content;
  
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
  const formatTime = (time: any[]): string => {
    if (!time || time.length === 0) return '';
    return time.map((t: any) => `${t.number} ${t.unit}${t.number > 1 ? 's' : ''}`).join(', ');
  };

  const formatRange = (range: any): string => {
    if (!range) return '';
    if (typeof range === 'string') return range;
    if (range.distance) {
      const distance = range.distance.amount 
        ? `${range.distance.amount} ${range.distance.type}`
        : range.distance.type;
      return distance;
    }
    return '';
  };

  const formatSeeAlsoActions = (seeAlso: string[]): React.ReactNode => {
    if (!seeAlso || seeAlso.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {seeAlso.map((actionRef) => {
          // Parse action reference like "Grapple" or "Disarm|DMG"
          const [actionName] = actionRef.split('|');
          const slug = actionName.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <Link
              key={actionRef}
              to={`/action/${slug}`}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                borderRadius: '16px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {actionName}
            </Link>
          );
        })}
      </div>
    );
  };

  const formatComponents = (components: any): string => {
    if (!components) return '';
    const parts: string[] = [];
    if (components.v) parts.push('V');
    if (components.s) parts.push('S');
    if (components.m) {
      if (typeof components.m === 'string') {
        parts.push(`M (${components.m})`);
      } else {
        parts.push('M');
      }
    }
    return parts.join(', ');
  };

  const formatDuration = (duration: any[]): string => {
    if (!duration || duration.length === 0) return '';
    return duration.map((d: any) => {
      if (d.type === 'timed' && d.duration) {
        let result = `${d.duration.number || d.duration.amount} ${d.duration.type}`;
        if (d.concentration) result = `Concentration, up to ${result}`;
        return result;
      }
      if (d.concentration) return `Concentration, ${d.type}`;
      return d.type;
    }).join(', ');
  };

  const getActionTypeColor = (time: any[]): string => {
    if (!time || time.length === 0) return '#6c757d';
    const actionType = time[0].unit?.toLowerCase();
    const colorMap: { [key: string]: string } = {
      'action': '#dc3545',
      'bonus action': '#28a745',
      'reaction': '#ffc107',
      'minute': '#6f42c1',
      'hour': '#17a2b8',
      'free': '#20c997'
    };
    return colorMap[actionType] || '#6c757d';
  };

  return (
    <BaseContentDisplay result={result} content={actionContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="action-display">
        {/* Action Type and Timing */}
        {actionContent.time && (
          <div className="action-timing" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: getActionTypeColor(actionContent.time) + '20',
            borderRadius: '6px',
            borderLeft: `4px solid ${getActionTypeColor(actionContent.time)}`
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: getActionTypeColor(actionContent.time),
              fontSize: '1.1rem'
            }}>
              Action Type
            </h4>
            <DetailRow name="Time" value={formatTime(actionContent.time)} />
            {actionContent.range && <DetailRow name="Range" value={formatRange(actionContent.range)} />}
          </div>
        )}

        {/* Spell-like Properties */}
        {(actionContent.components || actionContent.duration || actionContent.school) && (
          <div className="spell-properties" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#e8f4fd',
            borderRadius: '6px',
            borderLeft: '4px solid #2196f3'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#1976d2',
              fontSize: '1.1rem'
            }}>
              Spell Properties
            </h4>
            {actionContent.components && <DetailRow name="Components" value={formatComponents(actionContent.components)} />}
            {actionContent.duration && <DetailRow name="Duration" value={formatDuration(actionContent.duration)} />}
            {actionContent.school && <DetailRow name="School" value={actionContent.school} />}
          </div>
        )}

        {/* Action Description */}
        {actionContent.entries && (
          <div className="action-description" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ 
              color: '#495057', 
              marginBottom: '1rem',
              borderBottom: '2px solid #dee2e6',
              paddingBottom: '0.5rem'
            }}>
              Description
            </h4>
            <ContentEntries entries={actionContent.entries} />
          </div>
        )}

        {/* Higher Level Information */}
        {actionContent.entriesHigherLevel && (
          <div className="higher-level-section" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            borderLeft: '4px solid #ff9800'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#f57c00',
              fontSize: '1.1rem'
            }}>
              At Higher Levels
            </h4>
            <ContentEntries entries={actionContent.entriesHigherLevel} />
          </div>
        )}

        {/* Classes that can use this action */}
        {actionContent.classes && (
          <div className="action-classes" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f3e5f5',
            borderRadius: '6px',
            borderLeft: '4px solid #9c27b0'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#7b1fa2',
              fontSize: '1.1rem'
            }}>
              Available to Classes
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {actionContent.classes.fromClassList?.map((cls: any) => (
                <Link
                  key={cls.name}
                  to={`/class/${cls.name.toLowerCase()}`}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#e1bee7',
                    color: '#4a148c',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {cls.name}
                </Link>
              )) || []}
            </div>
          </div>
        )}

        {/* Related Actions */}
        {actionContent.seeAlsoAction && actionContent.seeAlsoAction.length > 0 && (
          <div className="related-actions" style={{
            padding: '1rem',
            backgroundColor: '#e8f5e8',
            borderRadius: '6px',
            borderLeft: '4px solid #4caf50'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#2e7d32',
              fontSize: '1.1rem'
            }}>
              Related Actions
            </h4>
            {formatSeeAlsoActions(actionContent.seeAlsoAction)}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}