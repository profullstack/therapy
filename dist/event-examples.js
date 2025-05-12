// Example of event handling in Node.js modules
import { EventEmitter } from 'events';

/**
 * Basic EventEmitter example
 * This shows how to create and use a simple event emitter
 */
export function createBasicEmitter() {
  const emitter = new EventEmitter();
  
  // Setup a timer that emits an event every second
  const timer = setInterval(() => {
    emitter.emit('tick', new Date());
  }, 1000);
  
  // Method to stop the timer
  const stop = () => {
    clearInterval(timer);
    emitter.emit('stop');
  };
  
  return { emitter, stop };
}

/**
 * Example usage of basic emitter:
 * 
 * import { createBasicEmitter } from './event-examples.js';
 * 
 * const { emitter, stop } = createBasicEmitter();
 * 
 * // Listen for the 'tick' event
 * emitter.on('tick', (date) => {
 *   console.log(`Tick at ${date}`);
 * });
 * 
 * // Listen for the 'stop' event
 * emitter.on('stop', () => {
 *   console.log('Timer stopped');
 * });
 * 
 * // Stop the timer after 5 seconds
 * setTimeout(stop, 5000);
 */

/**
 * Class-based EventEmitter example
 * This shows how to extend EventEmitter to create a class with built-in events
 */
export class TherapyEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.sessionActive = false;
  }
  
  startSession() {
    this.sessionActive = true;
    this.emit('sessionStart', { time: new Date() });
    
    // Emit thinking events periodically
    this.thinkingInterval = setInterval(() => {
      this.emit('thinking', { duration: Math.random() * 3 + 1 });
    }, 5000);
  }
  
  receiveUserInput(input) {
    // Validate input
    if (!input || typeof input !== 'string') {
      this.emit('error', new Error('Invalid input'));
      return;
    }
    
    // Emit the input event
    this.emit('userInput', { text: input, time: new Date() });
    
    // Simulate processing time
    setTimeout(() => {
      // Emit response event
      this.emit('response', { 
        text: `Processed: ${input}`,
        time: new Date()
      });
    }, 1000);
  }
  
  endSession() {
    if (this.thinkingInterval) {
      clearInterval(this.thinkingInterval);
    }
    
    this.sessionActive = false;
    this.emit('sessionEnd', { time: new Date() });
  }
}

/**
 * Example usage of class-based emitter:
 * 
 * import { TherapyEventEmitter } from './event-examples.js';
 * 
 * const therapySession = new TherapyEventEmitter();
 * 
 * // Set up event listeners
 * therapySession.on('sessionStart', (data) => {
 *   console.log(`Session started at ${data.time}`);
 * });
 * 
 * therapySession.on('thinking', (data) => {
 *   console.log(`AI is thinking (${data.duration.toFixed(1)}s)`);
 * });
 * 
 * therapySession.on('userInput', (data) => {
 *   console.log(`Received user input: ${data.text}`);
 * });
 * 
 * therapySession.on('response', (data) => {
 *   console.log(`AI response: ${data.text}`);
 * });
 * 
 * therapySession.on('sessionEnd', (data) => {
 *   console.log(`Session ended at ${data.time}`);
 * });
 * 
 * therapySession.on('error', (error) => {
 *   console.error(`Error: ${error.message}`);
 * });
 * 
 * // Start the session
 * therapySession.startSession();
 * 
 * // Send some user input
 * therapySession.receiveUserInput("I've been feeling stressed lately");
 * 
 * // End the session after 10 seconds
 * setTimeout(() => therapySession.endSession(), 10000);
 */

/**
 * Factory function that creates a therapy session manager with event handling
 * This demonstrates a more complex module with internal state and events
 */
