import { useState } from 'react';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import SourceTabs from './shared/SourceTabs';

interface ItemDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function ItemDisplay({ result, content, onClose }: ItemDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single item object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like item objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const itemContent = isMultiSource ? currentContent : content;
  
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
    <BaseContentDisplay result={result} content={itemContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
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
            {itemContent.type && (
              <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#495057' }}>
                {itemContent.typeAlt || itemContent.type}
              </div>
            )}
          </div>
          {itemContent.rarity && (
            <div style={{
              padding: '0.25rem 1rem',
              backgroundColor: getRarityColor(itemContent.rarity) + '20',
              color: getRarityColor(itemContent.rarity),
              borderRadius: '16px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>
              {itemContent.rarity}
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
          {itemContent.reqAttune && (
            <DetailRow name="Attunement" value={formatAttunement(itemContent.reqAttune)} />
          )}
          {itemContent.weight !== undefined && (
            <DetailRow name="Weight" value={formatWeight(itemContent.weight)} />
          )}
          {itemContent.value && (
            <DetailRow name="Value" value={formatValue(itemContent.value)} />
          )}
        </div>

        {/* Magic Item Properties */}
        {(itemContent.bonusSpellAttack || itemContent.bonusSpellSaveDc || itemContent.charges) && (
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
            {itemContent.bonusSpellAttack && (
              <DetailRow name="Spell Attack Bonus" value={itemContent.bonusSpellAttack} />
            )}
            {itemContent.bonusSpellSaveDc && (
              <DetailRow name="Spell Save DC Bonus" value={itemContent.bonusSpellSaveDc} />
            )}
            {itemContent.charges && (
              <DetailRow name="Charges" value={itemContent.charges} />
            )}
          </div>
        )}

        {/* Weapon Properties */}
        {(itemContent.weapon || itemContent.dmg1 || itemContent.range || itemContent.property) && (
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
            {itemContent.dmg1 && (
              <DetailRow 
                name="Damage" 
                value={`${itemContent.dmg1} ${itemContent.dmgType || ''}`} 
              />
            )}
            {itemContent.dmg2 && (
              <DetailRow 
                name="Two-Handed Damage" 
                value={`${itemContent.dmg2} ${itemContent.dmgType || ''}`} 
              />
            )}
            {itemContent.range && (
              <DetailRow name="Range" value={itemContent.range} />
            )}
            {itemContent.property && (
              <DetailRow name="Properties" value={formatProperties(itemContent.property)} />
            )}
          </div>
        )}

        {/* Armor Properties */}
        {(itemContent.armor || itemContent.ac || itemContent.strength || itemContent.stealth) && (
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
            {itemContent.ac && (
              <DetailRow name="Armor Class" value={itemContent.ac} />
            )}
            {itemContent.strength && (
              <DetailRow name="Strength Requirement" value={itemContent.strength} />
            )}
            {itemContent.stealth && (
              <DetailRow name="Stealth" value="Disadvantage" />
            )}
          </div>
        )}

        {/* Item Description */}
        {itemContent.entries && (
          <div className="item-description" style={{ marginBottom: '1.5rem' }}>
            <ContentEntries entries={itemContent.entries} />
          </div>
        )}

        {/* Additional Entries */}
        {itemContent.additionalEntries && (
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
            <ContentEntries entries={itemContent.additionalEntries} />
          </div>
        )}

        {/* Item Variants */}
        {itemContent.variants && itemContent.variants.length > 0 && (
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
            {itemContent.variants.map((variant: any, index: number) => (
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