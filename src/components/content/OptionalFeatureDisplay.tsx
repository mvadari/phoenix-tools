import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';
import { PrerequisiteDisplay } from './shared';

interface OptionalFeatureDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function OptionalFeatureDisplay({ result, content, onClose }: OptionalFeatureDisplayProps) {
  const formatFeatureType = (featureType: string[]): string => {
    if (!featureType || featureType.length === 0) return '';
    
    const typeMap: { [key: string]: string } = {
      'EI': 'Eldritch Invocation',
      'FS': 'Fighting Style',
      'MM': 'Metamagic',
      'PB': 'Pact Boon',
      'ED': 'Elemental Discipline',
      'AI': 'Artificer Infusion',
      'RN': 'Ranger Natural Explorer',
      'MV': 'Maneuver',
      'OTH': 'Other'
    };
    
    return featureType.map(type => typeMap[type] || type).join(', ');
  };


  const formatRepeatable = (repeatable: boolean): string => {
    return repeatable ? 'Yes' : 'No';
  };

  const formatCharges = (charges: any): React.ReactNode => {
    if (!charges) return null;
    
    if (typeof charges === 'number') {
      return `${charges} charge${charges !== 1 ? 's' : ''}`;
    }
    
    if (typeof charges === 'object') {
      return Object.entries(charges).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value as string}
        </div>
      ));
    }
    
    return JSON.stringify(charges);
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="optional-feature-display">
        {/* Feature Type */}
        {content.featureType && (
          <div className="feature-type" data-feature-type={content.featureType?.[0]}>
            <h4>
              Feature Type
            </h4>
            <DetailRow name="Type" value={formatFeatureType(content.featureType)} />
          </div>
        )}

        {/* Prerequisites */}
        {content.prerequisite && (
          <PrerequisiteDisplay prerequisite={content.prerequisite} />
        )}

        {/* Feature Properties */}
        {(content.repeatable || content.charges || content.level) && (
          <div className="feature-properties">
            <h4>
              Properties
            </h4>
            {content.level && <DetailRow name="Level" value={content.level} />}
            {content.repeatable !== undefined && (
              <DetailRow name="Repeatable" value={formatRepeatable(content.repeatable)} />
            )}
            {content.charges && (
              <div className="charges-section">
                <strong>Charges:</strong>
                <div className="charges-details">
                  {formatCharges(content.charges)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Usage Limitations */}
        {(content.usesAction || content.usesBonus || content.usesReaction) && (
          <div className="usage-info">
            <h4>
              Action Economy
            </h4>
            {content.usesAction && <DetailRow name="Uses Action" value="Yes" />}
            {content.usesBonus && <DetailRow name="Uses Bonus Action" value="Yes" />}
            {content.usesReaction && <DetailRow name="Uses Reaction" value="Yes" />}
          </div>
        )}

        {/* Feature Description */}
        {content.entries && (
          <div className="feature-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Additional Information */}
        {content.additionalSources && content.additionalSources.length > 0 && (
          <div className="additional-sources">
            <h4>
              Additional Sources
            </h4>
            {content.additionalSources.map((source: any, index: number) => (
              <div key={index} className="source-item">
                <strong>{source.source}</strong>
                {source.page && ` p. ${source.page}`}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}