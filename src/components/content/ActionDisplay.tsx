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
        <div className="source-selection-message">
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
      <div className="action-tags">
        {seeAlso.map((actionRef) => {
          // Parse action reference like "Grapple" or "Disarm|DMG"
          const [actionName] = actionRef.split('|');
          const slug = actionName.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <Link
              key={actionRef}
              to={`/action/${slug}`}
              className="action-tag"
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
          <div className="action-timing" data-action-type={actionContent.time[0]?.unit?.toLowerCase() || 'unknown'}>
            <h4>
              Action Type
            </h4>
            <DetailRow name="Time" value={formatTime(actionContent.time)} />
            {actionContent.range && <DetailRow name="Range" value={formatRange(actionContent.range)} />}
          </div>
        )}

        {/* Spell-like Properties */}
        {(actionContent.components || actionContent.duration || actionContent.school) && (
          <div className="spell-properties">
            <h4>
              Spell Properties
            </h4>
            {actionContent.components && <DetailRow name="Components" value={formatComponents(actionContent.components)} />}
            {actionContent.duration && <DetailRow name="Duration" value={formatDuration(actionContent.duration)} />}
            {actionContent.school && <DetailRow name="School" value={actionContent.school} />}
          </div>
        )}

        {/* Action Description */}
        {actionContent.entries && (
          <div className="action-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={actionContent.entries} />
          </div>
        )}

        {/* Higher Level Information */}
        {actionContent.entriesHigherLevel && (
          <div className="higher-level-section">
            <h4>
              At Higher Levels
            </h4>
            <ContentEntries entries={actionContent.entriesHigherLevel} />
          </div>
        )}

        {/* Classes that can use this action */}
        {actionContent.classes && (
          <div className="action-classes">
            <h4>
              Available to Classes
            </h4>
            <div className="class-tags">
              {actionContent.classes.fromClassList?.map((cls: any) => (
                <Link
                  key={cls.name}
                  to={`/class/${cls.name.toLowerCase()}`}
                  className="class-tag"
                >
                  {cls.name}
                </Link>
              )) || []}
            </div>
          </div>
        )}

        {/* Related Actions */}
        {actionContent.seeAlsoAction && actionContent.seeAlsoAction.length > 0 && (
          <div className="related-actions">
            <h4>
              Related Actions
            </h4>
            {formatSeeAlsoActions(actionContent.seeAlsoAction)}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}