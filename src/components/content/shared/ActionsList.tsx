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
}: ActionsListProps) {
  const hasActions = actions?.length || reactions?.length || legendary?.length || lair?.length || mythic?.length;
  
  if (!hasActions) return null;

  const renderActionGroup = (actionList: any[], groupTitle: string, groupType: string) => {
    if (!actionList?.length) return null;

    return (
      <div className="action-group" data-action-group={groupType}>
        <h4>
          {groupTitle}
        </h4>
        {actionList.map((action, index) => (
          <div key={index} className="action-item">
            {action.name && (
              <h5>
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
    <div className="actions-list">
      {actions && renderActionGroup(actions, "Actions", 'actions')}
      {reactions && renderActionGroup(reactions, "Reactions", 'reactions')}
      {legendary && renderActionGroup(legendary, "Legendary Actions", 'legendary')}
      {lair && renderActionGroup(lair, "Lair Actions", 'lair')}
      {mythic && renderActionGroup(mythic, "Mythic Actions", 'mythic')}
    </div>
  );
}