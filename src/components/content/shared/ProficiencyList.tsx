interface ProficiencyListProps {
  skills?: string[] | { [skill: string]: string | boolean }[] | { [skill: string]: string | boolean } | { choose?: { from: string[], count: number } }[] | { proficiency: string; optional?: boolean }[];
  languages?: string[] | { [lang: string]: boolean }[] | { anyStandard?: number };
  tools?: string[];
  weapons?: string[];
  armor?: string[];
  saves?: { [save: string]: string };
  label?: string;
  inline?: boolean;
}

export default function ProficiencyList({ 
  skills, 
  languages, 
  tools,
  weapons,
  armor, 
  saves, 
  label,
  inline = false 
}: ProficiencyListProps) {
  const formatSkills = (): string[] => {
    if (!skills) return [];
    
    if (Array.isArray(skills)) {
      return skills.flatMap((skill: any) => {
        if (typeof skill === 'string') return [skill];
        
        // Handle choose structure
        if (skill.choose != null) {
          return [`Choose ${skill.choose.count} from: ${skill.choose.from.join(', ')}`];
        }
        
        // Handle {proficiency: string, optional?: boolean} structure
        if ('proficiency' in skill && typeof skill.proficiency === 'string') {
          const profName = skill.proficiency;
          return [skill.optional ? `${profName} (optional)` : profName];
        }
        
        // Handle any other object structure by extracting string values
        const entries = Object.entries(skill)
          .filter(([_, value]) => value)
          .map(([key, value]) => typeof value === 'string' ? `${key} ${value}` : key);
        
        return entries.length > 0 ? entries : [`Unknown skill: ${JSON.stringify(skill)}`];
      });
    }
    
    // Handle object format
    if (typeof skills === 'object') {
      return Object.entries(skills)
        .filter(([_, value]) => value)
        .map(([key, value]) => typeof value === 'string' ? `${key} ${value}` : key);
    }
    
    return [];
  };

  const formatLanguages = (): string[] => {
    if (!languages) return [];
    
    if (Array.isArray(languages)) {
      return languages.flatMap(lang => {
        if (typeof lang === 'string') return [lang];
        if ('anyStandard' in lang) return [`Any ${lang.anyStandard} standard languages`];
        return Object.keys(lang).filter(key => lang[key]);
      });
    }
    
    if (typeof languages === 'object' && 'anyStandard' in languages) {
      return [`Any ${languages.anyStandard} standard languages`];
    }
    
    return [];
  };

  const formatSaves = (): string[] => {
    if (!saves) return [];
    return Object.entries(saves).map(([save, bonus]) => `${save.toUpperCase()} ${bonus}`);
  };

  const allProficiencies = [
    ...formatSkills().map(skill => ({ type: 'skill', name: skill })),
    ...formatLanguages().map(lang => ({ type: 'language', name: lang })),
    ...(tools || []).map(tool => ({ type: 'tool', name: typeof tool === 'string' ? tool : JSON.stringify(tool) })),
    ...(weapons || []).map(weapon => ({ type: 'weapon', name: typeof weapon === 'string' ? weapon : JSON.stringify(weapon) })),
    ...(armor || []).map(armorType => ({ type: 'armor', name: typeof armorType === 'string' ? armorType : JSON.stringify(armorType) })),
    ...formatSaves().map(save => ({ type: 'save', name: save }))
  ];


  if (allProficiencies.length === 0) return null;

  const containerStyle = inline ? {
    display: 'inline'
  } : {
    marginTop: '0.5rem'
  };

  const itemStyle = inline ? {
    display: 'inline',
    marginRight: '0.5rem'
  } : {
    marginBottom: '0.25rem'
  };

  return (
    <div style={containerStyle}>
      {label && <strong>{label}:</strong>}
      {inline ? (
        <span style={{ marginLeft: label ? '0.5rem' : 0 }}>
          {allProficiencies.map((prof, index) => (
            <span key={index} style={itemStyle}>
              {typeof prof.name === 'string' ? prof.name : (
                typeof prof.name === 'object' && prof.name !== null ? 
                  JSON.stringify(prof.name) : 
                  String(prof.name)
              )}
              {index < allProficiencies.length - 1 && ', '}
            </span>
          ))}
        </span>
      ) : (
        <div style={{ marginLeft: '1rem' }}>
          {allProficiencies.map((prof, index) => (
            <div key={index} style={itemStyle}>
              {prof.type === 'skill' && (
                <span style={{ 
                  fontSize: '0.8rem',
                  color: '#6c757d',
                  marginRight: '0.5rem',
                  textTransform: 'uppercase'
                }}>
                  {prof.type}
                </span>
              )}
              {typeof prof.name === 'string' ? prof.name : (
                typeof prof.name === 'object' && prof.name !== null ? 
                  JSON.stringify(prof.name) : 
                  String(prof.name)
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}