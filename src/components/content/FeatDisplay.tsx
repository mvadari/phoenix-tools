import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { PrerequisiteDisplay, ProficiencyList } from './shared';

interface FeatDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function FeatDisplay({ result, content, onClose }: FeatDisplayProps) {
  const formatAbilityIncrease = (ability: any[]): string => {
    return ability.map(ab => {
      const increases: string[] = [];
      Object.entries(ab).forEach(([stat, value]) => {
        if (typeof value === 'number' && value > 0) {
          increases.push(`${stat.toUpperCase()} +${value}`);
        }
      });
      return increases.join(', ');
    }).filter(Boolean).join(' or ');
  };

  const formatAdditionalSpells = (additionalSpells: any[]): React.ReactNode => {
    return additionalSpells.map((spellGroup, index) => (
      <div key={index} style={{ marginBottom: '0.5rem' }}>
        {spellGroup.known && spellGroup.known._ && (
          <div>
            <strong>Known Spells:</strong> {spellGroup.known._.map((spell: any) => {
              if (typeof spell === 'string') return spell;
              if (spell.choose) return `Choose from ${spell.choose}`;
              return JSON.stringify(spell);
            }).join(', ')}
          </div>
        )}
        {spellGroup.innate && spellGroup.innate._ && (
          <div>
            <strong>Innate Spells:</strong>
            {Object.entries(spellGroup.innate._).map(([frequency, spells]: [string, any]) => (
              <div key={frequency} style={{ marginLeft: '1rem' }}>
                <strong>{frequency}:</strong> {Array.isArray(spells) ? spells.map((spell: any) => {
                  if (typeof spell === 'string') return spell;
                  if (spell.choose) return `Choose from ${spell.choose}`;
                  return JSON.stringify(spell);
                }).join(', ') : JSON.stringify(spells)}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="feat-display">
        {/* Prerequisites */}
        {content.prerequisite && (
          <PrerequisiteDisplay prerequisite={content.prerequisite} />
        )}

        {/* Ability Score Increases */}
        {content.ability && content.ability.length > 0 && (
          <div className="ability-increases" style={{
            marginTop: '1.5rem',
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
              Ability Score Improvement
            </h4>
            <DetailRow name="Increase" value={formatAbilityIncrease(content.ability)} />
          </div>
        )}

        {/* Proficiencies Granted */}
        {(content.skillProficiencies || content.languageProficiencies || content.toolProficiencies) && (
          <div className="feat-proficiencies" style={{
            marginTop: '1.5rem',
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
              Proficiencies Granted
            </h4>
            <ProficiencyList
              skills={content.skillProficiencies}
              languages={content.languageProficiencies}
              tools={content.toolProficiencies}
            />
          </div>
        )}

        {/* Additional Spells */}
        {content.additionalSpells && content.additionalSpells.length > 0 && (
          <div className="additional-spells" style={{
            marginTop: '1.5rem',
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
              Spells Granted
            </h4>
            {formatAdditionalSpells(content.additionalSpells)}
            {content.additionalSpells[0]?.ability && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
                <strong>Spellcasting Ability:</strong> {content.additionalSpells[0].ability.toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Feat Description */}
        {content.entries && (
          <div className="feat-description" style={{ marginTop: '1.5rem' }}>
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

        {/* Feat Options/Variants */}
        {content.feats && content.feats.length > 0 && (
          <div className="feat-options" style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#495057',
              fontSize: '1.1rem'
            }}>
              Feat Options
            </h4>
            {content.feats.map((feat: any, index: number) => (
              <div key={index} style={{ 
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: index < content.feats.length - 1 ? '1px solid #dee2e6' : 'none'
              }}>
                <h5 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: '#495057',
                  fontWeight: 'bold'
                }}>
                  {feat.name}
                </h5>
                {feat.entries && <ContentEntries entries={feat.entries} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}