export function createTherapyEventManager(options = {}) {
  const emitter = new EventEmitter();
  const { maxListeners = 10 } = options;
  
  // Set max listeners to avoid memory leaks
  emitter.setMaxListeners(maxListeners);
  
  // Internal state
  let sessionId = null;
  let messageCount = 0;
  let sessionStartTime = null;
  
  // Create a new session
  function startSession() {
    if (sessionId) {
      emitter.emit('warning', { message: 'Session already in progress' });
      return sessionId;
    }
    
    sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    sessionStartTime = new Date();
    messageCount = 0;
    
    emitter.emit('session:start', { 
      sessionId,
      startTime: sessionStartTime
    });
    
    return sessionId;
  }
  
  // Process a message
  function processMessage(message) {
    if (!sessionId) {
      emitter.emit('error', new Error('No active session'));
      return false;
    }
    
    messageCount++;
    
    emitter.emit('message:received', {
      sessionId,
      messageId: `msg_${messageCount}`,
      content: message,
      timestamp: new Date()
    });
    
    // Simulate processing
    setTimeout(() => {
      emitter.emit('message:processed', {
        sessionId,
        messageId: `msg_${messageCount}`,
        timestamp: new Date()
      });
    }, 500);
    
    return true;
  }
  
  // End the current session
  function endSession() {
    if (!sessionId) {
      emitter.emit('warning', { message: 'No active session to end' });
      return false;
    }
    
    const sessionDuration = new Date() - sessionStartTime;
    
    emitter.emit('session:end', {
      sessionId,
      messageCount,
      duration: sessionDuration,
      endTime: new Date()
    });
    
    // Reset state
    sessionId = null;
    messageCount = 0;
    sessionStartTime = null;
    
    return true;
  }
  
  // Get session stats
  function getSessionStats() {
    if (!sessionId) {
      return { active: false };
    }
    
    return {
      active: true,
      sessionId,
      messageCount,
      duration: new Date() - sessionStartTime,
      startTime: sessionStartTime
    };
  }
  
  // Return the public API
  return {
    // Event emitter for subscribing to events
    events: emitter,
    
    // Methods
    startSession,
    processMessage,
    endSession,
    getSessionStats,
    
    // Event names as constants (useful for consumers)
    EVENT_TYPES: {
      SESSION_START: 'session:start',
      SESSION_END: 'session:end',
      MESSAGE_RECEIVED: 'message:received',
      MESSAGE_PROCESSED: 'message:processed',
      WARNING: 'warning',
      ERROR: 'error'
    }
  };
}

/**
 * Example usage of the therapy event manager:
 * 
 * import { createTherapyEventManager } from './event-examples.js';
 * 
 * // Create a therapy session manager
 * const therapyManager = createTherapyEventManager();
 * const { events, EVENT_TYPES } = therapyManager;
 * 
 * // Set up event listeners using the constants
 * events.on(EVENT_TYPES.SESSION_START, (data) => {
 *   console.log(`New session started: ${data.sessionId}`);
 * });
 * 
 * events.on(EVENT_TYPES.MESSAGE_RECEIVED, (data) => {
 *   console.log(`Message received: ${data.content}`);
 * });
 * 
 * events.on(EVENT_TYPES.MESSAGE_PROCESSED, (data) => {
 *   console.log(`Message ${data.messageId} processed`);
 * });
 * 
 * events.on(EVENT_TYPES.SESSION_END, (data) => {
 *   console.log(`Session ended after ${data.duration}ms with ${data.messageCount} messages`);
 * });
 * 
 * events.on(EVENT_TYPES.WARNING, (data) => {
 *   console.warn(`Warning: ${data.message}`);
 * });
 * 
 * events.on(EVENT_TYPES.ERROR, (error) => {
 *   console.error(`Error: ${error.message}`);
 * });
 * 
 * // Start a session
 * therapyManager.startSession();
 * 
 * // Process some messages
 * therapyManager.processMessage("Hello, I need some help");
 * 
 * setTimeout(() => {
 *   therapyManager.processMessage("I've been feeling anxious lately");
 * }, 1000);
 * 
 * // End the session after 5 seconds
 * setTimeout(() => {
 *   therapyManager.endSession();
 * }, 5000);
 */

/**
 * Example of using once() for one-time events
 */
export function createOneTimeEmitter() {
  const emitter = new EventEmitter();
  
  // This function sets up a one-time event
  function waitForResponse(timeout = 5000) {
    return new Promise((resolve, reject) => {
      // Set up a timeout
      const timeoutId = setTimeout(() => {
        // Clean up the event listener to prevent memory leaks
        emitter.removeAllListeners('response');
        reject(new Error('Response timeout'));
      }, timeout);
      
      // Use once() instead of on() for one-time event handling
      emitter.once('response', (data) => {
        clearTimeout(timeoutId);
        resolve(data);
      });
    });
  }
  
  // Function to simulate receiving a response
  function simulateResponse(data) {
    emitter.emit('response', data);
  }
  
  return {
    waitForResponse,
    simulateResponse
  };
}

/**
 * Example usage of one-time events:
 * 
 * import { createOneTimeEmitter } from './event-examples.js';
 * 
 * async function demonstrateOneTimeEvents() {
 *   const { waitForResponse, simulateResponse } = createOneTimeEmitter();
 *   
 *   // Set up a one-time event handler via Promise
 *   const responsePromise = waitForResponse(3000);
 *   
 *   // Simulate getting a response after 1 second
 *   setTimeout(() => {
 *     simulateResponse({ text: 'This is a response', timestamp: new Date() });
 *   }, 1000);
 *   
 *   try {
 *     // Wait for the response
 *     const response = await responsePromise;
 *     console.log(`Got response: ${response.text}`);
 *   } catch (error) {
 *     console.error(`Error: ${error.message}`);
 *   }
 * }
 * 
 * demonstrateOneTimeEvents();
 */