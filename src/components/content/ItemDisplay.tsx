import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';

interface ItemDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function ItemDisplay({ result, content, onClose }: ItemDisplayProps) {
  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        <div className="item-details">
          {content.type && (
            <div className="detail-row">
              <strong>Type:</strong> {content.type}
            </div>
          )}
          
          {content.rarity && (
            <div className="detail-row">
              <strong>Rarity:</strong> {content.rarity}
            </div>
          )}

          {content.reqAttune && (
            <div className="detail-row">
              <strong>Attunement:</strong> {
                typeof content.reqAttune === 'string' ? content.reqAttune : 'Required'
              }
            </div>
          )}

          {content.weight && (
            <div className="detail-row">
              <strong>Weight:</strong> {content.weight} lb.
            </div>
          )}

          {content.value && (
            <div className="detail-row">
              <strong>Value:</strong> {content.value / 100} gp
            </div>
          )}

          {content.ac && (
            <div className="detail-row">
              <strong>AC:</strong> {content.ac}
            </div>
          )}

          {content.strength && (
            <div className="detail-row">
              <strong>Strength Requirement:</strong> {content.strength}
            </div>
          )}

          {content.stealth && (
            <div className="detail-row">
              <strong>Stealth:</strong> Disadvantage
            </div>
          )}

          {content.dmg1 && (
            <div className="detail-row">
              <strong>Damage:</strong> {content.dmg1} {content.dmgType}
            </div>
          )}

          {content.dmg2 && (
            <div className="detail-row">
              <strong>Two-Handed Damage:</strong> {content.dmg2} {content.dmgType}
            </div>
          )}

          {content.range && (
            <div className="detail-row">
              <strong>Range:</strong> {content.range}
            </div>
          )}

          {content.property && (
            <div className="detail-row">
              <strong>Properties:</strong> {content.property.join(', ')}
            </div>
          )}
        </div>

        {content.entries && <ContentEntries entries={content.entries} />}

        {content.additionalEntries && (
          <div className="additional-entries">
            <ContentEntries entries={content.additionalEntries} />
          </div>
        )}

        {content.variants && (
          <div className="item-variants">
            <h4>Variants</h4>
            {content.variants.map((variant: any, index: number) => (
              <div key={index} className="variant">
                <h5>{variant.name}</h5>
                {variant.entries && <ContentEntries entries={variant.entries} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}