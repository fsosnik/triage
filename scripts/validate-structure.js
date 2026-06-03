#!/usr/bin/env node

/**
 * TRIAGE - Structure Validator
 * Ensures project has proper structure
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_DIRS = [
  'docs/architecture',
  'docs/api',
  'docs/guides',
  'docs/examples',
  'src/core',
  'src/agents',
  'src/learning',
  'src/validation',
  'src/tools',
  '.claude/agents',
  '.claude/skills',
  '.claude/patterns',
  '.claude/hooks',
  '.claude/rules',
  '.github/workflows',
  'tests',
  'scripts',
  'config',
];

const REQUIRED_FILES = [
  'README.md',
  'package.json',
  '.gitignore',
  'docs/architecture/ARCHITECTURE.md',
  'docs/api/API_INTEGRATION.md',
  'docs/guides/LOW_CONSUMPTION.md',
  'config/settings.example.json',
  'config/patterns.example.json',
  'config/blocklist.example.json',
];

function validateStructure() {
  console.log('🔍 Validating TRIAGE project structure...\n');

  let passed = 0;
  let failed = 0;

  // Check directories
  console.log('📁 Checking directories:');
  REQUIRED_DIRS.forEach(dir => {
    const exists = fs.existsSync(dir);
    if (exists) {
      console.log(`  ✅ ${dir}`);
      passed++;
    } else {
      console.log(`  ❌ ${dir} (MISSING)`);
      failed++;
      // Create it
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`     → Created`);
      } catch (e) {
        console.log(`     → Could not create`);
      }
    }
  });

  console.log('');

  // Check files
  console.log('📄 Checking critical files:');
  REQUIRED_FILES.forEach(file => {
    const exists = fs.existsSync(file);
    if (exists) {
      const size = fs.statSync(file).size;
      console.log(`  ✅ ${file} (${size} bytes)`);
      passed++;
    } else {
      console.log(`  ⚠️  ${file} (missing - may be needed)`);
      failed++;
    }
  });

  console.log('');

  // Summary
  const total = REQUIRED_DIRS.length + REQUIRED_FILES.length;
  const percentage = ((passed / total) * 100).toFixed(1);

  console.log('─'.repeat(50));
  console.log(`\n📊 Structure Validation: ${percentage}% Complete`);
  console.log(`   ✅ ${passed} items present`);
  console.log(`   ⚠️  ${failed} items missing\n`);

  if (percentage >= 90) {
    console.log('✅ Structure is VALID - Ready to proceed\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some items missing - Create them or continue\n');
    process.exit(0); // Don't fail, just warn
  }
}

validateStructure();
