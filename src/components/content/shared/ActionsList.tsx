import ContentEntries from '../ContentEntries';

interface ActionsListProps {
  actions?: any[];
  reactions?: any[];
  legendary?: any[];
  lair?: any[];
  mythic?: any[];
  title?: string;
}

export default function ActionsList({ 
  actions, 
  reactions, 
  legendary, 
  lair, 
  mythic, 
  title = "Actions" 
}: ActionsListProps) {
  const hasActions = actions?.length || reactions?.length || legendary?.length || lair?.length || mythic?.length;
  
  if (!hasActions) return null;

  const renderActionGroup = (actionList: any[], groupTitle: string, titleColor: string = '#495057') => {
    if (!actionList?.length) return null;

    return (
      <div className="action-group" style={{ marginTop: '1.5rem' }}>
        <h4 style={{ 
          color: titleColor, 
          marginBottom: '1rem',
          borderBottom: '2px solid #dee2e6',
          paddingBottom: '0.5rem'
        }}>
          {groupTitle}
        </h4>
        {actionList.map((action, index) => (
          <div key={index} className="action-item" style={{ 
            marginBottom: '1rem',
            paddingLeft: '1rem',
            borderLeft: '3px solid #dee2e6'
          }}>
            {action.name && (
              <h5 style={{ 
                margin: '0 0 0.5rem 0',
                fontWeight: 'bold',
                color: '#495057'
              }}>
                {action.name}
              </h5>
            )}
            {action.entries && <ContentEntries entries={action.entries} />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="actions-list" style={{ marginTop: '1.5rem' }}>
      {actions && renderActionGroup(actions, "Actions", '#28a745')}
      {reactions && renderActionGroup(reactions, "Reactions", '#ffc107')}
      {legendary && renderActionGroup(legendary, "Legendary Actions", '#dc3545')}
      {lair && renderActionGroup(lair, "Lair Actions", '#6f42c1')}
      {mythic && renderActionGroup(mythic, "Mythic Actions", '#fd7e14')}
    </div>
  );
}