import { useState, useEffect } from 'react';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import DetailRow from '../basic/DetailRow';
import { ProficiencyList, EquipmentList } from './shared';
import SourceTabs from './shared/SourceTabs';
import SubclassTabs from './shared/SubclassTabs';

interface ClassDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function ClassDisplay({ result, content, onClose }: ClassDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single class object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like class objects

  // Auto-select the primary source for multi-source content
  useEffect(() => {
    if (isMultiSource && !currentContent && content) {
      const primarySource = result.source;
      const availableKeys = Object.keys(content);
      
      // Try to use the primary source first, otherwise use the first available
      const defaultKey = availableKeys.includes(primarySource) ? primarySource : availableKeys[0];
      
      if (defaultKey && content[defaultKey]) {
        setCurrentContent(content[defaultKey]);
      }
    }
  }, [isMultiSource, currentContent, content, result.source]);


  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const classContent = isMultiSource ? currentContent : content;
  
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
  const formatHitDie = (hd: any): string => {
    if (!hd) return '';
    return `1d${hd.faces}`;
  };

  const formatAbilityScores = (abilities: any[]): string => {
    if (!abilities || abilities.length === 0) return '';
    return abilities.map(ability => {
      const keys = Object.keys(ability).filter(key => ability[key]);
      return keys.map(key => key.toUpperCase()).join(' or ');
    }).join(', ');
  };

  const formatSavingThrows = (proficiency: string[]): string => {
    if (!proficiency || proficiency.length === 0) return '';
    return proficiency.map(save => save.toUpperCase()).join(', ');
  };

  const formatClassFeatures = (classFeatures: any[]): React.ReactNode => {
    if (!classFeatures || classFeatures.length === 0) return null;

    const featuresByLevel: { [key: number]: string[] } = {};
    
    classFeatures.forEach(feature => {
      let featureName = '';
      let level = 1;
      
      if (typeof feature === 'string') {
        const parts = feature.split('|');
        featureName = parts[0];
        if (parts.length >= 4) {
          level = parseInt(parts[3]) || 1;
        }
      } else if (feature.classFeature) {
        const parts = feature.classFeature.split('|');
        featureName = parts[0];
        if (parts.length >= 4) {
          level = parseInt(parts[3]) || 1;
        }
        if (feature.gainSubclassFeature) {
          featureName += ' (Subclass Feature)';
        }
      }
      
      if (!featuresByLevel[level]) {
        featuresByLevel[level] = [];
      }
      featuresByLevel[level].push(featureName);
    });

    return (
      <div className="class-features-progression">
        {Object.entries(featuresByLevel)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([level, features]) => (
            <div key={level} className="feature-level">
              <div className="level-label">
                Level {level}:
              </div>
              <div className="features-list">
                {features.join(', ')}
              </div>
            </div>
          ))}
      </div>
    );
  };

  const formatMulticlassing = (multiclassing: any): React.ReactNode => {
    if (!multiclassing) return null;

    const formatRequirements = (requirements: any): string => {
      if (requirements.or) {
        return requirements.or.map((req: any) => {
          return Object.entries(req).map(([stat, value]) => `${stat.toUpperCase()} ${value}`).join(' and ');
        }).join(' or ');
      }
      return Object.entries(requirements).map(([stat, value]) => `${stat.toUpperCase()} ${value}`).join(', ');
    };

    return (
      <div>
        {multiclassing.requirements && (
          <DetailRow name="Requirements" value={formatRequirements(multiclassing.requirements)} />
        )}
        {multiclassing.proficienciesGained && (
          <div className="multiclassing-section">
            <strong>Proficiencies Gained:</strong>
            <div className="multiclassing-content">
              <ProficiencyList
                armor={multiclassing.proficienciesGained.armor}
                weapons={multiclassing.proficienciesGained.weapons}
                tools={multiclassing.proficienciesGained.tools}
                skills={multiclassing.proficienciesGained.skills}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const formatFeatProgression = (featProgression: any[]): React.ReactNode => {
    if (!featProgression || featProgression.length === 0) return null;

    return featProgression.map((prog, index) => (
      <div key={index} className="feat-item">
        <strong>{prog.name}:</strong> 
        {prog.progression && Object.entries((prog.progression as Record<string, number>)).map(([level, count]) => (
          <span key={level} className="feat-details">
            Level {level} ({count} choice{count > 1 ? 's' : ''})
          </span>
        ))}
        {prog.category && (
          <span className="feat-category">
            [{prog.category.join(', ')}]
          </span>
        )}
      </div>
    ));
  };

  return (
    <BaseContentDisplay result={result} content={classContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="class-display">
        {/* Primary Ability Scores */}
        {classContent.primaryAbility && (
          <div className="primary-abilities">
            <h4>
              Primary Abilities
            </h4>
            <DetailRow name="Recommended" value={formatAbilityScores(classContent.primaryAbility)} />
          </div>
        )}

        {/* Core Class Information */}
        <div className="class-core-info">
          <div>
            <DetailRow name="Hit Die" value={formatHitDie(classContent.hd)} />
            <DetailRow name="Saving Throws" value={formatSavingThrows(classContent.proficiency)} />
          </div>
          {classContent.subclassTitle && (
            <DetailRow name="Subclass Type" value={classContent.subclassTitle} />
          )}
        </div>

        {/* Spellcasting Information */}
        {(classContent?.spellcastingAbility || classContent?.casterProgression) && (
          <div>
            <h4>Spellcasting</h4>
            {classContent.spellcastingAbility && (
              <DetailRow 
                name="Spellcasting Ability" 
                value={classContent.spellcastingAbility.toUpperCase() === 'CHA' ? 'Charisma' : 
                       classContent.spellcastingAbility.toUpperCase() === 'INT' ? 'Intelligence' : 
                       classContent.spellcastingAbility.toUpperCase() === 'WIS' ? 'Wisdom' : 
                       classContent.spellcastingAbility.toUpperCase()}
              />
            )}
            {classContent.casterProgression && (
              <DetailRow 
                name="Casting Type" 
                value={classContent.casterProgression === 'pact' ? 'Pact Magic' : 
                       classContent.casterProgression === 'full' ? 'Full Caster' : 
                       classContent.casterProgression === 'half' ? 'Half Caster' : 
                       classContent.casterProgression === 'artificer' ? 'Artificer Spellcasting' : 
                       classContent.casterProgression}
              />
            )}
            {classContent.cantripProgression && (
              <DetailRow 
                name="Cantrips at 1st Level" 
                value={classContent.cantripProgression[0].toString()}
              />
            )}
            {classContent.spellsKnownProgression && (
              <DetailRow 
                name="Spells Known at 1st Level" 
                value={classContent.spellsKnownProgression[0].toString()}
              />
            )}
            {classContent.preparedSpells && (
              <DetailRow 
                name="Spells Prepared" 
                value={classContent.preparedSpells
                  .replace('<$level$>', 'class level')
                  .replace('<$int_mod$>', 'Intelligence modifier')
                  .replace('<$wis_mod$>', 'Wisdom modifier')
                  .replace('<$cha_mod$>', 'Charisma modifier')}
              />
            )}
          </div>
        )}

        {/* Spellcasting Progression Tables */}
        {classContent?.classTableGroups && classContent.classTableGroups.map((tableGroup: any, groupIndex: number) => {
          const rows = tableGroup.rowsSpellProgression || tableGroup.rows;
          if (!rows) return null;
          
          // Check if this is a Pact Magic table (Warlock)
          const isPactMagic = classContent.casterProgression === 'pact';
          const tableTitle = tableGroup.title || (groupIndex === 0 ? 'Spell Progression' : 'Additional Spell Information');
          
          return (
            <div key={groupIndex}>
              <h4>{tableTitle}</h4>
              {/* Add explanation for Pact Magic */}
              {isPactMagic && groupIndex === 0 && (
                <div className="pact-magic-explanation">
                  <strong>Pact Magic:</strong> Unlike other spellcasters, all Warlock spell slots are cast at the "Slot Level" shown. 
                  You don't get multiple spell slot levels - instead, you get a smaller number of higher-level slots that recharge on a short rest.
                </div>
              )}
              <div className="spellcasting-table">
                <table className="class-progression-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      {tableGroup.colLabels.map((label: string, index: number) => {
                        // For Pact Magic, combine "Spell Slots" and "Slot Level" columns
                        const cleanLabel = label.replace(/\{@filter ([^|]+)\|[^}]+\}/g, '$1').replace(/\{@[^}]+\}/g, '');
                        if (isPactMagic && (cleanLabel === 'Spell Slots' || cleanLabel === 'Slot Level')) {
                          if (cleanLabel === 'Spell Slots') {
                            return <th key={index}>Pact Magic Slots</th>;
                          } else {
                            // Skip the "Slot Level" column as we'll combine it
                            return null;
                          }
                        }
                        return <th key={index}>{cleanLabel}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: any[], rowIndex: number) => {
                      const isMilestone = rowIndex === 4 || rowIndex === 10 || rowIndex === 16; // 5th, 11th, 17th levels
                      return (
                        <tr key={rowIndex} className={isMilestone ? 'milestone-row' : ''}>
                          <td className={`level-cell ${isMilestone ? 'milestone-level' : ''}`}>{rowIndex + 1}</td>
                          {row.map((cell: string | number, cellIndex: number) => {
                            // For Pact Magic, combine spell slots and slot level into one cell
                            if (isPactMagic && tableGroup.colLabels) {
                              const cleanLabel = tableGroup.colLabels[cellIndex]?.replace(/\{@filter ([^|]+)\|[^}]+\}/g, '$1').replace(/\{@[^}]+\}/g, '');
                              
                              if (cleanLabel === 'Spell Slots') {
                                // Combine with the next cell (Slot Level)
                                const slotCount = cell;
                                const slotLevel = row[cellIndex + 1];
                                const cleanSlotLevel = typeof slotLevel === 'string' ? 
                                  slotLevel.replace(/\{@filter ([^|]+)\|[^}]+\}/g, '$1').replace(/\{@[^}]+\}/g, '') : 
                                  slotLevel;
                                
                                return (
                                  <td key={cellIndex} className="progression-cell">
                                    {slotCount} × {cleanSlotLevel}
                                  </td>
                                );
                              } else if (cleanLabel === 'Slot Level') {
                                // Skip this cell as it's been combined with the previous one
                                return null;
                              }
                            }
                            
                            const formatCell = (cell: any): string => {
                              if (typeof cell === 'string') {
                                return cell.replace(/\{@filter ([^|]+)\|[^}]+\}/g, '$1').replace(/\{@[^}]+\}/g, '');
                              } else if (typeof cell === 'number') {
                                return cell.toString();
                              } else if (cell && typeof cell === 'object') {
                                // Handle dice roll objects like {type: "dice", toRoll: [{number: 1, faces: 6}]}
                                if (cell.type === 'dice' && cell.toRoll) {
                                  return cell.toRoll.map((dice: any) => `${dice.number}d${dice.faces}`).join(' + ');
                                }
                                // Fallback for other objects
                                return JSON.stringify(cell);
                              }
                              return String(cell || '');
                            };
                            
                            return (
                              <td key={cellIndex} className="progression-cell">
                                {formatCell(cell)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Starting Proficiencies */}
        {classContent.startingProficiencies && (
          <div className="starting-proficiencies">
            <h4>
              Starting Proficiencies
            </h4>
            <ProficiencyList
              armor={classContent.startingProficiencies.armor}
              weapons={classContent.startingProficiencies.weapons}
              tools={classContent.startingProficiencies.tools}
              skills={classContent.startingProficiencies.skills}
            />
          </div>
        )}

        {/* Starting Equipment */}
        {classContent.startingEquipment && (
          <EquipmentList equipment={classContent.startingEquipment} />
        )}

        {/* Multiclassing */}
        {classContent.multiclassing && (
          <div className="multiclassing">
            <h4>
              Multiclassing
            </h4>
            {formatMulticlassing(classContent.multiclassing)}
          </div>
        )}

        {/* Feat Progression */}
        {(classContent.featProgression || classContent.optionalfeatureProgression) && (
          <div className="feat-progression">
            <h4>
              Optional Features & Feats
            </h4>
            {classContent.featProgression && formatFeatProgression(classContent.featProgression)}
            {classContent.optionalfeatureProgression && formatFeatProgression(classContent.optionalfeatureProgression)}
          </div>
        )}

        {/* Class Features Progression */}
        {classContent.classFeatures && classContent.classFeatures.length > 0 && (
          <div className="class-features">
            <h4>
              Class Features by Level
            </h4>
            {formatClassFeatures(classContent.classFeatures)}
          </div>
        )}


        {/* Subclass Information */}
        {classContent.subclass && classContent.subclass.length > 0 && (
          <SubclassTabs 
            subclasses={classContent.subclass}
            subclassTitle={classContent.subclassTitle}
          />
        )}
      </div>
    </BaseContentDisplay>
  );
}