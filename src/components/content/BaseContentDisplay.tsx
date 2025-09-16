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
  const [showFluff, setShowFluff] = useState<boolean>(() => {
    // Load from localStorage, default to open
    try {
      const saved = localStorage.getItem('fluffContentVisible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (error) {
      // If there's any issue with localStorage, default to open
      return true;
    }
  });

  const toggleFluff = () => {
    const newValue = !showFluff;
    setShowFluff(newValue);
    try {
      localStorage.setItem('fluffContentVisible', JSON.stringify(newValue));
    } catch (error) {
      console.warn('Failed to save fluff visibility preference:', error);
    }
  };

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
          <h4 className="fluff-toggle" onClick={toggleFluff}>
            <span>Description</span>
            <span className={`toggle-icon ${showFluff ? 'expanded' : 'collapsed'}`}>
              ▼
            </span>
          </h4>
          {showFluff && (
            <div className="fluff-content-body">
              <ContentEntries entries={fluffContent.entries} />
            </div>
          )}
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