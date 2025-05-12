import 'dotenv-flow/config';
import chalk from 'chalk';

// API endpoints
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OLLAMA_API_URL = 'http://localhost:11434/api/chat';

/**
 * Call the appropriate AI provider based on configuration
 * @param {Array} messages - Chat history messages
 * @param {Object} config - Provider configuration
 * @returns {Promise<string>} AI response text
 */
export async function callAI(messages, config) {
  const { provider = 'ollama', model, verbose = false } = config;
  
  // Determine which provider to use
  switch (provider.toLowerCase()) {
    case 'openai':
      return callOpenAI(messages, model || 'gpt-4', verbose);
    case 'ollama':
      return callOllama(messages, model || 'llama3', verbose);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Call OpenAI API
 * @param {Array} messages - Chat history messages
 * @param {string} model - OpenAI model to use
 * @param {boolean} verbose - Whether to log detailed information
 * @returns {Promise<string>} AI response text
 */
async function callOpenAI(messages, model, verbose) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'OpenAI API key not found. Please set OPENAI_API_KEY in your .env file.'
    );
  }
  
  if (verbose) {
    console.log(chalk.dim(`Using OpenAI model: ${model}`));
  }
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error (${response.status}): ${errorData.error?.message || response.statusText}`
      );
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    if (error.message.includes('fetch failed')) {
      throw new Error('Failed to connect to OpenAI API. Please check your internet connection.');
    }
    throw error;
  }
}

/**
 * Call Ollama API
 * @param {Array} messages - Chat history messages
 * @param {string} model - Ollama model to use
 * @param {boolean} verbose - Whether to log detailed information
 * @returns {Promise<string>} AI response text
 */
async function callOllama(messages, model, verbose) {
  if (verbose) {
    console.log(chalk.dim(`Using Ollama model: ${model}`));
  }
  
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `Ollama API error (${response.status}): ${errorText || response.statusText}`
      );
    }
    
    const data = await response.json();
    return data.message.content.trim();
  } catch (error) {
    if (error.message.includes('fetch failed')) {
      throw new Error(
        'Failed to connect to Ollama. Make sure Ollama is running locally (http://localhost:11434).'
      );
    }
    throw error;
  }
}