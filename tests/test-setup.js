beforeEach(() => {
  // Clear all maps/arrays before each test
  if (global.testState) {
    global.testState.clear();
  }
});

afterEach(() => {
  // Cleanup
  jest.clearAllMocks();
});
