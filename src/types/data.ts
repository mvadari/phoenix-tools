// Common interfaces
export interface Source {
  source: string;
  page?: number;
}

export interface TimeUnit {
  number: number;
  unit: string;
}

export interface Range {
  type: string;
  distance?: {
    type: string;
    amount: number;
  };
}

export interface Duration {
  type: string;
  duration?: TimeUnit;
}

export interface Components {
  v?: boolean;
  s?: boolean;
  m?: boolean | string;
}

// Spell interfaces
export interface Spell extends Source {
  name: string;
  level: number;
  school: string;
  time: TimeUnit[];
  range: Range;
  components: Components;
  duration: Duration[];
  entries: (string | object)[];
  srd?: boolean;
  basicRules?: boolean;
  reprintedAs?: string[];
  scalingLevelDice?: object;
  damageInflict?: string[];
  savingThrow?: string[];
  classes?: {
    fromClassList: ClassSpellList[];
  };
}

export interface ClassSpellList {
  name: string;
  source: string;
}

// Class interfaces
export interface ClassFeature {
  name: string;
  level: number;
  entries: (string | object)[];
  source: string;
}

export interface Class extends Source {
  name: string;
  hd: { number: number; faces: number };
  proficiency: string[];
  startingProficiencies?: object;
  startingEquipment?: object;
  multiclassing?: object;
  classTableGroups: object[];
  classFeatures: string[];
  subclassTitle?: string;
  subclasses?: Subclass[];
}

export interface Subclass extends Source {
  name: string;
  shortName: string;
  className: string;
  classSource: string;
  subclassFeatures: string[];
}

// Monster interfaces
export interface Monster extends Source {
  name: string;
  size: string[];
  type: string | { type: string; tags?: string[] };
  alignment: string[];
  ac: (number | { ac: number; from?: string[] })[];
  hp: { average: number; formula: string } | number;
  speed: { [key: string]: number | string };
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  cr: string | number;
  xp?: number;
  passive?: number;
  languages?: string[];
  senses?: string[];
  skill?: { [key: string]: string };
  save?: { [key: string]: string };
  resist?: string[];
  immune?: string[];
  vulnerable?: string[];
  conditionImmune?: string[];
  trait?: object[];
  action?: object[];
  reaction?: object[];
  legendary?: object[];
  spellcasting?: object[];
  srd?: boolean;
  basicRules?: boolean;
}

// Background interfaces
export interface Background extends Source {
  name: string;
  skillProficiencies?: object[];
  languageProficiencies?: object[];
  toolProficiencies?: object[];
  startingEquipment?: object[];
  entries?: (string | object)[];
  ideals?: object[];
  bonds?: object[];
  flaws?: object[];
  personality?: object[];
  srd?: boolean;
  basicRules?: boolean;
}

// Item interfaces
export interface Item extends Source {
  name: string;
  type?: string;
  typeAlt?: string;
  rarity?: string;
  weight?: number;
  value?: number;
  entries?: (string | object)[];
  reqAttune?: boolean | string;
  wondrous?: boolean;
  tier?: string;
  property?: string[];
  range?: string;
  dmg1?: string;
  dmg2?: string;
  dmgType?: string;
  weapon?: boolean;
  armor?: boolean;
  shield?: boolean;
  srd?: boolean;
  basicRules?: boolean;
}

// Feat interfaces  
export interface Feat extends Source {
  name: string;
  prerequisite?: object[];
  entries: (string | object)[];
  ability?: object[];
  skillProficiencies?: object[];
  languageProficiencies?: object[];
  toolProficiencies?: object[];
  srd?: boolean;
  basicRules?: boolean;
}

// Search-specific interfaces
export interface SearchIndexItem {
  name: string;
  source: string;
  category: DataCategory;
  page?: number;
  level?: number;
  cr?: string | number;
  type?: string;
  rarity?: string;
  school?: string;
}

export interface SearchResult extends SearchIndexItem {
  score: number;
  matches: string[];
  availableSources?: string[]; // Track all sources that contain this item
}

export type DataCategory = 
  | 'spell' 
  | 'class' 
  | 'monster'
  | 'background' 
  | 'item' 
  | 'feat' 
  | 'race'
  | 'action'
  | 'adventure'
  | 'deity'
  | 'condition'
  | 'reward'
  | 'variant-rule'
  | 'table'
  | 'optionalfeature'
  | 'vehicle'
  | 'psionics';

// Data file interfaces
export interface DataFile<T = any> {
  _meta?: {
    internalCopies?: string[];
  };
  [category: string]: T[] | any;
}

export interface IndexFile {
  [key: string]: string;
}

// API response interfaces
export interface DataService {
  loadIndex(category: DataCategory): Promise<SearchIndexItem[]>;
  loadFullData(category: DataCategory, source: string): Promise<any[]>;
  loadFluff(category: DataCategory, name: string, source: string): Promise<any | null>;
  search(query: string, category?: DataCategory): Promise<SearchResult[]>;
}