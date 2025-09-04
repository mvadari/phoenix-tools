import type { SearchResult } from '../../types';
import BaseContentDisplay from './BaseContentDisplay';

interface FeatDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

interface TableEntry {
    type: 'table';
    caption?: string;
    colLabels: string[];
    colStyles?: string[];
    rows: (string | number)[][];
}

interface EntriesEntry {
    type: 'entries';
    name?: string;
    entries: (string | EntriesEntry)[];
}

function EntriesDisplay({ entry }: { entry: EntriesEntry }) {
    return (
        <div className="entries-section my-2">
            {entry.name && <div className="entries-title fw-bold mb-1">{entry.name}</div>}
            {entry.entries.map((subEntry, idx) =>
                typeof subEntry === 'string' ? (
                    <p key={idx}>{subEntry}</p>
                ) : subEntry.type === 'entries' ? (
                    <EntriesDisplay key={idx} entry={subEntry} />
                ) : null
            )}
        </div>
    );
}

function TableDisplay({ entry }: { entry: TableEntry }) {
    return (
        <div className="table-responsive my-3">
            {entry.caption && <div className="table-caption mb-1">{entry.caption}</div>}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {entry.colLabels.map((label, i) => (
                            <th key={i} className={entry.colStyles?.[i]}>{label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entry.rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j} className={entry.colStyles?.[j]}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function FeatDisplay({ result, content, onClose }: FeatDisplayProps) {
  return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        {content.entries && content.entries.map((entry: any, index: number) => {
            if (typeof entry === 'string') {
              return <p key={index}>{entry}</p>;
            }
            if (entry.type == 'list' && Array.isArray(entry.items)) {
              return (
                <ul key={index} className="feat-list">
                  {entry.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (entry.type === 'table') {
                return <TableDisplay key={index} entry={entry as TableEntry} />;
              }
              if (entry.type === 'section') {
                return <EntriesDisplay key={index} entry={entry as EntriesEntry} />;
              }
            }
          )}
      </div>
    </BaseContentDisplay>
  );
}