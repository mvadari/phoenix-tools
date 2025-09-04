import { Link } from 'react-router-dom';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';

interface SpellDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function SpellDisplay({ result, content, onClose }: SpellDisplayProps) {
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
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="spell-display">
        {/* Core Spell Information */}
        <div className="spell-stats" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <div>
            <DetailRow 
              name="Level" 
              value={content.level === 0 ? 'Cantrip' : `${content.level}${content.level === 1 ? 'st' : content.level === 2 ? 'nd' : content.level === 3 ? 'rd' : 'th'} level`} 
            />
            <DetailRow name="School" value={getSchoolName(content.school)} />
          </div>
          <div>
            <DetailRow name="Casting Time" value={formatTime(content.time)} />
            <DetailRow name="Range" value={formatRange(content.range)} />
          </div>
          <div>
            <DetailRow name="Components" value={formatComponents(content.components)} />
            <DetailRow name="Duration" value={formatDuration(content.duration)} />
          </div>
        </div>

        {/* Spell Description */}
        {content.entries && (
          <div className="spell-description" style={{ marginBottom: '1.5rem' }}>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* At Higher Levels */}
        {content.entriesHigherLevel && (
          <div className="higher-level-section" style={{
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
              At Higher Levels
            </h4>
            <ContentEntries entries={content.entriesHigherLevel} />
          </div>
        )}

        {/* Scaling Level Dice */}
        {content.scalingLevelDice && (
          <div className="scaling-dice" style={{
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
              Damage Scaling: {content.scalingLevelDice.label}
            </h4>
            <div style={{ fontFamily: 'monospace' }}>
              {Object.entries(content.scalingLevelDice.scaling).map(([level, dice]) => (
                <div key={level} style={{ marginBottom: '0.25rem' }}>
                  <strong>Level {level}:</strong> {dice as string}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Classes */}
        {content.classes && formatClasses(content.classes).length > 0 && (
          <div className="spell-classes" style={{
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
              {formatClasses(content.classes).map((className) => (
                <Link
                  key={className}
                  to={`/class/phb/${className.toLowerCase()}`}
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
                  {className}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Combat Information */}
        {(content.savingThrow || content.damageInflict || content.conditionInflict) && (
          <div className="combat-info" style={{
            padding: '1rem',
            backgroundColor: '#ffebee',
            borderRadius: '6px',
            borderLeft: '4px solid #f44336'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#c62828',
              fontSize: '1.1rem'
            }}>
              Combat Effects
            </h4>
            {content.savingThrow && (
              <DetailRow name="Saving Throw" value={content.savingThrow.join(', ')} />
            )}
            {content.damageInflict && (
              <DetailRow name="Damage Types" value={content.damageInflict.join(', ')} />
            )}
            {content.conditionInflict && (
              <DetailRow name="Conditions" value={content.conditionInflict.join(', ')} />
            )}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}