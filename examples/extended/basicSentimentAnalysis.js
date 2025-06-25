/**
 * Basic Sentiment Analysis Example
 * 
 * This example demonstrates how to use Turbit for parallel sentiment analysis
 * on multiple text samples, showcasing natural language processing capabilities.
 * 
 * The example shows:
 * - Parallel sentiment analysis on text reviews
 * - Different sentiment analysis algorithms
 * - Performance optimization for text processing
 * - Comprehensive sentiment scoring and classification
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
 * Enhanced sentiment analysis with multiple algorithms
 * @param {Array} reviews - Array of text reviews to analyze
 * @returns {Array} Array of sentiment analysis results
 */
const analyzeSentiment = function (reviews) {
  // Enhanced word dictionaries with weights
  const positiveWords = {
    "good": 1, "excellent": 2, "perfect": 3, "amazing": 2, "great": 2,
    "wonderful": 2, "fantastic": 2, "outstanding": 3, "superb": 3, "brilliant": 3,
    "love": 2, "like": 1, "enjoy": 1, "happy": 2, "satisfied": 2,
    "recommend": 2, "best": 3, "awesome": 2, "incredible": 3, "fabulous": 2
  };

  const negativeWords = {
    "bad": -1, "terrible": -2, "horrible": -3, "awful": -2, "disappointing": -2,
    "poor": -1, "worst": -3, "hate": -2, "dislike": -1, "unhappy": -2,
    "frustrated": -2, "angry": -2, "annoyed": -1, "upset": -2, "disgusted": -3,
    "dreadful": -3, "atrocious": -3, "miserable": -2, "depressing": -2
  };

  const neutralWords = {
    "okay": 0, "fine": 0, "average": 0, "normal": 0, "standard": 0,
    "acceptable": 0, "decent": 0, "reasonable": 0, "adequate": 0, "satisfactory": 0
  };

  return reviews.map(review => {
    const words = review.toLowerCase().split(/\s+/);
    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let totalWords = words.length;

    // Calculate sentiment score
    words.forEach(word => {
      // Remove punctuation
      const cleanWord = word.replace(/[^\w]/g, '');

      if (positiveWords[cleanWord]) {
        score += positiveWords[cleanWord];
        positiveCount++;
      } else if (negativeWords[cleanWord]) {
        score += negativeWords[cleanWord];
        negativeCount++;
      } else if (neutralWords[cleanWord]) {
        neutralCount++;
      }
    });

    // Normalize score by text length
    const normalizedScore = totalWords > 0 ? score / totalWords : 0;

    // Determine sentiment category
    let sentiment = "Neutral";
    let confidence = 0;

    if (normalizedScore > 0.1) {
      sentiment = "Positive";
      confidence = Math.min(Math.abs(normalizedScore) * 10, 1);
    } else if (normalizedScore < -0.1) {
      sentiment = "Negative";
      confidence = Math.min(Math.abs(normalizedScore) * 10, 1);
    } else {
      sentiment = "Neutral";
      confidence = 1 - Math.abs(normalizedScore) * 5;
    }

    // Calculate additional metrics
    const positiveRatio = totalWords > 0 ? positiveCount / totalWords : 0;
    const negativeRatio = totalWords > 0 ? negativeCount / totalWords : 0;
    const neutralRatio = totalWords > 0 ? neutralCount / totalWords : 0;

    return {
      text: review,
      sentiment: sentiment,
      score: Math.round(normalizedScore * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      metrics: {
        totalWords: totalWords,
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        neutralWords: neutralCount,
        positiveRatio: Math.round(positiveRatio * 1000) / 1000,
        negativeRatio: Math.round(negativeRatio * 1000) / 1000,
        neutralRatio: Math.round(neutralRatio * 1000) / 1000
      }
    };
  });
}

/**
 * Advanced sentiment analysis with context awareness
 * @param {Object} input - Input object with data and args
 * @returns {Array} Array of advanced sentiment analysis results
 */
const advancedSentimentAnalysis = function (input) {
  const { data, args } = input;
  const { context } = args;

  // Context-specific word weights
  const contextWeights = {
    "tech": {
      "fast": 2, "slow": -2, "innovative": 3, "outdated": -2,
      "user-friendly": 2, "complicated": -1, "reliable": 2, "buggy": -2
    },
    "food": {
      "delicious": 3, "tasty": 2, "bland": -2, "spicy": 1,
      "fresh": 2, "stale": -2, "hot": 1, "cold": -1
    },
    "service": {
      "helpful": 2, "rude": -2, "professional": 2, "unprofessional": -2,
      "quick": 1, "slow": -1, "friendly": 2, "unfriendly": -2
    }
  };

  const currentContext = contextWeights[context] || {};

  return data.map(review => {
    const words = review.toLowerCase().split(/\s+/);
    let score = 0;
    let contextScore = 0;
    let generalScore = 0;

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');

      // Check context-specific words first
      if (currentContext[cleanWord]) {
        contextScore += currentContext[cleanWord];
      }

      // General sentiment words
      if (cleanWord === "good" || cleanWord === "great" || cleanWord === "excellent") {
        generalScore += 1;
      } else if (cleanWord === "bad" || cleanWord === "terrible" || cleanWord === "awful") {
        generalScore -= 1;
      }
    });

    // Combine context and general scores
    score = (contextScore * 0.7) + (generalScore * 0.3);

    // Determine sentiment with context awareness
    let sentiment = "Neutral";
    if (score > 0.5) sentiment = "Positive";
    else if (score < -0.5) sentiment = "Negative";

    return {
      text: review,
      sentiment: sentiment,
      score: Math.round(score * 100) / 100,
      contextScore: Math.round(contextScore * 100) / 100,
      generalScore: Math.round(generalScore * 100) / 100,
      context: context
    };
  });
}

