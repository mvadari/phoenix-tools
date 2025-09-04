import { Link } from 'react-router-dom';

interface EquipmentListProps {
  equipment?: any[];
  title?: string;
}

export default function EquipmentList({ equipment, title = "Starting Equipment" }: EquipmentListProps) {
  if (!equipment?.length) return null;

  const formatEquipmentItem = (item: any): string => {
    if (typeof item === 'string') {
      return item;
    }
    
    if (item.item) {
      let result = item.displayName || item.item;
      if (item.quantity && item.quantity > 1) {
        result = `${item.quantity} × ${result}`;
      }
      return result;
    }
    
    if (item.special) {
      let result = item.special;
      if (item.quantity && item.quantity > 1) {
        result = `${item.quantity} × ${result}`;
      }
      return result;
    }
    
    return JSON.stringify(item);
  };

  const renderEquipmentGroup = (equipGroup: any, groupIndex: number) => {
    if (Array.isArray(equipGroup)) {
      return equipGroup.map((item, itemIndex) => (
        <div key={`${groupIndex}-${itemIndex}`} style={{ marginBottom: '0.25rem' }}>
          • {formatEquipmentItem(item)}
        </div>
      ));
    }
    
    if (equipGroup._) {
      return equipGroup._.map((item: any, itemIndex: number) => (
        <div key={`${groupIndex}-${itemIndex}`} style={{ marginBottom: '0.25rem' }}>
          • {formatEquipmentItem(item)}
        </div>
      ));
    }
    
    if (equipGroup.a) {
      return (
        <div key={groupIndex} style={{ marginBottom: '0.5rem' }}>
          <strong>Choose one of:</strong>
          <div style={{ marginLeft: '1rem' }}>
            {equipGroup.a.map((item: any, itemIndex: number) => (
              <div key={itemIndex} style={{ marginBottom: '0.25rem' }}>
                • {formatEquipmentItem(item)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (equipGroup.b) {
      return (
        <div key={groupIndex} style={{ marginBottom: '0.5rem' }}>
          <strong>Or choose:</strong>
          <div style={{ marginLeft: '1rem' }}>
            {equipGroup.b.map((item: any, itemIndex: number) => (
              <div key={itemIndex} style={{ marginBottom: '0.25rem' }}>
                • {formatEquipmentItem(item)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div key={groupIndex}>
        • {formatEquipmentItem(equipGroup)}
      </div>
    );
  };

  return (
    <div className="equipment-list" style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #dee2e6'
    }}>
      <h4 style={{ 
        color: '#495057', 
        marginBottom: '1rem',
        borderBottom: '2px solid #dee2e6',
        paddingBottom: '0.5rem'
      }}>
        {title}
      </h4>
      
      <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {equipment.map((equipGroup, groupIndex) => renderEquipmentGroup(equipGroup, groupIndex))}
      </div>
    </div>
  );
}