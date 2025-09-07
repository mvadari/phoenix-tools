interface AbilityScoresProps {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  className?: string;
}

export default function AbilityScores({ str, dex, con, int, wis, cha, className = "" }: AbilityScoresProps) {
  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const abilities = [
    { name: 'STR', score: str },
    { name: 'DEX', score: dex },
    { name: 'CON', score: con },
    { name: 'INT', score: int },
    { name: 'WIS', score: wis },
    { name: 'CHA', score: cha }
  ].filter(ability => ability.score !== undefined);

  if (abilities.length === 0) return null;

  return (
    <div 
      className={`ability-scores grid-layout ${className}`} 
      data-columns={Math.min(abilities.length, 6)}
    >
      {abilities.map(({ name, score }) => (
        <div key={name} className="ability-score">
          <div className="ability-name">
            {name}
          </div>
          <div className="ability-value">
            {score}
          </div>
          <div className="ability-modifier">
            ({getModifier(score!)})
          </div>
        </div>
      ))}
    </div>
  );
}