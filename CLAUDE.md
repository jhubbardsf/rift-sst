# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Install dependencies: `bun install`
- Development server: `bun run dev` or `bun run --watch index.ts`
- Run application: `bun run index.ts`
- Lint: Currently no linting command configured
- Test: Currently no testing command configured

## Code Style Guidelines
- **TypeScript**: Use strict typing. TypeScript is configured with strict mode on.
- **Module System**: ESM modules (`type: "module"` in package.json).
- **Formatting**: Use 2-space indentation as shown in existing code.
- **Imports**: Use ES modules import syntax.
- **Error Handling**: Use async/await for asynchronous code with proper error handling.
- **Naming**: Use camelCase for variables and functions, PascalCase for classes and components.
- **SST Config**: Follow AWS resource naming patterns shown in sst.config.ts.
- **Components**: This project uses Bun as a runtime with SST for AWS infrastructure.

## Runtime Environment
- Bun v1.2.3+ is used as the JavaScript runtime.
- AWS services are leveraged through SST.