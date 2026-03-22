import { processRecipeRequest } from './services/intelligence';

async function testSystem() {
  console.log("--- Starting Recipe & Nutrition System Test ---");

  const testQueries = [
    "Butter Chicken",
    "Masala Karela",
    "Aloo Gobhi",
    "Pizza"
  ];

  for (const query of testQueries) {
    console.log(`\nTesting Query: "${query}"`);
    const result = await processRecipeRequest(query);

    if (result) {
      console.log(`✅ Found Match: ${result.name}`);
      console.log(`📊 Calculated Calories: ${result.nutritionalInfo?.calories} kcal`);
      console.log(`🥗 Ingredients: ${result.ingredients.join(', ')}`);
    } else {
      console.log(`❌ No match found for "${query}"`);
    }
  }

  console.log("\n--- Test Complete ---");
}

testSystem();
