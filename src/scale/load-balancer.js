class LoadBalancer {
  constructor() {
    this.workers = new Map();
    this.queue = [];
    this.current = 0;
  }

  registerWorker(id, capacity, type = 'agent') {
    this.workers.set(id, {
      id,
      capacity,
      type,
      current_load: 0,
      tasks: []
    });
  }

  selectWorker(taskType) {
    let minLoad = Infinity;
    let selected = null;
    
    for (const [_, worker] of this.workers) {
      if (worker.current_load < minLoad) {
        minLoad = worker.current_load;
        selected = worker;
      }
    }
    
    return selected;
  }

  assignTask(task, taskType) {
    const worker = this.selectWorker(taskType);
    
    if (!worker) {
      this.queue.push(task);
      return { status: 'queued' };
    }
    
    if (worker.current_load >= worker.capacity) {
      this.queue.push(task);
      return { status: 'queued' };
    }
    
    worker.current_load++;
    worker.tasks.push(task);
    
    return {
      status: 'assigned',
      worker: worker.id,
      load: worker.current_load
    };
  }

  getMetrics() {
    let total_load = 0;
    let total_capacity = 0;
    
    for (const [_, worker] of this.workers) {
      total_load += worker.current_load;
      total_capacity += worker.capacity;
    }
    
    return {
      workers_count: this.workers.size,
      total_capacity,
      total_load,
      queue_length: this.queue.length,
      avg_load: this.workers.size > 0 ? total_load / this.workers.size : 0
    };
  }
}

module.exports = LoadBalancer;
