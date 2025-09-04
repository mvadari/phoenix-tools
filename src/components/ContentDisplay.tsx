import type { SearchResult } from '../types';
import SpellDisplay from './content/SpellDisplay';
import MonsterDisplay from './content/MonsterDisplay';
import ClassDisplay from './content/ClassDisplay';
import ItemDisplay from './content/ItemDisplay';
import GenericDisplay from './content/GenericDisplay';
import BackgroundDisplay from './content/BackgroundDisplay';

interface ContentDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

export default function ContentDisplay({ result, content, onClose }: ContentDisplayProps) {
  if (!content) return null;

  // Route to the appropriate specialized component based on category
  switch (result.category) {
    case 'spell':
      return <SpellDisplay result={result} content={content} onClose={onClose} />;
    
    case 'monster':
      return <MonsterDisplay result={result} content={content} onClose={onClose} />;
    
    case 'class':
      return <ClassDisplay result={result} content={content} onClose={onClose} />;
    
    case 'item':
      return <ItemDisplay result={result} content={content} onClose={onClose} />;
    
    case 'background':
      return <BackgroundDisplay result={result} content={content} onClose={onClose} />;
    
    default:
      return <GenericDisplay result={result} content={content} onClose={onClose} />;
  }
}