/**
 * Task Runner Example
 * 
 * This example demonstrates how to use Turbit as a basic task runner
 * for executing various types of tasks in parallel.
 * 
 * The example shows:
 * - Basic task execution patterns
 * - Different types of tasks (computation, I/O simulation, data processing)
 * - Error handling and resource management
 * - Performance monitoring and reporting
 */

let Turbit;

try {
  // Try to import the installed version of Turbit
  Turbit = require("turbit");
} catch (error) {
  // If the library is not installed, use the local version
  Turbit = require("../../turbit");
}

// Create a Turbit instance for parallel processing
const turbit = Turbit();

/**
 * Simple greeting task
 * @returns {string} A greeting message
 */
const greetingTask = function () {
  return "Hello, humans and intelligent machines!";
}

/**
 * CPU-intensive computation task
 * @returns {Object} Computation result with timing
 */
const computationTask = function () {
  const startTime = Date.now();

  // Simulate CPU-intensive work
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }

  const endTime = Date.now();

  return {
    result: result,
    computationTime: endTime - startTime,
    taskType: "CPU-intensive"
  };
}

/**
 * I/O simulation task
 * @returns {Object} I/O simulation result
 */
const ioSimulationTask = function () {
  const startTime = Date.now();

  // Simulate I/O delay
  const delay = Math.random() * 100 + 50; // 50-150ms
  const endTime = Date.now() + delay;

  // Busy wait to simulate I/O
  while (Date.now() < endTime) {
    // Simulating I/O operation
  }

  return {
    operation: "I/O simulation",
    delay: delay,
    actualTime: Date.now() - startTime,
    taskType: "I/O-bound"
  };
}

/**
 * Data processing task
 * @returns {Object} Processed data result
 */
const dataProcessingTask = function () {
  const startTime = Date.now();

  // Generate and process some data
  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: Math.random() * 100,
    timestamp: Date.now()
  }));

  // Process the data
  const processed = data.map(item => ({
    ...item,
    processed: item.value * 2,
    category: item.value > 50 ? 'high' : 'low'
  }));

  const endTime = Date.now();

  return {
    originalCount: data.length,
    processedCount: processed.length,
    processingTime: endTime - startTime,
    taskType: "Data processing"
  };
}

/**
 * Error-prone task for testing error handling
 * @returns {string} Success message or throws error
 */
