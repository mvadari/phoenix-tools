import type { SearchResult } from '../types';
import SpellDisplay from './content/SpellDisplay';
import MonsterDisplay from './content/MonsterDisplay';
import ClassDisplay from './content/ClassDisplay';
import ItemDisplay from './content/ItemDisplay';
import GenericDisplay from './content/GenericDisplay';
import BackgroundDisplay from './content/BackgroundDisplay';
import FeatDisplay from './content/FeatDisplay';
import RaceDisplay from './content/RaceDisplay';
import ActionDisplay from './content/ActionDisplay';
import DeityDisplay from './content/DeityDisplay';
import ConditionDisplay from './content/ConditionDisplay';
import OptionalFeatureDisplay from './content/OptionalFeatureDisplay';
import VehicleDisplay from './content/VehicleDisplay';
import RewardDisplay from './content/RewardDisplay';

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
    
    case 'feat':
      return <FeatDisplay result={result} content={content} onClose={onClose} />;
    
    case 'race':
      return <RaceDisplay result={result} content={content} onClose={onClose} />;
    
    case 'action':
      return <ActionDisplay result={result} content={content} onClose={onClose} />;
    
    case 'deity':
      return <DeityDisplay result={result} content={content} onClose={onClose} />;
    
    case 'condition':
      return <ConditionDisplay result={result} content={content} onClose={onClose} />;
    
    case 'optionalfeature':
      return <OptionalFeatureDisplay result={result} content={content} onClose={onClose} />;
    
    case 'vehicle':
      return <VehicleDisplay result={result} content={content} onClose={onClose} />;
    
    case 'reward':
      return <RewardDisplay result={result} content={content} onClose={onClose} />;
    
    default:
      return <GenericDisplay result={result} content={content} onClose={onClose} />;
  }
}