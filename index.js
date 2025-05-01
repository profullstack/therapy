// Main entry point for the @profullstack/therapy package

// Re-export the main therapy functionality
export { createTherapySession } from './lib/therapy.js';

// Re-export the event handling examples
export {
  createBasicEmitter,
  TherapyEventEmitter,
  createTherapyEventManager,
  createOneTimeEmitter
} from './lib/event-examples.js';

// Re-export the EventDrivenTherapy class
export { EventDrivenTherapy } from './examples/therapy-events.js';

// Re-export AI provider functionality
export { callAI } from './lib/ai-providers.js';

// Re-export prompt functionality
export { getPromptForMode } from './lib/prompts.js';