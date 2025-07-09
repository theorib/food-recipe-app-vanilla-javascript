# Agent Instructions for Forkify App

## Commands
- **Build**: `pnpm build` - Build for production
- **Dev**: `pnpm dev` - Start development server
- **Preview**: `pnpm preview` - Preview production build
- **Install**: `pnpm install` - Install dependencies (enforced via preinstall hook)

## Architecture
- **Framework**: Vanilla JS with Vite bundler
- **Pattern**: MVC (Model-View-Controller) with Publisher-Subscriber
- **State Management**: Custom state management in `model.js`
- **Views**: Class-based views extending base `view.js`, located in `src/js/views/`
- **DOM**: Custom DOM updating using DocumentFragment API
- **HTTP**: Custom HTTP library with Fetch API and Promises
- **Storage**: LocalStorage for bookmarks

## Code Style
- **Format**: Prettier with single quotes, avoid arrow parens
- **Lint**: ESLint with recommended rules
- **Imports**: ES6 modules, absolute imports from `src/js/`
- **Config**: Constants in `config.js`
- **Naming**: camelCase, controller functions prefixed with `control`
- **Error Handling**: Try-catch blocks with view error rendering
