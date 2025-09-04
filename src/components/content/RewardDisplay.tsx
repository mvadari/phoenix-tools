import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { PrerequisiteDisplay } from './shared';

interface RewardDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function RewardDisplay({ result, content, onClose }: RewardDisplayProps) {
  const formatRewardType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'Supernatural Gift': 'Supernatural Gift',
      'Epic Boon': 'Epic Boon', 
      'Charm': 'Charm',
      'Blessing': 'Blessing',
      'Boon': 'Boon',
      'Piety Trait': 'Piety Trait',
      'Dark Gift': 'Dark Gift',
      'Feat': 'Feat Reward',
      'Other': 'Special Reward'
    };
    return typeMap[type] || type;
  };

  const getRewardTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'Supernatural Gift': '#8b5cf6',
      'Epic Boon': '#f59e0b',
      'Charm': '#10b981',
      'Blessing': '#3b82f6',
      'Boon': '#6366f1',
      'Piety Trait': '#f97316',
      'Dark Gift': '#dc2626',
      'Feat': '#059669',
      'Other': '#6b7280'
    };
    return colorMap[type] || '#6b7280';
  };

  const formatAdditionalSpells = (additionalSpells: any[]): React.ReactNode => {
    if (!additionalSpells || additionalSpells.length === 0) return null;

    return additionalSpells.map((spellGroup, index) => (
      <div key={index} style={{ marginBottom: '0.5rem' }}>
        {spellGroup.innate && spellGroup.innate._ && (
          <div>
            <strong>Spells Granted:</strong>
            {Object.entries(spellGroup.innate._).map(([frequency, spells]: [string, any]) => (
              <div key={frequency} style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                <strong>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}:</strong>{' '}
                {Array.isArray(spells) ? spells.join(', ') : 
                 typeof spells === 'object' ? Object.values(spells).flat().join(', ') :
                 spells}
              </div>
            ))}
            {spellGroup.ability && (
              <div style={{ marginLeft: '1rem', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
                <strong>Spellcasting Ability:</strong> {spellGroup.ability.toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    ));
  };

  const formatRarity = (rarity: string): React.ReactNode => {
    if (!rarity) return null;
    
    const rarityColors: { [key: string]: string } = {
      'common': '#6c757d',
      'uncommon': '#28a745',
      'rare': '#007bff',
      'very rare': '#6f42c1',
      'legendary': '#fd7e14',
      'artifact': '#dc3545'
    };
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        backgroundColor: rarityColors[rarity.toLowerCase()] + '20' || '#e9ecef',
        color: rarityColors[rarity.toLowerCase()] || '#495057',
        borderRadius: '16px',
        fontSize: '0.875rem',
        fontWeight: '500',
        textTransform: 'capitalize'
      }}>
        {rarity}
      </span>
    );
  };

  const formatLevel = (level: number): string => {
    if (!level) return '';
    return `Level ${level}+`;
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="reward-display">
        {/* Reward Type Header */}
        <div className="reward-type" style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: getRewardTypeColor(content.type) + '20',
          borderRadius: '6px',
          borderLeft: `4px solid ${getRewardTypeColor(content.type)}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h4 style={{ 
              margin: '0', 
              color: getRewardTypeColor(content.type),
              fontSize: '1.1rem'
            }}>
              {formatRewardType(content.type)}
            </h4>
            {content.rarity && formatRarity(content.rarity)}
          </div>
        </div>

        {/* Prerequisites */}
        {content.prerequisite && (
          <PrerequisiteDisplay prerequisite={content.prerequisite} />
        )}

        {/* Reward Properties */}
        {(content.level || content.duration || content.charges) && (
          <div className="reward-properties" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#495057',
              fontSize: '1.1rem'
            }}>
              Properties
            </h4>
            {content.level && <DetailRow name="Minimum Level" value={formatLevel(content.level)} />}
            {content.duration && <DetailRow name="Duration" value={content.duration} />}
            {content.charges && <DetailRow name="Charges" value={content.charges} />}
          </div>
        )}

        {/* Granted Spells */}
        {content.additionalSpells && content.additionalSpells.length > 0 && (
          <div className="reward-spells" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f8ff',
            borderRadius: '6px',
            borderLeft: '4px solid #2196f3'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#1976d2',
              fontSize: '1.1rem'
            }}>
              Magical Abilities
            </h4>
            {formatAdditionalSpells(content.additionalSpells)}
          </div>
        )}

        {/* Reward Description */}
        {content.entries && (
          <div className="reward-description" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ 
              color: '#495057', 
              marginBottom: '1rem',
              borderBottom: '2px solid #dee2e6',
              paddingBottom: '0.5rem'
            }}>
              Description
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Drawbacks/Flaws (for Dark Gifts) */}
        {content.flaws && content.flaws.length > 0 && (
          <div className="reward-flaws" style={{
            marginBottom: '1.5rem',
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
              Drawbacks
            </h4>
            {content.flaws.map((flaw: any, index: number) => (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
                {typeof flaw === 'string' ? flaw : <ContentEntries entries={[flaw]} />}
              </div>
            ))}
          </div>
        )}

        {/* Source/Origin Information */}
        {(content.deity || content.patron || content.source) && (
          <div className="reward-source" style={{
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
              Source
            </h4>
            {content.deity && <DetailRow name="Deity" value={content.deity} />}
            {content.patron && <DetailRow name="Patron" value={content.patron} />}
            {content.source && <DetailRow name="Origin" value={content.source} />}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}