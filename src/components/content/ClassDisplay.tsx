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

        {/* Class Description */}
        {classContent.entries && (
          <div className="class-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={classContent.entries} />
          </div>
        )}

        {/* Subclass Information */}
        {classContent.subclass && classContent.subclass.length > 0 && (
          <div className="subclasses">
            <h4>
              {classContent.subclassTitle || 'Subclasses'}
            </h4>
            {classContent.subclass.map((subclass: any, index: number) => (
              <div key={index} className="subclass">
                <h5>
                  {subclass.name} {subclass.shortName && `(${subclass.shortName})`}
                </h5>
                {subclass.source && (
                  <div className="subclass-source">
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