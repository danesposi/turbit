# Turbit Usage Examples

This directory contains comprehensive example scripts demonstrating the usage of Turbit for various parallel processing tasks. The examples are organized into two categories: **simple** and **extended**, each showcasing different aspects of Turbit's capabilities.

## 📁 Directory Structure

```
examples/
├── README.md                 # This file
├── performanceComparison.js  # Performance comparison demonstration
├── simple/                   # Basic single-task parallel processing
│   ├── generateRandomNumbers.js
│   ├── taskRunner.js
│   ├── fibonacciCalculator.js
│   └── primeNumberGenerator.js
└── extended/                 # Advanced array-based parallel processing
    ├── basicSentimentAnalysis.js
    ├── passwordStrengthChecker.js
    ├── toUpperCaseProcessing.js
    ├── transactionRiskAnalysis.js
    ├── imageProcessingSimulator.js
    └── dataTransformationPipeline.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher recommended)
- Turbit library installed or available locally

### Installation
```bash
# If using npm
npm install turbit

# Or clone the repository and use local version
git clone https://github.com/jofpin/turbit.git
cd turbit
```

### Running Examples
```bash
# Performance comparison (recommended first)
node examples/performanceComparison.js

# Simple examples
node examples/simple/generateRandomNumbers.js
node examples/simple/taskRunner.js
node examples/simple/fibonacciCalculator.js
node examples/simple/primeNumberGenerator.js

# Extended examples
node examples/extended/basicSentimentAnalysis.js
node examples/extended/passwordStrengthChecker.js
node examples/extended/imageProcessingSimulator.js
node examples/extended/dataTransformationPipeline.js
```

## 📊 Performance Comparison

The [`performanceComparison.js`](performanceComparison.js) example demonstrates the benefits of parallel processing by comparing sequential vs parallel execution across different workload types:

- **CPU-intensive tasks**: Mathematical computations and algorithms
- **Memory-intensive tasks**: Large data processing and transformations
- **I/O-bound tasks**: Simulated I/O operations

This example provides:
- Speedup measurements and efficiency analysis
- Memory usage comparisons
- Optimization recommendations
- Performance insights for different workload types

## 📊 Simple Examples

Simple examples demonstrate basic parallel processing for single tasks that can be executed multiple times simultaneously.

| Script | Description | Use Case |
|--------|-------------|----------|
| [`generateRandomNumbers.js`](simple/generateRandomNumbers.js) | Enhanced random number generation with statistics | Demonstrates basic parallel execution with multiple test scenarios |
| [`taskRunner.js`](simple/taskRunner.js) | Comprehensive task runner with different task types | Template for custom implementations with CPU, I/O, and data processing tasks |
| [`fibonacciCalculator.js`](simple/fibonacciCalculator.js) | Parallel Fibonacci number calculation | CPU-intensive mathematical operations with performance analysis |
| [`primeNumberGenerator.js`](simple/primeNumberGenerator.js) | Parallel prime number generation and testing | Algorithm optimization examples with range-based and individual testing |

### Simple Example Pattern
```javascript
const Turbit = require("turbit");
const turbit = Turbit();

const task = function() {
    // Your computation here
    return result;
}

