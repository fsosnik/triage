class TimeoutManager {
  executeWithTimeout(fn, timeout = 30000) {
    return Promise.race([
      fn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), timeout)
      )
    ]);
  }
}

module.exports = TimeoutManager;
