import React from 'react';
import { Link } from 'react-router-dom';
import { createContentPath } from './routing';
import type { DataCategory, SearchResult } from '../types';

// Known content references that we can safely link
const KNOWN_CONTENT = {
  spell: [
    'Fireball', 'Magic Missile', 'Cure Wounds', 'Healing Word', 'Shield', 'Counterspell',
    'Lightning Bolt', 'Misty Step', 'Spiritual Weapon', 'Guiding Bolt', 'Sacred Flame',
    'Eldritch Blast', 'Hex', 'Hunter\'s Mark', 'Bless', 'Command', 'Faerie Fire',
    'Sleep', 'Color Spray', 'Burning Hands', 'Thunderwave', 'Shatter', 'Scorching Ray',
    'Web', 'Hold Person', 'Suggestion', 'Invisibility', 'Detect Magic', 'Identify'
  ],
  condition: [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated',
    'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained',
    'Stunned', 'Unconscious'
  ],
  monster: [
    'Ancient Red Dragon', 'Beholder', 'Lich', 'Tarrasque', 'Mind Flayer', 'Goblin',
    'Orc', 'Troll', 'Giant', 'Owlbear', 'Displacer Beast', 'Bulezau', 'Dragon'
  ]
};


// Map JSON reference types to our categories
const REFERENCE_TYPE_MAP: Record<string, DataCategory> = {
  'item': 'item',
  'spell': 'spell', 
  'condition': 'condition',
  'skill': 'background', // Skills are typically found in backgrounds/classes
  'creature': 'monster',
  'monster': 'monster',
  'action': 'action',
  'variantrule': 'variant-rule',
  'subclassFeature': 'class',
  'classFeature': 'class',
  'status': 'condition',
  'feat': 'feat',
  'race': 'race',
  'background': 'background',
  'class': 'class',
  'deity': 'deity',
  'reward': 'reward',
  'table': 'table',
  'optionalfeature': 'optionalfeature',
  'vehicle': 'vehicle',
  'psionics': 'psionics'
};

/**
 * Parses a JSON reference like {@item Herbalism kit|PHB} into components
 */
function parseJsonReference(reference: string): { type: string, name: string, source: string } | null {
  // Handle complex references like {@subclassFeature Fast Hands|Rogue||Thief||3}
  const complexMatch = reference.match(/\{@(\w+)\s+([^|]+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^}]*)\}/);
  if (complexMatch) {
    const [, type, name, , , , source] = complexMatch;
    return { type, name: name.trim(), source: source?.trim() || 'PHB' };
  }

  // Handle book references like {@book Making an Attack|phb|9|making an attack}
  const bookMatch = reference.match(/\{@book\s+([^|]+)\|([^|]+)\|([^|]+)\|([^}]+)\}/);
  if (bookMatch) {
    const [, name, source] = bookMatch;
    return { type: 'book', name: name.trim(), source: source.toUpperCase() };
  }

  // Handle standard references like {@item Herbalism kit|PHB}
  const standardMatch = reference.match(/\{@(\w+)\s+([^|]+)(?:\|([^}]+))?\}/);
  if (standardMatch) {
    const [, type, name, source = 'PHB'] = standardMatch;
    return { type, name: name.trim(), source: source.trim() };
  }

  return null;
}

/**
 * Processes text content to add links to D&D references
 */
