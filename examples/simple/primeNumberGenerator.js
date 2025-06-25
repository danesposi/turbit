/**
 * Prime Number Generator Example
 * 
 * This example demonstrates how to use Turbit for parallel generation
 * and testing of prime numbers, showcasing algorithm optimization.
 * 
 * The example shows:
 * - Parallel prime number generation
 * - Performance optimization for mathematical algorithms
 * - Different prime testing strategies
 * - Memory-efficient number generation
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
 * Efficient primality test using trial division
 * @param {number} n - Number to test for primality
 * @returns {boolean} True if prime, false otherwise
 */
const isPrime = function (n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  // Only test odd divisors up to square root
  const sqrt = Math.sqrt(n);
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Generates a random number in a specified range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number in range
 */
const generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random number and tests if it's prime
 * @returns {Object} Object containing the number and primality status
 */
const generateAndTestPrime = function () {
  const number = generateRandomNumber(1000, 100000);
  const startTime = Date.now();
  const prime = isPrime(number);
  const endTime = Date.now();

  return {
    number: number,
    isPrime: prime,
    testTime: endTime - startTime
  };
}

/**
 * Generates a sequence of numbers and finds primes
 * @returns {Object} Object containing primes found and statistics
 */
const findPrimesInRange = function () {
  const start = generateRandomNumber(1000, 5000);
  const end = start + generateRandomNumber(100, 500);
  const primes = [];
  const startTime = Date.now();

  for (let i = start; i <= end; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }

  const endTime = Date.now();

  return {
    range: { start, end },
    primes: primes,
    count: primes.length,
    searchTime: endTime - startTime
  };
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("🔢 Starting Prime Number Generator with Turbit");
  console.log("=".repeat(55));

  try {
    // Test 1: Individual prime testing
    console.log("\n🧪 Test 1: Individual Prime Testing");
    console.log("-".repeat(35));

    const individualResult = await turbit.run(generateAndTestPrime, {
      type: "simple",
      power: 75
    });

    const primesFound = individualResult.data.filter(result => result.isPrime);
    const averageTestTime = individualResult.data.reduce((sum, result) =>
      sum + result.testTime, 0) / individualResult.data.length;

    console.log(`✅ Tested ${individualResult.data.length} numbers`);
    console.log(`🔍 Found ${primesFound.length} primes`);
    console.log(`⏱️  Average test time: ${averageTestTime.toFixed(2)}ms`);
    console.log(`🖥️  Processes used: ${individualResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${individualResult.stats.memoryUsed}`);

    // Show some prime numbers found
    if (primesFound.length > 0) {
      console.log("\n📋 Sample prime numbers found:");
      primesFound.slice(0, 5).forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.number} (tested in ${result.testTime}ms)`);
      });
    }

    // Test 2: Range-based prime finding
    console.log("\n\n🔍 Test 2: Range-based Prime Finding");
    console.log("-".repeat(35));

    const rangeResult = await turbit.run(findPrimesInRange, {
      type: "simple",
      power: 100
    });

    const totalPrimes = rangeResult.data.reduce((sum, result) => sum + result.count, 0);
    const averageSearchTime = rangeResult.data.reduce((sum, result) =>
      sum + result.searchTime, 0) / rangeResult.data.length;

    console.log(`✅ Searched ${rangeResult.data.length} ranges`);
    console.log(`🔍 Found ${totalPrimes} primes total`);
    console.log(`⏱️  Average search time: ${averageSearchTime.toFixed(2)}ms`);
    console.log(`🖥️  Processes used: ${rangeResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${rangeResult.stats.memoryUsed}`);

    // Show range with most primes
    const bestRange = rangeResult.data.reduce((best, current) =>
      current.count > best.count ? current : best);

    console.log("\n📊 Best performing range:");
    console.log(`  Range: ${bestRange.range.start} - ${bestRange.range.end}`);
    console.log(`  Primes found: ${bestRange.count}`);
    console.log(`  Search time: ${bestRange.searchTime}ms`);

    // Performance analysis
    console.log("\n🎯 Performance Analysis:");
    console.log("• Individual testing is faster for single numbers");
    console.log("• Range searching is more efficient for finding multiple primes");
    console.log("• Higher power levels improve performance for CPU-intensive tasks");
    console.log("• Memory usage scales with the number of processes");

    // Show overall statistics
    console.log("\n📈 Overall Statistics:");
    console.log(`• Total execution time: ${individualResult.stats.timeTakenSeconds + rangeResult.stats.timeTakenSeconds}s`);
    console.log(`• Total primes discovered: ${primesFound.length + totalPrimes}`);
    console.log(`• Combined memory usage: ${individualResult.stats.memoryUsed}`);

  } catch (error) {
    console.error("❌ Error during prime number generation:", error.message);
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