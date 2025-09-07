import type { SearchResult } from '../../types';

interface BaseContentDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BaseContentDisplay({ result, content, children }: BaseContentDisplayProps) {
  return (
    <div className="content-display">
      <div className="content-header">
        <div>
          <h1>
            {result.name}
          </h1>
          <div>
            {result.category}
          </div>
        </div>
      </div>
      
      <div className="content-content">
        {children}
        
        <div className="content-source">
          <div>
            <strong>Source:</strong> {content?.source || result.source}
            {content?.page && <span> • Page {content?.page}</span>}
            {content?.srd && <span>SRD</span>}
            {content?.basicRules && <span>Basic Rules</span>}
          </div>
        </div>
      </div>
    </div>
  );
}