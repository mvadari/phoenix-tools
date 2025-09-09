import type { ReactNode } from 'react';

interface SpellcastingTableProps {
  classTableGroups: Array<{
    colLabels: string[];
    rows: Array<Array<string | number>>;
  }>;
  className?: string;
}

export default function SpellcastingTable({ classTableGroups, className = '' }: SpellcastingTableProps) {
  if (!classTableGroups || classTableGroups.length === 0) return null;

  const formatCellContent = (cell: string | number): ReactNode => {
    if (typeof cell === 'number') return cell;
    
    // Clean up 5eTools filter syntax for display
    const cleanedCell = String(cell)
      .replace(/\{@filter ([^|]+)\|[^}]+\}/g, '$1')
      .replace(/\{@[^}]+\}/g, ''); // Remove other 5eTools markup
    
    return cleanedCell;
  };

  const formatHeader = (header: string): ReactNode => {
    return formatCellContent(header);
  };

  return (
    <div className={`spellcasting-table ${className}`}>
      {classTableGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="table-group">
          <table className="class-progression-table">
            <thead>
              <tr>
                <th>Level</th>
                {group.colLabels.map((label, index) => (
                  <th key={index}>{formatHeader(label)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="level-cell">{rowIndex + 1}</td>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="progression-cell">
                      {formatCellContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}