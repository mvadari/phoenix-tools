# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a D&D 5e tools website project called "Phoenix Tools" built with Vite, TypeScript, and React. The project is actively developed with a comprehensive React component structure for displaying D&D content.

## Development Commands

- **Start dev server**: `npm run dev` (runs Vite dev server)
- **Build project**: `npm run build` (runs TypeScript compilation then Vite build)
- **Preview build**: `npm run preview`

## Architecture

### Build System
- **Vite 7.1.3** with TypeScript and React support
- Single-page React application with `/` base path
- Modern ES modules with TypeScript strict configuration

### Current Structure
The project has an established React component architecture:
- `src/main.tsx` - React application entry point
- `src/App.tsx` - Main application component with React Router setup
- `src/components/` - React components organized by function:
  - `basic/` - Basic UI components (DetailRow, ProcessedDetailRow)
  - `content/` - Specialized D&D content display components:
    - `ActionDisplay.tsx` - D&D actions and bonus actions
    - `BackgroundDisplay.tsx` - Character backgrounds with proficiencies and traits
    - `BaseContentDisplay.tsx` - Common layout wrapper for all content pages
    - `ClassDisplay.tsx` - Character classes with progression, detailed class features, and subclass tabs
    - `ContentEntries.tsx` - Generic content entry renderer
    - `FeatDisplay.tsx` - Feats with prerequisites and abilities
    - `ItemDisplay.tsx` - Magic items and equipment with properties
    - `MonsterDisplay.tsx` - Creature stat blocks and abilities
    - `RaceDisplay.tsx` - Character races with traits and subraces
    - `SpellDisplay.tsx` - Spells with comprehensive casting information
    - `shared/` - 10 reusable components for common D&D data:
      - `SubclassTabs.tsx` - Tabbed interface for class subclasses with feature progression
      - Other components for AbilityScores, SpeedDisplay, ProficiencyList, etc.
  - Search and filtering components (SearchInput, SearchResults, CategoryFilter)
  - `ContentPage.tsx` - Individual content page wrapper with URL routing
  - `SearchPage.tsx` - Main search interface
- `src/utils/` - Utility functions:
  - `routing.ts` - URL slug generation and content path utilities
- `src/hooks/` - Custom React hooks for data loading and search
- `src/services/` - Data loading and content management services
- `src/index.css` - Global styles
- `index.html` - Single HTML entry point with React root

### Technology Stack
- **Frontend**: React 19.1.1, TypeScript 5.8.3
- **Routing**: React Router DOM 7.8.2 for client-side navigation
- **Build**: Vite 7.1.3 with React plugin
- **Search**: ElasticLunr 0.9.5 and Lunr 2.3.9 for client-side search
- **Storage**: LocalForage 1.10.0 for offline data persistence  
- **Legacy**: jQuery 3.7.1 maintained for compatibility
- **Linting**: ESLint 9.34.0 with TypeScript and React plugins

### Key Features
- **Content Linking System**: SEO-friendly URLs with pattern `/{category}/{source}/{slug}`
- **Comprehensive D&D Content Display**: Specialized components for all major D&D content types
- **Shared Component Architecture**: 9 reusable components for common D&D data patterns
- **Fallback Data Loading**: Robust content loading with multiple source fallback strategies
- **Cross-Content Linking**: Internal links between related D&D content (spells ↔ classes, etc.)
- **Responsive Design**: Clean, modern interface with consistent styling patterns
- **Collapsible Content System**: Toggle-based UI density controls with localStorage persistence
- **Subclass Integration**: Full subclass feature loading with rich descriptions and spell lists
- **Class Feature Details**: Complete class feature descriptions with level-based organization and rich D&D formatting

### Recent Feature Implementations

#### Class Feature Details System (2025)
- **Location**: `src/components/content/ClassDisplay.tsx` 
- **Purpose**: Complete class feature display with detailed descriptions
- **Features**:
  - Level-grouped class features with comprehensive descriptions
  - Rich D&D content rendering through `ContentEntries` component
  - Proper handling of subclass feature references
  - Dense layout optimized for information consumption
  - Enhanced content processing for D&D-specific data types
- **Data Integration**: 
  - Enhanced `dataService.ts` with `mergeClassFeaturesIntoClasses()` method
  - Automatic extraction of class features from JSON files
  - Feature matching by `className`, `classSource`, and `level` properties
- **Content Processing**: Enhanced `contentLinks.tsx` with:
  - Proper handling of `refClassFeature` and `refSubclassFeature` references
  - Support for dice, damage, ability, skill, and bonus content types
  - Improved fallback with collapsible JSON display for unknown types
