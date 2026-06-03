/**
 * Phase 4: Load Balancer
 * Distributes tasks across agents & resources
 */

class LoadBalancer {
  constructor() {
    this.workers = new Map();
    this.queue = [];
    this.distribution = { round_robin: 0 };
  }

  registerWorker(id, capacity, type = 'agent') {
    this.workers.set(id, {
      id,
      type,
      capacity,
      current_load: 0,
      completed: 0,
      health: 'healthy'
    });
  }

  getWorkerLoad(id) {
    return this.workers.get(id)?.current_load || 0;
  }

  selectWorker(taskType) {
    const candidates = Array.from(this.workers.values())
      .filter(w => w.health === 'healthy' && w.current_load < w.capacity);

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.current_load - b.current_load);
    return candidates[0];
  }

  assignTask(task, taskType) {
    const worker = this.selectWorker(taskType);
    if (!worker) {
      this.queue.push({ task, taskType, queued_at: Date.now() });
      return { status: 'queued', worker: null };
    }

    worker.current_load++;
    return { status: 'assigned', worker: worker.id };
  }

  completeTask(workerId) {
    const worker = this.workers.get(workerId);
    if (worker) {
      worker.current_load = Math.max(0, worker.current_load - 1);
      worker.completed++;
    }

    if (this.queue.length > 0) {
      const next = this.queue.shift();
      return this.assignTask(next.task, next.taskType);
    }
    return null;
  }

  getMetrics() {
    const workers = Array.from(this.workers.values());
    const totalCapacity = workers.reduce((sum, w) => sum + w.capacity, 0);
    const totalLoad = workers.reduce((sum, w) => sum + w.current_load, 0);
    const avgLoad = totalLoad / workers.length || 0;

    return {
      workers_count: workers.length,
      total_capacity: totalCapacity,
      current_load: totalLoad,
      queue_size: this.queue.length,
      avg_load: avgLoad.toFixed(2),
      utilization: ((totalLoad / totalCapacity) * 100).toFixed(1) + '%'
    };
  }
}

module.exports = LoadBalancer;
