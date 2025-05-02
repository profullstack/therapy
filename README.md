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

## Event Handling in Node.js

This package includes examples of how to use event handling in Node.js modules. These examples demonstrate different patterns for implementing event-driven architecture in your applications.

### Basic Event Handling

The `lib/event-examples.js` module provides several examples of event handling patterns:

```javascript
import { createBasicEmitter } from '@profullstack/therapy';

// Create a basic event emitter
const { emitter, stop } = createBasicEmitter();

// Listen for events
emitter.on('tick', (date) => {
  console.log(`Tick at ${date}`);
});

// Stop the emitter after 5 seconds
setTimeout(stop, 5000);
```

### Class-based Event Emitters

You can extend the EventEmitter class to create custom event-emitting classes:

```javascript
import { TherapyEventEmitter } from '@profullstack/therapy';

const therapySession = new TherapyEventEmitter();

// Set up event listeners
therapySession.on('sessionStart', (data) => {
  console.log(`Session started at ${data.time}`);
});

therapySession.on('userInput', (data) => {
  console.log(`Received user input: ${data.text}`);
});

// Start the session
therapySession.startSession();

// Send user input
therapySession.receiveUserInput("I've been feeling stressed lately");
```

### Factory Functions with Event Emitters

For more complex scenarios, you can use factory functions that return objects with event emitters:

```javascript
import { createTherapyEventManager } from '@profullstack/therapy';

const therapyManager = createTherapyEventManager();
const { events, EVENT_TYPES } = therapyManager;

// Set up event listeners using constants
events.on(EVENT_TYPES.SESSION_START, (data) => {
  console.log(`New session started: ${data.sessionId}`);
});

// Start a session
therapyManager.startSession();

// Process messages
therapyManager.processMessage("Hello, I need some help");
```

### Event-Driven Therapy Sessions

The `examples/therapy-events.js` module demonstrates how to refactor the therapy application to use event-driven architecture:

```javascript
import { EventDrivenTherapy } from '@profullstack/therapy';

// Create a therapy session
const therapy = new EventDrivenTherapy({
  mode: 'cbt',
  provider: 'openai',
  verbose: true
});

// Add custom event listeners
therapy.on('user:input', (data) => {
  if (data.text.toLowerCase().includes('anxious')) {
    console.log('User mentioned anxiety');
  }
});

// Start the therapy session
therapy.start();
```

### Running the Examples

To run the included examples:

```bash
# Run the basic event demo
node examples/event-demo.js

# Run the event-driven therapy example
node examples/therapy-events.js
```

## Disclaimer

This tool is not a replacement for professional mental health care. It uses AI to simulate therapeutic conversations but should not be used in place of licensed therapy, especially in crisis situations.

## License

MIT

## Resources

- [Therapy Transformer: Enhancing Mental Health Support with Large Language Models](https://arxiv.org/html/2504.12337v1)