export function processContentLinks(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let processedText: React.ReactNode[] = [];
  let lastIndex = 0;
  const matches: Array<{ match: string, displayText: string, category: DataCategory | null, source: string, start: number, end: number }> = [];

  // First, find JSON-style references like {@item Something|PHB}
  const jsonRefRegex = /\{@\w+[^}]+\}/g;
  let jsonMatch;
  while ((jsonMatch = jsonRefRegex.exec(text)) !== null) {
    const parsed = parseJsonReference(jsonMatch[0]);
    if (parsed) {
      matches.push({
        match: jsonMatch[0],
        displayText: parsed.name,
        category: REFERENCE_TYPE_MAP[parsed.type] || null, // null for unsupported types
        source: parsed.source,
        start: jsonMatch.index,
        end: jsonMatch.index + jsonMatch[0].length
      });
    }
  }

  // Then, find natural language references for known content (but avoid overlaps)
  Object.entries(KNOWN_CONTENT).forEach(([category, items]) => {
    items.forEach(item => {
      const regex = new RegExp(`\\b${item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let regexMatch: RegExpExecArray | null;
      while ((regexMatch = regex.exec(text)) !== null) {
        // Check if this overlaps with any JSON reference
        const hasOverlap = matches.some(jsonRef => 
          regexMatch!.index < jsonRef.end && regexMatch!.index + regexMatch![0].length > jsonRef.start
        );
        
        if (!hasOverlap) {
          matches.push({
            match: regexMatch[0],
            displayText: regexMatch[0],
            category: category as DataCategory,
            source: 'PHB',
            start: regexMatch.index,
            end: regexMatch.index + regexMatch[0].length
          });
        }
      }
    });
  });

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep the first one)
  const nonOverlappingMatches = matches.filter((match, index) => {
    if (index === 0) return true;
    const prevMatch = matches[index - 1];
    return match.start >= prevMatch.end;
  });

  // Process the text with links
  nonOverlappingMatches.forEach((match, index) => {
    // Add text before the match
    if (match.start > lastIndex) {
      processedText.push(text.substring(lastIndex, match.start));
    }

    // Create the link or plain text based on whether we have a valid category
    if (match.category) {
      const searchResult: SearchResult = {
        name: match.displayText,
        source: match.source,
        category: match.category,
        score: 1,
        matches: []
      };
      const path = createContentPath(searchResult);
      
      processedText.push(
        <Link
          key={`link-${index}`}
          to={path}
          className="content-link"
          title={`Go to ${match.category}: ${match.displayText} (${match.source})`}
        >
          {match.displayText}
        </Link>
      );
    } else {
      // For unsupported reference types, render as plain text
      processedText.push(
        <span key={`text-${index}`} className="content-ref">
          {match.displayText}
        </span>
      );
    }

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    processedText.push(text.substring(lastIndex));
  }

  // If no matches found, return original text
  if (processedText.length === 0) {
    return text;
  }

  return <span>{processedText}</span>;
}

/**
 * Processes content entries recursively to add links
 */
export function processEntry(entry: any): React.ReactNode {
  if (typeof entry === 'string') {
    return processContentLinks(entry);
  }

  if (typeof entry === 'object' && entry !== null) {
    // Handle different entry types
    if (entry.type === 'list' && entry.items) {
      return (
        <ul>
          {entry.items.map((item: any, index: number) => (
            <li key={index}>{processEntry(item)}</li>
          ))}
        </ul>
      );
    }

    if (entry.type === 'entries' && entry.entries) {
      return (
        <div>
          {entry.name && <h4>{processContentLinks(entry.name)}</h4>}
          {entry.entries.map((subEntry: any, index: number) => (
            <div key={index}>{processEntry(subEntry)}</div>
          ))}
        </div>
      );
    }

    // Handle section entries (similar to entries but for larger sections)
    if (entry.type === 'section' && entry.entries) {
      return (
        <div>
          {entry.name && <h3>{processContentLinks(entry.name)}</h3>}
          {entry.entries.map((subEntry: any, index: number) => (
            <div key={index}>{processEntry(subEntry)}</div>
          ))}
        </div>
      );
    }

    // Handle inset entries (special highlighted boxes)
    if (entry.type === 'inset' && entry.entries) {
      return (
        <div className="content-inset">
          {entry.name && <h4>{processContentLinks(entry.name)}</h4>}
          {entry.entries.map((subEntry: any, index: number) => (
            <div key={index}>{processEntry(subEntry)}</div>
          ))}
        </div>
      );
    }

    // Handle quote entries
    if (entry.type === 'quote' && entry.entries) {
      return (
        <blockquote className="content-quote">
          {entry.entries.map((subEntry: any, index: number) => (
            <div key={index}>{processEntry(subEntry)}</div>
          ))}
          {entry.by && <cite>— {processContentLinks(entry.by)}</cite>}
        </blockquote>
      );
    }

    // Handle cell entries (table cells with roll data)
    if (entry.type === 'cell') {
      if (entry.roll) {
        // Handle dice roll cells
        if (entry.roll.min !== undefined && entry.roll.max !== undefined) {
          return `${entry.roll.min}-${entry.roll.max}`;
        }
        if (entry.roll.exact !== undefined) {
          return entry.roll.exact.toString();
        }
      }
      return entry.text || JSON.stringify(entry);
    }

    // Handle tableGroup entries
    if (entry.type === 'tableGroup' && entry.tables) {
      return (
        <div className="content-table-group">
          {entry.name && <h4>{processContentLinks(entry.name)}</h4>}
          {entry.tables.map((table: any, index: number) => (
            <div key={index}>{processEntry(table)}</div>
          ))}
        </div>
      );
    }

    // Handle table entries
    if (entry.type === 'table' && entry.colLabels && entry.rows) {
      return (
        <table className="content-table">
          <thead>
            <tr>
              {entry.colLabels.map((label: string, index: number) => (
                <th key={index}>
                  {processContentLinks(label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entry.rows.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex}>
                    {processEntry(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  // If we can't process it, try to extract useful information
  if (typeof entry === 'string') {
    return entry;
  }
  
  if (typeof entry === 'object' && entry !== null) {
    // Try to extract readable content from unknown types
    if (entry.entries && Array.isArray(entry.entries)) {
      return (
        <div className="content-unknown">
          {entry.name && <h5>{processContentLinks(entry.name)}</h5>}
          {entry.entries.map((subEntry: any, index: number) => (
            <div key={index}>{processEntry(subEntry)}</div>
          ))}
        </div>
      );
    }
    
    // If it has a text or content field, use that
    if (entry.text) {
      return processContentLinks(entry.text);
    }
    
    if (entry.content) {
      return processContentLinks(entry.content);
    }
    
    // As a last resort, return the JSON, but wrapped nicely
    return <pre className="content-debug">{JSON.stringify(entry, null, 2)}</pre>;
  }

  return null;
}