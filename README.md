# Rift Research AWS Infrastructure

This repository contains the AWS infrastructure for Rift Research, managed using the [SST](https://sst.dev/) framework.

[![Built with SST](https://img.shields.io/badge/built%20with-sst-brightgreen)](https://sst.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/powered%20by-Bun-yellow)](https://bun.sh)

## 🚀 Current Resources

### Token Colors Lambda Function

A serverless function that extracts color palettes from token images. The function:

-   Accepts image URLs via query parameter
-   Uses node-vibrant to extract dominant colors
-   Supports various image formats (including WebP, AVIF, and SVG)
-   Returns color palette information optimized for UI display
-   Implements caching for performance

## 🛠️ Getting Started

### Prerequisites

-   [Bun](https://bun.sh/) for development
-   AWS account with credentials configured
-   Node.js 16+ (for SST)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/rift-sst.git
cd rift-sst

# Install dependencies
bun install
```

## 🧪 Development

SST provides a local development environment that connects to your AWS account:

```bash
# Start local development
bun run dev
```

This creates a development environment connected to AWS with hot reloading for your functions.

## 📦 Deployment

### Staging/Development Environment

```bash
bun run deploy:development
```

### Production Environment

```bash
bun run deploy:production
```

## 🔧 Configuration

The infrastructure is defined in `sst.config.ts`, which includes:

-   Stage-based configuration (development/production)
-   CORS settings for different environments
-   Resource retention policies

## 📚 Resources for New Developers

-   [SST Documentation](https://docs.sst.dev/)
-   [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
-   [TypeScript Documentation](https://www.typescriptlang.org/docs/)
-   [Bun Documentation](https://bun.sh/docs)

## 📝 Contributing

1. Set up the development environment
2. Create a new branch for your feature
3. Make changes and test locally
4. Deploy to development for testing
5. Submit a pull request
