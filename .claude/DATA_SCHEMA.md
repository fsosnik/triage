# Data Schemas

## TrendAnalyzer
- Input: metric name + array de valores [0.8, 0.85, 0.9]
- Output: 'improving' | 'stable' | 'declining'

## PerformanceProfiler  
- recordCycle(data) → push to array
- analyze() → { cycles: length, efficiency: score }

## GraphifyAdapter
- compressEvents(events) → { t, s, tk, tm }
- compressPatterns(patterns) → { id, sr, a }

[etc]
