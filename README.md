# create-electron-vite

A CLI tool to quickly scaffold a new Electron + Vite + React + TypeScript application.

## Installation

Use `npx` to run the CLI directly from GitHub:

```bash
npx github:Snupai/electron-vite-template
```

## Usage

When you run the command, the CLI will:

1. Prompt you for a project name (default: `my-electron-app`)
2. Ask if you want to initialize a git repository (default: yes)
3. Create a new folder with the project name
4. Copy the Electron + Vite template
5. Install dependencies with `pnpm`
6. Optionally initialize git and create an initial commit

### Example

```bash
npx github:Snupai/electron-vite-template my-awesome-app
```

## What You Get

The template includes:

- ⚡ **Vite 6** - Fast build tool with HMR
- ⚛️ **React 18** - Modern React with TypeScript
- 🖥️ **Electron 38** - Cross-platform desktop apps
- 📦 **TypeScript** - Type-safe development
- 🔧 **esbuild** - Fast bundling for Electron processes
- 🎨 **Modern UI** - Clean starter template

## Project Structure

```
your-project/
├── src/              # React application
│   ├── main.tsx      # React entry point
│   ├── App.tsx       # Main app component
│   └── ...
├── main.ts           # Electron main process
├── preload.ts        # Electron preload script
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration
├── build.mjs         # Build orchestration
└── package.json      # Dependencies and scripts
```

## Available Scripts

Once your project is created:

- `pnpm dev` - Start Vite dev server with hot reload
- `pnpm build` - Build for production (TypeScript + Vite + Electron)
- `pnpm build:electron` - Build only Electron processes
- `pnpm start` - Build and launch Electron app

## Development Workflow

1. **UI Development**: Use `pnpm dev` for fast iteration with Hot Module Replacement
2. **Full App Testing**: Use `pnpm start` to test in the complete Electron environment
3. **Production Build**: Run `pnpm build` before creating releases

## Requirements

- Node.js 20+
- pnpm 10+

## Troubleshooting

### Electron fails to start after installation

If you see an error like "Electron failed to install correctly", pnpm may have blocked Electron's build scripts for security. Fix it by running:

```bash
pnpm approve-builds electron
```

Then reinstall Electron:

```bash
pnpm rebuild electron
```

Or simply reinstall all dependencies:

```bash
pnpm install
```

## License

MIT

## Author

Snupai
