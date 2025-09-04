import type { SearchResult } from '../types';

interface ContentDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function ContentDisplay({ result, content, onClose }: ContentDisplayProps) {
  const renderContent = () => {
    if (!content) return null;

    // Basic content rendering - could be enhanced based on content type
    return (
      <div className="content-body">
        {content.entries && Array.isArray(content.entries) && (
          <div className="content-entries">
            {content.entries.map((entry: any, index: number) => (
              <div key={index} className="content-entry">
                {typeof entry === 'string' ? (
                  <p>{entry}</p>
                ) : (
                  <div>
                    {entry.name && <h4>{entry.name}</h4>}
                    {entry.entries && Array.isArray(entry.entries) && (
                      <div>
                        {entry.entries.map((subEntry: string, subIndex: number) => (
                          <p key={subIndex}>{subEntry}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {result.category === 'spell' && (
          <div className="spell-details">
            {content.level !== undefined && (
              <div className="detail-row">
                <strong>Level:</strong> {content.level === 0 ? 'Cantrip' : content.level}
              </div>
            )}
            {content.school && (
              <div className="detail-row">
                <strong>School:</strong> {content.school}
              </div>
            )}
            {content.time && (
              <div className="detail-row">
                <strong>Casting Time:</strong> {
                  Array.isArray(content.time) ? 
                    content.time.map((t: any) => `${t.number} ${t.unit}`).join(', ') :
                    'Unknown'
                }
              </div>
            )}
            {content.range && (
              <div className="detail-row">
                <strong>Range:</strong> {
                  content.range.distance ? 
                    `${content.range.distance.amount} ${content.range.distance.type}` :
                    content.range.type
                }
              </div>
            )}
            {content.components && (
              <div className="detail-row">
                <strong>Components:</strong> {
                  [
                    content.components.v && 'V',
                    content.components.s && 'S',
                    content.components.m && (typeof content.components.m === 'string' ? `M (${content.components.m})` : 'M')
                  ].filter(Boolean).join(', ')
                }
              </div>
            )}
            {content.duration && (
              <div className="detail-row">
                <strong>Duration:</strong> {
                  Array.isArray(content.duration) ?
                    content.duration.map((d: any) => 
                      d.duration ? `${d.duration.number} ${d.duration.unit}` : d.type
                    ).join(', ') :
                    'Unknown'
                }
              </div>
            )}
          </div>
        )}

        {result.category === 'monster' && (
          <div className="monster-details">
            {content.size && (
              <div className="detail-row">
                <strong>Size:</strong> {Array.isArray(content.size) ? content.size.join(', ') : content.size}
              </div>
            )}
            {content.type && (
              <div className="detail-row">
                <strong>Type:</strong> {typeof content.type === 'string' ? content.type : content.type.type}
              </div>
            )}
            {content.alignment && (
              <div className="detail-row">
                <strong>Alignment:</strong> {Array.isArray(content.alignment) ? content.alignment.join(', ') : content.alignment}
              </div>
            )}
            {content.ac && (
              <div className="detail-row">
                <strong>AC:</strong> {Array.isArray(content.ac) ? content.ac.map((ac: any) => typeof ac === 'number' ? ac : ac.ac).join(', ') : content.ac}
              </div>
            )}
            {content.hp && (
              <div className="detail-row">
                <strong>HP:</strong> {typeof content.hp === 'number' ? content.hp : `${content.hp.average} (${content.hp.formula})`}
              </div>
            )}
            {content.speed && (
              <div className="detail-row">
                <strong>Speed:</strong> {
                  Object.entries(content.speed).map(([type, value]) => `${type} ${value}`).join(', ')
                }
              </div>
            )}
            <div className="ability-scores" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '1rem',
              margin: '1rem 0'
            }}>
              <div><strong>STR</strong><br/>{content.str}</div>
              <div><strong>DEX</strong><br/>{content.dex}</div>
              <div><strong>CON</strong><br/>{content.con}</div>
              <div><strong>INT</strong><br/>{content.int}</div>
              <div><strong>WIS</strong><br/>{content.wis}</div>
              <div><strong>CHA</strong><br/>{content.cha}</div>
            </div>
          </div>
        )}

        <div className="content-source" style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.9rem',
          color: '#6c757d'
        }}>
          <strong>Source:</strong> {content.source || result.source}
          {content.page && <span> • Page {content.page}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="content-modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div 
        className="content-modal" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '800px',
          maxHeight: '90vh',
          width: '100%',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
        }}
      >
        <div className="content-header" style={{
          padding: '1.5rem',
          borderBottom: '1px solid #dee2e6',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, color: '#2c3e50' }}>{result.name}</h2>
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                color: '#6c757d',
                textTransform: 'capitalize'
              }}>
                {result.category} • {result.source}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6c757d',
                padding: '0.5rem'
              }}
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="content-content" style={{ padding: '1.5rem' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}