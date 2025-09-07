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

  const formatDuration = (duration: string): React.ReactNode => {
    if (!duration) return null;
    
    return (
      <div className="duration-info">
        <strong>Duration:</strong> {duration}
      </div>
    );
  };

  const formatSave = (save: string): React.ReactNode => {
    if (!save) return null;
    
    return (
      <div className="save-info">
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
        <div className="condition-type" data-condition={result.name.toLowerCase()}>
          <h4>
            {getConditionType()}
          </h4>
        </div>

        {/* Duration and Save Information */}
        {(content.duration || content.save) && (
          <div className="condition-mechanics">
            {content.duration && formatDuration(content.duration)}
            {content.save && formatSave(content.save)}
          </div>
        )}

        {/* Condition Effects */}
        {content.entries && (
          <div className="condition-effects">
            <h4>
              Effects
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Severity (for diseases) */}
        {content.severity && (
          <div className="condition-severity">
            <h4>
              Severity
            </h4>
            <DetailRow name="Level" value={content.severity} />
          </div>
        )}

        {/* Transmission (for diseases) */}
        {content.transmission && (
          <div className="condition-transmission">
            <h4>
              Transmission
            </h4>
            <ContentEntries entries={[content.transmission]} />
          </div>
        )}

        {/* Treatment */}
        {content.treatment && (
          <div className="condition-treatment">
            <h4>
              Treatment
            </h4>
            <ContentEntries entries={[content.treatment]} />
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}