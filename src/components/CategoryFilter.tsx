import type { DataCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory?: DataCategory;
  onCategoryChange: (category?: DataCategory) => void;
  counts?: Record<DataCategory, number>;
}

const CATEGORY_LABELS: Record<DataCategory, string> = {
  spell: 'Spells',
  class: 'Classes',
  monster: 'Bestiary',
  background: 'Backgrounds',
  item: 'Items',
  feat: 'Feats',
  race: 'Races',
  action: 'Actions',
  adventure: 'Adventures',
  deity: 'Deities',
  condition: 'Conditions',
  reward: 'Rewards',
  'variant-rule': 'Variant Rules',
  table: 'Tables',
  optionalfeature: 'Optional Features',
  vehicle: 'Vehicles',
  psionics: 'Psionics'
};

const PRIMARY_CATEGORIES: DataCategory[] = [
  'spell', 'monster', 'item', 'class', 'background', 'feat', 'race'
];

const SECONDARY_CATEGORIES: DataCategory[] = [
  'action', 'deity', 'condition', 'optionalfeature', 'vehicle', 'reward'
];

export default function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  counts 
}: CategoryFilterProps) {
  return (
    <div className="category-filters">
      <button
        className={`category-filter ${!selectedCategory ? 'active' : ''}`}
        onClick={() => onCategoryChange(undefined)}
      >
        All
        {counts && Object.values(counts).length > 0 && (
          <span className="category-count">
            {Object.values(counts).reduce((sum, count) => sum + count, 0)}
          </span>
        )}
      </button>
      
      {PRIMARY_CATEGORIES.map(category => (
        <button
          key={category}
          className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {CATEGORY_LABELS[category]}
          {counts && counts[category] && (
            <span className="category-count">{counts[category]}</span>
          )}
        </button>
      ))}
      
      <div className="category-divider" style={{
        margin: '0 0.5rem',
        borderLeft: '1px solid #dee2e6',
        height: '30px'
      }} />
      
      {SECONDARY_CATEGORIES.map(category => (
        <button
          key={category}
          className={`category-filter secondary ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {CATEGORY_LABELS[category]}
          {counts && counts[category] && (
            <span className="category-count">{counts[category]}</span>
          )}
        </button>
      ))}
    </div>
  );
}