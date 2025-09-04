import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import { ProficiencyList, EquipmentList } from './shared';

interface BackgroundDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function BackgroundDisplay({ result, content, onClose }: BackgroundDisplayProps) {
  const formatTraits = (traits: any[]): React.ReactNode => {
    if (!traits || traits.length === 0) return null;

    return traits.map((trait, index) => (
      <div key={index} style={{ 
        marginBottom: '0.75rem',
        fontSize: '0.9rem'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {index + 1}. {trait}
        </div>
      </div>
    ));
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="background-display">
        {/* Proficiencies */}
        {(content.skillProficiencies || content.languageProficiencies || content.toolProficiencies) && (
          <div className="background-proficiencies" style={{
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
              Proficiencies
            </h4>
            <ProficiencyList
              skills={content.skillProficiencies}
              languages={content.languageProficiencies}
              tools={content.toolProficiencies}
            />
          </div>
        )}

        {/* Starting Equipment */}
        {content.startingEquipment && (
          <EquipmentList equipment={content.startingEquipment} />
        )}

        {/* Background Description */}
        {content.entries && (
          <div className="background-description" style={{ marginBottom: '1.5rem' }}>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Personality Traits */}
        {content.personality && content.personality.length > 0 && (
          <div className="personality-traits" style={{
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
              Suggested Personality Traits
            </h4>
            {formatTraits(content.personality)}
          </div>
        )}

        {/* Ideals */}
        {content.ideals && content.ideals.length > 0 && (
          <div className="ideals" style={{
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
              Suggested Ideals
            </h4>
            {formatTraits(content.ideals)}
          </div>
        )}

        {/* Bonds */}
        {content.bonds && content.bonds.length > 0 && (
          <div className="bonds" style={{
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
              Suggested Bonds
            </h4>
            {formatTraits(content.bonds)}
          </div>
        )}

        {/* Flaws */}
        {content.flaws && content.flaws.length > 0 && (
          <div className="flaws" style={{
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
              Suggested Flaws
            </h4>
            {formatTraits(content.flaws)}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}