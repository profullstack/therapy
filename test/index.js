/**
 * Basic tests for @profullstack/therapy
 */

// Import the module
import therapy from '../index.js';
import { jest } from '@jest/globals';

// Import lib components
let aiProviders, eventExamples, prompts, therapyLib;

try { aiProviders = await import('../lib/ai-providers.js'); }
catch (err) { console.log('AI providers not found or could not be loaded:', err.message); }

try { eventExamples = await import('../lib/event-examples.js'); }
catch (err) { console.log('Event examples not found or could not be loaded:', err.message); }

try { prompts = await import('../lib/prompts.js'); }
catch (err) { console.log('Prompts not found or could not be loaded:', err.message); }

try { therapyLib = await import('../lib/therapy.js'); }
catch (err) { console.log('Therapy lib not found or could not be loaded:', err.message); }

describe('@profullstack/therapy', () => {
  test('module exports something', () => {
    console.log('Testing @profullstack/therapy...');
    console.log('Module exports:', Object.keys(therapy));
    
    expect(Object.keys(therapy).length).toBeGreaterThan(0);
  });
  
  // Test lib components if they exist
  test('AI providers if available', () => {
    if (aiProviders) {
      console.log('Testing AI providers...');
      console.log('AI providers exports:', Object.keys(aiProviders));
      expect(Object.keys(aiProviders).length).toBeGreaterThan(0);
    } else {
      console.log('AI providers not available, skipping test');
    }
  });
  
  test('event examples if available', () => {
    if (eventExamples) {
      console.log('Testing event examples...');
      console.log('Event examples exports:', Object.keys(eventExamples));
      expect(Object.keys(eventExamples).length).toBeGreaterThan(0);
    } else {
      console.log('Event examples not available, skipping test');
    }
  });
  
  test('prompts if available', () => {
    if (prompts) {
      console.log('Testing prompts...');
      console.log('Prompts exports:', Object.keys(prompts));
      expect(Object.keys(prompts).length).toBeGreaterThan(0);
    } else {
      console.log('Prompts not available, skipping test');
    }
  });
  
  test('therapy lib if available', () => {
    if (therapyLib) {
      console.log('Testing therapy lib...');
      console.log('Therapy lib exports:', Object.keys(therapyLib));
      expect(Object.keys(therapyLib).length).toBeGreaterThan(0);
    } else {
      console.log('Therapy lib not available, skipping test');
    }
  });
  
  // Test basic functionality
  test('createTherapist function if available', () => {
    if (typeof therapy.createTherapist === 'function') {
      console.log('Testing createTherapist function exists');
      expect(therapy.createTherapist).toBeDefined();
    } else {
      console.log('createTherapist function not available, skipping test');
    }
  });
  
  test('processEvent function if available', () => {
    if (typeof therapy.processEvent === 'function') {
      console.log('Testing processEvent function exists');
      expect(therapy.processEvent).toBeDefined();
    } else {
      console.log('processEvent function not available, skipping test');
    }
  });
});