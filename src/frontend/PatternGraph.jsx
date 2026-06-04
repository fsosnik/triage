import React, { useEffect, useState } from 'react';

export function PatternGraph() {
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    fetch('/api/patterns')
      .then(r => r.json())
      .then(d => setPatterns(d.data));
  }, []);

  // Graphify para visualizar patrones
  return (
    <div>
      <h3>Pattern Network</h3>
      {/* Aquí renderizar con Graphify si es necesario */}
      {patterns.map(p => (
        <div key={p.id}>
          {p.id}: {p.sr}% - Agents: {p.a}
        </div>
      ))}
    </div>
  );
}
