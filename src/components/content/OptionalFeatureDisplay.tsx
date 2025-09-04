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

  const getFeatureTypeColor = (featureType: string[]): string => {
    if (!featureType || featureType.length === 0) return '#6c757d';
    const firstType = featureType[0];
    const colorMap: { [key: string]: string } = {
      'EI': '#8b5cf6', // Eldritch Invocation - purple
      'FS': '#ef4444', // Fighting Style - red
      'MM': '#3b82f6', // Metamagic - blue
      'PB': '#10b981', // Pact Boon - emerald
      'ED': '#f59e0b', // Elemental Discipline - amber
      'AI': '#6366f1', // Artificer Infusion - indigo
      'RN': '#22c55e', // Ranger - green
      'MV': '#f97316'  // Maneuver - orange
    };
    return colorMap[firstType] || '#6c757d';
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
          <div className="feature-type" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: getFeatureTypeColor(content.featureType) + '20',
            borderRadius: '6px',
            borderLeft: `4px solid ${getFeatureTypeColor(content.featureType)}`
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: getFeatureTypeColor(content.featureType),
              fontSize: '1.1rem'
            }}>
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
          <div className="feature-properties" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#495057',
              fontSize: '1.1rem'
            }}>
              Properties
            </h4>
            {content.level && <DetailRow name="Level" value={content.level} />}
            {content.repeatable !== undefined && (
              <DetailRow name="Repeatable" value={formatRepeatable(content.repeatable)} />
            )}
            {content.charges && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Charges:</strong>
                <div style={{ marginLeft: '1rem' }}>
                  {formatCharges(content.charges)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Usage Limitations */}
        {(content.usesAction || content.usesBonus || content.usesReaction) && (
          <div className="usage-info" style={{
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
              Action Economy
            </h4>
            {content.usesAction && <DetailRow name="Uses Action" value="Yes" />}
            {content.usesBonus && <DetailRow name="Uses Bonus Action" value="Yes" />}
            {content.usesReaction && <DetailRow name="Uses Reaction" value="Yes" />}
          </div>
        )}

        {/* Feature Description */}
        {content.entries && (
          <div className="feature-description" style={{ marginBottom: '1.5rem' }}>
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

        {/* Additional Information */}
        {content.additionalSources && content.additionalSources.length > 0 && (
          <div className="additional-sources" style={{
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
              Additional Sources
            </h4>
            {content.additionalSources.map((source: any, index: number) => (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
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