/**
 * Sentiment trend analysis across multiple reviews
 * @param {Array} reviews - Array of text reviews
 * @returns {Object} Sentiment trend analysis
 */
const analyzeSentimentTrends = function (reviews) {
  const results = analyzeSentiment(reviews);

  // Calculate overall statistics
  const totalReviews = results.length;
  const positiveReviews = results.filter(r => r.sentiment === "Positive").length;
  const negativeReviews = results.filter(r => r.sentiment === "Negative").length;
  const neutralReviews = results.filter(r => r.sentiment === "Neutral").length;

  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalReviews;
  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalReviews;

  // Find most positive and negative reviews
  const sortedByScore = [...results].sort((a, b) => b.score - a.score);
  const mostPositive = sortedByScore[0];
  const mostNegative = sortedByScore[sortedByScore.length - 1];

  // Calculate sentiment distribution
  const sentimentDistribution = {
    positive: Math.round((positiveReviews / totalReviews) * 100),
    negative: Math.round((negativeReviews / totalReviews) * 100),
    neutral: Math.round((neutralReviews / totalReviews) * 100)
  };

  return {
    totalReviews: totalReviews,
    averageScore: Math.round(averageScore * 100) / 100,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    sentimentDistribution: sentimentDistribution,
    mostPositive: mostPositive,
    mostNegative: mostNegative,
    overallSentiment: averageScore > 0.1 ? "Positive" : averageScore < -0.1 ? "Negative" : "Neutral"
  };
}

/**
 * Main execution function
 */
