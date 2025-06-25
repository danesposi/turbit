/**
 * Random Number Generator Example
 * 
 * This example demonstrates how to use Turbit for parallel generation
 * of random numbers, showcasing basic parallel execution capabilities.
 * 
 * The example shows:
 * - Parallel random number generation
 * - Performance comparison between different power levels
 * - Statistical analysis of generated numbers
 * - Memory-efficient random generation
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
 * Generates a random number with optional range specification
 * @param {number} min - Minimum value (default: 0)
 * @param {number} max - Maximum value (default: 100)
 * @returns {number} Random number in the specified range
 */
const generateRandomNumber = function (min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates multiple random numbers with statistics
 * @returns {Object} Object containing random numbers and statistics
 */
const generateRandomNumbersWithStats = function () {
  const numbers = [];
  const count = Math.floor(Math.random() * 50) + 10; // 10-60 numbers

  for (let i = 0; i < count; i++) {
    numbers.push(generateRandomNumber());
  }

  // Calculate basic statistics
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return {
    numbers: numbers,
    count: numbers.length,
    statistics: {
      sum: sum,
      average: average,
      min: min,
      max: max,
      range: max - min
    }
  };
}

/**
 * Generates random numbers in different ranges
 * @returns {Object} Object containing numbers in different ranges
 */
const generateMultiRangeNumbers = function () {
  return {
    small: generateRandomNumber(1, 10),
    medium: generateRandomNumber(11, 100),
    large: generateRandomNumber(101, 1000),
    decimal: Math.random() * 100
  };
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("🎲 Starting Random Number Generator with Turbit");
  console.log("=".repeat(50));

  try {
    // Test 1: Basic random number generation
    console.log("\n🎯 Test 1: Basic Random Number Generation");
    console.log("-".repeat(40));

    const basicResult = await turbit.run(generateRandomNumber, {
      type: "simple",
      power: 50 // Uses 50% of the available cores
    });

    console.log(`✅ Generated ${basicResult.data.length} random numbers`);
    console.log(`⏱️  Execution time: ${basicResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${basicResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${basicResult.stats.memoryUsed}`);

    // Show sample numbers
    console.log("\n📋 Sample random numbers:");
    basicResult.data.slice(0, 10).forEach((num, index) => {
      console.log(`  ${index + 1}. ${num}`);
    });

    // Test 2: Random numbers with statistics
    console.log("\n\n📊 Test 2: Random Numbers with Statistics");
    console.log("-".repeat(40));

    const statsResult = await turbit.run(generateRandomNumbersWithStats, {
      type: "simple",
      power: 75
    });

    console.log(`✅ Generated ${statsResult.data.length} number sets`);
    console.log(`⏱️  Execution time: ${statsResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${statsResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${statsResult.stats.memoryUsed}`);

    // Show statistics from first few sets
    console.log("\n📈 Sample statistics:");
    statsResult.data.slice(0, 3).forEach((set, index) => {
      console.log(`\n  Set ${index + 1}:`);
      console.log(`    Count: ${set.count} numbers`);
      console.log(`    Average: ${set.statistics.average.toFixed(2)}`);
      console.log(`    Range: ${set.statistics.min} - ${set.statistics.max}`);
      console.log(`    Sum: ${set.statistics.sum}`);
    });

    // Test 3: Multi-range number generation
    console.log("\n\n🎲 Test 3: Multi-Range Number Generation");
    console.log("-".repeat(40));

    const multiRangeResult = await turbit.run(generateMultiRangeNumbers, {
      type: "simple",
      power: 100
    });

    console.log(`✅ Generated ${multiRangeResult.data.length} multi-range sets`);
    console.log(`⏱️  Execution time: ${multiRangeResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${multiRangeResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${multiRangeResult.stats.memoryUsed}`);

    // Show sample multi-range numbers
    console.log("\n📋 Sample multi-range numbers:");
    multiRangeResult.data.slice(0, 3).forEach((set, index) => {
      console.log(`\n  Set ${index + 1}:`);
      console.log(`    Small (1-10): ${set.small}`);
      console.log(`    Medium (11-100): ${set.medium}`);
      console.log(`    Large (101-1000): ${set.large}`);
      console.log(`    Decimal (0-100): ${set.decimal.toFixed(2)}`);
    });

    // Performance analysis
    console.log("\n🎯 Performance Analysis:");
    console.log("• Basic generation is fastest for simple random numbers");
    console.log("• Statistics calculation adds computational overhead");
    console.log("• Multi-range generation provides more variety");
    console.log("• Higher power levels improve throughput for complex operations");

    // Overall statistics
    const totalNumbers = basicResult.data.length +
      statsResult.data.reduce((sum, set) => sum + set.count, 0) +
      multiRangeResult.data.length * 4;

    console.log("\n📈 Overall Statistics:");
    console.log(`• Total random numbers generated: ${totalNumbers}`);
    console.log(`• Combined execution time: ${(basicResult.stats.timeTakenSeconds + statsResult.stats.timeTakenSeconds + multiRangeResult.stats.timeTakenSeconds).toFixed(2)}s`);
    console.log(`• Average numbers per second: ${(totalNumbers / (basicResult.stats.timeTakenSeconds + statsResult.stats.timeTakenSeconds + multiRangeResult.stats.timeTakenSeconds)).toFixed(0)}`);

  } catch (error) {
    console.error("❌ Error during random number generation:", error.message);
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