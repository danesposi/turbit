/**
 * Fibonacci Calculator Example
 * 
 * This example demonstrates how to use Turbit for parallel computation
 * of Fibonacci numbers, which is a CPU-intensive mathematical operation.
 * 
 * The example shows:
 * - Parallel execution of mathematical calculations
 * - Performance comparison between different power levels
 * - Error handling for computational tasks
 * - Memory management for large calculations
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
 * Calculates the nth Fibonacci number using iterative approach
 * This is more efficient than recursive for large numbers
 * @param {number} n - The position in the Fibonacci sequence
 * @returns {number} The Fibonacci number at position n
 */
const calculateFibonacci = function (n) {
  if (n <= 1) return n;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

/**
 * Generates a random Fibonacci position for calculation
 * @returns {number} A random number between 30 and 45
 */
const generateRandomPosition = function () {
  return Math.floor(Math.random() * 16) + 30; // 30 to 45
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("🚀 Starting Fibonacci Calculator with Turbit");
  console.log("=".repeat(50));

  try {
    // Test with different power levels to show performance differences
    const powerLevels = [25, 50, 75, 100];

    for (const power of powerLevels) {
      console.log(`\n📊 Testing with ${power}% CPU power...`);

      const result = await turbit.run(generateRandomPosition, {
        type: "simple",
        power: power
      });

      // Calculate Fibonacci for each random position
      const fibonacciResults = result.data.map(position => {
        const startTime = Date.now();
        const fibNumber = calculateFibonacci(position);
        const endTime = Date.now();

        return {
          position: position,
          fibonacci: fibNumber,
          calculationTime: endTime - startTime
        };
      });

      // Display results
      console.log(`✅ Completed ${fibonacciResults.length} calculations`);
      console.log(`⏱️  Total execution time: ${result.stats.timeTakenSeconds}s`);
      console.log(`🖥️  Processes used: ${result.stats.numProcessesUsed}`);
      console.log(`💾 Memory used: ${result.stats.memoryUsed}`);

      // Show sample calculations
      console.log("\n📋 Sample calculations:");
      fibonacciResults.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. F(${result.position}) = ${result.fibonacci} (${result.calculationTime}ms)`);
      });

      console.log("-".repeat(30));
    }

    console.log("\n🎯 Performance Analysis:");
    console.log("• Higher power levels generally result in faster execution");
    console.log("• Memory usage increases with more processes");
    console.log("• For CPU-intensive tasks, 75-100% power is recommended");

  } catch (error) {
    console.error("❌ Error during Fibonacci calculation:", error.message);
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