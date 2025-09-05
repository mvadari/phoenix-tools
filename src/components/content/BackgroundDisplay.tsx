import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import { ProficiencyList, EquipmentList } from './shared';
import { useState } from 'react';
import SourceTabs from './shared/SourceTabs';

interface BackgroundDisplayProps {
  result: SearchResult;
  content: { [source: string]: any } | any; // Support both old and new format
  onClose: () => void;
}

export default function BackgroundDisplay({ result, content, onClose }: BackgroundDisplayProps) {
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Determine if we have multi-source content or single content
  const isMultiSource = content && typeof content === 'object' && 
    !content.name && // If it has a name, it's probably a single object
    Object.keys(content).some(key => content[key]?.name); // Check if values look like objects

  const handleSourceChange = (_source: string, sourceContent: any) => {
    setCurrentContent(sourceContent);
  };

  // If it's single source content, use it directly
  const actualContent = isMultiSource ? currentContent : content;

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
    <BaseContentDisplay result={result} content={actualContent} onClose={onClose}>
      {isMultiSource && (
        <SourceTabs 
          sources={content}
          availableSources={result.availableSources}
          onSourceChange={handleSourceChange}
          primarySource={result.source}
        />
      )}
      <div className="background-display">
        {/* Proficiencies */}
        {(actualContent.skillProficiencies || actualContent.languageProficiencies || actualContent.toolProficiencies) && (
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
              skills={actualContent.skillProficiencies}
              languages={actualContent.languageProficiencies}
              tools={actualContent.toolProficiencies}
            />
          </div>
        )}

        {/* Starting Equipment */}
        {actualContent.startingEquipment && (
          <EquipmentList equipment={actualContent.startingEquipment} />
        )}

        {/* Background Description */}
        {actualContent.entries && (
          <div className="background-description" style={{ marginBottom: '1.5rem' }}>
            <ContentEntries entries={actualContent.entries} />
          </div>
        )}

        {/* Personality Traits */}
        {actualContent.personality && actualContent.personality.length > 0 && (
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
            {formatTraits(actualContent.personality)}
          </div>
        )}

        {/* Ideals */}
        {actualContent.ideals && actualContent.ideals.length > 0 && (
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
            {formatTraits(actualContent.ideals)}
          </div>
        )}

        {/* Bonds */}
        {actualContent.bonds && actualContent.bonds.length > 0 && (
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
            {formatTraits(actualContent.bonds)}
          </div>
        )}

        {/* Flaws */}
        {actualContent.flaws && actualContent.flaws.length > 0 && (
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
            {formatTraits(actualContent.flaws)}
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}