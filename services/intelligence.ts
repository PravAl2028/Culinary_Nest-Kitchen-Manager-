import { Room, Recipe, User, MealType } from '../types';
import { INDIAN_NUTRITION_DATA, getIndianCalorieLookup } from './indian_nutrition_data';
import extendedRecipes from './extended_recipes.json';
import { GLOBAL_RECIPE_DATABASE } from './recipe_database';

const EXTENDED_DATABASE: Recipe[] = [...GLOBAL_RECIPE_DATABASE, ...(extendedRecipes as any)];

/**
 * ALGORITHM 1: PANTRY MATCHER
 * Calculates what percentage of a recipe's ingredients are currently in the room's inventory.
 */
export const calculateMatchScore = (recipe: Recipe, inventory: { name: string }[]): number => {
  if (!recipe.ingredients || recipe.ingredients.length === 0) return 0;
  
  const inventoryNames = inventory.map(i => i.name.toLowerCase());
  const matched = recipe.ingredients.filter(ing => 
    inventoryNames.some(inv => inv.includes(ing.toLowerCase()) || ing.toLowerCase().includes(inv))
  );
  
  return Math.round((matched.length / recipe.ingredients.length) * 100);
};

/**
 * ALGORITHM 2: PREFERENCE ENGINE
 * Ranks recipes for a specific user based on their stated preferences and historical "likes".
 */
export const getRecommendedRecipes = (user: User, recipes: Recipe[]): Recipe[] => {
  return [...recipes].sort((a, b) => {
    const aPref = isPreferred(user, a);
    const bPref = isPreferred(user, b);
    if (aPref && !bPref) return -1;
    if (!aPref && bPref) return 1;
    return 0;
  });
};

const isPreferred = (user: User, recipe: Recipe): boolean => {
  if (!user.preferences) return false;
  const prefs = [
    ...user.preferences.breakfast,
    ...user.preferences.lunch,
    ...user.preferences.dinner
  ].map(p => p.toLowerCase());
  
  return prefs.some(p => 
    recipe.name.toLowerCase().includes(p) || p.includes(recipe.name.toLowerCase())
  );
};

/**
 * ALGORITHM 3: MARKOV SEQUENCER
 * Analyzes previous meals to suggest what typical "next" meal types or recipes follow.
 * For this MVP, we analyze the last 7 days of dailyPlans.
 */
export const suggestNextMealType = (dailyPlans: Record<string, any>): MealType => {
  const dates = Object.keys(dailyPlans).sort();
  if (dates.length === 0) return 'breakfast';
  
  const lastDate = dates[dates.length - 1];
  const lastPlan = dailyPlans[lastDate];
  
  // Simple transition logic: If last was dinner, suggest breakfast. If last was breakfast, suggest lunch.
  if (lastPlan.finalizedRecipes?.some((r: any) => r.type === 'dinner')) return 'breakfast';
  if (lastPlan.finalizedRecipes?.some((r: any) => r.type === 'breakfast')) return 'lunch';
  if (lastPlan.finalizedRecipes?.some((r: any) => r.type === 'lunch')) return 'dinner';
  
  return 'dinner';
};

/**
 * ALGORITHM 4: NUTRITIONAL OPTIMIZER
 * Returns a combination of recipes that stay within a daily caloric target.
 */
export const getOptimizedDailyMenu = (recipes: Recipe[], targetCalories: number = 2000): Recipe[] => {
  const menu: Recipe[] = [];
  let totalCals = 0;
  
  // Try to pick one of each type
  const types: MealType[] = ['breakfast', 'lunch', 'dinner'];
  
  for (const type of types) {
    const options = recipes.filter(r => r.type === type);
    if (options.length > 0) {
      // Pick the first one that fits
      const choice = options.find(r => (r.nutritionalInfo?.calories || 0) + totalCals <= targetCalories);
      if (choice) {
        menu.push(choice);
        totalCals += choice.nutritionalInfo?.calories || 0;
      }
    }
  }
  
  return menu;
};
/**
 * ALGORITHM 5: PROCEDURAL RECIPE GENERATOR
 * Synthesizes a plausible recipe for unknown dishes based on culinary patterns.
 */
