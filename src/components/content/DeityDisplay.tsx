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
      <div className="domain-list">
        {domains.map((domain) => (
          <span key={domain} className="domain-tag">
            {domain}
          </span>
        ))}
      </div>
    );
  };



  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="deity-display">
        {/* Basic Deity Information */}
        <div className="deity-header">
          {content.title && <DetailRow name="Title" value={content.title} />}
          {content.alignment && <DetailRow name="Alignment" value={formatAlignment(content.alignment)} />}
          {content.pantheon && <DetailRow name="Pantheon" value={content.pantheon} />}
        </div>

        {/* Pantheon & Category */}
        {(content.pantheon || content.category) && (
          <div className="deity-pantheon" data-pantheon={content.pantheon}>
            <h4>
              Divine Information
            </h4>
            {content.pantheon && <DetailRow name="Pantheon" value={content.pantheon} />}
            {content.category && <DetailRow name="Divine Rank" value={content.category} />}
          </div>
        )}

        {/* Alignment Display */}
        {content.alignment && (
          <div className="deity-alignment" data-alignment={content.alignment?.[0]}>
            <h4>
              Alignment & Domains
            </h4>
            <DetailRow name="Alignment" value={formatAlignment(content.alignment)} />
            {content.domains && (
              <div className="domains-section">
                <strong>Domains:</strong>
                <div>
                  {formatDomains(content.domains)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Divine Details */}
        {(content.province || content.symbol) && (
          <div className="divine-details">
            <h4>
              Divine Aspects
            </h4>
            {content.province && <DetailRow name="Province" value={content.province} />}
            {content.symbol && <DetailRow name="Holy Symbol" value={content.symbol} />}
          </div>
        )}

        {/* Deity Description */}
        {content.entries && (
          <div className="deity-description">
            <h4>
              Description
            </h4>
            <ContentEntries entries={content.entries} />
          </div>
        )}

        {/* Altnames/Aliases */}
        {content.altNames && content.altNames.length > 0 && (
          <div className="deity-altnames">
            <h4>
              Also Known As
            </h4>
            <div className="altnames-list">
              {content.altNames.join(', ')}
            </div>
          </div>
        )}
      </div>
    </BaseContentDisplay>
  );
}