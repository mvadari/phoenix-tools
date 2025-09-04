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

/**
 * Creates a search result for known content
 */
function createKnownContentResult(name: string, category: DataCategory): SearchResult {
  return {
    name,
    source: 'PHB', // Default to Player's Handbook
    category,
    score: 1,
    matches: []
  };
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
  const matches: Array<{ match: string, category: DataCategory, start: number, end: number }> = [];

  // Find all potential matches
  Object.entries(KNOWN_CONTENT).forEach(([category, items]) => {
    items.forEach(item => {
      const regex = new RegExp(`\\b${item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          category: category as DataCategory,
          start: match.index,
          end: match.index + match[0].length
        });
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

    // Create the link
    const searchResult = createKnownContentResult(match.match, match.category);
    const path = createContentPath(searchResult);
    
    processedText.push(
      <Link
        key={`link-${index}`}
        to={path}
        style={{
          color: '#007bff',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted'
        }}
        title={`Go to ${match.category}: ${match.match}`}
      >
        {match.match}
      </Link>
    );

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

    // Handle table entries
    if (entry.type === 'table' && entry.colLabels && entry.rows) {
      return (
        <table style={{ marginTop: '1rem', marginBottom: '1rem', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {entry.colLabels.map((label: string, index: number) => (
                <th key={index} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>
                  {processContentLinks(label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entry.rows.map((row: any[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
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

  // If we can't process it, return as string or null for React safety
  return typeof entry === 'string' ? entry : JSON.stringify(entry);
}