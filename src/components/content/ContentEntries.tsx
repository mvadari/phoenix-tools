import { processEntry } from '../../utils/contentLinks';

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
            <p>{processEntry(entry)}</p>
          ) : (
            <div>
              {entry.name && <h4>{processEntry(entry.name)}</h4>}
              {entry.entries && Array.isArray(entry.entries) && (
                <div>
                  {entry.entries.map((subEntry: any, subIndex: number) => (
                    <div key={subIndex}>
                      {typeof subEntry === 'string' ? (
                        <p>{processEntry(subEntry)}</p>
                      ) : (
                        <div>{processEntry(subEntry)}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Handle other entry types */}
              {entry.type && processEntry(entry)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}