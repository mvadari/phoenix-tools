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
        <div key={level} className="spell-level">
          <strong>{levelLabel}{spellInfo}:</strong>{' '}
          {spellList.map((spell: string, index: number) => (
            <span key={spell}>
              <Link 
                to={`/spell/phb/${spell.toLowerCase().replace(/\s+/g, '-')}`}
                className="spell-link"
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
    <div className="spellcasting-block">
      <h4>
        {title}
      </h4>
      
      {spellcasting.map((caster, index) => (
        <div key={index} className="spellcaster">
          {caster.name && (
            <h5>
              {caster.name}
            </h5>
          )}
          
          {caster.headerEntries && <ContentEntries entries={caster.headerEntries} />}
          
          {caster.spells && (
            <div className="spell-levels">
              {renderSpellList(caster.spells)}
            </div>
          )}
          
          {caster.footerEntries && <ContentEntries entries={caster.footerEntries} />}
        </div>
      ))}
    </div>
  );
}