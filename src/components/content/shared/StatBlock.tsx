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
    <div className="stat-block" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #dee2e6',
      marginTop: '1rem'
    }}>
      {ac && (
        <div className="stat-item">
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '0.8rem', 
            color: '#6c757d',
            marginBottom: '0.25rem'
          }}>
            ARMOR CLASS
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {formatAC()}
          </div>
        </div>
      )}
      
      {hp && (
        <div className="stat-item">
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '0.8rem', 
            color: '#6c757d',
            marginBottom: '0.25rem'
          }}>
            HIT POINTS
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {formatHP()}
          </div>
        </div>
      )}
      
      {cr && (
        <div className="stat-item">
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '0.8rem', 
            color: '#6c757d',
            marginBottom: '0.25rem'
          }}>
            CHALLENGE RATING
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {formatCR()}
          </div>
        </div>
      )}
      
      {(cr || proficiencyBonus) && (
        <div className="stat-item">
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '0.8rem', 
            color: '#6c757d',
            marginBottom: '0.25rem'
          }}>
            PROFICIENCY BONUS
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            +{getProficiencyBonus()}
          </div>
        </div>
      )}
    </div>
  );
}