const errorProneTask = function () {
  const random = Math.random();

  if (random < 0.3) {
    throw new Error("Simulated task failure");
  }

  return "Task completed successfully";
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("⚡ Starting Task Runner with Turbit");
  console.log("=".repeat(45));

  try {
    // Test 1: Simple greeting task
    console.log("\n👋 Test 1: Simple Greeting Task");
    console.log("-".repeat(30));

    const greetingResult = await turbit.run(greetingTask, {
      type: "simple",
      power: 100
    });

    console.log("✅ Greeting task completed");
    console.log(`📝 Results: ${greetingResult.data.length} greetings`);
    console.log(`⏱️  Execution time: ${greetingResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${greetingResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${greetingResult.stats.memoryUsed}`);

    // Show sample greetings
    console.log("\n📋 Sample greetings:");
    greetingResult.data.slice(0, 3).forEach((greeting, index) => {
      console.log(`  ${index + 1}. ${greeting}`);
    });

    // Test 2: CPU-intensive computation
    console.log("\n\n🧮 Test 2: CPU-Intensive Computation");
    console.log("-".repeat(35));

    const computationResult = await turbit.run(computationTask, {
      type: "simple",
      power: 75
    });

    console.log("✅ Computation tasks completed");
    console.log(`📊 Tasks executed: ${computationResult.data.length}`);
    console.log(`⏱️  Total execution time: ${computationResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${computationResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${computationResult.stats.memoryUsed}`);

    // Show computation statistics
    const avgComputationTime = computationResult.data.reduce((sum, task) =>
      sum + task.computationTime, 0) / computationResult.data.length;

    console.log(`\n📈 Average computation time: ${avgComputationTime.toFixed(2)}ms`);
    console.log(`📊 Sample result: ${computationResult.data[0].result.toFixed(2)}`);

    // Test 3: I/O simulation
    console.log("\n\n💾 Test 3: I/O Simulation");
    console.log("-".repeat(25));

    const ioResult = await turbit.run(ioSimulationTask, {
      type: "simple",
      power: 50
    });

    console.log("✅ I/O simulation completed");
    console.log(`📊 Tasks executed: ${ioResult.data.length}`);
    console.log(`⏱️  Total execution time: ${ioResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${ioResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${ioResult.stats.memoryUsed}`);

    // Show I/O statistics
    const avgDelay = ioResult.data.reduce((sum, task) =>
      sum + task.delay, 0) / ioResult.data.length;

    console.log(`\n📈 Average simulated delay: ${avgDelay.toFixed(2)}ms`);

    // Test 4: Data processing
    console.log("\n\n📊 Test 4: Data Processing");
    console.log("-".repeat(25));

    const dataResult = await turbit.run(dataProcessingTask, {
      type: "simple",
      power: 100
    });

    console.log("✅ Data processing completed");
    console.log(`📊 Tasks executed: ${dataResult.data.length}`);
    console.log(`⏱️  Total execution time: ${dataResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${dataResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${dataResult.stats.memoryUsed}`);

    // Show data processing statistics
    const totalProcessed = dataResult.data.reduce((sum, task) =>
      sum + task.processedCount, 0);

    console.log(`\n📈 Total items processed: ${totalProcessed}`);
    console.log(`📊 Average processing time: ${(dataResult.data.reduce((sum, task) =>
      sum + task.processingTime, 0) / dataResult.data.length).toFixed(2)}ms`);

    // Test 5: Error handling
    console.log("\n\n⚠️  Test 5: Error Handling");
    console.log("-".repeat(25));

    try {
      const errorResult = await turbit.run(errorProneTask, {
        type: "simple",
        power: 25
      });

      console.log("✅ Error handling test completed");
      console.log(`📊 Tasks executed: ${errorResult.data.length}`);

      const successCount = errorResult.data.filter(result =>
        typeof result === 'string' && result.includes('successfully')).length;

      console.log(`✅ Successful tasks: ${successCount}`);
      console.log(`❌ Failed tasks: ${errorResult.data.length - successCount}`);

    } catch (error) {
      console.log("❌ Error handling test failed as expected");
      console.log(`📝 Error message: ${error.message}`);
    }

    // Performance analysis
    console.log("\n🎯 Performance Analysis:");
    console.log("• Simple tasks execute fastest with minimal overhead");
    console.log("• CPU-intensive tasks benefit most from parallel processing");
    console.log("• I/O-bound tasks show limited improvement with parallelism");
    console.log("• Data processing scales well with available cores");
    console.log("• Error handling ensures robust task execution");

    // Overall statistics
    const totalTasks = greetingResult.data.length +
      computationResult.data.length +
      ioResult.data.length +
      dataResult.data.length;

    console.log("\n📈 Overall Statistics:");
    console.log(`• Total tasks executed: ${totalTasks}`);
    console.log(`• Combined execution time: ${(greetingResult.stats.timeTakenSeconds + computationResult.stats.timeTakenSeconds + ioResult.stats.timeTakenSeconds + dataResult.stats.timeTakenSeconds).toFixed(2)}s`);
    console.log(`• Average tasks per second: ${(totalTasks / (greetingResult.stats.timeTakenSeconds + computationResult.stats.timeTakenSeconds + ioResult.stats.timeTakenSeconds + dataResult.stats.timeTakenSeconds)).toFixed(0)}`);

  } catch (error) {
    console.error("❌ Error in task runner:", error.message);
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