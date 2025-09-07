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


  const formatAdditionalSpells = (additionalSpells: any[]): React.ReactNode => {
    if (!additionalSpells || additionalSpells.length === 0) return null;

    return additionalSpells.map((spellGroup, index) => (
      <div key={index} className="spell-group">
        {spellGroup.innate && spellGroup.innate._ && (
          <div>
            <strong>Spells Granted:</strong>
            {Object.entries(spellGroup.innate._).map(([frequency, spells]: [string, any]) => (
              <div key={frequency} className="spell-frequency">
                <strong>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}:</strong>{' '}
                {Array.isArray(spells) ? spells.join(', ') : 
                 typeof spells === 'object' ? Object.values(spells).flat().join(', ') :
                 spells}
              </div>
            ))}
            {spellGroup.ability && (
              <div className="spellcasting-ability">
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
    
    return (
      <span className="reward-rarity" data-rarity={rarity.toLowerCase()}>
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
        <div className="reward-type" data-reward-type={content.type}>
          <div className="reward-type-header">
            <h4>
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
          <div className="reward-properties">
            <h4>
              Properties
            </h4>
            {content.level && <DetailRow name="Minimum Level" value={formatLevel(content.level)} />}
            {content.duration && <DetailRow name="Duration" value={content.duration} />}
            {content.charges && <DetailRow name="Charges" value={content.charges} />}
          </div>
        )}

        {/* Granted Spells */}
        {content.additionalSpells && content.additionalSpells.length > 0 && (
          <div className="reward-spells">
            <h4>
              Magical Abilities
            </h4>
            {formatAdditionalSpells(content.additionalSpells)}
          </div>
        )}

        {/* Reward Description */}
        {content.entries && (
          <div className="reward-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Drawbacks/Flaws (for Dark Gifts) */}
        {content.flaws && content.flaws.length > 0 && (
          <div className="reward-flaws">
            <h4>
              Drawbacks
            </h4>
            {content.flaws.map((flaw: any, index: number) => (
              <div key={index} className="flaw-item">
                {typeof flaw === 'string' ? flaw : <ContentEntries entries={[flaw]} />}
              </div>
            ))}
          </div>
        )}

        {/* Source/Origin Information */}
        {(content.deity || content.patron || content.source) && (
          <div className="reward-source">
            <h4>
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