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
- Single-page React application with `/phoenix-tools` base path
- Modern ES modules with TypeScript strict configuration

### Current Structure
The project has an established React component architecture:
- `src/main.tsx` - React application entry point
- `src/App.tsx` - Main application component
- `src/components/` - React components organized by function:
  - `basic/` - Basic UI components (DetailRow, ProcessedDetailRow)
  - `content/` - D&D content display components (ClassDisplay, SpellDisplay, MonsterDisplay, etc.)
  - Search and filtering components (SearchInput, SearchResults, CategoryFilter)
- `src/index.css` - Global styles
- `index.html` - Single HTML entry point with React root

### Technology Stack
- **Frontend**: React 19.1.1, TypeScript 5.8.3
- **Build**: Vite 7.1.3 with React plugin
- **Search**: ElasticLunr 0.9.5 and Lunr 2.3.9 for client-side search
- **Storage**: LocalForage 1.10.0 for offline data persistence  
- **Legacy**: jQuery 3.7.1 maintained for compatibility
- **Linting**: ESLint 9.34.0 with TypeScript and React plugins

### Development Notes
- Uses ES2022 target with strict TypeScript configuration
- React JSX configured for modern React transform (`react-jsx`)
- Strict linting with unused locals/parameters checking
- Jest configured for testing (minimal setup)
- Project deployed with `/phoenix-tools` base path