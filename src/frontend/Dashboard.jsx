import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.json())
      .then(d => setMetrics(d.data.slice(-20)));

    const ws = new WebSocket('ws://localhost:3000');
    ws.onmessage = (msg) => {
      const { type, data } = JSON.parse(msg.data);
      if (type === 'event') {
        setMetrics(m => [...m, data[0]].slice(-20));
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>TRIAGE OS Dashboard</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ts" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="tk" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
