import { useState } from 'react';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import SourceTabs from './shared/SourceTabs';
import { 
  AbilityScores, 
  SpeedDisplay, 
  StatBlock, 
  DamageResistanceBlock,
  ActionsList,
  SpellcastingBlock,
  ProficiencyList
} from './shared';

interface MonsterDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function MonsterDisplay({ result, content, onClose }: MonsterDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single monster object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like monster objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const monsterContent = isMultiSource ? currentContent : content;
  
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
  const formatSize = (size: string[] | string): string => {
    if (Array.isArray(size)) return size.join(', ');
    const sizeMap: { [key: string]: string } = {
      'T': 'Tiny', 'S': 'Small', 'M': 'Medium', 
      'L': 'Large', 'H': 'Huge', 'G': 'Gargantuan'
    };
    return sizeMap[size] || size;
  };

  const formatType = (type: string | { type: string; tags?: string[] }): string => {
    if (typeof type === 'string') return type;
    let result = type.type;
    if (type.tags && type.tags.length > 0) {
      result += ` (${type.tags.join(', ')})`;
    }
    return result;
  };

  const formatAlignment = (alignment: string[]): string => {
    const alignmentMap: { [key: string]: string } = {
      'LG': 'lawful good', 'NG': 'neutral good', 'CG': 'chaotic good',
      'LN': 'lawful neutral', 'N': 'neutral', 'CN': 'chaotic neutral',
      'LE': 'lawful evil', 'NE': 'neutral evil', 'CE': 'chaotic evil',
      'U': 'unaligned', 'A': 'any alignment'
    };
    
    return alignment.map(a => alignmentMap[a] || a).join(' ');
  };

  const formatSenses = (senses: string[]): string => {
    if (!senses || senses.length === 0) return '';
    return senses.join(', ');
  };

  const formatLanguages = (languages: string[]): string => {
    if (!languages || languages.length === 0) return '—';
    return languages.join(', ');
  };

  return (
    <BaseContentDisplay result={result} content={monsterContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="monster-display">
        {/* Basic Information */}
        <div className="monster-basic-info">
          {formatSize(monsterContent.size)} {formatType(monsterContent.type)}, {formatAlignment(monsterContent.alignment)}
        </div>

        {/* Core Stats */}
        <StatBlock 
          ac={monsterContent.ac} 
          hp={monsterContent.hp} 
          cr={monsterContent.cr} 
          xp={monsterContent.xp} 
        />

        {/* Speed */}
        {monsterContent.speed && <SpeedDisplay speed={monsterContent.speed} />}

        {/* Ability Scores */}
        <AbilityScores
          str={monsterContent.str}
          dex={monsterContent.dex}
          con={monsterContent.con}
          int={monsterContent.int}
          wis={monsterContent.wis}
          cha={monsterContent.cha}
        />

        {/* Skills, Saves, and Proficiencies */}
        {(monsterContent.save || monsterContent.skill) && (
          <div className="monster-proficiencies">
            <ProficiencyList 
              saves={monsterContent.save}
              skills={monsterContent.skill}
              inline={true}
            />
          </div>
        )}

        {/* Damage Resistances */}
        <DamageResistanceBlock
          resist={monsterContent.resist}
          immune={monsterContent.immune}
          vulnerable={monsterContent.vulnerable}
          conditionImmune={monsterContent.conditionImmune}
        />

        {/* Senses and Languages */}
        <div className="monster-senses">
          {monsterContent.senses && <DetailRow name="Senses" value={formatSenses(monsterContent.senses)} />}
          <DetailRow name="Languages" value={formatLanguages(monsterContent.languages)} />
          {monsterContent.passive && <DetailRow name="Passive Perception" value={monsterContent.passive} />}
        </div>

        {/* Traits */}
        {monsterContent.trait && monsterContent.trait.length > 0 && (
          <div className="traits">
            <h4>
              Traits
            </h4>
            {monsterContent.trait.map((trait: any, index: number) => (
              <div key={index} className="trait-item">
                {trait.name && (
                  <h5>
                    {trait.name}
                  </h5>
                )}
                {trait.entries && <ContentEntries entries={trait.entries} />}
              </div>
            ))}
          </div>
        )}

        {/* Spellcasting */}
        {monsterContent.spellcasting && (
          <SpellcastingBlock spellcasting={monsterContent.spellcasting} />
        )}

        {/* Actions */}
        <ActionsList
          actions={monsterContent.action}
          reactions={monsterContent.reaction}
          legendary={monsterContent.legendary}
          lair={monsterContent.lair}
          mythic={monsterContent.mythic}
        />

        {/* Description */}
        {monsterContent.entries && (
          <div className="monster-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={monsterContent.entries} />
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}