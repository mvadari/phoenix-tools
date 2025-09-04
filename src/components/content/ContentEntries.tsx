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
          {processEntry(entry)}
        </div>
      ))}
    </div>
  );
}