import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';
import ContentEntries from './ContentEntries';
import DetailRow from '../basic/DetailRow';

interface DeityDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function DeityDisplay({ result, content, onClose }: DeityDisplayProps) {
  const formatAlignment = (alignment: string[]): string => {
    if (!alignment || alignment.length === 0) return '';
    const alignmentMap: { [key: string]: string } = {
      'LG': 'Lawful Good', 'NG': 'Neutral Good', 'CG': 'Chaotic Good',
      'LN': 'Lawful Neutral', 'N': 'Neutral', 'CN': 'Chaotic Neutral',
      'LE': 'Lawful Evil', 'NE': 'Neutral Evil', 'CE': 'Chaotic Evil',
      'U': 'Unaligned', 'A': 'Any Alignment'
    };
    
    return alignment.map(a => alignmentMap[a] || a).join(', ');
  };

  const formatDomains = (domains: string[]): React.ReactNode => {
    if (!domains || domains.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {domains.map((domain) => (
          <span
            key={domain}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              borderRadius: '16px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {domain}
          </span>
        ))}
      </div>
    );
  };

  const getAlignmentColor = (alignment: string[]): string => {
    if (!alignment || alignment.length === 0) return '#6c757d';
    const firstAlignment = alignment[0];
    const colorMap: { [key: string]: string } = {
      'LG': '#28a745', 'NG': '#20c997', 'CG': '#17a2b8',
      'LN': '#6f42c1', 'N': '#6c757d', 'CN': '#fd7e14',
      'LE': '#dc3545', 'NE': '#e83e8c', 'CE': '#343a40'
    };
    return colorMap[firstAlignment] || '#6c757d';
  };

  const getPantheonColor = (pantheon: string): string => {
    const colorMap: { [key: string]: string } = {
      'Dwarven': '#8b4513',
      'Elven': '#32cd32',
      'Halfling': '#daa520',
      'Human': '#4682b4',
      'Draconic': '#dc143c',
      'Orcish': '#8b0000',
      'Goblinoid': '#556b2f',
      'Giant': '#2f4f4f',
      'Gnomish': '#9370db',
      'Celtic': '#228b22',
      'Greek': '#4169e1',
      'Norse': '#1e90ff',
      'Egyptian': '#ff8c00',
      'Forgotten Realms': '#800080',
      'Greyhawk': '#006400',
      'Dragonlance': '#b22222'
    };
    return colorMap[pantheon] || '#6c757d';
  };

  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="deity-display">
        {/* Basic Deity Information */}
        <div className="deity-header" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {content.title && <DetailRow name="Title" value={content.title} />}
          {content.alignment && <DetailRow name="Alignment" value={formatAlignment(content.alignment)} />}
          {content.pantheon && <DetailRow name="Pantheon" value={content.pantheon} />}
        </div>

        {/* Pantheon & Category */}
        {(content.pantheon || content.category) && (
          <div className="deity-pantheon" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: getPantheonColor(content.pantheon) + '20',
            borderRadius: '6px',
            borderLeft: `4px solid ${getPantheonColor(content.pantheon)}`
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: getPantheonColor(content.pantheon),
              fontSize: '1.1rem'
            }}>
              Divine Information
            </h4>
            {content.pantheon && <DetailRow name="Pantheon" value={content.pantheon} />}
            {content.category && <DetailRow name="Divine Rank" value={content.category} />}
          </div>
        )}

        {/* Alignment Display */}
        {content.alignment && (
          <div className="deity-alignment" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: getAlignmentColor(content.alignment) + '20',
            borderRadius: '6px',
            borderLeft: `4px solid ${getAlignmentColor(content.alignment)}`
          }}>
            <h4 style={{ 
              margin: '0 0 1rem 0', 
              color: getAlignmentColor(content.alignment),
              fontSize: '1.1rem'
            }}>
              Alignment & Domains
            </h4>
            <DetailRow name="Alignment" value={formatAlignment(content.alignment)} />
            {content.domains && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Domains:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  {formatDomains(content.domains)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Divine Details */}
        {(content.province || content.symbol) && (
          <div className="divine-details" style={{
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
              Divine Aspects
            </h4>
            {content.province && <DetailRow name="Province" value={content.province} />}
            {content.symbol && <DetailRow name="Holy Symbol" value={content.symbol} />}
          </div>
        )}

        {/* Deity Description */}
        {content.entries && (
          <div className="deity-description" style={{ marginBottom: '1.5rem' }}>
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

        {/* Altnames/Aliases */}
        {content.altNames && content.altNames.length > 0 && (
          <div className="deity-altnames" style={{
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
              Also Known As
            </h4>
            <div style={{ fontStyle: 'italic' }}>
              {content.altNames.join(', ')}
            </div>
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}