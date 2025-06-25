/**
 * Image Processing Simulator Example
 * 
 * This example demonstrates how to use Turbit for parallel image processing
 * simulation, showcasing media processing capabilities.
 * 
 * The example shows:
 * - Parallel image processing operations
 * - Different image transformation algorithms
 * - Performance optimization for media processing
 * - Memory-efficient image data handling
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
 * Simulates an image with pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Object} Simulated image object
 */
const createSimulatedImage = function (width, height) {
  const pixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixels.push({
        x: x,
        y: y,
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
        a: 255
      });
    }
  }

  return {
    width: width,
    height: height,
    pixels: pixels,
    size: width * height
  };
}

/**
 * Applies grayscale filter to image pixels
 * @param {Array} imageChunk - Chunk of image pixels
 * @returns {Array} Processed pixels
 */
const applyGrayscale = function (imageChunk) {
  return imageChunk.map(pixel => {
    const gray = Math.round(0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b);
    return {
      ...pixel,
      r: gray,
      g: gray,
      b: gray
    };
  });
}

/**
 * Applies brightness adjustment to image pixels
 * @param {Object} input - Input object with data and args
 * @returns {Array} Processed pixels
 */
const adjustBrightness = function (input) {
  const { data, args } = input;
  const { factor } = args;

  return data.map(pixel => ({
    ...pixel,
    r: Math.min(255, Math.max(0, Math.round(pixel.r * factor))),
    g: Math.min(255, Math.max(0, Math.round(pixel.g * factor))),
    b: Math.min(255, Math.max(0, Math.round(pixel.b * factor)))
  }));
}

/**
 * Applies blur effect to image pixels
 * @param {Array} imageChunk - Chunk of image pixels
 * @returns {Array} Processed pixels
 */
const applyBlur = function (imageChunk) {
  return imageChunk.map(pixel => {
    // Simple blur simulation - average with neighboring pixels
    const blurFactor = 0.8;
    const r = Math.round(pixel.r * blurFactor + (255 - pixel.r) * (1 - blurFactor));
    const g = Math.round(pixel.g * blurFactor + (255 - pixel.g) * (1 - blurFactor));
    const b = Math.round(pixel.b * blurFactor + (255 - pixel.b) * (1 - blurFactor));

    return {
      ...pixel,
      r: r,
      g: g,
      b: b
    };
  });
}

/**
 * Applies edge detection to image pixels
 * @param {Array} imageChunk - Chunk of image pixels
 * @returns {Array} Processed pixels
 */
const applyEdgeDetection = function (imageChunk) {
  return imageChunk.map(pixel => {
    // Simple edge detection simulation
    const intensity = (pixel.r + pixel.g + pixel.b) / 3;
    const edge = intensity > 128 ? 255 : 0;

    return {
      ...pixel,
      r: edge,
      g: edge,
      b: edge
    };
  });
}

/**
 * Calculates image statistics
 * @param {Array} imageChunk - Chunk of image pixels
 * @returns {Object} Image statistics
 */
