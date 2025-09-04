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
    <div className="damage-resistance-block" style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #dee2e6'
    }}>
      {vulnerable && vulnerable.length > 0 && (
        <div className="detail-row" style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#dc3545' }}>Damage Vulnerabilities:</strong> {formatList(vulnerable)}
        </div>
      )}
      
      {resist && resist.length > 0 && (
        <div className="detail-row" style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#28a745' }}>Damage Resistances:</strong> {formatList(resist)}
        </div>
      )}
      
      {immune && immune.length > 0 && (
        <div className="detail-row" style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#007bff' }}>Damage Immunities:</strong> {formatList(immune)}
        </div>
      )}
      
      {conditionImmune && conditionImmune.length > 0 && (
        <div className="detail-row">
          <strong style={{ color: '#6f42c1' }}>Condition Immunities:</strong> {formatList(conditionImmune)}
        </div>
      )}
    </div>
  );
}