export const generateProceduralRecipe = (dishName: string): Recipe => {
  const name = dishName.toLowerCase();
  let type: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'dinner';
  let instructions: string[] = [];
  let ingredients: string[] = [];

  // 1. Identify common categories/patterns
  if (name.includes('roti') || name.includes('bread') || name.includes('naan') || name.includes('chapati')) {
    ingredients = ['Wheat Flour (Atta)', 'Water', 'Salt', 'Ghee/Oil'];
    instructions = [
      "In a large bowl, mix flour and salt. Slowly add water and knead into a smooth, soft dough.",
      "Cover and let the dough rest for at least 15-20 minutes.",
      "Divide dough into small balls and roll thin into circular shapes using a rolling pin.",
      "Heat a tawa or flat griddle. Place the roti and cook until small bubbles appear.",
      "Flip and cook the other side, then place over open flame for a few seconds to puff up."
    ];
  } else if (name.includes('curry') || name.includes('masala') || name.includes('gravy')) {
    ingredients = [dishName.split(' ')[0], 'Onion', 'Tomato', 'Ginger-Garlic Paste', 'Turmeric', 'Cumin', 'Chili Powder'];
    instructions = [
      "Heat oil in a heavy-bottomed pot. Sauté finely chopped onions until golden brown.",
      "Add ginger-garlic paste and sauté until fragrant.",
      "Stir in tomatoes and spices; cook until the oil starts to separate from the masala.",
      `Add your ${dishName.split(' ')[0]} and enough water to reach desired consistency.`,
      "Simmer on low heat until the main ingredients are tender and the gravy is thick."
    ];
  } else if (name.includes('fry') || name.includes('sauté')) {
    ingredients = [dishName.split(' ')[0], 'Oil', 'Mustard Seeds', 'Curry Leaves', 'Turmeric', 'Chili Powder'];
    instructions = [
      `Wash and cut the ${dishName.split(' ')[0]} into uniform small pieces.`,
      "Heat oil in a pan and add mustard seeds/cumin for tempering.",
      "Toss in the main ingredients and spices. Stir well to coat.",
      "Cook uncovered on medium heat, stirring occasionally, until crispy and cooked through."
    ];
  } else if (name.includes('pasta') || name.includes('spaghetti') || name.includes('macaroni')) {
    ingredients = [dishName.split(' ')[0], 'Garlic', 'Olive Oil', 'Italian Herbs', 'Hard Cheese'];
    instructions = [
      "Bring a large pot of salted water to a boil. Add pasta and cook until 'al dente'.",
      "While pasta cooks, sauté garlic in olive oil until light golden.",
      "Reserve a cup of pasta water, then drain the rest.",
      "Toss the pasta with the oil and garlic, adding water if needed to create a light sauce.",
      "Serve hot with a sprinkle of herbs and grated cheese."
    ];
  } else if (name.includes('soup') || name.includes('stew') || name.includes('boil')) {
    ingredients = [dishName.split(' ')[0], 'Water/Stock', 'Onion', 'Garlic', 'Salt', 'Black Pepper'];
    instructions = [
      "Prepare a flavorful broth using water or vegetable stock.",
      `Add ${dishName.split(' ')[0]} and any other chopped aromatics.`,
      "Bring to a boil, then reduce heat and simmer partially covered.",
      "Cook for 20-30 minutes until all flavors have melded together.",
      "Season generously and garnish with fresh herbs before serving."
    ];
  } else {
    // Default fallback (still better than before)
    ingredients = [dishName, 'Cooking Oil', 'Aromatic Spices', 'Salt'];
    instructions = [
      `Prep all components for your ${dishName} including washing and chopping.`,
      "Choose a suitable pan or pot and heat with a small amount of oil.",
      "Add ingredients in order of cooking time (longest first).",
      "Cook over consistent heat until tender, stirring as needed to prevent sticking.",
      "Adjust salt and spices at the end to your preference."
    ];
  }

  return {
    id: `gen-${Math.random().toString(36).substr(2, 5)}`,
    name: dishName,
    type,
    instructions,
    ingredients,
    isSpecial: false,
    nutritionalInfo: { calories: 300, protein: 10, carbs: 30, fat: 12, servingSize: '250g' }
  };
};

