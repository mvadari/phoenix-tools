interface DamageResistanceBlockProps {
  resist?: string[];
  immune?: string[];
  vulnerable?: string[];
  conditionImmune?: string[];
}

export default function DamageResistanceBlock({ 
  resist, 
  immune, 
  vulnerable, 
  conditionImmune 
}: DamageResistanceBlockProps) {
  const hasResistances = resist?.length || immune?.length || vulnerable?.length || conditionImmune?.length;
  
  if (!hasResistances) return null;

  const formatList = (items: string[]): string => items.join(', ');

  return (
    <div className="damage-resistance-block">
      {vulnerable && vulnerable.length > 0 && (
        <div className="detail-row">
          <strong className="vulnerability-label">Damage Vulnerabilities:</strong> {formatList(vulnerable)}
        </div>
      )}
      
      {resist && resist.length > 0 && (
        <div className="detail-row">
          <strong className="resistance-label">Damage Resistances:</strong> {formatList(resist)}
        </div>
      )}
      
      {immune && immune.length > 0 && (
        <div className="detail-row">
          <strong className="immunity-label">Damage Immunities:</strong> {formatList(immune)}
        </div>
      )}
      
      {conditionImmune && conditionImmune.length > 0 && (
        <div className="detail-row">
          <strong className="condition-immunity-label">Condition Immunities:</strong> {formatList(conditionImmune)}
        </div>
      )}
    </div>
  );
}