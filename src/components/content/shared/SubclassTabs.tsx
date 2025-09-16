import { useState } from 'react';
import ContentEntries from '../ContentEntries';

interface SubclassTabsProps {
  subclasses: any[];
  subclassTitle?: string;
}

interface ExpandedSpellListProps {
  additionalSpells: any[];
}

interface SubclassFeatureProgressionProps {
  subclassFeatures: string[];
  featureDetails?: any[];
}

function ExpandedSpellList({ additionalSpells }: ExpandedSpellListProps) {
  if (!additionalSpells || additionalSpells.length === 0) return null;

  const prepared = additionalSpells[0]?.prepared;
  if (!prepared) return null;

  const spellLevels = Object.keys(prepared).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  return (
    <div className="expanded-spell-list">
      <h6>Expanded Spell List</h6>
      <div className="spell-list-table">
        <table className="subclass-spell-table">
          <thead>
            <tr>
              <th>Spell Level</th>
              <th>Spells</th>
            </tr>
          </thead>
          <tbody>
            {spellLevels.map(level => {
              const spells = prepared[level];
              const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
              
              return (
                <tr key={level}>
                  <td className="spell-level-cell">{ordinals[parseInt(level)]}</td>
                  <td className="spell-list-cell">
                    {Array.isArray(spells) ? spells.join(', ') : spells}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubclassFeatureProgression({ subclassFeatures, featureDetails }: SubclassFeatureProgressionProps) {
  if (!subclassFeatures || subclassFeatures.length === 0) return null;

  // If we have rich feature details, use those
  if (featureDetails && featureDetails.length > 0) {
    // Group features by level
    const featuresByLevel: { [key: number]: any[] } = {};
    
    featureDetails.forEach(feature => {
      const level = feature.level || 1;
      if (!featuresByLevel[level]) {
        featuresByLevel[level] = [];
      }
      featuresByLevel[level].push(feature);
    });
    
    // Sort features within each level by header (if it exists) or by appearance order
    Object.keys(featuresByLevel).forEach(level => {
      featuresByLevel[parseInt(level)].sort((a, b) => {
        // Sort by header number if they exist, otherwise maintain order
        const headerA = a.header || 0;
        const headerB = b.header || 0;
        return headerA - headerB;
      });
    });

    return (
      <div className="subclass-feature-progression">
        <div className="feature-timeline">
          {Object.entries(featuresByLevel)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, features]) => (
              <div key={level} className="feature-level-section">
                <h6 className="feature-level-header">Level {level}</h6>
                {features.map((feature, index) => (
                  <div key={index} className="feature-detail">
                    <h5 className="feature-name">{feature.name}</h5>
                    {feature.entries && (
                      <div className="feature-description">
                        <ContentEntries entries={feature.entries} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Fallback to basic feature names if no rich details available
  const featuresByLevel: { [key: number]: string[] } = {};
  
  subclassFeatures.forEach(feature => {
    // Parse feature strings like "Thief|Rogue||Thief||3"
    const parts = feature.split('|');
    
    if (parts.length >= 6) {
      const level = parseInt(parts[5]) || 1;
      const featureName = parts[0];
      
      if (!featuresByLevel[level]) {
        featuresByLevel[level] = [];
      }
      featuresByLevel[level].push(featureName);
    }
  });

  if (Object.keys(featuresByLevel).length === 0) return null;

  return (
    <div className="subclass-feature-progression">
      <h6>Subclass Features</h6>
      <div className="feature-timeline">
        {Object.entries(featuresByLevel)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([level, features]) => (
            <div key={level} className="feature-level-item">
              <div className="feature-level-label">
                Level {level}
              </div>
              <div className="feature-list">
                {features.join(', ')}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function SubclassTabs({ subclasses, subclassTitle = 'Subclasses' }: SubclassTabsProps) {
  const [selectedSubclass, setSelectedSubclass] = useState<number | null>(null);

  if (!subclasses || subclasses.length === 0) return null;

  // Sort subclasses alphabetically by name
  const sortedSubclasses = [...subclasses].sort((a, b) => {
    const nameA = a.shortName || a.name || '';
    const nameB = b.shortName || b.name || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="subclass-tabs-container">
      <h4>{subclassTitle}</h4>
      
      {/* Tab Navigation */}
      <div className="subclass-tab-nav">
        {sortedSubclasses.map((subclass, index) => (
          <button
            key={index}
            className={`subclass-tab ${selectedSubclass === index ? 'active' : ''}`}
            onClick={() => setSelectedSubclass(selectedSubclass === index ? null : index)}
          >
            {subclass.shortName || subclass.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedSubclass !== null && (
        <div className="subclass-tab-content">
          <div className="subclass-content">
            <div className="subclass-header">
              <h5>
                {sortedSubclasses[selectedSubclass].name}
                {sortedSubclasses[selectedSubclass].shortName && 
                  sortedSubclasses[selectedSubclass].shortName !== sortedSubclasses[selectedSubclass].name && 
                  ` (${sortedSubclasses[selectedSubclass].shortName})`
                }
              </h5>
              {sortedSubclasses[selectedSubclass].source && (
                <div className="subclass-source">
                  Source: {sortedSubclasses[selectedSubclass].source}
                </div>
              )}
            </div>

            {/* Expanded Spell List */}
            {sortedSubclasses[selectedSubclass].additionalSpells && (
              <ExpandedSpellList additionalSpells={sortedSubclasses[selectedSubclass].additionalSpells} />
            )}

            {/* Subclass Feature Progression */}
            {sortedSubclasses[selectedSubclass].subclassFeatures && (
              <div className="subclass-feature-section">
                <h6>Subclass Features</h6>
                <SubclassFeatureProgression 
                  subclassFeatures={sortedSubclasses[selectedSubclass].subclassFeatures}
                  featureDetails={sortedSubclasses[selectedSubclass].featureDetails}
                />
                {(!sortedSubclasses[selectedSubclass].featureDetails || sortedSubclasses[selectedSubclass].featureDetails.length === 0) && (
                  <div className="feature-note">
                    <p><em>Feature names and levels are shown above. For complete feature descriptions, refer to your Player's Handbook or other official D&D 5e sources.</em></p>
                  </div>
                )}
              </div>
            )}

            {/* Subclass Table Groups (Spell Progression, etc.) */}
            {sortedSubclasses[selectedSubclass].subclassTableGroups && (
              <div className="subclass-tables">
                <h6>Subclass Tables</h6>
                {sortedSubclasses[selectedSubclass].subclassTableGroups.map((tableGroup: any, index: number) => (
                  <div key={index} className="table-group">
                    {tableGroup.title && <h6>{tableGroup.title}</h6>}
                    {/* Table rendering would go here */}
                  </div>
                ))}
              </div>
            )}

            {/* Subclass Description */}
            {sortedSubclasses[selectedSubclass].entries && (
              <div className="subclass-description">
                <h6>Description</h6>
                <ContentEntries entries={sortedSubclasses[selectedSubclass].entries} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}