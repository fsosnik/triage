classifyTaskType(task) {
  const t = task.toLowerCase();
  if (t.includes('refactor')) return 'refactor';  // Check FIRST
  if (t.includes('bug') || t.includes('fix')) return 'bugfix';
  if (t.includes('feature')) return 'feature';
  return 'unknown';
}
