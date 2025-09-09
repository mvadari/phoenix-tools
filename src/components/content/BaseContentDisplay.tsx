import { useState, useEffect } from 'react';
import type { SearchResult } from '../../types';
import { DataService } from '../../services/dataService';
import ContentEntries from './ContentEntries';

interface BaseContentDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BaseContentDisplay({ result, content, children }: BaseContentDisplayProps) {
  const [fluffContent, setFluffContent] = useState<any>(null);

  useEffect(() => {
    const loadFluff = async () => {
      // Check if this content has fluff (default to true if hasFluff field is not present)
      const hasFluff = content?.hasFluff !== false;
      
      if (!hasFluff) {
        setFluffContent(null);
        return;
      }

      try {
        const fluff = await DataService.loadFluff(result.category, result.name, result.source);
        setFluffContent(fluff);
      } catch (error) {
        console.error('Failed to load fluff:', error);
      }
    };

    loadFluff();
  }, [result.category, result.name, result.source, content]);
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
      
      {/* Fluff content section - displayed at the top */}
      {fluffContent && fluffContent.entries && (
        <div className="fluff-content">
          <ContentEntries entries={fluffContent.entries} />
        </div>
      )}
      
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