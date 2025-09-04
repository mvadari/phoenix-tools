import type { SearchResult } from '../../types';

interface BaseContentDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BaseContentDisplay({ result, content, onClose, children }: BaseContentDisplayProps) {
  return (
    <div className="content-display" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      overflow: 'hidden'
    }}>
      <div className="content-header" style={{
        padding: '2rem',
        borderBottom: '2px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#111827',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {result.name}
          </h1>
          <div style={{ 
            marginTop: '0.5rem',
            fontSize: '1rem',
            color: '#6b7280',
            textTransform: 'capitalize',
            fontWeight: '500'
          }}>
            {result.category}
          </div>
        </div>
      </div>
      
      <div className="content-content" style={{ 
        padding: '2rem'
      }}>
        {children}
        
        <div className="content-source" style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            <strong>Source:</strong> {content.source || result.source}
            {content.page && <span> • Page {content.page}</span>}
            {content.srd && <span style={{ 
              marginLeft: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>SRD</span>}
            {content.basicRules && <span style={{ 
              marginLeft: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>Basic Rules</span>}
          </div>
        </div>
      </div>
    </div>
  );
}