/**
 * ALGORITHM 6: LAYERED RECIPE & NUTRITION ENGINE
 */

// Layer 1: Recipe Matching
export const findBestMatch = (query: string, database: Recipe[]): Recipe | null => {
  const normalizedQuery = query.toLowerCase().replace(/recipe|how to|steps|cook/gi, '').trim();
  if (!normalizedQuery) return null;

  let bestMatch: Recipe | null = null;
  let highestScore = 0;

  for (const recipe of database) {
    const name = recipe.name.toLowerCase();
    let score = 0;

    // Direct match is highest priority
    if (name === normalizedQuery) score = 100;
    // Query is part of name
    else if (name.includes(normalizedQuery)) score = 80 + (normalizedQuery.length / name.length) * 10;
    // Word-by-word overlap
    else {
      const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
      const nameWords = name.split(/\s+/);
      const commonWords = queryWords.filter(w => nameWords.some(nw => nw.startsWith(w) || w.startsWith(nw)));
      score = (commonWords.length / Math.max(queryWords.length, nameWords.length)) * 70;
    }

    if (score > highestScore && score > 25) {
      highestScore = score;
      bestMatch = recipe;
    }
  }

  return bestMatch;
};

export const findLayeredMatch = (query: string): Recipe | null => {
  return findBestMatch(query, EXTENDED_DATABASE);
};

// Layer 2: Ingredient Extraction & Semantic Matching
export const extractAndCleanIngredients = (ingredients: string[]): string[] => {
  return ingredients.map(ing => {
    // Basic cleaning: remove units and quantities for semantic matching
    return ing.replace(/[0-9]|-|\/|tsp|tbsp|cup|g|kg|ml|oz|clove|slice|pinch|to taste/gi, '').trim();
  });
};

// Layer 3: Nutrition Engine (Open Food Facts)
export const fetchOFFNutrition = async (ingredient: string): Promise<number | null> => {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(ingredient)}&fields=nutriments&page_size=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.products && data.products.length > 0) {
      const n = data.products[0].nutriments;
      // Prefer explicit kcal field
      const kcal = n['energy-kcal_100g'] ?? n['energy-kcal'];
      if (kcal != null && kcal > 0) {
        // Sanity check: real food max is ~900 kcal/100g (pure fat)
        // Values above that are almost certainly kJ — convert to kcal
        return kcal > 900 ? Math.round(kcal / 4.184) : kcal;
      }
      // Fall back to kJ and convert
      const kj = n['energy-kj_100g'] ?? n['energy_100g'];
      if (kj != null && kj > 0) {
        return Math.round(kj / 4.184);
      }
    }
  } catch (error) {
    console.error(`Error fetching nutrition for ${ingredient} from OFF:`, error);
  }
  return null;
};

// Layer 4: Indian Nutrition Mapping & Calorie Calculation
const ZERO_CALORIE_INGREDIENTS = [
  'water', 'salt', 'ice', 'tap water', 'pinch salt', 'spring water', 
  'mineral water', 'iodized salt', 'sea salt', 'rock salt', 'pinch of salt'
];

const LOW_QUANTITY_INGREDIENTS = [
  'sesame', 'cashew', 'almond', 'raisin', 'cheese', 'peanut', 'olive', 'seeds',
  'walnut', 'pistachio', 'pine nut', 'pecan', 'macadamia', 'hazelnut',
  'sunflower', 'pumpkin', 'flaxseed', 'chia', 'hemp', 'poppy', 'mustard', 
  'cumin', 'fennel', 'coriander seed', 'curry leaves', 'peppercorn', 'cinnamon',
  'cardamom', 'clove', 'nutmeg', 'mace', 'star anise'
];

