import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { getPromptForMode } from './prompts.js';
import { callAI } from './ai-providers.js';

/**
 * Creates and manages an interactive therapy session
 * @param {Object} options - Session configuration options
 */
export async function createTherapySession(options) {
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
  
  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  // Handle stdin being closed (e.g., when input is piped from echo)
  process.stdin.on('end', () => {
    // This is triggered when stdin is closed (e.g., when using echo | therapy)
    // We don't need to do anything here, just prevent the error
  });
  
  // Start the conversation
  processUserInput(rl, chatHistory, config);
}

/**
 * Process user input and get AI response
 */
function processUserInput(rl, chatHistory, config) {
  rl.question(chalk.green('You: '), async (userInput) => {
    // Check for exit commands
    if (['exit', 'quit', 'bye'].includes(userInput.toLowerCase())) {
      console.log(chalk.cyan('\nThank you for the conversation. Take care! 👋'));
      rl.close();
      return;
    }
    
    // Add user message to history
    chatHistory.push({ role: 'user', content: userInput });
    
    // Show thinking spinner
    const spinner = ora({
      text: 'AI is thinking...',
      color: 'cyan',
    }).start();
    
    try {
      // Get AI response
      const aiResponse = await callAI(chatHistory, config);
      
      // Stop spinner and display response
      spinner.stop();
      console.log(chalk.cyan(`\nAI: ${aiResponse}\n`));
      
      // Add AI response to history
      chatHistory.push({ role: 'assistant', content: aiResponse });
      
      // Continue the conversation
      processUserInput(rl, chatHistory, config);
    } catch (error) {
      spinner.stop();
      console.error(chalk.red(`Error: ${error.message}`));
      
      if (config.verbose) {
        console.error(error);
      }
      
      console.log(chalk.yellow('\nThere was an error getting a response, but you can continue the conversation.\n'));
      
      // Continue the conversation despite the error
      processUserInput(rl, chatHistory, config);
    }
  });
  
  // Handle errors on the readline interface
  rl.on('error', (err) => {
    if (err.code === 'ERR_USE_AFTER_CLOSE') {
      // Ignore this error, it happens when stdin is closed
      return;
    }
    console.error(chalk.red(`Readline error: ${err.message}`));
  });
}