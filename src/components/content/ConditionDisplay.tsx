import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';

interface ConditionDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function ConditionDisplay({ result, content, onClose }: ConditionDisplayProps) {
  const getConditionColor = (conditionName: string): string => {
    const name = conditionName.toLowerCase();
    const colorMap: { [key: string]: string } = {
      // Negative conditions - red spectrum
      'blinded': '#dc3545',
      'charmed': '#e83e8c',
      'deafened': '#6610f2',
      'frightened': '#fd7e14',
      'grappled': '#20c997',
      'incapacitated': '#dc3545',
      'paralyzed': '#6f42c1',
      'petrified': '#6c757d',
      'poisoned': '#28a745',
      'prone': '#ffc107',
      'restrained': '#17a2b8',
      'stunned': '#dc3545',
      'unconscious': '#343a40',
      // Diseases - darker colors
      'disease': '#8b0000',
      'madness': '#4b0082',
      'curse': '#2f4f4f'
    };
    
    // Check for disease or curse keywords
    if (name.includes('disease') || name.includes('fever') || name.includes('plague')) return colorMap['disease'];
    if (name.includes('madness') || name.includes('insanity')) return colorMap['madness'];
    if (name.includes('curse') || name.includes('cursed')) return colorMap['curse'];
    
    return colorMap[name] || '#6c757d';
  };

  const formatDuration = (duration: string): React.ReactNode => {
    if (!duration) return null;
    
    return (
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#fff3e0',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        <strong>Duration:</strong> {duration}
      </div>
    );
  };

  const formatSave = (save: string): React.ReactNode => {
    if (!save) return null;
    
    return (
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#e8f5e8',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        <strong>Save to End:</strong> {save}
      </div>
    );
  };

  const isCondition = (name: string): boolean => {
    const conditions = [
      'blinded', 'charmed', 'deafened', 'frightened', 'grappled', 
      'incapacitated', 'invisible', 'paralyzed', 'petrified', 
      'poisoned', 'prone', 'restrained', 'stunned', 'unconscious'
    ];
    return conditions.some(condition => name.toLowerCase().includes(condition));
  };

  const isDisease = (name: string): boolean => {
    return name.toLowerCase().includes('disease') || 
           name.toLowerCase().includes('fever') || 
           name.toLowerCase().includes('plague') ||
           name.toLowerCase().includes('pox');
  };

  const getConditionType = (): string => {
    if (isCondition(result.name)) return 'Condition';
    if (isDisease(result.name)) return 'Disease';
    return 'Affliction';
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="condition-display">
        {/* Condition Type Header */}
        <div className="condition-type" style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: getConditionColor(result.name) + '20',
          borderRadius: '6px',
          borderLeft: `4px solid ${getConditionColor(result.name)}`,
          textAlign: 'center'
        }}>
          <h4 style={{ 
            margin: '0', 
            color: getConditionColor(result.name),
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {getConditionType()}
          </h4>
        </div>

        {/* Duration and Save Information */}
        {(content.duration || content.save) && (
          <div className="condition-mechanics" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {content.duration && formatDuration(content.duration)}
            {content.save && formatSave(content.save)}
          </div>
        )}

        {/* Condition Effects */}
        {content.entries && (
          <div className="condition-effects" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: '#495057',
              fontSize: '1.1rem'
            }}>
              Effects
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Severity (for diseases) */}
        {content.severity && (
          <div className="condition-severity" style={{
            marginBottom: '1.5rem',
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
              Severity
            </h4>
            <DetailRow name="Level" value={content.severity} />
          </div>
        )}

        {/* Transmission (for diseases) */}
        {content.transmission && (
          <div className="condition-transmission" style={{
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
              Transmission
            </h4>
            <ContentEntries entries={[content.transmission]} />
          </div>
        )}

        {/* Treatment */}
        {content.treatment && (
          <div className="condition-treatment" style={{
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
              Treatment
            </h4>
            <ContentEntries entries={[content.treatment]} />
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}