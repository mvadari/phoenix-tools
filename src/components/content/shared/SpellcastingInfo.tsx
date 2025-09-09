import DetailRow from '../../basic/DetailRow';

interface SpellcastingInfoProps {
  spellcastingAbility?: string;
  casterProgression?: string;
  preparedSpells?: string;
  cantripProgression?: number[];
  spellsKnownProgression?: number[];
  spellsKnownProgressionFixedByLevel?: Record<string, Record<string, number>>;
}

export default function SpellcastingInfo({ 
  spellcastingAbility,
  casterProgression,
  preparedSpells,
  cantripProgression,
  spellsKnownProgression,
  spellsKnownProgressionFixedByLevel
}: SpellcastingInfoProps) {
  if (!spellcastingAbility && !casterProgression) return null;

  const formatAbility = (ability: string): string => {
    const abilityNames: Record<string, string> = {
      'str': 'Strength',
      'dex': 'Dexterity', 
      'con': 'Constitution',
      'int': 'Intelligence',
      'wis': 'Wisdom',
      'cha': 'Charisma'
    };
    return abilityNames[ability.toLowerCase()] || ability.toUpperCase();
  };

  const formatCasterProgression = (progression: string): string => {
    const progressionNames: Record<string, string> = {
      'full': 'Full Caster',
      'half': 'Half Caster',
      'third': 'Third Caster',
      'pact': 'Pact Magic',
      'artificer': 'Artificer Spellcasting'
    };
    return progressionNames[progression] || progression;
  };

  const formatPreparedSpells = (formula: string): string => {
    return formula
      .replace('<$level$>', 'class level')
      .replace('<$int_mod$>', 'Intelligence modifier')
      .replace('<$wis_mod$>', 'Wisdom modifier')
      .replace('<$cha_mod$>', 'Charisma modifier');
  };

  const formatMysticArcanum = (): React.ReactNode => {
    if (!spellsKnownProgressionFixedByLevel) return null;

    const mysticSpells: string[] = [];
    Object.entries(spellsKnownProgressionFixedByLevel).forEach(([level, spells]) => {
      Object.entries(spells).forEach(([spellLevel, count]) => {
        mysticSpells.push(`Level ${level}: ${count} ${spellLevel}${getOrdinalSuffix(parseInt(spellLevel))} level spell`);
      });
    });

    if (mysticSpells.length === 0) return null;

    return (
      <div className="mystic-arcanum">
        <strong>Mystic Arcanum:</strong>
        <div className="mystic-arcanum-list">
          {mysticSpells.map((spell, index) => (
            <div key={index} className="mystic-spell">
              {spell}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getOrdinalSuffix = (num: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  };

  return (
    <div className="spellcasting-info">
      <h4>Spellcasting</h4>
      <div className="spellcasting-details">
        {spellcastingAbility && (
          <DetailRow 
            name="Spellcasting Ability" 
            value={formatAbility(spellcastingAbility)} 
          />
        )}
        {casterProgression && (
          <DetailRow 
            name="Casting Type" 
            value={formatCasterProgression(casterProgression)} 
          />
        )}
        {preparedSpells && (
          <DetailRow 
            name="Spells Prepared" 
            value={formatPreparedSpells(preparedSpells)} 
          />
        )}
        {cantripProgression && (
          <DetailRow 
            name="Cantrips at 1st Level" 
            value={cantripProgression[0].toString()} 
          />
        )}
        {spellsKnownProgression && (
          <DetailRow 
            name="Spells Known at 1st Level" 
            value={spellsKnownProgression[0].toString()} 
          />
        )}
        {formatMysticArcanum()}
      </div>
    </div>
  );
}