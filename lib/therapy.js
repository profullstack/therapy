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
  const { mode = 'cbt', provider = 'ollama', model, verbose = false } = options;
  
  // Initialize the chat history with the system prompt
  const systemPrompt = getPromptForMode(mode);
  const chatHistory = [{ role: 'system', content: systemPrompt }];
  
  // Create readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  // Start the conversation loop
  await conversationLoop(rl, chatHistory, { provider, model, verbose });
}

/**
 * Manages the ongoing conversation between user and AI
 */
async function conversationLoop(rl, chatHistory, config) {
  // Promisify readline question
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  
  try {
    while (true) {
      // Get user input
      const userInput = await question(chalk.green('You: '));
      
      // Check for exit commands
      if (['exit', 'quit', 'bye'].includes(userInput.toLowerCase())) {
        console.log(chalk.cyan('\nThank you for the conversation. Take care! 👋'));
        rl.close();
        break;
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
      } catch (error) {
        spinner.fail(`Error: ${error.message}`);
        if (config.verbose) {
          console.error(error);
        }
      }
    }
  } catch (error) {
    console.error(chalk.red('Session error:'), error.message);
    rl.close();
  }
}