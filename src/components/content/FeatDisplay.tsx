import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { PrerequisiteDisplay, ProficiencyList } from './shared';
import { useState } from 'react';
import SourceTabs from './shared/SourceTabs';

interface FeatDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function FeatDisplay({ result, content, onClose }: FeatDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const actualContent = isMultiSource ? currentContent : content;

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
      <div key={index} className="spell-group">
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
              <div key={frequency} className="innate-spells">
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
    <BaseContentDisplay result={result} content={actualContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="feat-display">
        {/* Prerequisites */}
        {actualContent.prerequisite && (
          <PrerequisiteDisplay prerequisite={actualContent.prerequisite} />
        )}

        {/* Ability Score Increases */}
        {actualContent.ability && actualContent.ability.length > 0 && (
          <div className="ability-increases">
            <h4>
              Ability Score Improvement
            </h4>
            <DetailRow name="Increase" value={formatAbilityIncrease(actualContent.ability)} />
          </div>
        )}

        {/* Proficiencies Granted */}
        {(actualContent.skillProficiencies || actualContent.languageProficiencies || actualContent.toolProficiencies) && (
          <div className="feat-proficiencies">
            <h4>
              Proficiencies Granted
            </h4>
            <ProficiencyList
              skills={actualContent.skillProficiencies}
              languages={actualContent.languageProficiencies}
              tools={actualContent.toolProficiencies}
            />
          </div>
        )}

        {/* Additional Spells */}
        {actualContent.additionalSpells && actualContent.additionalSpells.length > 0 && (
          <div className="additional-spells">
            <h4>
              Spells Granted
            </h4>
            {formatAdditionalSpells(actualContent.additionalSpells)}
            {actualContent.additionalSpells[0]?.ability && (
              <div className="spellcasting-ability">
                <strong>Spellcasting Ability:</strong> {actualContent.additionalSpells[0].ability.toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Feat Description */}
        {actualContent.entries && (
          <div className="feat-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={actualContent.entries} />
          </div>
        )}

        {/* Feat Options/Variants */}
        {actualContent.feats && actualContent.feats.length > 0 && (
          <div className="feat-options">
            <h4>
              Feat Options
            </h4>
            {actualContent.feats.map((feat: any, index: number) => (
              <div key={index} className="feat-option">
                <h5>
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