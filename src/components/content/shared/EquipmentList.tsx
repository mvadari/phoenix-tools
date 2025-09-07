import { processContentLinks } from '../../../utils/contentLinks';

interface EquipmentListProps {
  equipment?: any[];
  title?: string;
}

export default function EquipmentList({ equipment, title = "Starting Equipment" }: EquipmentListProps) {
  if (!equipment?.length) return null;

  const formatEquipmentItem = (item: any): React.ReactNode => {
    let text = '';
    
    if (typeof item === 'string') {
      text = item;
    } else if (item.item) {
      text = item.displayName || item.item;
      if (item.quantity && item.quantity > 1) {
        text = `${item.quantity} × ${text}`;
      }
    } else if (item.special) {
      text = item.special;
      if (item.quantity && item.quantity > 1) {
        text = `${item.quantity} × ${text}`;
      }
    } else {
      text = JSON.stringify(item);
    }
    
    return processContentLinks(text);
  };

  const renderEquipmentGroup = (equipGroup: any, groupIndex: number) => {
    if (Array.isArray(equipGroup)) {
      return equipGroup.map((item, itemIndex) => (
        <div key={`${groupIndex}-${itemIndex}`} className="equipment-item">
          • {formatEquipmentItem(item)}
        </div>
      ));
    }
    
    if (equipGroup._) {
      return equipGroup._.map((item: any, itemIndex: number) => (
        <div key={`${groupIndex}-${itemIndex}`} className="equipment-item">
          • {formatEquipmentItem(item)}
        </div>
      ));
    }
    
    if (equipGroup.a) {
      return (
        <div key={groupIndex} className="equipment-choice-group">
          <strong>Choose one of:</strong>
          <div className="choice-options">
            {equipGroup.a.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="choice-item">
                • {formatEquipmentItem(item)}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (equipGroup.b) {
      return (
        <div key={groupIndex} className="equipment-choice-group">
          <strong>Or choose:</strong>
          <div className="choice-options">
            {equipGroup.b.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="choice-item">
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
    <div className="equipment-list">
      <h4>
        {title}
      </h4>
      
      <div className="equipment-content">
        {equipment.map((equipGroup, groupIndex) => renderEquipmentGroup(equipGroup, groupIndex))}
      </div>
    </div>
  );
}