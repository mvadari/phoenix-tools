interface ContentEntriesProps {
  entries: any[];
}

export default function ContentEntries({ entries }: ContentEntriesProps) {
  if (!entries || !Array.isArray(entries)) return null;

  return (
    <div className="content-entries">
      {entries.map((entry: any, index: number) => (
        <div key={index} className="content-entry">
          {typeof entry === 'string' ? (
            <p>{entry}</p>
          ) : (
            <div>
              {entry.name && <h4>{entry.name}</h4>}
              {entry.entries && Array.isArray(entry.entries) && (
                <div>
                  {entry.entries.map((subEntry: string, subIndex: number) => (
                    <p key={subIndex}>{subEntry}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}