#!/usr/bin/env node

// Example of integrating event handling into the therapy application
import { EventEmitter } from 'events';
import readline from 'readline';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
// For local testing, use relative imports
import { getPromptForMode } from '../lib/prompts.js';
import { callAI } from '../lib/ai-providers.js';

// When installed as a package, use:
// import { getPromptForMode, callAI } from '@profullstack/therapy';

/**
 * EventEmitter-based therapy session
 * This demonstrates how to refactor the existing therapy application
 * to use event-driven architecture
 */
class EventDrivenTherapy extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // Configuration
    this.options = {
      mode: 'cbt',
      provider: 'openai',
      model: undefined,
      verbose: false,
      ...options
    };
    
    // State
    this.chatHistory = [];
    this.rl = null;
    this.isActive = false;
    
    // Bind methods to preserve 'this' context
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.processAIResponse = this.processAIResponse.bind(this);
    
    // Initialize event listeners
    this._setupEventListeners();
  }
  
  _setupEventListeners() {
    // Listen to our own events to implement the core functionality
    this.on('session:start', this._onSessionStart.bind(this));
    this.on('user:input', this._onUserInput.bind(this));
    this.on('ai:thinking', this._onAIThinking.bind(this));
    this.on('ai:response', this._onAIResponse.bind(this));
    this.on('session:end', this._onSessionEnd.bind(this));
    this.on('error', this._onError.bind(this));
  }
  
  // Start a new therapy session
  start() {
    if (this.isActive) {
      this.emit('warning', { message: 'Session already active' });
      return false;
    }
    
    // Initialize readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    // Handle readline errors
    this.rl.on('error', (err) => {
      this.emit('error', err);
    });
    
    // Initialize the chat history with the system prompt
    const systemPrompt = getPromptForMode(this.options.mode);
    this.chatHistory = [{ role: 'system', content: systemPrompt }];
    
    // Extract initial greeting from the prompt
    const initialPrompt = systemPrompt;
    const startMessage = initialPrompt.split('Begin').pop().split('"')[1] || 
                        "I'm here to support you. What's been on your mind lately?";
    
    // Mark session as active
    this.isActive = true;
    
    // Emit session start event
    this.emit('session:start', { 
      mode: this.options.mode,
      provider: this.options.provider,
      startMessage,
      timestamp: new Date()
    });
    
    return true;
  }
  
  // Handle user input
  handleUserInput() {
    if (!this.isActive || !this.rl) {
      this.emit('error', new Error('No active session'));
      return;
    }
    
    this.rl.question(chalk.green('You: '), (input) => {
      // Check for exit commands
      if (['exit', 'quit', 'bye'].includes(input.toLowerCase())) {
        this.stop();
        return;
      }
      
      // Emit user input event
      this.emit('user:input', {
        text: input,
        timestamp: new Date()
      });
    });
  }
  
  // Process AI response
  async processAIResponse(userInput) {
    try {
      // Add user message to history
      this.chatHistory.push({ role: 'user', content: userInput });
      
      // Emit thinking event
      this.emit('ai:thinking', {
        timestamp: new Date()
      });
      
      // Call AI provider
      const config = {
        provider: this.options.provider,
        model: this.options.model,
        verbose: this.options.verbose
      };
      
      const aiResponse = await callAI(this.chatHistory, config);
      
      // Add AI response to history
      this.chatHistory.push({ role: 'assistant', content: aiResponse });
      
      // Emit response event
      this.emit('ai:response', {
        text: aiResponse,
        timestamp: new Date()
      });
    } catch (error) {
      this.emit('error', error);
    }
  }
  
  // Stop the therapy session
  stop() {
    if (!this.isActive) {
      this.emit('warning', { message: 'No active session to end' });
      return false;
    }
    
    // Close readline interface
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
    
    // Mark session as inactive
    this.isActive = false;
    
    // Emit session end event
    this.emit('session:end', {
      messageCount: this.chatHistory.length - 1, // Subtract system prompt
      timestamp: new Date()
    });
    
    return true;
  }
  
  // Event handlers
  _onSessionStart(data) {
    console.log(chalk.cyan('🧠 ') + chalk.bold('AI Therapy Session'));
    console.log(chalk.dim(`Mode: ${this.options.mode.toUpperCase()} | Provider: ${this.options.provider.toUpperCase()}\n`));
    console.log(chalk.cyan(`\nAI: ${data.startMessage}\n`));
    
    // Start listening for user input
    this.handleUserInput();
  }
  
  _onUserInput(data) {
    // Process the user input
    this.processAIResponse(data.text);
  }
  
  _onAIThinking() {
    // In a real implementation, you might show a spinner here
    process.stdout.write(chalk.cyan('AI is thinking... '));
  }
  
  _onAIResponse(data) {
    // Clear the "thinking" message
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
    
    // Display the AI response
    console.log(chalk.cyan(`\nAI: ${data.text}\n`));
    
    // Continue the conversation
    this.handleUserInput();
  }
  
  _onSessionEnd() {
    console.log(chalk.cyan('\nThank you for the conversation. Take care! 👋'));
  }
  
  _onError(error) {
    console.error(chalk.red(`Error: ${error.message}`));
    
    if (this.options.verbose && error.stack) {
      console.error(chalk.dim(error.stack));
    }
    
    // Continue the conversation despite the error
    if (this.isActive) {
      console.log(chalk.yellow('\nThere was an error, but you can continue the conversation.\n'));
      this.handleUserInput();
    }
  }
}

