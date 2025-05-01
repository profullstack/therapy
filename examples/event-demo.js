#!/usr/bin/env node

// Example script demonstrating how to use the event handling module
import { 
  createBasicEmitter, 
  TherapyEventEmitter, 
  createTherapyEventManager,
  createOneTimeEmitter
} from '../lib/event-examples.js';

// Example 1: Basic Event Emitter
console.log('\n--- Example 1: Basic Event Emitter ---');
const { emitter, stop } = createBasicEmitter();

// Listen for the 'tick' event
emitter.on('tick', (date) => {
  console.log(`Tick at ${date.toISOString()}`);
});

// Listen for the 'stop' event
emitter.on('stop', () => {
  console.log('Timer stopped');
});

// Stop the timer after 3 seconds
console.log('Timer will run for 3 seconds...');
setTimeout(stop, 3000);

// Example 2: Class-based Event Emitter
setTimeout(() => {
  console.log('\n--- Example 2: Class-based Event Emitter ---');
  const therapySession = new TherapyEventEmitter();
  
  // Set up event listeners
  therapySession.on('sessionStart', (data) => {
    console.log(`Session started at ${data.time}`);
  });
  
  therapySession.on('thinking', (data) => {
    console.log(`AI is thinking (${data.duration.toFixed(1)}s)`);
  });
  
  therapySession.on('userInput', (data) => {
    console.log(`Received user input: ${data.text}`);
  });
  
  therapySession.on('response', (data) => {
    console.log(`AI response: ${data.text}`);
  });
  
  therapySession.on('sessionEnd', (data) => {
    console.log(`Session ended at ${data.time}`);
  });
  
  therapySession.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });
  
  // Start the session
  therapySession.startSession();
  
  // Send some user input
  therapySession.receiveUserInput("I've been feeling stressed lately");
  
  // Try sending invalid input to trigger error event
  setTimeout(() => {
    therapySession.receiveUserInput(null);
  }, 2000);
  
  // Send another valid input
  setTimeout(() => {
    therapySession.receiveUserInput("How can I manage my anxiety?");
  }, 3000);
  
  // End the session after 6 seconds
  setTimeout(() => {
    therapySession.endSession();
  }, 6000);
}, 4000);

// Example 3: Factory Function with Event Manager
setTimeout(() => {
  console.log('\n--- Example 3: Factory Function with Event Manager ---');
  const therapyManager = createTherapyEventManager();
  const { events, EVENT_TYPES } = therapyManager;
  
  // Set up event listeners using the constants
  events.on(EVENT_TYPES.SESSION_START, (data) => {
    console.log(`New session started: ${data.sessionId}`);
  });
  
  events.on(EVENT_TYPES.MESSAGE_RECEIVED, (data) => {
    console.log(`Message received: ${data.content}`);
  });
  
  events.on(EVENT_TYPES.MESSAGE_PROCESSED, (data) => {
    console.log(`Message ${data.messageId} processed`);
  });
  
  events.on(EVENT_TYPES.SESSION_END, (data) => {
    console.log(`Session ended after ${Math.round(data.duration)}ms with ${data.messageCount} messages`);
  });
  
  events.on(EVENT_TYPES.WARNING, (data) => {
    console.warn(`Warning: ${data.message}`);
  });
  
  events.on(EVENT_TYPES.ERROR, (error) => {
    console.error(`Error: ${error.message}`);
  });
  
  // Try to process a message without an active session (should emit error)
  therapyManager.processMessage("This will fail");
  
  // Start a session
  therapyManager.startSession();
  
  // Try to start another session (should emit warning)
  setTimeout(() => {
    therapyManager.startSession();
  }, 1000);
  
  // Process some messages
  setTimeout(() => {
    therapyManager.processMessage("Hello, I need some help");
  }, 1500);
  
  setTimeout(() => {
    therapyManager.processMessage("I've been feeling anxious lately");
  }, 2500);
  
  // Get and display session stats
  setTimeout(() => {
    const stats = therapyManager.getSessionStats();
    console.log('Current session stats:', stats);
  }, 3000);
  
  // End the session
  setTimeout(() => {
    therapyManager.endSession();
  }, 4000);
  
  // Try to end the session again (should emit warning)
  setTimeout(() => {
    therapyManager.endSession();
  }, 4500);
}, 11000);

// Example 4: One-time Events with Promises
setTimeout(async () => {
  console.log('\n--- Example 4: One-time Events with Promises ---');
  
  const { waitForResponse, simulateResponse } = createOneTimeEmitter();
  
  console.log('Waiting for response (will timeout after 3 seconds if no response)...');
  
  // Set up a one-time event handler via Promise
  const responsePromise = waitForResponse(3000);
  
  // Simulate getting a response after 1 second
  setTimeout(() => {
    console.log('Simulating response...');
    simulateResponse({ text: 'This is a one-time response', timestamp: new Date() });
  }, 1000);
  
  try {
    // Wait for the response
    const response = await responsePromise;
    console.log(`Got response: ${response.text} at ${response.timestamp.toISOString()}`);
    
    // Demonstrate that the event handler is removed after first use
    console.log('Sending another response (should not be received)...');
    simulateResponse({ text: 'This response should not be received', timestamp: new Date() });
    
    console.log('Done with all examples!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}, 16000);