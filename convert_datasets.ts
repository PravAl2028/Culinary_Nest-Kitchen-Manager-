import * as fs from 'fs';
import * as path from 'path';

// Improved CSV parser that handles quoted fields with commas
function parseCSV(content: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      result.push(row);
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (row.length > 0 || currentVal !== '') {
    row.push(currentVal.trim());
    result.push(row);
  }
  return result;
}

const recipesCsvPath = 'c:\\culinarynest\\IndianFoodDatasetCSV.csv';
const caloriesCsvPath = 'c:\\culinarynest\\calories.csv';

// 1. Convert Recipes
console.log("Parsing Recipes...");
const recipesRaw = fs.readFileSync(recipesCsvPath, 'utf-8');
const recipesRows = parseCSV(recipesRaw);
const recipesHeader = recipesRows[0];
const recipes = recipesRows.slice(1, 8001).map(row => { // Take first 8000
    const obj: any = {};
    recipesHeader.forEach((h, i) => {
        obj[h] = row[i];
    });
    return {
        id: `csv-${obj.Srno}`,
        name: obj.TranslatedRecipeName || obj.RecipeName,
        ingredients: (obj.TranslatedIngredients || obj.Ingredients || "").split(',').map((s: string) => s.trim()),
        instructions: (obj.TranslatedInstructions || obj.Instructions || "").split('.').map((s: string) => s.trim()).filter((s: string) => s.length > 0),

        type: (obj.Course || "").toLowerCase().includes('breakfast') ? 'breakfast' : 
              (obj.Course || "").toLowerCase().includes('lunch') ? 'lunch' : 'dinner',
        cuisine: obj.Cuisine
    };
});
fs.writeFileSync('c:\\culinarynest\\services\\extended_recipes.json', JSON.stringify(recipes, null, 2));
console.log(`Saved ${recipes.length} recipes to extended_recipes.json`);

// 2. Convert Calories
console.log("Parsing Calories...");
const caloriesRaw = fs.readFileSync(caloriesCsvPath, 'utf-8');
const caloriesRows = parseCSV(caloriesRaw);
const caloriesHeader = caloriesRows[0];
const calories = caloriesRows.slice(1).map(row => {
    const obj: any = {};
    caloriesHeader.forEach((h, i) => {
        obj[h] = row[i];
    });
    return {
        item: obj.FoodItem,
        category: obj.FoodCategory,
        caloriesPer100g: parseInt(obj.Cals_per100grams?.replace(/[^0-9]/g, '') || '0')
    };
});

const caloriesDataFile = `
export const INDIAN_NUTRITION_DATA = ${JSON.stringify(calories, null, 2)};

export const getIndianCalorieLookup = (ingredient: string): number | null => {
  const normalized = ingredient.toLowerCase();
  const match = INDIAN_NUTRITION_DATA.find(entry => 
    normalized.includes(entry.item?.toLowerCase()) || 
    entry.item?.toLowerCase().includes(normalized)
  );
  return match ? match.caloriesPer100g : null;
};
`;
fs.writeFileSync('c:\\culinarynest\\services\\indian_nutrition_data.ts', caloriesDataFile);
console.log(`Saved ${calories.length} calorie entries to indian_nutrition_data.ts`);
