# @profullstack/therapy

A command-line interface for interactive AI therapy sessions in your terminal.

[![GitHub](https://img.shields.io/github/license/profullstack/therapy)](https://github.com/profullstack/therapy/blob/master/LICENSE)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/profullstack/therapy)](https://github.com/profullstack/therapy/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/profullstack/therapy)](https://github.com/profullstack/therapy/commits/master)
[![npm version](https://img.shields.io/npm/v/@profullstack/therapy)](https://www.npmjs.com/package/@profullstack/therapy)
[![npm downloads](https://img.shields.io/npm/dm/@profullstack/therapy)](https://www.npmjs.com/package/@profullstack/therapy)

## Features

- 🧠 Multiple therapy modes (CBT, Person-centered, Trauma-informed)
- 🤖 Support for different AI providers (OpenAI, Ollama)
- 💬 Interactive terminal-based conversation
- 🎨 Beautiful, colorful terminal output
- 🔧 Configurable via command-line options or environment variables

## Installation

### Prerequisites

- Node.js 18+ installed
- For OpenAI: An OpenAI API key
- For Ollama: [Ollama](https://ollama.ai/) installed and running locally

### Install globally

```bash
# Install globally using pnpm
pnpm i -g @profullstack/therapy

# Or using npm
npm i -g @profullstack/therapy
```

### Install from source

```bash
# Clone the repository
git clone https://github.com/profullstack/therapy.git
cd therapy

# Install dependencies
pnpm install

# Link the CLI globally
pnpm link --global
```

## Configuration

Create a `.env` file in the project directory:

```
PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
```

Or use command-line options to override these settings.

## Usage

```bash
# Start a CBT therapy session with default provider
therapy

# Start a trauma-informed therapy session
therapy --mode trauma

# Start a person-centered therapy session with OpenAI
therapy -m person -p openai

# Use a specific model
therapy --provider openai --model gpt-4-turbo

# Show help
therapy --help
```

### Available Therapy Modes

- `cbt` - Cognitive Behavioral Therapy (default)
- `person` - Person-centered therapy
- `trauma` - Trauma-informed care

### Available Providers

- `ollama` - Uses locally running Ollama (default)
- `openai` - Uses OpenAI API (requires API key)

### Exit Commands

Type any of these to end your therapy session:
- `exit`
- `quit`
- `bye`

## Disclaimer

This tool is not a replacement for professional mental health care. It uses AI to simulate therapeutic conversations but should not be used in place of licensed therapy, especially in crisis situations.

## License

MIT