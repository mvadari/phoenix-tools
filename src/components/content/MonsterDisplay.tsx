import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
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
  content: any;
  onClose: () => void;
}

export default function MonsterDisplay({ result, content, onClose }: MonsterDisplayProps) {
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
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="monster-display">
        {/* Basic Information */}
        <div className="monster-basic-info" style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          textAlign: 'center',
          color: '#495057'
        }}>
          {formatSize(content.size)} {formatType(content.type)}, {formatAlignment(content.alignment)}
        </div>

        {/* Core Stats */}
        <StatBlock 
          ac={content.ac} 
          hp={content.hp} 
          cr={content.cr} 
          xp={content.xp} 
        />

        {/* Speed */}
        {content.speed && <SpeedDisplay speed={content.speed} />}

        {/* Ability Scores */}
        <AbilityScores
          str={content.str}
          dex={content.dex}
          con={content.con}
          int={content.int}
          wis={content.wis}
          cha={content.cha}
        />

        {/* Skills, Saves, and Proficiencies */}
        {(content.save || content.skill) && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <ProficiencyList 
              saves={content.save}
              skills={content.skill}
              inline={true}
            />
          </div>
        )}

        {/* Damage Resistances */}
        <DamageResistanceBlock
          resist={content.resist}
          immune={content.immune}
          vulnerable={content.vulnerable}
          conditionImmune={content.conditionImmune}
        />

        {/* Senses and Languages */}
        <div style={{ marginTop: '1.5rem' }}>
          {content.senses && <DetailRow name="Senses" value={formatSenses(content.senses)} />}
          <DetailRow name="Languages" value={formatLanguages(content.languages)} />
          {content.passive && <DetailRow name="Passive Perception" value={content.passive} />}
        </div>

        {/* Traits */}
        {content.trait && content.trait.length > 0 && (
          <div className="traits" style={{ marginTop: '1.5rem' }}>
            <h4 style={{ 
              color: '#495057', 
              marginBottom: '1rem',
              borderBottom: '2px solid #dee2e6',
              paddingBottom: '0.5rem'
            }}>
              Traits
            </h4>
            {content.trait.map((trait: any, index: number) => (
              <div key={index} style={{ 
                marginBottom: '1rem',
                paddingLeft: '1rem',
                borderLeft: '3px solid #28a745'
              }}>
                {trait.name && (
                  <h5 style={{ 
                    margin: '0 0 0.5rem 0',
                    fontWeight: 'bold',
                    color: '#495057'
                  }}>
                    {trait.name}
                  </h5>
                )}
                {trait.entries && <ContentEntries entries={trait.entries} />}
              </div>
            ))}
          </div>
        )}

        {/* Spellcasting */}
        {content.spellcasting && (
          <SpellcastingBlock spellcasting={content.spellcasting} />
        )}

        {/* Actions */}
        <ActionsList
          actions={content.action}
          reactions={content.reaction}
          legendary={content.legendary}
          lair={content.lair}
          mythic={content.mythic}
        />

        {/* Description */}
        {content.entries && (
          <div style={{ marginTop: '1.5rem' }}>
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
      </div>
    </BaseContentDisplay>
  );
}