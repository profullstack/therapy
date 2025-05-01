#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';
import { getPromptForMode } from './lib/prompts.js';
import { callAI } from './lib/ai-providers.js';

// Get package version without importing JSON directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json'), 'utf8'));
const version = packageJson.version;

// Configure the CLI program
program
  .name('therapy')
  .description('Interactive AI therapy session in your terminal')
  .version(version)
  .option('-m, --mode <mode>', 'therapy mode (cbt, person, trauma)', 'cbt')
  .option('-p, --provider <provider>', 'AI provider (openai, ollama)', process.env.PROVIDER || 'openai')
  .option('--model <model>', 'specific model to use (defaults based on provider)')
  .option('-v, --verbose', 'show detailed logs')
  .action((options) => {
    console.log(chalk.cyan('🧠 ') + chalk.bold('AI Therapy Session'));
    console.log(chalk.dim(`Mode: ${options.mode.toUpperCase()} | Provider: ${options.provider.toUpperCase()}\n`));
    
    try {
      startTherapySession(options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText('after', `
Examples:
  $ therapy                     Start a CBT session with default provider
  $ therapy --mode trauma       Start a trauma-informed session
  $ therapy -m person -p openai Start a person-centered session with OpenAI
`);

// Parse command line arguments
program.parse();

/**
 * Start a therapy session
 */
function startTherapySession(options) {
  const { mode = 'cbt', provider = 'openai', model, verbose = false } = options;
  
  // Initialize the chat history with the system prompt
  const systemPrompt = getPromptForMode(mode);
  const chatHistory = [{ role: 'system', content: systemPrompt }];
  
  // Extract initial greeting from the prompt
  const initialPrompt = systemPrompt;
  const startMessage = initialPrompt.split('Begin').pop().split('"')[1] || 
                      "I'm here to support you. What's been on your mind lately?";
  
  console.log(chalk.cyan(`\nAI: ${startMessage}\n`));
  
  // Create config object
  const config = { provider, model, verbose };
  
  // Check if input is being piped in
  const isPiped = !process.stdin.isTTY;
  
  if (isPiped) {
    // Handle piped input (e.g., from echo)
    let pipeInput = '';
    
    process.stdin.on('data', (chunk) => {
      pipeInput += chunk;
    });
    
    process.stdin.on('end', async () => {
      if (pipeInput.trim()) {
        console.log(chalk.green(`You: ${pipeInput.trim()}`));
        
        // Add user message to history
        chatHistory.push({ role: 'user', content: pipeInput.trim() });
        
        // Start spinner
        startSpinner('🧠 AI is thinking');
        
        try {
          // Get AI response
          const reply = await callAI(chatHistory, config);
          
          // Stop spinner and display response
          stopSpinner();
          console.log(chalk.cyan(`\n🧠 AI: ${reply}\n`));
        } catch (err) {
          stopSpinner();
          console.error(chalk.red('❌ Error:'), err.message);
        }
      } else {
        console.log(chalk.yellow('No input provided.'));
      }
    });
  } else {
    // Interactive mode
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    // Start the conversation
    chatWithAI(rl, chatHistory, config);
  }
}

/**
 * Spinner utility
 */
let spinnerInterval;
const spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];
let spinnerIndex = 0;

function startSpinner(text = 'Thinking') {
  process.stdout.write(`${text} `);
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r${text} ${spinnerFrames[spinnerIndex++ % spinnerFrames.length]} `);
  }, 80);
}

function stopSpinner() {
  clearInterval(spinnerInterval);
  process.stdout.write('\r\x1b[K'); // clear line
}

/**
 * Main conversation function - uses callback pattern like the original
 */
function chatWithAI(rl, chatHistory, config) {
  rl.question(chalk.green('You: '), async (input) => {
    // Check for exit commands
    if (['exit', 'quit', 'bye'].includes(input.toLowerCase())) {
      console.log(chalk.cyan('\nThank you for the conversation. Take care! 👋'));
      rl.close();
      return;
    }
    
    // Add user message to history
    chatHistory.push({ role: 'user', content: input });
    
    // Start spinner
    startSpinner('🧠 AI is thinking');
    
    try {
      // Get AI response
      const reply = await callAI(chatHistory, config);
      
      // Stop spinner and display response
      stopSpinner();
      console.log(chalk.cyan(`\n🧠 AI: ${reply}\n`));
      
      // Add AI response to history
      chatHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
      stopSpinner();
      console.error(chalk.red('❌ Error:'), err.message);
    }
    
    // Continue the conversation
    chatWithAI(rl, chatHistory, config);
  });
}