import type { SearchResult } from '../../types';

interface BaseContentDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BaseContentDisplay({ result, content, onClose, children }: BaseContentDisplayProps) {
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
          {children}
          
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
      </div>
    </div>
  );
}