turbit.run(task, { 
    type: "simple", 
    power: 75 // Use 75% of available cores
})
.then(result => {
    console.log("Results:", result.data);
    console.log("Performance:", result.stats);
    turbit.kill();
});
```

## 🔄 Extended Examples

Extended examples showcase Turbit's ability to process large datasets by distributing data chunks across multiple CPU cores.

| Script | Description | Use Case |
|--------|-------------|----------|
| [`basicSentimentAnalysis.js`](extended/basicSentimentAnalysis.js) | Enhanced sentiment analysis with context awareness | Natural language processing with multiple algorithms and trend analysis |
| [`passwordStrengthChecker.js`](extended/passwordStrengthChecker.js) | Bulk password strength evaluation | Security analysis with CSV export capabilities |
| [`toUpperCaseProcessing.js`](extended/toUpperCaseProcessing.js) | Parallel text transformation | Data preprocessing and text manipulation |
| [`transactionRiskAnalysis.js`](extended/transactionRiskAnalysis.js) | Large-scale financial transaction analysis | Financial computing with risk scoring and reporting |
| [`imageProcessingSimulator.js`](extended/imageProcessingSimulator.js) | Parallel image processing simulation | Media processing with multiple filter operations |
| [`dataTransformationPipeline.js`](extended/dataTransformationPipeline.js) | Multi-stage data transformation pipeline | ETL processes with validation, enrichment, and analysis |

### Extended Example Pattern
```javascript
const Turbit = require("turbit");
const turbit = Turbit();

const processData = function(dataChunk) {
    // Process each chunk of data
    return dataChunk.map(item => {
        // Your processing logic here
        return processedItem;
    });
}

const largeDataset = [/* your data array */];

turbit.run(processData, {
    type: "extended",
    data: largeDataset,
    power: 100, // Use all available cores
    args: { /* additional parameters */ }
})
.then(result => {
    console.log("Processed data:", result.data);
    console.log("Performance stats:", result.stats);
    turbit.kill();
});
```

## ⚡ Performance Insights

### When to Use Simple Type
- **Single task execution** that can be repeated
- **CPU-intensive calculations** (math, algorithms)
- **Independent operations** that don't require data sharing
- **Template for custom parallel implementations**

### When to Use Extended Type
- **Large dataset processing** (arrays, lists, files)
- **Data transformation pipelines**
- **Batch operations** on multiple items
- **Memory-efficient processing** of big data

### Performance Tips
1. **Power Configuration**: Start with 50-75% power and adjust based on your system
2. **Data Chunking**: Extended type automatically chunks data for optimal distribution
3. **Memory Management**: Always call `turbit.kill()` to clean up resources
4. **Error Handling**: Wrap operations in try-catch blocks for robust execution
5. **Workload Matching**: Match power settings to workload characteristics

## 📈 Performance Comparison

The examples include performance statistics showing:
- **Execution time** in seconds
- **Number of processes** used
- **Data processed** (count/volume)
- **Memory usage** during execution

Example output:
```json
{
  "timeTakenSeconds": 2.45,
  "numProcessesUsed": 8,
  "dataProcessed": 1000000,
  "memoryUsed": "156.7 MB"
}
```

## 🔧 Configuration Options

### Turbit Options
- `type`: "simple" or "extended"
- `power`: Percentage of CPU cores to use (1-100)
- `data`: Array of data for extended processing
- `args`: Additional arguments passed to processing functions

### System Requirements
- **Minimum**: 2 CPU cores
- **Recommended**: 4+ CPU cores for optimal performance
- **Memory**: Varies based on data size and processing complexity

## 🛠️ Customization

### Adding New Examples
1. Follow the established patterns in existing examples
2. Include comprehensive error handling
3. Add performance monitoring
4. Document the use case and expected output

### Best Practices
- Always handle errors gracefully
- Clean up resources with `turbit.kill()`
- Monitor memory usage for large datasets
- Test with different power configurations
- Consider data size vs. processing overhead
- Use appropriate power settings for different workload types

## 📚 Further Resources

- **Main Documentation**: [Turbit GitHub Repository](https://github.com/jofpin/turbit)
- **API Reference**: See the main `turbit.js` file for detailed method documentation
- **Performance Benchmarks**: Check the `benchmark/` directory for performance comparisons
- **Issues & Support**: [GitHub Issues](https://github.com/jofpin/turbit/issues)

## 🤝 Contributing

Feel free to:
- Modify these examples for your specific use cases
- Add new examples showcasing different applications
- Improve performance or add new features
- Report bugs or suggest enhancements

---

**Happy parallel processing! 🚀**