const parseIngredientQuantity = (ingredient: string) => {
  let quantityGrams = 100; // Default fallback to 100g
  
  const fractionMatch = ingredient.match(/^(\d+)\/(\d+)/) || ingredient.match(/\b(\d+)\/(\d+)\b/);
  const decimalMatch = ingredient.match(/^(\d*\.?\d+)/) || ingredient.match(/\b(\d*\.?\d+)\b/);
  
  let numericValue = 1;
  let valueFound = false;

  if (fractionMatch) {
    numericValue = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
    valueFound = true;
  } else if (decimalMatch) {
    numericValue = parseFloat(decimalMatch[1]);
    valueFound = true;
  }

  const lowerIng = ingredient.toLowerCase();
  
  if (lowerIng.includes('cup')) {
    // Density-based weights per 1 cup
    let densityGrams = 240; // Water default
    if (lowerIng.includes('seed') || lowerIng.includes('nut') || lowerIng.includes('sesame')) densityGrams = 140;
    else if (lowerIng.includes('flour')) densityGrams = 125;
    else if (lowerIng.includes('sugar')) densityGrams = 200;
    else if (lowerIng.includes('oil') || lowerIng.includes('butter') || lowerIng.includes('ghee')) densityGrams = 220;
    
    quantityGrams = numericValue * densityGrams;
  } else if (lowerIng.includes('tbsp') || lowerIng.includes('tablespoon')) {
    quantityGrams = numericValue * 15;
  } else if (lowerIng.includes('tsp') || lowerIng.includes('teaspoon')) {
    quantityGrams = numericValue * 5;
  } else if (lowerIng.match(/\b(g|gram|grams)\b/)) {
    quantityGrams = numericValue;
  } else if (lowerIng.match(/\b(kg|kilogram)\b/)) {
    quantityGrams = numericValue * 1000;
  } else if (lowerIng.match(/\b(ml|milliliter)\b/)) {
    quantityGrams = numericValue; 
  } else if (lowerIng.includes('clove')) {
    quantityGrams = numericValue * 5;
  } else if (valueFound && !lowerIng.includes('taste') && !lowerIng.includes('pinch')) {
    // Count of items — look up per-unit weight from the comprehensive reference table
    // Sorted most-specific first so the first match wins
    const UNIT_WEIGHTS: [string, number][] = [
      // Alliums
      ['small onion', 10], ['pearl onion', 10], ['spring onion', 15],
      ['red onion', 30], ['shallot', 20], ['onion', 30],
      // Garlic
      ['long garlic', 7], ['large clove garlic', 7], ['clove garlic', 5], ['cloves garlic', 5], ['garlic', 5],
      // Root veg
      ['baby potato', 40], ['small potato', 70], ['sweet potato', 130],
      ['colocasia', 60], ['arbi', 60], ['elephant yam', 100],
      ['potato', 150],
      ['carrot', 80], ['ginger', 10], ['beetroot', 150],
      ['radish', 100], ['mooli', 100], ['turnip', 100], ['kohlrabi', 100],
      // Gourds
      ['cherry tomato', 15], ['tomato', 120],
      ['bottle gourd', 500], ['lauki', 500],
      ['ridge gourd', 200], ['turai', 200], ['snake gourd', 300],
      ['chayote', 200], ['chow chow', 200], ['tinda', 80],
      ['bitter gourd', 100], ['karela', 100], ['parwal', 50],
      ['pumpkin', 400], ['kaddu', 400], ['cucumber', 200],
      ['zucchini', 200], ['courgette', 200],
      // Nightshades & peppers
      ['badi hari mirch', 20], ['thai red chilli', 3],
      ['kashmiri chilli', 2], ['byadagi chilli', 2], ['guntur chilli', 2],
      ['dry red chilli', 2], ['fresh red chilli', 5],
      ['green chillies', 5], ['green chilli', 5], ['chilli', 5], ['chillies', 5],
      ['jalapeno', 8], ['bell pepper', 120], ['capsicum', 120],
      ['small brinjal', 60], ['brinjal', 120], ['eggplant', 120],
      // Leafy veg
      ['cauliflower', 600], ['broccoli floret', 20], ['broccoli', 300],
      ['cabbage', 700], ['spinach leaf', 2], ['spinach', 150],
      ['curry leaf', 0.1], ['curry leaves', 0.1], ['bay leaf', 1],
      ['colocasia leaf', 15], ['banana flower', 200], ['banana stem', 200],
      ['banana leaf', 200], ['bok choy', 150], ['leek', 100],
      ['celery', 40], ['asparagus', 15], ['lettuce leaf', 10], ['lettuce', 475],
      ['green bean', 8], ['bhindi', 10], ['okra', 10],
      ['lotus stem', 80], ['drumstick', 30], ['moringa', 30],
      ['kaffir lime leaf', 1], ['basil leaf', 0.5], ['mint leaf', 0.3],
      ['parsley leaf', 0.5], ['tulsi leaf', 0.3],
      // Misc veg
      ['button mushroom', 10], ['portobello mushroom', 70], ['mushroom', 10],
      ['baby corn', 10], ['sweet corn', 100],
      ['avocado', 150], ['tindora', 10], ['ivy gourd', 10],
      ['raw mango', 200], ['raw banana', 120], ['raw papaya', 300],
      ['tamarind', 10],
      // Fruits
      ['strawberry', 12], ['cherry', 8], ['grape', 3],
      ['dried fig', 8], ['fresh fig', 50], ['fig', 50],
      ['apricot', 8], ['prune', 10], ['raisin', 1.5], ['date', 7],
      ['lemon wedge', 10], ['lime wedge', 10], ['lemon', 60], ['lime', 67],
      ['orange', 130], ['kiwi', 70], ['peach', 150], ['pear', 170], ['plum', 80],
      ['apple', 180], ['banana', 120], ['mango', 200], ['guava', 100],
      ['passion fruit', 18], ['chikoo', 90], ['sapota', 90], ['custard apple', 200],
      // Eggs & dairy
      ['egg white', 30], ['egg yolk', 20], ['egg', 50],
      ['cheese slice', 28], ['cheese cube', 28],
      // Meat & seafood
      ['chicken breast', 175], ['chicken thigh', 120], ['chicken leg', 180],
      ['chicken sausage', 50], ['bacon strip', 15], ['bacon', 15],
      ['seer fish', 200], ['kingfish', 200], ['king fish', 200], ['vanjaram', 200],
      ['hilsa', 200], ['pomfret', 250], ['rohu', 200], ['mackerel', 120],
      ['sardine', 50], ['basa fillet', 150], ['basa', 150],
      ['prawn', 10], ['shrimp', 10], ['crab', 250],
      ['fish fillet', 150], ['fish steak', 200], ['fish', 150],
      // Nuts (per piece)
      ['cashew', 2], ['almond', 1.2], ['badam', 1.2],
      ['pistachio', 0.7], ['walnut half', 5], ['walnut', 5], ['peanut', 0.7],
      // Whole spices
      ['black cardamom', 1.5], ['cardamom', 0.5], ['elaichi', 0.5],
      ['clove', 0.3], ['laung', 0.3], ['star anise', 2],
      ['cinnamon stick', 3], ['cinnamon', 3], ['mace blade', 0.5], ['javitri', 0.5],
      ['peppercorn', 0.06], ['saffron strand', 0.01], ['nutmeg', 8],
      // Bread & bakery
      ['whole wheat paratha', 60], ['paratha', 60],
      ['bread slice', 30], ['phulka', 30], ['roti', 30],
      ['idli', 40], ['pav bun', 40], ['pav', 40],
      ['burger bun', 50], ['hot dog bun', 45], ['bagel', 98],
      ['baguette', 250], ['pizza base', 200], ['pita', 60],
      ['tortilla', 30], ['lasagna sheet', 20], ['spring roll wrapper', 15],
      ['papad', 10], ['pani puri', 5], ['samosa', 60], ['aloo tikki', 60],
      ['rasgulla', 30], ['bread', 30],
      // Other
      ['tofu', 100], ['soy chunks', 5], ['chocolate', 50],
    ];

    let itemWeight = 100; // default fallback
    const unitMatch = UNIT_WEIGHTS.find(([key]) => lowerIng.includes(key));
    if (unitMatch) itemWeight = unitMatch[1];

    quantityGrams = numericValue * itemWeight;

  } else {
    // No explicit numeric value found, or it's a pinch/taste
    if (lowerIng.includes('leaves') || lowerIng.includes('coriander')) quantityGrams = 5;
    else if (lowerIng.includes('bread') || lowerIng.includes('loaf')) quantityGrams = 40; // ~1 slice/piece
    else if (lowerIng.includes('butter') || lowerIng.includes('oil')) quantityGrams = 10;
    else if (lowerIng.includes('to taste') || lowerIng.includes('pinch')) quantityGrams = 2;
    else if (LOW_QUANTITY_INGREDIENTS.some(zi => lowerIng.includes(zi))) quantityGrams = 10;
    else quantityGrams = 50; // Conservative fallback
  }

  // Clean for semantic matching — use word boundaries so units like 'g','ml','oz' don't eat letters inside words
  const cleanedName = ingredient
    .replace(/\b\d+\s*(tsp|tbsp|teaspoons?|tablespoons?|cups?|grams?|\bkg\b|\bml\b|\boz\b|\bg\b)\b/gi, '')
    .replace(/[-\/]/g, ' ')
    .replace(/\b(cloves?|slices?|pinch|pieces?)\b/gi, '')
    .replace(/to taste|for frying|finely chopped|boiled and peeled|chopped for garnishing|cut into slices or regular bread/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { cleanedName, quantityGrams };
};

export interface DetailedCalorieResult {
  total: number;
  breakdown: Record<string, number>;
}

export const calculateRecipeCalories = async (recipe: Recipe): Promise<DetailedCalorieResult> => {
  let totalCalories = 0;
  const breakdown: Record<string, number> = {};

  for (const originalIngredient of recipe.ingredients) {
    const { cleanedName, quantityGrams } = parseIngredientQuantity(originalIngredient);
    const lowerIng = cleanedName.toLowerCase() || originalIngredient.toLowerCase();
    
    // Step 0: Zero Calorie Exceptions
    if (ZERO_CALORIE_INGREDIENTS.some(zi => lowerIng === zi || lowerIng.includes(zi))) {
      breakdown[originalIngredient] = 0;
      continue; 
    }

    let caloriesPer100g: number | null = null;
    caloriesPer100g = getIndianCalorieLookup(cleanedName);
    
    if (caloriesPer100g === null && cleanedName) {
      caloriesPer100g = await fetchOFFNutrition(cleanedName);
    }

    if (caloriesPer100g === null) {
      caloriesPer100g = 50; 
    }

    // Sanity check: if value is unrealistically high it was stored as kJ — convert
    if (caloriesPer100g > 900) {
      caloriesPer100g = Math.round(caloriesPer100g / 4.184);
    }

    const proportionalCalories = (caloriesPer100g / 100) * quantityGrams;
    breakdown[originalIngredient] = Math.round(proportionalCalories);
    totalCalories += proportionalCalories;
  }

  return {
    total: Math.round(totalCalories),
    breakdown
  };
};


export const calculateRecipeNutritionalInfo = async (recipe: Recipe) => {
  const result = await calculateRecipeCalories(recipe);
  const totalCals = result.total;
  
  return {
    calories: totalCals,
    protein: Math.round(totalCals * 0.05), // Estimated 5% protein
    carbs: Math.round(totalCals * 0.12),  // Estimated 12% carbs
    fat: Math.round(totalCals * 0.04),    // Estimated 4% fat
    servingSize: "1 portion",
    ingredientCalories: result.breakdown
  };
};

/**
 * Main Entry Point for User Request Flow
 */
export const processRecipeRequest = async (query: string): Promise<Recipe | null> => {
  // Layer 1
  const match = findLayeredMatch(query);
  if (!match) return null;

  // Layer 2, 3, 4
  const nutritionalInfo = await calculateRecipeNutritionalInfo(match);
  
  return {
    ...match,
    nutritionalInfo
  };
};
