#!/usr/bin/env node

/**
 * TRIAGE - Changelog Generator
 */

const fs = require('fs');
const { execSync } = require('child_process');

function generateChangelog() {
  console.log('📝 Generating CHANGELOG.md...\n');

  try {
    // Get latest commits
    const commits = execSync('git log --oneline --no-decorate -20', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0);

    const changelog = `# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### Added
- Auto documentation generation
- GitHub Actions workflows
- Pattern registry tracking
- Blocklist management system

### Changed
- Improved documentation structure
- Enhanced metrics tracking

### Fixed
- Various documentation issues

---

## [0.1.0] - 2026-06-03

### Added
- Initial TRIAGE OS setup
- 7-layer architecture
- 4 specialized agents (Code, QA, Research, Risk)
- Pattern library system
- Dynamic blocklist
- Auto-learning loops
- GitHub Actions automation
- Comprehensive documentation

### Documentation
- Architecture specification
- API integration guide
- Low consumption techniques
- Project manifest
- Agent specifications

---

## Recent Commits

\`\`\`
${commits.slice(0, 10).map(c => `${c}`).join('\n')}
\`\`\`

---

**For full details**: See git history with \`git log\`
`;

    fs.writeFileSync('CHANGELOG.md', changelog);
    console.log('✅ CHANGELOG.md generated\n');

  } catch (error) {
    console.warn('⚠️  Could not generate full changelog:', error.message);
    // Create basic changelog even if git fails
    const basicChangelog = `# Changelog

## [0.1.0] - 2026-06-03

### Initial Release
- TRIAGE OS foundation
- Documentation and automation
`;
    fs.writeFileSync('CHANGELOG.md', basicChangelog);
    console.log('✅ Basic CHANGELOG.md created\n');
  }
}

generateChangelog();