const calculateImageStats = function (imageChunk) {
  const totalPixels = imageChunk.length;
  let totalR = 0, totalG = 0, totalB = 0;
  let maxR = 0, maxG = 0, maxB = 0;
  let minR = 255, minG = 255, minB = 255;

  imageChunk.forEach(pixel => {
    totalR += pixel.r;
    totalG += pixel.g;
    totalB += pixel.b;

    maxR = Math.max(maxR, pixel.r);
    maxG = Math.max(maxG, pixel.g);
    maxB = Math.max(maxB, pixel.b);

    minR = Math.min(minR, pixel.r);
    minG = Math.min(minG, pixel.g);
    minB = Math.min(minB, pixel.b);
  });

  return {
    totalPixels: totalPixels,
    averageR: totalR / totalPixels,
    averageG: totalG / totalPixels,
    averageB: totalB / totalPixels,
    maxR: maxR,
    maxG: maxG,
    maxB: maxB,
    minR: minR,
    minG: minG,
    minB: minB
  };
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("🖼️  Starting Image Processing Simulator with Turbit");
  console.log("=".repeat(55));

  try {
    // Generate test images of different sizes
    const testImages = [
      { name: "Small", width: 100, height: 100 },
      { name: "Medium", width: 300, height: 300 },
      { name: "Large", width: 500, height: 500 }
    ];

    for (const imageConfig of testImages) {
      console.log(`\n📸 Processing ${imageConfig.name} Image (${imageConfig.width}x${imageConfig.height})`);
      console.log("-".repeat(50));

      const image = createSimulatedImage(imageConfig.width, imageConfig.height);
      console.log(`✅ Generated image with ${image.pixels.length} pixels`);

      // Test 1: Grayscale conversion
      console.log("\n🎨 Test 1: Grayscale Conversion");
      const grayscaleResult = await turbit.run(applyGrayscale, {
        type: "extended",
        data: image.pixels,
        power: 75
      });

      console.log(`✅ Processed ${grayscaleResult.data.length} pixels`);
      console.log(`⏱️  Execution time: ${grayscaleResult.stats.timeTakenSeconds}s`);
      console.log(`🖥️  Processes used: ${grayscaleResult.stats.numProcessesUsed}`);
      console.log(`💾 Memory used: ${grayscaleResult.stats.memoryUsed}`);

      // Test 2: Brightness adjustment
      console.log("\n💡 Test 2: Brightness Adjustment");
      const brightnessResult = await turbit.run(adjustBrightness, {
        type: "extended",
        data: image.pixels,
        args: { factor: 1.5 }, // Increase brightness by 50%
        power: 100
      });

      console.log(`✅ Processed ${brightnessResult.data.length} pixels`);
      console.log(`⏱️  Execution time: ${brightnessResult.stats.timeTakenSeconds}s`);
      console.log(`🖥️  Processes used: ${brightnessResult.stats.numProcessesUsed}`);
      console.log(`💾 Memory used: ${brightnessResult.stats.memoryUsed}`);

      // Test 3: Blur effect
      console.log("\n🌫️  Test 3: Blur Effect");
      const blurResult = await turbit.run(applyBlur, {
        type: "extended",
        data: image.pixels,
        power: 50
      });

      console.log(`✅ Processed ${blurResult.data.length} pixels`);
      console.log(`⏱️  Execution time: ${blurResult.stats.timeTakenSeconds}s`);
      console.log(`🖥️  Processes used: ${blurResult.stats.numProcessesUsed}`);
      console.log(`💾 Memory used: ${blurResult.stats.memoryUsed}`);

      // Test 4: Edge detection
      console.log("\n🔍 Test 4: Edge Detection");
      const edgeResult = await turbit.run(applyEdgeDetection, {
        type: "extended",
        data: image.pixels,
        power: 75
      });

      console.log(`✅ Processed ${edgeResult.data.length} pixels`);
      console.log(`⏱️  Execution time: ${edgeResult.stats.timeTakenSeconds}s`);
      console.log(`🖥️  Processes used: ${edgeResult.stats.numProcessesUsed}`);
      console.log(`💾 Memory used: ${edgeResult.stats.memoryUsed}`);

      // Test 5: Image statistics calculation
      console.log("\n📊 Test 5: Image Statistics");
      const statsResult = await turbit.run(calculateImageStats, {
        type: "extended",
        data: image.pixels,
        power: 100
      });

      console.log(`✅ Calculated statistics for ${statsResult.data.length} chunks`);
      console.log(`⏱️  Execution time: ${statsResult.stats.timeTakenSeconds}s`);
      console.log(`🖥️  Processes used: ${statsResult.stats.numProcessesUsed}`);
      console.log(`💾 Memory used: ${statsResult.stats.memoryUsed}`);

      // Show sample statistics
      if (statsResult.data.length > 0) {
        const sampleStats = statsResult.data[0];
        console.log("\n📈 Sample image statistics:");
        console.log(`  Average RGB: (${sampleStats.averageR.toFixed(1)}, ${sampleStats.averageG.toFixed(1)}, ${sampleStats.averageB.toFixed(1)})`);
        console.log(`  RGB Range: R[${sampleStats.minR}-${sampleStats.maxR}], G[${sampleStats.minG}-${sampleStats.maxG}], B[${sampleStats.minB}-${sampleStats.maxB}]`);
      }

      // Performance analysis for this image size
      const totalTime = grayscaleResult.stats.timeTakenSeconds +
        brightnessResult.stats.timeTakenSeconds +
        blurResult.stats.timeTakenSeconds +
        edgeResult.stats.timeTakenSeconds +
        statsResult.stats.timeTakenSeconds;

      const totalPixels = image.pixels.length * 5; // 5 operations

      console.log(`\n📈 Performance for ${imageConfig.name} image:`);
      console.log(`  Total processing time: ${totalTime.toFixed(2)}s`);
      console.log(`  Total pixels processed: ${totalPixels.toLocaleString()}`);
      console.log(`  Pixels per second: ${(totalPixels / totalTime).toLocaleString()}`);

      console.log("-".repeat(50));
    }

    // Overall performance analysis
    console.log("\n🎯 Performance Analysis:");
    console.log("• Grayscale conversion is fastest due to simple calculations");
    console.log("• Brightness adjustment scales well with parallel processing");
    console.log("• Blur effects benefit from chunk-based processing");
    console.log("• Edge detection shows good parallelization gains");
    console.log("• Statistics calculation is memory-efficient");
    console.log("• Larger images show better parallel processing benefits");

    console.log("\n💡 Optimization Tips:");
    console.log("• Use 75-100% power for CPU-intensive operations");
    console.log("• Adjust chunk sizes based on image dimensions");
    console.log("• Consider memory usage for very large images");
    console.log("• Combine operations to reduce data transfer overhead");

  } catch (error) {
    console.error("❌ Error during image processing:", error.message);
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