const main = async function () {
  console.log("📝 Starting Basic Sentiment Analysis with Turbit");
  console.log("=".repeat(55));

  try {
    // Sample reviews for different contexts
    const techReviews = [
      "This product is excellent and I love it",
      "The interface is very user-friendly and intuitive",
      "Performance is outstanding, highly recommend",
      "Bugs everywhere, terrible experience",
      "The Apple Vision Pro is a game-changer in the tech industry. Is a Good product.",
      "Elon Musk: visionary leadership has revolutionized space exploration",
      "Steve Jobs: Innovation and design philosophy continue to inspire generations",
      "Turbit is very cool and fast for parallel processing.",
      "The software is slow and crashes frequently",
      "Amazing features but the price is too high",
      "Reliable and efficient, exactly what I needed",
      "Complicated setup process, not user-friendly"
    ];

    const foodReviews = [
      "The food was delicious and perfectly cooked",
      "Amazing flavors, best restaurant in town",
      "Fresh ingredients and excellent service",
      "Bland and tasteless, very disappointing",
      "Spicy and flavorful, exactly what I wanted",
      "Cold food and rude staff",
      "Great atmosphere and friendly service",
      "Overpriced for mediocre quality",
      "Authentic taste and generous portions",
      "Stale bread and lukewarm soup"
    ];

    const serviceReviews = [
      "Customer service was helpful and professional",
      "Quick response time and friendly staff",
      "Rude and unprofessional service",
      "Exceeded my expectations, highly recommend",
      "Slow service and unhelpful staff",
      "Professional and efficient handling",
      "Terrible experience, would not recommend",
      "Friendly and knowledgeable team",
      "Unfriendly staff and poor communication",
      "Outstanding service and attention to detail"
    ];

    // Test 1: Basic sentiment analysis
    console.log("\n🔍 Test 1: Basic Sentiment Analysis");
    console.log("-".repeat(35));

    const basicResult = await turbit.run(analyzeSentiment, {
      type: "extended",
      data: techReviews,
      power: 100
    });

    console.log(`✅ Analyzed ${basicResult.data.length} reviews`);
    console.log(`⏱️  Execution time: ${basicResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${basicResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${basicResult.stats.memoryUsed}`);

    // Show sample results
    console.log("\n📋 Sample sentiment analysis results:");
    basicResult.data.slice(0, 5).forEach((result, index) => {
      console.log(`\n  ${index + 1}. "${result.text.substring(0, 50)}..."`);
      console.log(`     Sentiment: ${result.sentiment} (score: ${result.score}, confidence: ${result.confidence})`);
      console.log(`     Words: ${result.metrics.totalWords} total, ${result.metrics.positiveWords} positive, ${result.metrics.negativeWords} negative`);
    });

    // Test 2: Context-aware sentiment analysis
    console.log("\n\n🎯 Test 2: Context-Aware Sentiment Analysis");
    console.log("-".repeat(40));

    const contextResult = await turbit.run(advancedSentimentAnalysis, {
      type: "extended",
      data: foodReviews,
      args: { context: "food" },
      power: 75
    });

    console.log(`✅ Analyzed ${contextResult.data.length} food reviews with context awareness`);
    console.log(`⏱️  Execution time: ${contextResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${contextResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${contextResult.stats.memoryUsed}`);

    // Show context-aware results
    console.log("\n📋 Context-aware analysis results:");
    contextResult.data.slice(0, 5).forEach((result, index) => {
      console.log(`\n  ${index + 1}. "${result.text.substring(0, 40)}..."`);
      console.log(`     Sentiment: ${result.sentiment} (score: ${result.score})`);
      console.log(`     Context score: ${result.contextScore}, General score: ${result.generalScore}`);
    });

    // Test 3: Sentiment trend analysis
    console.log("\n\n📊 Test 3: Sentiment Trend Analysis");
    console.log("-".repeat(35));

    const trendResult = await turbit.run(analyzeSentimentTrends, {
      type: "extended",
      data: serviceReviews,
      power: 50
    });

    console.log(`✅ Analyzed trends for ${trendResult.data.length} service reviews`);
    console.log(`⏱️  Execution time: ${trendResult.stats.timeTakenSeconds}s`);
    console.log(`🖥️  Processes used: ${trendResult.stats.numProcessesUsed}`);
    console.log(`💾 Memory used: ${trendResult.stats.memoryUsed}`);

    // Show trend analysis
    const trends = trendResult.data;
    console.log("\n📈 Sentiment Trends:");
    console.log(`  Overall sentiment: ${trends.overallSentiment}`);
    console.log(`  Average score: ${trends.averageScore}`);
    console.log(`  Average confidence: ${trends.averageConfidence}%`);
    console.log(`  Distribution: ${trends.sentimentDistribution.positive}% positive, ${trends.sentimentDistribution.negative}% negative, ${trends.sentimentDistribution.neutral}% neutral`);

    console.log("\n🏆 Most Positive Review:");
    console.log(`  "${trends.mostPositive.text.substring(0, 60)}..."`);
    console.log(`  Score: ${trends.mostPositive.score}`);

    console.log("\n👎 Most Negative Review:");
    console.log(`  "${trends.mostNegative.text.substring(0, 60)}..."`);
    console.log(`  Score: ${trends.mostNegative.score}`);

    // Performance analysis
    const totalTime = basicResult.stats.timeTakenSeconds +
      contextResult.stats.timeTakenSeconds +
      trendResult.stats.timeTakenSeconds;

    const totalReviews = techReviews.length + foodReviews.length + serviceReviews.length;

    console.log("\n🎯 Performance Analysis:");
    console.log(`• Total reviews analyzed: ${totalReviews}`);
    console.log(`• Total execution time: ${totalTime.toFixed(2)}s`);
    console.log(`• Reviews per second: ${(totalReviews / totalTime).toFixed(0)}`);
    console.log(`• Basic analysis: ${basicResult.stats.timeTakenSeconds}s`);
    console.log(`• Context analysis: ${contextResult.stats.timeTakenSeconds}s`);
    console.log(`• Trend analysis: ${trendResult.stats.timeTakenSeconds}s`);

    console.log("\n💡 Sentiment Analysis Insights:");
    console.log("• Basic analysis is fastest for simple sentiment detection");
    console.log("• Context-aware analysis provides more accurate results");
    console.log("• Trend analysis helps understand overall sentiment patterns");
    console.log("• Parallel processing scales well with review volume");
    console.log("• Confidence scores help identify uncertain classifications");

  } catch (error) {
    console.error("❌ Error during sentiment analysis:", error.message);
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