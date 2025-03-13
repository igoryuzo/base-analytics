# Project: Base Analytics Farcaster Frame

## Project Info
- Farcaster Frame using Dune Analytics API
- Next.js with TypeScript
- Deployed on Vercel

## Setup Commands
```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Build for production
yarn build

# TypeCheck
yarn typecheck

# Lint code
yarn lint

# Run tests
yarn test
```

## Project Structure
- `/pages/api` - API routes for the Frame
- `/pages` - Next.js pages
- `/components` - React components
- `/lib` - Utility functions and API clients
- `/public` - Static assets

## Development Notes
- Frame metadata is served from API routes
- API keys should be stored in Vercel environment variables
- Follow TypeScript strict mode