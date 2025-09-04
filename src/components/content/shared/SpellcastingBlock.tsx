import { Link } from 'react-router-dom';
import ContentEntries from '../ContentEntries';

interface SpellcastingBlockProps {
  spellcasting?: any[];
  title?: string;
}

export default function SpellcastingBlock({ spellcasting, title = "Spellcasting" }: SpellcastingBlockProps) {
  if (!spellcasting?.length) return null;

  const renderSpellList = (spells: any) => {
    if (!spells) return null;

    return Object.entries(spells).map(([level, spellData]: [string, any]) => {
      const levelNum = parseInt(level);
      const levelLabel = levelNum === 0 ? 'Cantrips (at will)' : 
                        levelNum === 1 ? '1st level' :
                        levelNum === 2 ? '2nd level' :
                        levelNum === 3 ? '3rd level' :
                        `${levelNum}th level`;
      
      let spellInfo = '';
      if (spellData.slots) {
        spellInfo = ` (${spellData.slots} slot${spellData.slots !== 1 ? 's' : ''})`;
      }

      const spellList = spellData.spells || [];

      return (
        <div key={level} style={{ marginBottom: '0.75rem', marginLeft: '1rem' }}>
          <strong>{levelLabel}{spellInfo}:</strong>{' '}
          {spellList.map((spell: string, index: number) => (
            <span key={spell}>
              <Link 
                to={`/spell/phb/${spell.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                {spell}
              </Link>
              {index < spellList.length - 1 && ', '}
            </span>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="spellcasting-block" style={{
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f0f8ff',
      borderRadius: '6px',
      border: '1px solid #b3d9ff'
    }}>
      <h4 style={{ 
        color: '#0056b3', 
        marginBottom: '1rem',
        borderBottom: '2px solid #b3d9ff',
        paddingBottom: '0.5rem'
      }}>
        {title}
      </h4>
      
      {spellcasting.map((caster, index) => (
        <div key={index} className="spellcaster" style={{ marginBottom: '1.5rem' }}>
          {caster.name && (
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#0056b3' }}>
              {caster.name}
            </h5>
          )}
          
          {caster.headerEntries && <ContentEntries entries={caster.headerEntries} />}
          
          {caster.spells && (
            <div style={{ marginTop: '0.5rem' }}>
              {renderSpellList(caster.spells)}
            </div>
          )}
          
          {caster.footerEntries && <ContentEntries entries={caster.footerEntries} />}
        </div>
      ))}
    </div>
  );
}