import type { SearchResult } from '../../types';
import DetailRow from '../basic/DetailRow';
import BaseContentDisplay from './BaseContentDisplay';

interface BackgroundDisplayProps {
  result: SearchResult;
  content: any;
  onClose: () => void;
}

function processSkillProficiencies(skillProficiencies: any) {
  const skills = [];
  for (const [skill, value] of Object.entries(skillProficiencies)) {
    if (value === true) {
      skills.push(skill);
    }
    if (skill === "choose" && typeof value === 'object' && value !== null) {
      const chooseValue = value as { count: number; from: string[] };
      skills.push(`Choose ${chooseValue.count} from ${chooseValue.from.join(', ')}`);
    }
  }
  return skills.join(', ');
}

function processToolProficiencies(skillProficiencies: any) {
  const skills = [];
  for (const [skill, value] of Object.entries(skillProficiencies)) {
    if (value === true) {
      skills.push(skill);
    }
    if (skill === "choose" && typeof value === 'object' && value !== null) {
      const chooseValue = value as { count: number; from: string[] };
      skills.push(`Choose ${chooseValue.count} from ${chooseValue.from.join(', ')}`);
    }
  }
  return skills.join(', ');
}

function processLanguageProficiencies(skillProficiencies: any) {
  const languages = [];
  for (const [key, value] of Object.entries(skillProficiencies)) {
    if (key === "any") {
      languages.push(`Any Language (${value})`);
    } else if (key === "anyStandard") {
      languages.push(`Any Standard Language (${value})`);
    } else {
      languages.push(`${key} (${value})`);
    }
  }
  return languages.join(', ');
}

export default function BackgroundDisplay({ result, content, onClose }: BackgroundDisplayProps) {
    console.log(content);
    console.log(result);
    return (
    <BaseContentDisplay result={result} content={content} onClose={onClose}>
      <div className="content-body">
        {content.entries && content.entries.map((entry: any, index: number) => (
          <DetailRow key={index} name={entry.name} value={entry.entry} />
        ))}
        {content.skillProficiencies && content.skillProficiencies.length > 0 && (
          <DetailRow name="Skill Proficiencies" value={processSkillProficiencies(content.skillProficiencies[0])} />
        )}
        {content.languageProficiencies && content.languageProficiencies.length > 0 && (
          <DetailRow name="Language Proficiencies" value={processLanguageProficiencies(content.languageProficiencies[0])} />
        )}
        {content.toolProficiencies && content.toolProficiencies.length > 0 && (
          <DetailRow name="Tool Proficiencies" value={processToolProficiencies(content.toolProficiencies[0])} />
        )}
      </div>
    </BaseContentDisplay>
  );
}
