const Benchmark = require('../src/benchmark/benchmark');
const Profiler = require('../src/benchmark/profiler');
const LoadTest = require('../src/benchmark/load-test');

describe('Phase 14: Performance Benchmarking', () => {
  
  test('Benchmark should measure function', async () => {
    const bench = new Benchmark('test');
    const result = await bench.run(async () => { }, 10);
    expect(result.times.avg).toBeGreaterThan(0);
  });

  test('should calculate median', async () => {
    const bench = new Benchmark('test');
    const median = bench.median([1, 2, 3, 4, 5]);
    expect(median).toBe(3);
  });

  test('Profiler should mark and measure', () => {
    const profiler = new Profiler();
    profiler.start('test');
    profiler.end('test');
    expect(profiler.measures.length).toBe(1);
  });

  test('should get report', () => {
    const profiler = new Profiler();
    profiler.start('op1');
    profiler.end('op1');
    const report = profiler.getReport();
    expect(report.summary).toBeDefined();
  });

  test('LoadTest should run concurrent operations', async () => {
    const load = new LoadTest(5);
    const result = await load.run(async () => true, 10);
    expect(result.successful).toBe(10);
  });

  test('should calculate throughput', async () => {
    const load = new LoadTest(5);
    const result = await load.run(async () => true, 20);
    expect(result.ops_per_sec).toBeDefined();
  });
});
