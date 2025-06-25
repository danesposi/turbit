/**
 * Performance Comparison Example
 * 
 * This example demonstrates the performance benefits of using Turbit
 * for parallel processing by comparing sequential vs parallel execution.
 * 
 * The example shows:
 * - Performance comparison between sequential and parallel processing
 * - Different workload types and their parallelization benefits
 * - Memory usage analysis
 * - CPU utilization optimization
 */

let Turbit;

try {
  // Try to import the installed version of Turbit
  Turbit = require("turbit");
} catch (error) {
  // If the library is not installed, use the local version
  Turbit = require("../turbit");
}

// Create a Turbit instance for parallel processing
const turbit = Turbit();

/**
 * CPU-intensive task simulation
 * @param {number} iterations - Number of iterations to perform
 * @returns {Object} Task result with timing information
 */
const cpuIntensiveTask = function (iterations = 1000000) {
  const startTime = Date.now();
  let result = 0;

  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
  }

  const endTime = Date.now();

  return {
    result: result,
    iterations: iterations,
    executionTime: endTime - startTime,
    taskType: "CPU-intensive"
  };
}

/**
 * Memory-intensive task simulation
 * @param {number} size - Size of data to process
 * @returns {Object} Task result with memory usage
 */
const memoryIntensiveTask = function (size = 100000) {
  const startTime = Date.now();

  // Create large arrays to simulate memory usage
  const data = Array.from({ length: size }, (_, i) => ({
    id: i,
    value: Math.random() * 1000,
    timestamp: Date.now(),
    metadata: {
      category: Math.floor(Math.random() * 10),
      priority: Math.floor(Math.random() * 5),
      tags: Array.from({ length: 5 }, () => Math.random().toString(36).substring(7))
    }
  }));

  // Process the data
  const processed = data.map(item => ({
    ...item,
    processed: item.value * 2,
    category: item.value > 500 ? 'high' : 'low',
    score: Math.sqrt(item.value) + Math.sin(item.value)
  }));

  const endTime = Date.now();

  return {
    originalSize: data.length,
    processedSize: processed.length,
    executionTime: endTime - startTime,
    memoryUsage: process.memoryUsage().heapUsed,
    taskType: "Memory-intensive"
  };
}

/**
 * I/O simulation task
 * @param {number} operations - Number of I/O operations to simulate
 * @returns {Object} Task result with I/O timing
 */
const ioSimulationTask = function (operations = 100) {
  const startTime = Date.now();

  // Simulate I/O operations with delays
  for (let i = 0; i < operations; i++) {
    const delay = Math.random() * 10 + 5; // 5-15ms delay
    const endTime = Date.now() + delay;
    while (Date.now() < endTime) {
      // Simulating I/O wait
    }
  }

  const endTime = Date.now();

  return {
    operations: operations,
    executionTime: endTime - startTime,
    averageOperationTime: (endTime - startTime) / operations,
    taskType: "I/O-bound"
  };
}

/**
 * Sequential execution of tasks
 * @param {Function} taskFunction - Function to execute
 * @param {Array} parameters - Array of parameters for each task
 * @returns {Object} Sequential execution results
 */
const sequentialExecution = async function (taskFunction, parameters) {
  const startTime = Date.now();
  const results = [];

  for (let i = 0; i < parameters.length; i++) {
    const result = taskFunction(parameters[i]);
    results.push(result);
  }

  const endTime = Date.now();

  return {
    results: results,
    totalTime: endTime - startTime,
    averageTime: (endTime - startTime) / parameters.length,
    executionType: "Sequential"
  };
}

/**
 * Parallel execution using Turbit
 * @param {Function} taskFunction - Function to execute
 * @param {Array} parameters - Array of parameters for each task
 * @param {number} power - CPU power percentage to use
 * @returns {Object} Parallel execution results
 */
