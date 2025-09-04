import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';

interface ItemDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function ItemDisplay({ result, content, onClose }: ItemDisplayProps) {
  const getRarityColor = (rarity: string): string => {
    const colors: { [key: string]: string } = {
      'common': '#6c757d',
      'uncommon': '#28a745',
      'rare': '#007bff',
      'very rare': '#6f42c1',
      'legendary': '#fd7e14',
      'artifact': '#dc3545'
    };
    return colors[rarity.toLowerCase()] || '#6c757d';
  };

  const formatValue = (value: number): string => {
    if (!value || value === 0) return '—';
    if (value >= 100) {
      return `${(value / 100).toLocaleString()} gp`;
    }
    if (value >= 10) {
      return `${value} sp`;
    }
    return `${value} cp`;
  };

  const formatWeight = (weight: number): string => {
    if (weight === 0) return '—';
    if (weight < 1) return `${weight} lb.`;
    return `${weight} lb${weight !== 1 ? 's' : ''}.`;
  };

  const formatProperties = (properties: string[]): string => {
    const propMap: { [key: string]: string } = {
      'A': 'ammunition',
      'F': 'finesse',
      'H': 'heavy',
      'L': 'light',
      'LD': 'loading',
      'R': 'reach',
      'RLD': 'reload',
      'S': 'special',
      'T': 'thrown',
      'TH': 'thrown',
      '2H': 'two-handed',
      'V': 'versatile'
    };
    
    return properties.map(prop => propMap[prop] || prop).join(', ');
  };

  const formatAttunement = (reqAttune: boolean | string): string => {
    if (typeof reqAttune === 'string') return reqAttune;
    return reqAttune ? 'Required' : 'Not required';
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="item-display">
        {/* Item Type and Rarity */}
        <div className="item-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px'
        }}>
          <div>
            {content.type && (
              <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#495057' }}>
                {content.typeAlt || content.type}
              </div>
            )}
          </div>
          {content.rarity && (
            <div style={{
              padding: '0.25rem 1rem',
              backgroundColor: getRarityColor(content.rarity) + '20',
              color: getRarityColor(content.rarity),
              borderRadius: '16px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>
              {content.rarity}
            </div>
          )}
        </div>

        {/* Core Properties */}
        <div className="item-properties" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {content.reqAttune && (
            <DetailRow name="Attunement" value={formatAttunement(content.reqAttune)} />
          )}
          {content.weight !== undefined && (
            <DetailRow name="Weight" value={formatWeight(content.weight)} />
          )}
          {content.value && (
            <DetailRow name="Value" value={formatValue(content.value)} />
          )}
        </div>

        {/* Magic Item Properties */}
        {(content.bonusSpellAttack || content.bonusSpellSaveDc || content.charges) && (
          <div className="magic-properties" style={{
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
              Magic Properties
            </h4>
            {content.bonusSpellAttack && (
              <DetailRow name="Spell Attack Bonus" value={content.bonusSpellAttack} />
            )}
            {content.bonusSpellSaveDc && (
              <DetailRow name="Spell Save DC Bonus" value={content.bonusSpellSaveDc} />
            )}
            {content.charges && (
              <DetailRow name="Charges" value={content.charges} />
            )}
          </div>
        )}

        {/* Weapon Properties */}
        {(content.weapon || content.dmg1 || content.range || content.property) && (
          <div className="weapon-properties" style={{
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
              Weapon Properties
            </h4>
            {content.dmg1 && (
              <DetailRow 
                name="Damage" 
                value={`${content.dmg1} ${content.dmgType || ''}`} 
              />
            )}
            {content.dmg2 && (
              <DetailRow 
                name="Two-Handed Damage" 
                value={`${content.dmg2} ${content.dmgType || ''}`} 
              />
            )}
            {content.range && (
              <DetailRow name="Range" value={content.range} />
            )}
            {content.property && (
              <DetailRow name="Properties" value={formatProperties(content.property)} />
            )}
          </div>
        )}

        {/* Armor Properties */}
        {(content.armor || content.ac || content.strength || content.stealth) && (
          <div className="armor-properties" style={{
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
              Armor Properties
            </h4>
            {content.ac && (
              <DetailRow name="Armor Class" value={content.ac} />
            )}
            {content.strength && (
              <DetailRow name="Strength Requirement" value={content.strength} />
            )}
            {content.stealth && (
              <DetailRow name="Stealth" value="Disadvantage" />
            )}
          </div>
        )}

        {/* Item Description */}
        {content.entries && (
          <div className="item-description" style={{ marginBottom: '1.5rem' }}>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Additional Entries */}
        {content.additionalEntries && (
          <div className="additional-entries" style={{ 
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
              Additional Information
            </h4>
            <ContentEntries entries={content.additionalEntries} />
          </div>
        )}

        {/* Item Variants */}
        {content.variants && content.variants.length > 0 && (
          <div className="item-variants" style={{
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
              Variants
            </h4>
            {content.variants.map((variant: any, index: number) => (
              <div key={index} style={{ 
                marginBottom: '1rem',
                paddingLeft: '1rem',
                borderLeft: '2px solid #81c784'
              }}>
                <h5 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: '#2e7d32',
                  fontWeight: 'bold'
                }}>
                  {variant.name}
                </h5>
                {variant.entries && <ContentEntries entries={variant.entries} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}