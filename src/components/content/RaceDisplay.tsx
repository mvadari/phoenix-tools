import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { SpeedDisplay, ProficiencyList } from './shared';
import { useState } from 'react';
import SourceTabs from './shared/SourceTabs';

interface RaceDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function RaceDisplay({ result, content, onClose }: RaceDisplayProps) {
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
        <div className="loading-message">
          Select a source above to view content
        </div>
      </BaseContentDisplay>
    );
  }

  const formatSize = (size: string[] | string): string => {
    if (Array.isArray(size)) return size.join(', ');
    const sizeMap: { [key: string]: string } = {
      'T': 'Tiny', 'S': 'Small', 'M': 'Medium', 
      'L': 'Large', 'H': 'Huge', 'G': 'Gargantuan'
    };
    return sizeMap[size] || size;
  };

  const formatAbilityScoreIncrease = (ability: any[]): React.ReactNode => {
    if (!ability || ability.length === 0) return null;

    return ability.map((abilitySet, index) => (
      <div key={index} className="ability-increase-item">
        {Object.entries(abilitySet).map(([stat, value]) => (
          <span key={stat}>
            <strong>{stat.toUpperCase()}</strong> +{(value as number)}
          </span>
        ))}
      </div>
    ));
  };

  const formatAge = (age: any): string => {
    if (!age) return '';
    const parts: string[] = [];
    if (age.mature) parts.push(`mature at ${age.mature} years`);
    if (age.max) parts.push(`live up to ${age.max} years`);
    return parts.join(', ');
  };

  const formatHeight = (height: any): string => {
    if (!height) return '';
    const parts: string[] = [];
    if (height.min) parts.push(`${height.min} inches`);
    if (height.max) parts.push(`${height.max} inches`);
    return parts.length > 0 ? parts.join(' - ') : '';
  };

  const formatWeight = (weight: any): string => {
    if (!weight) return '';
    const parts: string[] = [];
    if (weight.min) parts.push(`${weight.min} lbs`);
    if (weight.max) parts.push(`${weight.max} lbs`);
    return parts.length > 0 ? parts.join(' - ') : '';
  };

  const formatTraitTags = (traitTags: string[]): React.ReactNode => {
    if (!traitTags || traitTags.length === 0) return null;

    return (
      <div className="trait-tags-list">
        {traitTags.map((tag) => (
          <span
            key={tag}
            className="trait-tag"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  const formatResistances = (resistances: any[]): string => {
    if (!resistances || resistances.length === 0) return '';
    return resistances.join(', ');
  };

  const formatRacialTraits = (entries: any[]): React.ReactNode => {
    if (!entries || entries.length === 0) return null;

    return entries.map((trait, index) => {
      if (trait.type === 'entries' && trait.name) {
        return (
          <div key={index} className="racial-trait">
            <h5>
              {trait.name}
            </h5>
            <ContentEntries entries={trait.entries} />
          </div>
        );
      }
      return null;
    }).filter(Boolean);
  };

  const formatSubraces = (subraces: any[]): React.ReactNode => {
    if (!subraces || subraces.length === 0) return null;

    return subraces.map((subrace, index) => (
      <div key={index} className="subrace">
        <h5>
          {subrace.name}
        </h5>
        
        {/* Subrace Ability Score Increases */}
        {subrace.ability && (
          <div className="subrace-section">
            <strong>Ability Score Increase:</strong>
            <div className="subrace-content">
              {formatAbilityScoreIncrease(subrace.ability)}
            </div>
          </div>
        )}

        {/* Subrace Proficiencies */}
        {(subrace.skillProficiencies || subrace.languageProficiencies || subrace.toolProficiencies || subrace.weaponProficiencies || subrace.armorProficiencies) && (
          <div className="subrace-section">
            <strong>Additional Proficiencies:</strong>
            <div className="subrace-content">
              <ProficiencyList
                skills={subrace.skillProficiencies}
                languages={subrace.languageProficiencies}
                tools={subrace.toolProficiencies}
                weapons={subrace.weaponProficiencies}
                armor={subrace.armorProficiencies}
              />
            </div>
          </div>
        )}

        {/* Subrace Traits */}
        {subrace.entries && <ContentEntries entries={subrace.entries} />}
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
      <div className="race-display">
        {/* Basic Race Information */}
        <div className="race-basic-info">
          <DetailRow name="Size" value={formatSize(actualContent.size)} />
          {actualContent.age && <DetailRow name="Age" value={formatAge(actualContent.age)} />}
        </div>

        {/* Physical Characteristics */}
        {(actualContent.height || actualContent.weight) && (
          <div className="physical-characteristics">
            <h4>
              Physical Characteristics
            </h4>
            {actualContent.height && <DetailRow name="Height" value={formatHeight(actualContent.height)} />}
            {actualContent.weight && <DetailRow name="Weight" value={formatWeight(actualContent.weight)} />}
          </div>
        )}

        {/* Speed */}
        {actualContent.speed && <SpeedDisplay speed={actualContent.speed} />}

        {/* Ability Score Increases */}
        {actualContent.ability && (
          <div className="ability-increases">
            <h4>
              Ability Score Increase
            </h4>
            {formatAbilityScoreIncrease(actualContent.ability)}
          </div>
        )}

        {/* Proficiencies */}
        {(actualContent.skillProficiencies || actualContent.languageProficiencies || actualContent.toolProficiencies || actualContent.weaponProficiencies || actualContent.armorProficiencies) && (
          <div className="race-proficiencies">
            <h4>
              Proficiencies
            </h4>
            <ProficiencyList
              skills={actualContent.skillProficiencies}
              languages={actualContent.languageProficiencies}
              tools={actualContent.toolProficiencies}
              weapons={actualContent.weaponProficiencies}
              armor={actualContent.armorProficiencies}
            />
          </div>
        )}

        {/* Damage Resistances & Immunities */}
        {(actualContent.resist || actualContent.immune || actualContent.vulnerable) && (
          <div className="resistances">
            <h4>
              Damage Resistances & Immunities
            </h4>
            {actualContent.resist && <DetailRow name="Resistances" value={formatResistances(actualContent.resist)} />}
            {actualContent.immune && <DetailRow name="Immunities" value={formatResistances(actualContent.immune)} />}
            {actualContent.vulnerable && <DetailRow name="Vulnerabilities" value={formatResistances(actualContent.vulnerable)} />}
          </div>
        )}

        {/* Trait Tags */}
        {actualContent.traitTags && actualContent.traitTags.length > 0 && (
          <div className="trait-tags">
            <h4>
              Traits
            </h4>
            {formatTraitTags(actualContent.traitTags)}
          </div>
        )}

        {/* Racial Traits */}
        {actualContent.entries && (
          <div className="racial-traits">
            <h4>
              Racial Traits
            </h4>
            {formatRacialTraits(actualContent.entries)}
          </div>
        )}

        {/* Subraces */}
        {actualContent.subrace && actualContent.subrace.length > 0 && (
          <div className="subraces">
            <h4>
              Subraces
            </h4>
            {formatSubraces(actualContent.subrace)}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}