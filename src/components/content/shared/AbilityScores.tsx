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
    <div className={`ability-scores ${className}`} style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(abilities.length, 6)}, 1fr)`,
      gap: '1rem',
      marginTop: '1rem'
    }}>
      {abilities.map(({ name, score }) => (
        <div key={name} className="ability-score" style={{
          textAlign: 'center',
          padding: '0.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '0.8rem', 
            color: '#6c757d',
            marginBottom: '0.25rem'
          }}>
            {name}
          </div>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            marginBottom: '0.125rem'
          }}>
            {score}
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#6c757d'
          }}>
            ({getModifier(score!)})
          </div>
        </div>
      ))}
    </div>
  );
}