#!/usr/bin/env node

/**
 * TRIAGE OS - Update README with metrics
 */

const fs = require('fs');
const path = require('path');

function updateReadme() {
  console.log('📝 Updating README with metrics...\n');

  // Get metrics
  const patternsFile = path.join(process.cwd(), '.claude/patterns/successes.json');
  let patternCount = 0;
  
  if (fs.existsSync(patternsFile)) {
    try {
      const patterns = JSON.parse(fs.readFileSync(patternsFile, 'utf-8'));
      patternCount = Array.isArray(patterns) ? patterns.length : 0;
    } catch (e) {
      // Skip
    }
  }

  // Update README
  let readme = fs.readFileSync('README.md', 'utf-8');
  
  // Update pattern count in README if exists
  readme = readme.replace(
    /Patterns Learned.*?\d+/,
    `Patterns Learned: ${patternCount}`
  );

  fs.writeFileSync('README.md', readme);
  console.log(`✓ README updated (${patternCount} patterns)`);
}

updateReadme();
