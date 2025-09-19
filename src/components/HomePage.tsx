import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataService } from '../services';
import type { DataCategory } from '../types';

const CATEGORY_CONFIG: Record<DataCategory, {
  label: string;
  icon: string;
  description: string;
  gradient: string;
}> = {
  spell: {
    label: 'Spells',
    icon: '✦',
    description: 'Magic spells from cantrips to 9th level',
    gradient: 'from-purple-500 to-blue-600'
  },
  monster: {
    label: 'Bestiary',
    icon: '⚔',
    description: 'Creatures, monsters, and NPCs',
    gradient: 'from-red-500 to-orange-600'
  },
  item: {
    label: 'Items',
    icon: '◊',
    description: 'Magic items, equipment, and treasures',
    gradient: 'from-yellow-500 to-amber-600'
  },
  class: {
    label: 'Classes',
    icon: '⚡',
    description: 'Character classes and subclasses',
    gradient: 'from-green-500 to-emerald-600'
  },
  background: {
    label: 'Backgrounds',
    icon: '🎭',
    description: 'Character backgrounds and origins',
    gradient: 'from-indigo-500 to-purple-600'
  },
  race: {
    label: 'Races',
    icon: '👥',
    description: 'Character races and lineages',
    gradient: 'from-pink-500 to-rose-600'
  },
  feat: {
    label: 'Feats',
    icon: '💪',
    description: 'Character feats and abilities',
    gradient: 'from-cyan-500 to-teal-600'
  },
  action: {
    label: 'Actions',
    icon: '⚡',
    description: 'Combat actions and maneuvers',
    gradient: 'from-orange-500 to-red-600'
  },
  condition: {
    label: 'Conditions',
    icon: '🛡',
    description: 'Status effects and conditions',
    gradient: 'from-gray-500 to-slate-600'
  },
  deity: {
    label: 'Deities',
    icon: '⭐',
    description: 'Gods and divine beings',
    gradient: 'from-yellow-400 to-gold-500'
  },
  optionalfeature: {
    label: 'Optional Features',
    icon: '🔧',
    description: 'Optional class features and variants',
    gradient: 'from-teal-500 to-cyan-600'
  },
  vehicle: {
    label: 'Vehicles',
    icon: '🚢',
    description: 'Ships, mounts, and vehicles',
    gradient: 'from-blue-500 to-indigo-600'
  },
  reward: {
    label: 'Rewards',
    icon: '🏆',
    description: 'Supernatural gifts and rewards',
    gradient: 'from-purple-400 to-pink-500'
  },
  psionics: {
    label: 'Psionics',
    icon: '🧠',
    description: 'Psionic powers and disciplines',
    gradient: 'from-violet-500 to-purple-600'
  },
  adventure: {
    label: 'Adventures',
    icon: '📖',
    description: 'Published adventures and campaigns',
    gradient: 'from-brown-500 to-amber-700'
  },
  'variant-rule': {
    label: 'Variant Rules',
    icon: '📋',
    description: 'Alternative and optional rules',
    gradient: 'from-slate-500 to-gray-600'
  },
  table: {
    label: 'Tables',
    icon: '📊',
    description: 'Random tables and references',
    gradient: 'from-neutral-500 to-stone-600'
  }
};

const PRIMARY_CATEGORIES: DataCategory[] = [
  'spell', 'monster', 'item', 'class', 'background', 'race', 'feat'
];

const SECONDARY_CATEGORIES: DataCategory[] = [
  'action', 'condition', 'deity', 'optionalfeature'
];

interface CategoryCardProps {
  category: DataCategory;
  count?: number;
  config: typeof CATEGORY_CONFIG[DataCategory];
}

function CategoryCard({ category, count, config }: CategoryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/search?category=${category}`);
  };

  return (
    <div
      className={`category-card ${config.gradient}`}
      onClick={handleClick}
      data-category={category}
    >
      <div className="category-card-content">
        <div className="category-icon">{config.icon}</div>
        <div className="category-info">
          <h3 className="category-title">{config.label}</h3>
          <p className="category-description">{config.description}</p>
          {count !== undefined && (
            <div className="category-count">
              {count.toLocaleString()} {count === 1 ? 'item' : 'items'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [categoryCounts, setCategoryCounts] = useState<Record<DataCategory, number>>({} as Record<DataCategory, number>);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadCategoryCounts = async () => {
      try {
        setLoading(true);
        await DataService.initialize();
        setInitialized(true);

        // Load global index to get category counts
        const globalIndex = await DataService.loadGlobalIndex();

        const counts = globalIndex.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {} as Record<DataCategory, number>);

        setCategoryCounts(counts);
      } catch (error) {
        console.error('Failed to load category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryCounts();
  }, []);

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading D&D content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1 className="homepage-title">Phoenix Tools</h1>
        <p className="homepage-subtitle">
          Your comprehensive D&D 5e reference tool
        </p>
        <div className="homepage-stats">
          {initialized && Object.keys(categoryCounts).length > 0 && (
            <span>
              {Object.values(categoryCounts).reduce((sum, count) => sum + count, 0).toLocaleString()}
              {' '}items across {Object.keys(categoryCounts).length} categories
            </span>
          )}
        </div>
      </div>

      <div className="category-grid">
        <div className="category-section">
          <h2 className="section-title">Core Content</h2>
          <div className="category-cards primary">
            {PRIMARY_CATEGORIES.map(category => (
              <CategoryCard
                key={category}
                category={category}
                count={categoryCounts[category]}
                config={CATEGORY_CONFIG[category]}
              />
            ))}
          </div>
        </div>

        <div className="category-section">
          <h2 className="section-title">Rules & References</h2>
          <div className="category-cards secondary">
            {SECONDARY_CATEGORIES.map(category => (
              <CategoryCard
                key={category}
                category={category}
                count={categoryCounts[category]}
                config={CATEGORY_CONFIG[category]}
              />
            ))}
          </div>
        </div>

        {/* Additional categories with counts > 0 */}
        {Object.entries(categoryCounts)
          .filter(([category, count]) =>
            count > 0 &&
            !PRIMARY_CATEGORIES.includes(category as DataCategory) &&
            !SECONDARY_CATEGORIES.includes(category as DataCategory)
          )
          .length > 0 && (
          <div className="category-section">
            <h2 className="section-title">Additional Content</h2>
            <div className="category-cards additional">
              {Object.entries(categoryCounts)
                .filter(([category, count]) =>
                  count > 0 &&
                  !PRIMARY_CATEGORIES.includes(category as DataCategory) &&
                  !SECONDARY_CATEGORIES.includes(category as DataCategory)
                )
                .map(([category, count]) => (
                  <CategoryCard
                    key={category}
                    category={category as DataCategory}
                    count={count}
                    config={CATEGORY_CONFIG[category as DataCategory]}
                  />
                ))
              }
            </div>
          </div>
        )}
      </div>

      <div className="homepage-footer">
        <div className="quick-links">
          <Link to="/search" className="quick-link">
            <span className="quick-link-icon">🔍</span>
            Advanced Search
          </Link>
        </div>
      </div>
    </div>
  );
}