- **Styling**: Flattened CSS structure in `class-display.scss` with semantic class organization

#### Subclass Tabs System (2025)
- **Location**: `src/components/content/shared/SubclassTabs.tsx`
- **Purpose**: Comprehensive subclass display with tabbed interface
- **Features**:
  - Alphabetically sorted subclass tabs
  - Rich feature descriptions loaded from JSON with level-based organization
  - Expanded spell lists with proper table formatting
  - Fallback display for basic feature names when detailed descriptions unavailable
  - Responsive design with mobile optimizations
- **Data Integration**: Enhanced `dataService.ts` with `mergeSubclassesIntoClasses()` method
- **Styling**: Density-optimized CSS in `class-display.scss` with reduced spacing for D&D enthusiasts

#### Collapsible Content Pattern
- **Location**: `src/components/content/BaseContentDisplay.tsx` (fluff content)
- **Purpose**: User-controlled content density with persistent preferences
- **Implementation**:
  - Toggle headers with rotating chevron icons
  - localStorage persistence using keys: `fluffContentVisible`
  - Smooth CSS animations and hover effects
  - Default to open for accessibility, collapsible for density
- **Styling**: Consistent toggle pattern in `content-display.scss` with transition animations

#### Data Service Enhancements
- **Enhanced Class Loading**: Automatic merging of both subclass and class features from multiple JSON files
- **Feature Details**: Loading of rich feature descriptions with level and header sorting for both subclasses and classes
- **Caching Strategy**: Robust localStorage caching with error handling and cache version management (`2.1.1`)
- **Data Structure**: Support for complex feature references with `subclassSource` and class feature properties
- **Class Feature Integration**: `mergeClassFeaturesIntoClasses()` method for enriching classes with detailed feature descriptions

### Development Notes
- Uses ES2022 target with strict TypeScript configuration
- React JSX configured for modern React transform (`react-jsx`)
- Strict linting with unused locals/parameters checking
- Jest configured for testing (minimal setup)
- Project deployed with `/` base path
- Component composition pattern with shared utility components for D&D-specific data display

### Development Patterns & Best Practices

#### UI State Management
- **localStorage Keys**: Use descriptive keys like `fluffContentVisible`, `classDescriptionVisible`
- **Default Values**: Consider user experience - accessibility vs density (fluff defaults to `true`, descriptions to `false`)
- **Error Handling**: Always wrap localStorage access in try-catch blocks
- **State Initialization**: Use useState initializer functions for localStorage-backed state

#### Styling Conventions
- **Density Focus**: Target audience is D&D enthusiasts who prefer information-dense layouts
- **Spacing Hierarchy**: Use `$spacing-sm` for dense content, `$spacing-lg` for readable sections
- **Toggle Components**: Consistent pattern with `.toggle-icon`, `transform: rotate()`, and hover effects
- **Animation**: Use `fadeIn` animation for expanding content, `transition: all 0.2s ease` for interactions

#### Data Loading Patterns
- **Class Features**: Use `mergeClassFeaturesIntoClasses()` method for enriching class data with detailed descriptions
- **Subclass Features**: Use `mergeSubclassesIntoClasses()` method for enriching class data with subclass information
- **Feature Sorting**: Sort by level first, then by header property for consistent display
- **Content Processing**: Use `ContentEntries` component for rendering rich D&D content with links
- **Content Type Handling**: Enhanced `processEntry()` function handles dice, abilities, skills, damage, and references
- **Fallback Content**: Always provide graceful degradation when detailed data unavailable, with collapsible JSON for debugging

#### Component Architecture
- **Shared Components**: Place reusable D&D-specific components in `src/components/content/shared/`
- **Conditional Rendering**: Use feature detection (`classContent.entries`) rather than hard-coded assumptions
- **Props Interface**: Define clear TypeScript interfaces for component props
- **CSS Classes**: Use semantic class names like `.feature-level-section`, `.subclass-tab-nav`, `.class-feature-item`

#### Content Processing Best Practices
- **D&D Content Types**: The `processEntry()` function in `contentLinks.tsx` handles specialized D&D content:
  - `refClassFeature`/`refSubclassFeature` - Feature references (displayed as feature names)
  - `dice` - Dice roll notation (styled with monospace font and colored background)
  - `damage` - Damage values (colored red)
  - `ability` - Ability score references (converted to full names, colored)
  - `skill` - Skill references (italicized)
  - `bonus` - Numeric bonuses (monospace, with + sign)
- **Fallback Strategy**: Unknown content types display in collapsible `<details>` elements with JSON fallback
- **CSS Styling**: Each content type has specific styling classes for consistent visual presentation