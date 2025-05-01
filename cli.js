#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createTherapySession } from './lib/therapy.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
  .option('-p, --provider <provider>', 'AI provider (openai, ollama)', process.env.PROVIDER || 'ollama')
  .option('--model <model>', 'specific model to use (defaults based on provider)')
  .option('-v, --verbose', 'show detailed logs')
  .action(async (options) => {
    console.log(chalk.cyan('🧠 ') + chalk.bold('AI Therapy Session'));
    console.log(chalk.dim(`Mode: ${options.mode.toUpperCase()} | Provider: ${options.provider.toUpperCase()}\n`));
    
    try {
      await createTherapySession(options);
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