import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import SourceTabs from './shared/SourceTabs';

interface SpellDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function SpellDisplay({ result, content, onClose }: SpellDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single spell object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like spell objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const spellContent = isMultiSource ? currentContent : content;
  
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
        <div className="loading">
          Select a source above to view content
        </div>
      </BaseContentDisplay>
    );
  }
  const formatTime = (time: any[]): string => {
    return time.map((t: any) => `${t.number} ${t.unit}`).join(', ');
  };

  const formatRange = (range: any): string => {
    if (range.distance) {
      const distance = range.distance.amount 
        ? `${range.distance.amount} ${range.distance.type}`
        : range.distance.type;
      return `${distance} (${range.type})`;
    }
    return range.type;
  };

  const formatComponents = (components: any): string => {
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

  const getSchoolName = (school: string): string => {
    const schools: { [key: string]: string } = {
      'A': 'Abjuration',
      'C': 'Conjuration',
      'D': 'Divination',
      'E': 'Enchantment',
      'V': 'Evocation',
      'I': 'Illusion',
      'N': 'Necromancy',
      'T': 'Transmutation'
    };
    return schools[school] || school;
  };

  const formatClasses = (classes: any): string[] => {
    if (!classes?.fromClassList) return [];
    return classes.fromClassList.map((cls: any) => cls.name);
  };

  return (
    <BaseContentDisplay result={result} content={spellContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="spell-display">
        {/* Core Spell Information */}
        <div className="spell-stats">
          <div>
            <DetailRow 
              name="Level" 
              value={spellContent.level === 0 ? 'Cantrip' : `${spellContent.level}${spellContent.level === 1 ? 'st' : spellContent.level === 2 ? 'nd' : spellContent.level === 3 ? 'rd' : 'th'} level`} 
            />
            <DetailRow name="School" value={getSchoolName(spellContent.school)} />
          </div>
          <div>
            <DetailRow name="Casting Time" value={formatTime(spellContent.time)} />
            <DetailRow name="Range" value={formatRange(spellContent.range)} />
          </div>
          <div>
            <DetailRow name="Components" value={formatComponents(spellContent.components)} />
            <DetailRow name="Duration" value={formatDuration(spellContent.duration)} />
          </div>
        </div>

        {/* Spell Description */}
        {spellContent.entries && (
          <div className="spell-description">
            <ContentEntries entries={spellContent.entries} />
          </div>
        )}

        {/* At Higher Levels */}
        {spellContent.entriesHigherLevel && (
          <div className="higher-level-section">
            <h4>
              At Higher Levels
            </h4>
            <ContentEntries entries={spellContent.entriesHigherLevel} />
          </div>
        )}

        {/* Scaling Level Dice */}
        {spellContent.scalingLevelDice && (
          <div className="scaling-dice">
            <h4>
              Damage Scaling: {spellContent.scalingLevelDice.label}
            </h4>
            <div className="scaling-info">
              {Object.entries(spellContent.scalingLevelDice.scaling).map(([level, dice]) => (
                <div key={level} className="scaling-level">
                  <strong>Level {level}:</strong> {dice as string}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Classes */}
        {spellContent.classes && formatClasses(spellContent.classes).length > 0 && (
          <div className="spell-classes">
            <h4>
              Available to Classes
            </h4>
            <div className="classes-list">
              {formatClasses(spellContent.classes).map((className) => (
                <Link
                  key={className}
                  to={`/class/${className.toLowerCase()}`}
                  className="class-link"
                >
                  {className}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Combat Information */}
        {(spellContent.savingThrow || spellContent.damageInflict || spellContent.conditionInflict) && (
          <div className="combat-info">
            <h4>
              Combat Effects
            </h4>
            {spellContent.savingThrow && (
              <DetailRow name="Saving Throw" value={spellContent.savingThrow.join(', ')} />
            )}
            {spellContent.damageInflict && (
              <DetailRow name="Damage Types" value={spellContent.damageInflict.join(', ')} />
            )}
            {spellContent.conditionInflict && (
              <DetailRow name="Conditions" value={spellContent.conditionInflict.join(', ')} />
            )}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}