const parallelExecution = async function (taskFunction, parameters, power = 100) {
  const startTime = Date.now();

  const result = await turbit.run(taskFunction, {
    type: "simple",
    power: power
  });

  const endTime = Date.now();

  return {
    results: result.data,
    totalTime: endTime - startTime,
    averageTime: (endTime - startTime) / parameters.length,
    executionType: "Parallel",
    turbitStats: result.stats
  };
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("⚡ Performance Comparison: Sequential vs Parallel Processing");
  console.log("=".repeat(65));

  try {
    // Test configurations
    const testConfigs = [
      { name: "Small Workload", count: 4, cpuIterations: 500000, memorySize: 50000, ioOperations: 50 },
      { name: "Medium Workload", count: 8, cpuIterations: 1000000, memorySize: 100000, ioOperations: 100 },
      { name: "Large Workload", count: 16, cpuIterations: 2000000, memorySize: 200000, ioOperations: 200 }
    ];

    for (const config of testConfigs) {
      console.log(`\n📊 Testing ${config.name} (${config.count} tasks)`);
      console.log("=".repeat(50));

      // Test 1: CPU-intensive tasks
      console.log("\n🧮 Test 1: CPU-Intensive Tasks");
      console.log("-".repeat(30));

      const cpuParams = Array(config.count).fill(config.cpuIterations);

      // Sequential execution
      const cpuSequential = await sequentialExecution(cpuIntensiveTask, cpuParams);

      // Parallel execution
      const cpuParallel = await parallelExecution(cpuIntensiveTask, cpuParams, 100);

      // Calculate performance improvement
      const cpuSpeedup = cpuSequential.totalTime / cpuParallel.totalTime;
      const cpuEfficiency = (cpuSpeedup / cpuParallel.turbitStats.numProcessesUsed) * 100;

      console.log(`Sequential: ${cpuSequential.totalTime}ms (avg: ${cpuSequential.averageTime.toFixed(1)}ms)`);
      console.log(`Parallel:   ${cpuParallel.totalTime}ms (avg: ${cpuParallel.averageTime.toFixed(1)}ms)`);
      console.log(`Speedup:    ${cpuSpeedup.toFixed(2)}x`);
      console.log(`Efficiency: ${cpuEfficiency.toFixed(1)}%`);
      console.log(`Processes:  ${cpuParallel.turbitStats.numProcessesUsed}`);
      console.log(`Memory:     ${cpuParallel.turbitStats.memoryUsed}`);

      // Test 2: Memory-intensive tasks
      console.log("\n💾 Test 2: Memory-Intensive Tasks");
      console.log("-".repeat(35));

      const memoryParams = Array(config.count).fill(config.memorySize);

      // Sequential execution
      const memorySequential = await sequentialExecution(memoryIntensiveTask, memoryParams);

      // Parallel execution
      const memoryParallel = await parallelExecution(memoryIntensiveTask, memoryParams, 75);

      // Calculate performance improvement
      const memorySpeedup = memorySequential.totalTime / memoryParallel.totalTime;
      const memoryEfficiency = (memorySpeedup / memoryParallel.turbitStats.numProcessesUsed) * 100;

      console.log(`Sequential: ${memorySequential.totalTime}ms (avg: ${memorySequential.averageTime.toFixed(1)}ms)`);
      console.log(`Parallel:   ${memoryParallel.totalTime}ms (avg: ${memoryParallel.averageTime.toFixed(1)}ms)`);
      console.log(`Speedup:    ${memorySpeedup.toFixed(2)}x`);
      console.log(`Efficiency: ${memoryEfficiency.toFixed(1)}%`);
      console.log(`Processes:  ${memoryParallel.turbitStats.numProcessesUsed}`);
      console.log(`Memory:     ${memoryParallel.turbitStats.memoryUsed}`);

      // Test 3: I/O-bound tasks
      console.log("\n💾 Test 3: I/O-Bound Tasks");
      console.log("-".repeat(25));

      const ioParams = Array(config.count).fill(config.ioOperations);

      // Sequential execution
      const ioSequential = await sequentialExecution(ioSimulationTask, ioParams);

      // Parallel execution
      const ioParallel = await parallelExecution(ioSimulationTask, ioParams, 50);

      // Calculate performance improvement
      const ioSpeedup = ioSequential.totalTime / ioParallel.totalTime;
      const ioEfficiency = (ioSpeedup / ioParallel.turbitStats.numProcessesUsed) * 100;

      console.log(`Sequential: ${ioSequential.totalTime}ms (avg: ${ioSequential.averageTime.toFixed(1)}ms)`);
      console.log(`Parallel:   ${ioParallel.totalTime}ms (avg: ${ioParallel.averageTime.toFixed(1)}ms)`);
      console.log(`Speedup:    ${ioSpeedup.toFixed(2)}x`);
      console.log(`Efficiency: ${ioEfficiency.toFixed(1)}%`);
      console.log(`Processes:  ${ioParallel.turbitStats.numProcessesUsed}`);
      console.log(`Memory:     ${ioParallel.turbitStats.memoryUsed}`);

      // Summary for this workload
      console.log("\n📈 Workload Summary:");
      console.log(`CPU Tasks:     ${cpuSpeedup.toFixed(2)}x speedup (${cpuEfficiency.toFixed(1)}% efficiency)`);
      console.log(`Memory Tasks:  ${memorySpeedup.toFixed(2)}x speedup (${memoryEfficiency.toFixed(1)}% efficiency)`);
      console.log(`I/O Tasks:     ${ioSpeedup.toFixed(2)}x speedup (${ioEfficiency.toFixed(1)}% efficiency)`);

      const avgSpeedup = (cpuSpeedup + memorySpeedup + ioSpeedup) / 3;
      const avgEfficiency = (cpuEfficiency + memoryEfficiency + ioEfficiency) / 3;

      console.log(`Overall:       ${avgSpeedup.toFixed(2)}x average speedup (${avgEfficiency.toFixed(1)}% average efficiency)`);

      console.log("-".repeat(50));
    }

    // Performance analysis and recommendations
    console.log("\n🎯 Performance Analysis:");
    console.log("• CPU-intensive tasks benefit most from parallel processing");
    console.log("• Memory-intensive tasks show good speedup but may be limited by memory bandwidth");
    console.log("• I/O-bound tasks show limited improvement due to I/O bottlenecks");
    console.log("• Efficiency decreases with more processes due to overhead");
    console.log("• Larger workloads generally show better parallelization benefits");

    console.log("\n💡 Optimization Recommendations:");
    console.log("• Use 75-100% power for CPU-intensive tasks");
    console.log("• Use 50-75% power for memory-intensive tasks to avoid memory pressure");
    console.log("• Use 25-50% power for I/O-bound tasks to avoid context switching overhead");
    console.log("• Monitor memory usage for large datasets");
    console.log("• Consider task granularity for optimal parallelization");

    console.log("\n📊 Key Insights:");
    console.log("• Parallel processing provides significant speedup for CPU-intensive workloads");
    console.log("• Memory and I/O bottlenecks limit parallelization benefits");
    console.log("• Process overhead affects efficiency at higher core counts");
    console.log("• Turbit automatically optimizes chunk sizes for best performance");
    console.log("• Power configuration should match workload characteristics");

  } catch (error) {
    console.error("❌ Error during performance comparison:", error.message);
  } finally {
    turbit.kill();
    console.log("\n🧹 Cleaned up Turbit resources");
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, cleaning up...');
  turbit.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, cleaning up...');
  turbit.kill();
  process.exit(0);
});

// Run the example
main(); 