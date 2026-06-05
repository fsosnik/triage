(async () => {
  const { default: TriageOS } = await import('triage-os');
  
  const os = new TriageOS();
  const result = await os.process({
    task: "Implementar autenticación",
    context: "Node.js + Express"
  });
  
  console.log('✅ Result:', result);
})().catch(console.error);