// Example usage
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // This code runs when the script is executed directly
  const therapy = new EventDrivenTherapy({
    mode: 'cbt',
    provider: process.env.PROVIDER || 'openai',
    verbose: true
  });
  
  // You can add additional event listeners for custom behavior
  therapy.on('user:input', (data) => {
    if (data.text.toLowerCase().includes('anxious')) {
      console.log(chalk.yellow('\n[Event detected: User mentioned anxiety]\n'));
    }
  });
  
  therapy.on('ai:response', (data) => {
    // Example: Log response length for analytics
    const wordCount = data.text.split(' ').length;
    console.log(chalk.dim(`[Response stats: ${wordCount} words]`));
  });
  
  // Start the therapy session
  therapy.start();
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nDetected Ctrl+C, ending session...'));
    therapy.stop();
    process.exit(0);
  });
}

// Export the class for use in other modules
export { EventDrivenTherapy };

/**
 * Example of how to use this module in another file:
 * 
 * import { EventDrivenTherapy } from '@profullstack/therapy';
 *
 * // For local testing, you would use:
 * // import { EventDrivenTherapy } from './therapy-events.js';
 * 
 * // Create a therapy session
 * const therapy = new EventDrivenTherapy({
 *   mode: 'person',
 *   provider: 'openai',
 *   model: 'gpt-4',
 *   verbose: true
 * });
 * 
 * // Add custom event listeners
 * therapy.on('session:start', (data) => {
 *   console.log(`Session started at ${data.timestamp}`);
 *   
 *   // You could save session data to a database here
 * });
 * 
 * therapy.on('user:input', (data) => {
 *   // You could analyze user input for keywords here
 *   if (data.text.toLowerCase().includes('suicide') || 
 *       data.text.toLowerCase().includes('harm')) {
 *     console.log('Crisis keywords detected, alerting support team...');
 *   }
 * });
 * 
 * therapy.on('ai:response', (data) => {
 *   // You could log responses for quality control
 *   console.log(`Response at ${data.timestamp}: ${data.text.substring(0, 50)}...`);
 * });
 * 
 * therapy.on('session:end', (data) => {
 *   console.log(`Session ended with ${data.messageCount} messages`);
 *   
 *   // You could save session summary to a database here
 * });
 * 
 * // Start the therapy session
 * therapy.start();
 */