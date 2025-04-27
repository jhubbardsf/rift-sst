# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build/Run: `bun run --watch index.ts`
- Deploy (dev): `bun run deploy:development`
- Deploy (prod): `bun run deploy:production`
- Install: `bun install`
- TypeCheck: `bun tsc --noEmit`

## Code Style Guidelines
- **TypeScript**: Use strict typing with proper type annotations for all functions
- **Imports**: Group imports by type (core/external/internal)
- **Error Handling**: Use try/catch blocks with typed errors (`err: any`)
- **Environment**: Use environment variables for stage-specific configuration
- **Formatting**: Use single quotes for strings, 4-space indentation
- **ES Modules**: This project uses ESM format (`type: "module"`)
- **Async/Await**: Prefer async/await over Promise chains
- **Response Format**: Use consistent API response structures with proper status codes
- **Caching**: Implement proper caching strategies where appropriate
- **Comments**: Add comments for non-obvious logic and complex functions