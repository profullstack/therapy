# Therapy CLI

A command-line interface for interactive AI therapy sessions in your terminal.

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

### Install from source

```bash
# Clone the repository
git clone https://github.com/yourusername/therapy-cli.git
cd therapy-cli

# Install dependencies
npm install

# Link the CLI globally
npm link
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