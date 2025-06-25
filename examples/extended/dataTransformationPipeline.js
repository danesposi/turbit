/**
 * Data Transformation Pipeline Example
 * 
 * This example demonstrates how to use Turbit for multi-stage data transformation
 * pipelines, showcasing ETL (Extract, Transform, Load) processes.
 * 
 * The example shows:
 * - Multi-stage data processing pipelines
 * - Data validation and cleaning
 * - Aggregation and analysis
 * - Performance optimization for ETL workflows
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
 * Generates sample customer data
 * @param {number} count - Number of records to generate
 * @returns {Array} Array of customer records
 */
const generateCustomerData = function (count) {
  const customers = [];
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia'];
  const products = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty'];

  for (let i = 0; i < count; i++) {
    customers.push({
      id: i + 1,
      name: `Customer_${i + 1}`,
      email: `customer${i + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 18,
      country: countries[Math.floor(Math.random() * countries.length)],
      purchaseAmount: Math.random() * 1000,
      purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      productCategory: products[Math.floor(Math.random() * products.length)],
      isActive: Math.random() > 0.3
    });
  }

  return customers;
}

/**
 * Stage 1: Data validation and cleaning
 * @param {Array} dataChunk - Chunk of customer data
 * @returns {Array} Validated and cleaned data
 */
const validateAndCleanData = function (dataChunk) {
  return dataChunk.filter(customer => {
    // Validate required fields
    if (!customer.name || !customer.email || !customer.age) {
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return false;
    }

    // Validate age range
    if (customer.age < 18 || customer.age > 100) {
      return false;
    }

    // Validate purchase amount
    if (customer.purchaseAmount < 0 || customer.purchaseAmount > 10000) {
      return false;
    }

    // Clean data
    customer.name = customer.name.trim();
    customer.email = customer.email.toLowerCase();
    customer.purchaseAmount = Math.round(customer.purchaseAmount * 100) / 100; // Round to 2 decimals

    return true;
  });
}

/**
 * Stage 2: Data enrichment
 * @param {Object} input - Input object with data and args
 * @returns {Array} Enriched data
 */
const enrichData = function (input) {
  const { data, args } = input;
  const { currentDate } = args;

  return data.map(customer => {
    // Calculate customer age
    const birthYear = currentDate.getFullYear() - customer.age;

    // Add customer segment based on purchase amount
    let segment = 'Bronze';
    if (customer.purchaseAmount >= 500) segment = 'Gold';
    else if (customer.purchaseAmount >= 200) segment = 'Silver';

    // Add purchase recency (days since last purchase)
    const daysSincePurchase = Math.floor((currentDate - customer.purchaseDate) / (1000 * 60 * 60 * 24));

    // Add lifetime value (simplified calculation)
    const lifetimeValue = customer.purchaseAmount * (customer.isActive ? 1.5 : 1.0);

    return {
      ...customer,
      birthYear: birthYear,
      segment: segment,
      daysSincePurchase: daysSincePurchase,
      lifetimeValue: Math.round(lifetimeValue * 100) / 100,
      isRecentCustomer: daysSincePurchase <= 30
    };
  });
}

/**
 * Stage 3: Data aggregation by country
 * @param {Array} dataChunk - Chunk of enriched data
 * @returns {Object} Aggregated statistics by country
 */
const aggregateByCountry = function (dataChunk) {
  const countryStats = {};

  dataChunk.forEach(customer => {
    const country = customer.country;

    if (!countryStats[country]) {
      countryStats[country] = {
        country: country,
        totalCustomers: 0,
        totalRevenue: 0,
        averagePurchase: 0,
        activeCustomers: 0,
        segments: { Bronze: 0, Silver: 0, Gold: 0 },
        topProductCategory: {}
      };
    }

    countryStats[country].totalCustomers++;
    countryStats[country].totalRevenue += customer.purchaseAmount;
    countryStats[country].activeCustomers += customer.isActive ? 1 : 0;
    countryStats[country].segments[customer.segment]++;

    // Track product categories
    if (!countryStats[country].topProductCategory[customer.productCategory]) {
      countryStats[country].topProductCategory[customer.productCategory] = 0;
    }
    countryStats[country].topProductCategory[customer.productCategory]++;
  });

  // Calculate averages and find top product category
  Object.values(countryStats).forEach(stats => {
    stats.averagePurchase = Math.round((stats.totalRevenue / stats.totalCustomers) * 100) / 100;

    // Find top product category
    const topCategory = Object.entries(stats.topProductCategory)
      .sort(([, a], [, b]) => b - a)[0];
    stats.topProductCategory = topCategory ? topCategory[0] : 'Unknown';
  });

  return Object.values(countryStats);
}

/**
 * Stage 4: Customer segmentation analysis
 * @param {Array} dataChunk - Chunk of enriched data
 * @returns {Object} Segmentation analysis
 */
const analyzeSegments = function (dataChunk) {
  const segmentAnalysis = {
    Bronze: { count: 0, totalRevenue: 0, averageAge: 0, countries: {} },
    Silver: { count: 0, totalRevenue: 0, averageAge: 0, countries: {} },
    Gold: { count: 0, totalRevenue: 0, averageAge: 0, countries: {} }
  };

  dataChunk.forEach(customer => {
    const segment = customer.segment;
    segmentAnalysis[segment].count++;
    segmentAnalysis[segment].totalRevenue += customer.purchaseAmount;
    segmentAnalysis[segment].averageAge += customer.age;

    if (!segmentAnalysis[segment].countries[customer.country]) {
      segmentAnalysis[segment].countries[customer.country] = 0;
    }
    segmentAnalysis[segment].countries[customer.country]++;
  });

  // Calculate averages and percentages
  Object.values(segmentAnalysis).forEach(segment => {
    if (segment.count > 0) {
      segment.averageAge = Math.round(segment.averageAge / segment.count);
      segment.averageRevenue = Math.round((segment.totalRevenue / segment.count) * 100) / 100;
    }
  });

  return segmentAnalysis;
}

/**
 * Stage 5: Generate insights and recommendations
 * @param {Array} dataChunk - Chunk of processed data
 * @returns {Object} Insights and recommendations
 */
const generateInsights = function (dataChunk) {
  const insights = {
    totalCustomers: dataChunk.length,
    totalRevenue: 0,
    averagePurchase: 0,
    activeRate: 0,
    recentCustomerRate: 0,
    topCountries: [],
    recommendations: []
  };

  // Calculate basic metrics
  dataChunk.forEach(customer => {
    insights.totalRevenue += customer.purchaseAmount;
    insights.activeRate += customer.isActive ? 1 : 0;
    insights.recentCustomerRate += customer.isRecentCustomer ? 1 : 0;
  });

  insights.averagePurchase = Math.round((insights.totalRevenue / insights.totalCustomers) * 100) / 100;
  insights.activeRate = Math.round((insights.activeRate / insights.totalCustomers) * 100);
  insights.recentCustomerRate = Math.round((insights.recentCustomerRate / insights.totalCustomers) * 100);

  // Find top countries by revenue
  const countryRevenue = {};
  dataChunk.forEach(customer => {
    if (!countryRevenue[customer.country]) countryRevenue[customer.country] = 0;
    countryRevenue[customer.country] += customer.purchaseAmount;
  });

  insights.topCountries = Object.entries(countryRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([country, revenue]) => ({ country, revenue: Math.round(revenue * 100) / 100 }));

  // Generate recommendations
  if (insights.activeRate < 70) {
    insights.recommendations.push("Consider re-engagement campaigns for inactive customers");
  }
  if (insights.recentCustomerRate < 30) {
    insights.recommendations.push("Focus on customer retention strategies");
  }
  if (insights.averagePurchase < 200) {
    insights.recommendations.push("Implement upselling and cross-selling initiatives");
  }

  return insights;
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("🔄 Starting Data Transformation Pipeline with Turbit");
  console.log("=".repeat(55));

  try {
    // Generate sample data
    const dataSize = 100000;
    console.log(`📊 Generating ${dataSize.toLocaleString()} customer records...`);
    const rawData = generateCustomerData(dataSize);
    console.log(`✅ Generated ${rawData.length} customer records`);

    // Stage 1: Data validation and cleaning
    console.log("\n🧹 Stage 1: Data Validation and Cleaning");
    console.log("-".repeat(40));

    const validationResult = await turbit.run(validateAndCleanData, {
      type: "extended",
      data: rawData,
      power: 75
    });

    const cleanedData = validationResult.data;
    console.log(`✅ Validated and cleaned ${cleanedData.length} records`);
    console.log(`❌ Rejected ${rawData.length - cleanedData.length} invalid records`);
    console.log(`⏱️  Execution time: ${validationResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${validationResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${validationResult.stats.memoryUsed}`);

    // Stage 2: Data enrichment
    console.log("\n\n✨ Stage 2: Data Enrichment");
    console.log("-".repeat(25));

    const enrichmentResult = await turbit.run(enrichData, {
      type: "extended",
      data: cleanedData,
      args: { currentDate: new Date() },
      power: 100
    });

    const enrichedData = enrichmentResult.data;
    console.log(`✅ Enriched ${enrichedData.length} records`);
    console.log(`⏱️  Execution time: ${enrichmentResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${enrichmentResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${enrichmentResult.stats.memoryUsed}`);

    // Stage 3: Country aggregation
    console.log("\n\n🌍 Stage 3: Country Aggregation");
    console.log("-".repeat(30));

    const aggregationResult = await turbit.run(aggregateByCountry, {
      type: "extended",
      data: enrichedData,
      power: 75
    });

    const countryStats = aggregationResult.data;
    console.log(`✅ Aggregated data for ${countryStats.length} countries`);
    console.log(`⏱️  Execution time: ${aggregationResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${aggregationResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${aggregationResult.stats.memoryUsed}`);

    // Show country statistics
    console.log("\n📊 Country Statistics:");
    countryStats.slice(0, 5).forEach(stats => {
      console.log(`  ${stats.country}: ${stats.totalCustomers} customers, $${stats.totalRevenue.toFixed(2)} revenue`);
    });

    // Stage 4: Segmentation analysis
    console.log("\n\n🎯 Stage 4: Customer Segmentation Analysis");
    console.log("-".repeat(40));

    const segmentationResult = await turbit.run(analyzeSegments, {
      type: "extended",
      data: enrichedData,
      power: 100
    });

    const segmentAnalysis = segmentationResult.data;
    console.log(`✅ Analyzed customer segments`);
    console.log(`⏱️  Execution time: ${segmentationResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${segmentationResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${segmentationResult.stats.memoryUsed}`);

    // Show segment analysis
    console.log("\n📈 Segment Analysis:");
    Object.entries(segmentAnalysis).forEach(([segment, stats]) => {
      console.log(`  ${segment}: ${stats.count} customers, avg age ${stats.averageAge}, avg revenue $${stats.averageRevenue}`);
    });

    // Stage 5: Generate insights
    console.log("\n\n💡 Stage 5: Generate Insights and Recommendations");
    console.log("-".repeat(50));

    const insightsResult = await turbit.run(generateInsights, {
      type: "extended",
      data: enrichedData,
      power: 50
    });

    const insights = insightsResult.data;
    console.log(`✅ Generated insights and recommendations`);
    console.log(`⏱️  Execution time: ${insightsResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${insightsResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${insightsResult.stats.memoryUsed}`);

    // Show insights
    console.log("\n📊 Key Insights:");
    console.log(`  Total customers: ${insights.totalCustomers.toLocaleString()}`);
    console.log(`  Total revenue: $${insights.totalRevenue.toFixed(2)}`);
    console.log(`  Average purchase: $${insights.averagePurchase}`);
    console.log(`  Active customer rate: ${insights.activeRate}%`);
    console.log(`  Recent customer rate: ${insights.recentCustomerRate}%`);

    console.log("\n🌍 Top Countries by Revenue:");
    insights.topCountries.forEach((country, index) => {
      console.log(`  ${index + 1}. ${country.country}: $${country.revenue.toFixed(2)}`);
    });

    console.log("\n💡 Recommendations:");
    insights.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });

    // Performance analysis
    const totalTime = validationResult.stats.timeTakenSeconds +
      enrichmentResult.stats.timeTakenSeconds +
      aggregationResult.stats.timeTakenSeconds +
      segmentationResult.stats.timeTakenSeconds +
      insightsResult.stats.timeTakenSeconds;

    console.log("\n🎯 Performance Analysis:");
    console.log(`• Total pipeline execution time: ${totalTime.toFixed(2)}s`);
    console.log(`• Records processed per second: ${(enrichedData.length / totalTime).toLocaleString()}`);
    console.log(`• Data validation: ${validationResult.stats.timeTakenSeconds}s (${((validationResult.stats.timeTakenSeconds / totalTime) * 100).toFixed(1)}%)`);
    console.log(`• Data enrichment: ${enrichmentResult.stats.timeTakenSeconds}s (${((enrichmentResult.stats.timeTakenSeconds / totalTime) * 100).toFixed(1)}%)`);
    console.log(`• Aggregation: ${aggregationResult.stats.timeTakenSeconds}s (${((aggregationResult.stats.timeTakenSeconds / totalTime) * 100).toFixed(1)}%)`);
    console.log(`• Segmentation: ${segmentationResult.stats.timeTakenSeconds}s (${((segmentationResult.stats.timeTakenSeconds / totalTime) * 100).toFixed(1)}%)`);
    console.log(`• Insights generation: ${insightsResult.stats.timeTakenSeconds}s (${((insightsResult.stats.timeTakenSeconds / totalTime) * 100).toFixed(1)}%)`);

    console.log("\n💡 Pipeline Optimization Tips:");
    console.log("• Data validation benefits from parallel processing");
    console.log("• Enrichment operations scale well with more cores");
    console.log("• Aggregation works best with optimized chunk sizes");
    console.log("• Consider memory usage for large datasets");
    console.log("• Balance power allocation across pipeline stages");

  } catch (error) {
    console.error("❌ Error during data transformation pipeline:", error.message);
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