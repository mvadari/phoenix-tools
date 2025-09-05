import { useState } from 'react';
import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { ProficiencyList, EquipmentList } from './shared';
import SourceTabs from './shared/SourceTabs';

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
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
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
            <div key={level} style={{
              display: 'flex',
              marginBottom: '0.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #e9ecef'
            }}>
              <div style={{
                minWidth: '60px',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                Level {level}:
              </div>
              <div style={{ flex: 1 }}>
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
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Proficiencies Gained:</strong>
            <div style={{ marginLeft: '1rem' }}>
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
      <div key={index} style={{ marginBottom: '0.5rem' }}>
        <strong>{prog.name}:</strong> 
        {prog.progression && Object.entries((prog.progression as Record<string, number>)).map(([level, count]) => (
          <span key={level} style={{ marginLeft: '0.5rem' }}>
            Level {level} ({count} choice{count > 1 ? 's' : ''})
          </span>
        ))}
        {prog.category && (
          <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#6c757d' }}>
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
          <div className="primary-abilities" style={{
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
              Primary Abilities
            </h4>
            <DetailRow name="Recommended" value={formatAbilityScores(classContent.primaryAbility)} />
          </div>
        )}

        {/* Core Class Information */}
        <div className="class-core-info" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <DetailRow name="Hit Die" value={formatHitDie(classContent.hd)} />
            <DetailRow name="Saving Throws" value={formatSavingThrows(classContent.proficiency)} />
          </div>
          {classContent.subclassTitle && (
            <DetailRow name="Subclass Type" value={classContent.subclassTitle} />
          )}
        </div>

        {/* Starting Proficiencies */}
        {classContent.startingProficiencies && (
          <div className="starting-proficiencies" style={{
            marginBottom: '1.5rem',
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
          <div className="multiclassing" style={{
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
              Multiclassing
            </h4>
            {formatMulticlassing(classContent.multiclassing)}
          </div>
        )}

        {/* Feat Progression */}
        {(classContent.featProgression || classContent.optionalfeatureProgression) && (
          <div className="feat-progression" style={{
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
              Optional Features & Feats
            </h4>
            {classContent.featProgression && formatFeatProgression(classContent.featProgression)}
            {classContent.optionalfeatureProgression && formatFeatProgression(classContent.optionalfeatureProgression)}
          </div>
        )}

        {/* Class Features Progression */}
        {classContent.classFeatures && classContent.classFeatures.length > 0 && (
          <div className="class-features" style={{
            marginBottom: '1.5rem',
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
              Class Features by Level
            </h4>
            {formatClassFeatures(classContent.classFeatures)}
          </div>
        )}

        {/* Class Description */}
        {classContent.entries && (
          <div className="class-description" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ 
              color: '#495057', 
              marginBottom: '1rem',
              borderBottom: '2px solid #dee2e6',
              paddingBottom: '0.5rem'
            }}>
              Description
            </h4>
            <ContentEntries entries={classContent.entries} />
          </div>
        )}

        {/* Subclass Information */}
        {classContent.subclass && classContent.subclass.length > 0 && (
          <div className="subclasses" style={{
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
              {classContent.subclassTitle || 'Subclasses'}
            </h4>
            {classContent.subclass.map((subclass: any, index: number) => (
              <div key={index} style={{ 
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: index < classContent.subclass.length - 1 ? '1px solid #ffcdd2' : 'none'
              }}>
                <h5 style={{ 
                  margin: '0 0 0.5rem 0',
                  color: '#c62828',
                  fontWeight: 'bold'
                }}>
                  {subclass.name} {subclass.shortName && `(${subclass.shortName})`}
                </h5>
                {subclass.source && (
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#6c757d',
                    marginBottom: '0.5rem'
                  }}>
                    Source: {subclass.source}
                  </div>
                )}
                {subclass.entries && <ContentEntries entries={subclass.entries} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}