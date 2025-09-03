# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a D&D 5e tools website project built with Vite, TypeScript, and React. The project appears to be in early development with minimal source files currently present.

## Development Commands

- **Start dev server**: `npm run dev` (runs on port 3000, opens /index.html)
- **Build project**: `npm run build` (runs TypeScript compilation then Vite build)
- **Preview build**: `npm run preview`

## Architecture

### Build System
- **Vite** with TypeScript and React support
- Multi-page application setup that dynamically discovers HTML files in root
- Complex build configuration that expects multiple JavaScript entry points in `src/js/` directory
- Modular library imports for jQuery, LocalForage, and ElasticLunr

### Expected Structure
The Vite config references a comprehensive file structure that doesn't yet exist:
- `src/js/` - Core JavaScript modules (init, utils, navigation, parser, filter, etc.)
- `src/lib/` - Third-party library wrappers
- HTML files in root directory for multi-page setup
- CSS output to `css/` directory
- Assets organized by type (images to `assets/images/`, etc.)

### Technology Stack
- **Frontend**: React 19.1.1, TypeScript 5.8.3
- **Search**: ElasticLunr for client-side search functionality  
- **Storage**: LocalForage for offline data persistence
- **Legacy**: jQuery support maintained for compatibility

### Development Notes
- Uses ES2022 target with strict TypeScript configuration
- React JSX configured for modern React transform
- Path aliases: `@` maps to `src/`, `js` maps to `src/js/`
- Jest configured for testing (minimal setup)