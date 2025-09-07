interface StatBlockProps {
  ac?: (number | { ac: number; from?: string[] })[];
  hp?: { average: number; formula: string } | number;
  cr?: string | number;
  xp?: number;
  proficiencyBonus?: number;
}

export default function StatBlock({ ac, hp, cr, xp, proficiencyBonus }: StatBlockProps) {
  const formatAC = (): string => {
    if (!ac) return '';
    
    return ac.map(armor => {
      if (typeof armor === 'number') return armor.toString();
      return armor.from ? `${armor.ac} (${armor.from.join(', ')})` : armor.ac.toString();
    }).join(', ');
  };

  const formatHP = (): string => {
    if (!hp) return '';
    if (typeof hp === 'number') return hp.toString();
    return `${hp.average} (${hp.formula})`;
  };

  const formatCR = (): string => {
    if (!cr) return '';
    const crValue = cr.toString();
    const xpValue = xp ? ` (${xp.toLocaleString()} XP)` : '';
    return `${crValue}${xpValue}`;
  };

  const getProficiencyBonus = (): number => {
    if (proficiencyBonus) return proficiencyBonus;
    if (!cr) return 2;
    
    const crNum = typeof cr === 'string' ? parseFloat(cr) || 0 : cr;
    if (crNum >= 17) return 6;
    if (crNum >= 13) return 5;
    if (crNum >= 9) return 4;
    if (crNum >= 5) return 3;
    return 2;
  };

  const hasStats = ac || hp || cr;
  if (!hasStats) return null;

  return (
    <div className="stat-block">
      {ac && (
        <div className="stat-item">
          <div className="stat-label">
            ARMOR CLASS
          </div>
          <div className="stat-value">
            {formatAC()}
          </div>
        </div>
      )}
      
      {hp && (
        <div className="stat-item">
          <div className="stat-label">
            HIT POINTS
          </div>
          <div className="stat-value">
            {formatHP()}
          </div>
        </div>
      )}
      
      {cr && (
        <div className="stat-item">
          <div className="stat-label">
            CHALLENGE RATING
          </div>
          <div className="stat-value">
            {formatCR()}
          </div>
        </div>
      )}
      
      {(cr || proficiencyBonus) && (
        <div className="stat-item">
          <div className="stat-label">
            PROFICIENCY BONUS
          </div>
          <div className="stat-value">
            +{getProficiencyBonus()}
          </div>
        </div>
      )}
    </div>
  );
}