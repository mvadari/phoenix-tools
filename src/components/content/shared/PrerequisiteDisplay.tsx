interface PrerequisiteDisplayProps {
  prerequisite?: any[];
  label?: string;
}

export default function PrerequisiteDisplay({ prerequisite, label = "Prerequisites" }: PrerequisiteDisplayProps) {
  if (!prerequisite?.length) return null;

  const formatPrerequisite = (prereq: any): string => {
    if (typeof prereq === 'string') return prereq;
    
    const parts: string[] = [];
    
    // Ability score requirements
    if (prereq.str) parts.push(`Str ${prereq.str}`);
    if (prereq.dex) parts.push(`Dex ${prereq.dex}`);
    if (prereq.con) parts.push(`Con ${prereq.con}`);
    if (prereq.int) parts.push(`Int ${prereq.int}`);
    if (prereq.wis) parts.push(`Wis ${prereq.wis}`);
    if (prereq.cha) parts.push(`Cha ${prereq.cha}`);
    
    // Level requirements
    if (prereq.level) {
      parts.push(`${prereq.level}${prereq.level === 1 ? 'st' : prereq.level === 2 ? 'nd' : prereq.level === 3 ? 'rd' : 'th'} level`);
    }
    
    // Class requirements
    if (prereq.class) {
      const className = typeof prereq.class === 'string' ? prereq.class : prereq.class.name;
      parts.push(`${className} class`);
    }
    
    // Spellcasting requirements
    if (prereq.spellcasting) {
      parts.push('The ability to cast at least one spell');
    }
    
    // Feature requirements
    if (prereq.feature) {
      parts.push(`${prereq.feature} feature`);
    }
    
    // Other requirements
    if (prereq.other) {
      parts.push(prereq.other);
    }
    
    // Race requirements
    if (prereq.race) {
      const raceName = typeof prereq.race === 'string' ? prereq.race : prereq.race.name;
      parts.push(`${raceName} race`);
    }
    
    // Proficiency requirements
    if (prereq.proficiency) {
      parts.push(`Proficiency with ${prereq.proficiency}`);
    }
    
    return parts.length > 0 ? parts.join(', ') : JSON.stringify(prereq);
  };

  const allPrereqs = prerequisite.map(formatPrerequisite);

  return (
    <div className="prerequisite-display" style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#fff3cd',
      borderRadius: '6px',
      border: '1px solid #ffeaa7'
    }}>
      <div className="detail-row">
        <strong style={{ color: '#856404' }}>{label}:</strong>{' '}
        <span style={{ color: '#856404' }}>
          {allPrereqs.join(' or ')}
        </span>
      </div>
    </div>
  );
}