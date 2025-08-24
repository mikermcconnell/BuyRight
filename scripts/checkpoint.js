#!/usr/bin/env node

/**
 * Checkpoint Management System
 * 
 * This script provides a simple checkpoint system using Git tags
 * to save and restore project states.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const CHECKPOINT_PREFIX = 'checkpoint';
const CHECKPOINT_LOG = path.join(__dirname, '..', '.checkpoint-log.json');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute git commands
function gitExec(command, silent = false) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    if (!silent) {
      console.error(`${colors.red}Error executing: ${command}${colors.reset}`);
      console.error(error.message);
    }
    return null;
  }
}

// Load checkpoint log
function loadCheckpointLog() {
  if (fs.existsSync(CHECKPOINT_LOG)) {
    return JSON.parse(fs.readFileSync(CHECKPOINT_LOG, 'utf8'));
  }
  return { checkpoints: [] };
}

// Save checkpoint log
function saveCheckpointLog(log) {
  fs.writeFileSync(CHECKPOINT_LOG, JSON.stringify(log, null, 2));
}

// Create a new checkpoint
function createCheckpoint(description) {
  // Ensure working directory is clean
  const status = gitExec('git status --porcelain');
  if (status) {
    console.log(`${colors.yellow}⚠ You have uncommitted changes. Committing them first...${colors.reset}`);
    gitExec('git add -A');
    gitExec(`git commit -m "Auto-commit before checkpoint: ${description}"`);
  }

  // Generate checkpoint name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const checkpointName = `${CHECKPOINT_PREFIX}-${timestamp}`;
  
  // Create the tag
  const tagMessage = `Checkpoint: ${description}\nCreated: ${new Date().toISOString()}`;
  gitExec(`git tag -a ${checkpointName} -m "${tagMessage}"`);
  
  // Push to remote
  const pushResult = gitExec(`git push origin ${checkpointName}`, true);
  
  // Update log
  const log = loadCheckpointLog();
  log.checkpoints.push({
    name: checkpointName,
    description,
    date: new Date().toISOString(),
    commit: gitExec('git rev-parse HEAD'),
    pushed: pushResult !== null
  });
  saveCheckpointLog(log);
  
  console.log(`${colors.green}✅ Checkpoint created: ${checkpointName}${colors.reset}`);
  console.log(`${colors.cyan}   Description: ${description}${colors.reset}`);
  
  return checkpointName;
}

// List all checkpoints
function listCheckpoints() {
  const log = loadCheckpointLog();
  const tags = gitExec(`git tag -l "${CHECKPOINT_PREFIX}-*"`) || '';
  const tagList = tags.split('\n').filter(t => t);
  
  console.log(`${colors.blue}📍 Available Checkpoints:${colors.reset}\n`);
  
  if (tagList.length === 0) {
    console.log('  No checkpoints found.');
    return;
  }
  
  tagList.forEach((tag, index) => {
    const logEntry = log.checkpoints.find(c => c.name === tag);
    const date = gitExec(`git log -1 --format=%ai ${tag}`);
    const message = gitExec(`git tag -l --format="%(contents:subject)" ${tag}`);
    
    console.log(`  ${colors.yellow}${index + 1}.${colors.reset} ${colors.cyan}${tag}${colors.reset}`);
    console.log(`     📝 ${message || (logEntry && logEntry.description) || 'No description'}`);
    console.log(`     📅 ${date}`);
    console.log();
  });
}

// Restore to a checkpoint
function restoreCheckpoint(checkpointName) {
  // Check for uncommitted changes
  const status = gitExec('git status --porcelain');
  if (status) {
    console.log(`${colors.red}❌ You have uncommitted changes. Please commit or stash them first.${colors.reset}`);
    console.log('   Run: git stash');
    return false;
  }
  
  // Verify checkpoint exists
  const exists = gitExec(`git tag -l ${checkpointName}`);
  if (!exists) {
    console.log(`${colors.red}❌ Checkpoint '${checkpointName}' not found.${colors.reset}`);
    listCheckpoints();
    return false;
  }
  
  // Create a safety backup before restoring
  const backupName = `${CHECKPOINT_PREFIX}-backup-${Date.now()}`;
  gitExec(`git tag ${backupName}`);
  
  // Checkout the checkpoint
  gitExec(`git checkout ${checkpointName}`);
  
  console.log(`${colors.green}✅ Restored to checkpoint: ${checkpointName}${colors.reset}`);
  console.log(`${colors.yellow}⚠ You are now in a detached HEAD state.${colors.reset}`);
  console.log(`   To continue development from here:`);
  console.log(`   ${colors.cyan}git checkout -b new-branch-name${colors.reset}`);
  console.log(`   To return to master:`);
  console.log(`   ${colors.cyan}git checkout master${colors.reset}`);
  
  return true;
}

// Auto checkpoint based on criteria
function autoCheckpoint() {
  const lastCommit = gitExec('git log -1 --format=%s');
  const changeCount = gitExec('git diff --stat HEAD~1 | tail -1') || '';
  
  // Criteria for auto-checkpoint
  const shouldCheckpoint = 
    lastCommit.includes('feat:') ||
    lastCommit.includes('fix:') ||
    lastCommit.includes('BREAKING') ||
    changeCount.includes('100+') ||
    changeCount.includes('50 files');
  
  if (shouldCheckpoint) {
    const description = `Auto: ${lastCommit.substring(0, 50)}`;
    createCheckpoint(description);
    return true;
  }
  
  return false;
}

// Main CLI interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'create':
    case 'save':
      const description = args.slice(1).join(' ') || 'Manual checkpoint';
      createCheckpoint(description);
      break;
      
    case 'list':
    case 'ls':
      listCheckpoints();
      break;
      
    case 'restore':
    case 'checkout':
      if (!args[1]) {
        console.log(`${colors.red}Please specify a checkpoint name.${colors.reset}`);
        listCheckpoints();
      } else {
        restoreCheckpoint(args[1]);
      }
      break;
      
    case 'auto':
      const created = autoCheckpoint();
      if (!created) {
        console.log(`${colors.yellow}No auto-checkpoint needed at this time.${colors.reset}`);
      }
      break;
      
    case 'help':
    default:
      console.log(`
${colors.cyan}Checkpoint Management System${colors.reset}

${colors.yellow}Commands:${colors.reset}
  ${colors.green}create/save [description]${colors.reset}  Create a new checkpoint
  ${colors.green}list/ls${colors.reset}                    List all checkpoints
  ${colors.green}restore/checkout [name]${colors.reset}    Restore to a checkpoint
  ${colors.green}auto${colors.reset}                       Auto-create if criteria met
  ${colors.green}help${colors.reset}                       Show this help

${colors.yellow}Examples:${colors.reset}
  node scripts/checkpoint.js save "Before adding payment system"
  node scripts/checkpoint.js list
  node scripts/checkpoint.js restore checkpoint-2024-01-15T10-30-00
  
${colors.blue}Tip:${colors.reset} Add to package.json for easier access:
  "checkpoint": "node scripts/checkpoint.js"
      `);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createCheckpoint, listCheckpoints, restoreCheckpoint, autoCheckpoint };