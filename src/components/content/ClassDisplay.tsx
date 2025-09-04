import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';

interface ClassDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function ClassDisplay({ result, content, onClose }: ClassDisplayProps) {
  console.log(content);
  console.log(result);
  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        <div className="class-details">
          {content.hd && (
            <div className="detail-row">
              <strong>Hit Die:</strong> {content.hd.number}d{content.hd.faces}
            </div>
          )}
          
          {content.proficiency && (
            <>
              {content.startingProficiencies.armor && (
                <div className="detail-row">
                  <strong>Armor Proficiencies:</strong> {content.startingProficiencies.armor.join(', ')}
                </div>
              )}
              {content.startingProficiencies.weapons && (
                <div className="detail-row">
                  <strong>Weapon Proficiencies:</strong> {content.startingProficiencies.weapons.join(', ')}
                </div>
              )}
              {content.startingProficiencies.tools && (
                <div className="detail-row">
                  <strong>Tool Proficiencies:</strong> {content.startingProficiencies.tools.join(', ')}
                </div>
              )}
              {content.startingProficiencies.savingThrows && (
                <div className="detail-row">
                  <strong>Saving Throw Proficiencies:</strong> {content.startingProficiencies.savingThrows.join(', ')}
                </div>
              )}
              {content.startingProficiencies.skills && (
                <div className="detail-row">
                  <strong>Skill Proficiencies:</strong> Choose {content.startingProficiencies.skills.map(skill => `${skill.choose.count} from ${skill.choose.from.join(', ')}`).join(', ')}
                </div>
              )}
            </>
          )}

          {content.startingEquipment && (
            <div className="starting-equipment">
              <h4>Starting Equipment</h4>
              <ContentEntries entries={content.startingEquipment} />
            </div>
          )}

          {content.multiclassing && (
            <div className="multiclassing">
              <h4>Multiclassing</h4>
              <ContentEntries entries={content.multiclassing} />
            </div>
          )}
        </div>

        {content.classTableGroups && (
          <div className="class-table">
            <h4>Class Features</h4>
            {content.classTableGroups.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="table-group">
                {group.title && <h5>{group.title}</h5>}
                {/* Table rendering would go here */}
              </div>
            ))}
          </div>
        )}

        {content.classFeatures && (
          <div className="class-features">
            <h4>Class Features</h4>
            {content.classFeatures.map((feature: any, index: number) => (
              <div key={index} className="feature">
                <h5>{feature.name}</h5>
                {feature.entries && <ContentEntries entries={feature.entries} />}
              </div>
            ))}
          </div>
        )}

        {content.subclassTitle && (
          <div className="subclass-info">
            <h4>{content.subclassTitle}</h4>
            {content.subclasses && (
              <div className="subclasses">
                {content.subclasses.map((subclass: any, index: number) => (
                  <div key={index} className="subclass">
                    <h5>{subclass.name}</h5>
                    {subclass.entries && <ContentEntries entries={subclass.entries} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {content.entries && <ContentEntries entries={content.entries} />}
      </div>
    </BaseContentDisplay>
  );
}