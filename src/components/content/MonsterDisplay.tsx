import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';

interface MonsterDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function MonsterDisplay({ result, content, onClose }: MonsterDisplayProps) {
  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        <div className="monster-details">
          <div className="basic-info">
            {content.size && (
              <div className="detail-row">
                <strong>Size:</strong> {Array.isArray(content.size) ? content.size.join(', ') : content.size}
              </div>
            )}
            {content.type && (
              <div className="detail-row">
                <strong>Type:</strong> {typeof content.type === 'string' ? content.type : content.type.type}
              </div>
            )}
            {content.alignment && (
              <div className="detail-row">
                <strong>Alignment:</strong> {Array.isArray(content.alignment) ? content.alignment.join(', ') : content.alignment}
              </div>
            )}
          </div>

          <div className="combat-stats">
            {content.ac && (
              <div className="detail-row">
                <strong>AC:</strong> {Array.isArray(content.ac) ? content.ac.map((ac: any) => typeof ac === 'number' ? ac : ac.ac).join(', ') : content.ac}
              </div>
            )}
            {content.hp && (
              <div className="detail-row">
                <strong>HP:</strong> {typeof content.hp === 'number' ? content.hp : `${content.hp.average} (${content.hp.formula})`}
              </div>
            )}
            {content.speed && (
              <div className="detail-row">
                <strong>Speed:</strong> {
                  Object.entries(content.speed).map(([type, value]) => `${type} ${value}`).join(', ')
                }
              </div>
            )}
            {content.cr && (
              <div className="detail-row">
                <strong>Challenge Rating:</strong> {content.cr}
              </div>
            )}
          </div>

          <div className="ability-scores" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
            margin: '1rem 0',
            textAlign: 'center'
          }}>
            <div><strong>STR</strong><br/>{content.str}</div>
            <div><strong>DEX</strong><br/>{content.dex}</div>
            <div><strong>CON</strong><br/>{content.con}</div>
            <div><strong>INT</strong><br/>{content.int}</div>
            <div><strong>WIS</strong><br/>{content.wis}</div>
            <div><strong>CHA</strong><br/>{content.cha}</div>
          </div>

          {content.save && (
            <div className="detail-row">
              <strong>Saving Throws:</strong> {
                Object.entries(content.save).map(([ability, bonus]) => `${ability.toUpperCase()} +${bonus}`).join(', ')
              }
            </div>
          )}

          {content.skill && (
            <div className="detail-row">
              <strong>Skills:</strong> {
                Object.entries(content.skill).map(([skill, bonus]) => `${skill} +${bonus}`).join(', ')
              }
            </div>
          )}

          {content.senses && (
            <div className="detail-row">
              <strong>Senses:</strong> {Array.isArray(content.senses) ? content.senses.join(', ') : content.senses}
            </div>
          )}

          {content.languages && (
            <div className="detail-row">
              <strong>Languages:</strong> {Array.isArray(content.languages) ? content.languages.join(', ') : content.languages}
            </div>
          )}
        </div>

        {content.trait && (
          <div className="monster-traits">
            <h4>Traits</h4>
            {content.trait.map((trait: any, index: number) => (
              <div key={index} className="trait">
                <strong>{trait.name}.</strong> <ContentEntries entries={trait.entries} />
              </div>
            ))}
          </div>
        )}

        {content.action && (
          <div className="monster-actions">
            <h4>Actions</h4>
            {content.action.map((action: any, index: number) => (
              <div key={index} className="action">
                <strong>{action.name}.</strong> <ContentEntries entries={action.entries} />
              </div>
            ))}
          </div>
        )}

        {content.legendary && (
          <div className="monster-legendary">
            <h4>Legendary Actions</h4>
            {content.legendary.map((legendary: any, index: number) => (
              <div key={index} className="legendary">
                <strong>{legendary.name}.</strong> <ContentEntries entries={legendary.entries} />
              </div>
            ))}
          </div>
        )}

        {content.entries && <ContentEntries entries={content.entries} />}
      </div>
    </BaseContentDisplay>
  );
}