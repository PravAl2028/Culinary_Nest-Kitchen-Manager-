import { Recipe, User, ShoppingItem, WishListItem } from './types';

export const DEFAULT_RECIPES: Recipe[] = [
  { 
    id: '1', name: 'Pancakes', type: 'breakfast', isSpecial: false, 
    description: 'Fluffy homemade pancakes',
    ingredients: ['Flour', 'Milk', 'Eggs', 'Butter', 'Sugar'],
    nutritionalInfo: { calories: 350, protein: 8, carbs: 45, fat: 12, servingSize: '200g' },
    instructions: ['Whisk flour, sugar, and baking powder.', 'Add milk, eggs, and melted butter.', 'Cook on a greased griddle until bubbly.', 'Flip and cook until golden.']
  },
  { 
    id: '2', name: 'Oatmeal', type: 'breakfast', isSpecial: false, 
    description: 'Healthy oats with fruits',
    ingredients: ['Oats', 'Milk', 'Banana', 'Honey'],
    nutritionalInfo: { calories: 280, protein: 10, carbs: 52, fat: 5, servingSize: '300g' },
    instructions: ['Boil milk in a small saucepan.', 'Stir in oats and reduce heat.', 'Simmer for 5 minutes until thickened.', 'Top with sliced banana and honey.']
  },
  { 
    id: '3', name: 'Grilled Cheese', type: 'lunch', isSpecial: false, 
    description: 'Classic cheese melt',
    ingredients: ['Bread', 'Cheese', 'Butter'],
    nutritionalInfo: { calories: 400, protein: 15, carbs: 32, fat: 22, servingSize: '150g' },
    instructions: ['Butter one side of each bread slice.', 'Place cheese between unbuttered sides.', 'Grill in a pan over medium heat.', 'Flip when golden brown and cheese is melted.']
  },
  { 
    id: '4', name: 'Chicken Salad', type: 'lunch', isSpecial: false, 
    description: 'Fresh greens with grilled chicken',
    ingredients: ['Chicken', 'Lettuce', 'Tomato', 'Cucumber', 'Olive Oil'],
    nutritionalInfo: { calories: 320, protein: 28, carbs: 10, fat: 18, servingSize: '400g' },
    instructions: ['Season and grill chicken breast until cooked.', 'Slice chicken into strips.', 'Toss greens and veggies in a bowl.', 'Top with chicken and drizzle olive oil.']
  },
  { 
    id: '5', name: 'Spaghetti Bolognese', type: 'dinner', isSpecial: false, 
    description: 'Pasta with meat sauce',
    ingredients: ['Pasta', 'Ground Beef', 'Tomato Sauce', 'Onion', 'Garlic'],
    nutritionalInfo: { calories: 550, protein: 25, carbs: 65, fat: 18, servingSize: '0.5kg' },
    instructions: ['Boil pasta in salted water.', 'Brown beef with onion and garlic.', 'Add tomato sauce and simmer for 15 mins.', 'Serve sauce over drained pasta.']
  },
  { 
    id: '6', name: 'Roast Chicken', type: 'dinner', isSpecial: true, 
    description: 'Sunday special roast',
    ingredients: ['Whole Chicken', 'Potatoes', 'Carrots', 'Rosemary', 'Butter'],
    nutritionalInfo: { calories: 650, protein: 45, carbs: 35, fat: 28, servingSize: '0.6kg' },
    instructions: ['Preheat oven to 200°C.', 'Rub chicken with butter and rosemary.', 'Place veggies around chicken in a tray.', 'Roast for 1 hour or until skin is crispy.']
  },
  { 
    id: '7', name: 'Vegetable Stir Fry', type: 'dinner', isSpecial: false, 
    description: 'Mixed veggies with soy sauce',
    ingredients: ['Broccoli', 'Carrots', 'Bell Peppers', 'Soy Sauce', 'Rice'],
    nutritionalInfo: { calories: 420, protein: 12, carbs: 75, fat: 6, servingSize: '0.45kg' },
    instructions: ['Cook rice according to package instructions.', 'Chop veggies into bite-sized pieces.', 'Stir-fry veggies in a wok with soy sauce.', 'Serve over hot rice.']
  },
  { 
    id: '8', name: 'Fruit Smoothie', type: 'snack', isSpecial: false, 
    description: 'Banana and berry blend',
    ingredients: ['Banana', 'Mixed Berries', 'Yogurt', 'Honey'],
    nutritionalInfo: { calories: 210, protein: 6, carbs: 42, fat: 3, servingSize: '350g' },
    instructions: ['Place all ingredients in a blender.', 'Blend on high until smooth.', 'Pour into a chilled glass.', 'Enjoy immediately.']
  },
  { 
    id: '9', name: 'Potato Fry', type: 'dinner', isSpecial: false, 
    description: 'Crispy seasoned potato cubes',
    ingredients: ['Potatoes', 'Oil', 'Turmeric', 'Chili Powder', 'Salt'],
    nutritionalInfo: { calories: 250, protein: 3, carbs: 40, fat: 10, servingSize: '250g' },
    instructions: ['Peel and cube potatoes.', 'Heat oil in a pan.', 'Add potatoes and spices.', 'Fry on medium heat until crispy and golden.']
  },
  { 
    id: '10', name: 'Vegetable Soup', type: 'dinner', isSpecial: false, 
    description: 'Warm and comforting veggie broth',
    ingredients: ['Carrots', 'Beans', 'Corn', 'Onion', 'Vegetable Stock'],
    nutritionalInfo: { calories: 150, protein: 4, carbs: 25, fat: 2, servingSize: '400g' },
    instructions: ['Saute onions until soft.', 'Add veggies and stock.', 'Simmer for 20 minutes.', 'Season with salt and pepper.']
  },
  { 
    id: '11', name: 'Plain Rice', type: 'lunch', isSpecial: false, 
    description: 'Steamed white rice',
    ingredients: ['Rice', 'Water'],
    nutritionalInfo: { calories: 200, protein: 4, carbs: 45, fat: 0.5, servingSize: '200g' },
    instructions: ['Rinse rice under cold water.', 'Add rice and water to a pot (1:2 ratio).', 'Bring to boil, then simmer for 15 minutes.', 'Fluff with a fork.']
  },
];

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const DEFAULT_USERS: User[] = [
  {
    id: 'u_mom',
    name: 'Mom',
    role: 'homemaker',
    password: '123',
    preferences: {
      breakfast: ['Toast', 'Coffee', 'Fruit Bowl', 'Yogurt', 'Bagel', 'Smoothie'],
      lunch: ['Salad', 'Soup', 'Sandwich', 'Wrap', 'Leftovers', 'Sushi'],
      dinner: ['Salmon', 'Steak', 'Pasta', 'Curry', 'Stir Fry', 'Pizza']
    }
  },
  {
    id: 'u_dad',
    name: 'Dad',
    role: 'member',
    password: '123',
    preferences: {
      breakfast: ['Eggs', 'Bacon', 'Hashbrowns', 'Toast', 'Oatmeal', 'Waffles'],
      lunch: ['Burger', 'Sandwich', 'Pizza', 'Tacos', 'Burrito', 'Sub'],
      dinner: ['BBQ Ribs', 'Steak', 'Roast Beef', 'Chicken Wings', 'Lasagna', 'Chili']
    }
  },
  {
    id: 'u_kid',
    name: 'Kid',
    role: 'member',
    password: '123',
    preferences: {
      breakfast: ['Cereal', 'Pancakes', 'Waffles', 'Donut', 'Pop Tart', 'Toast'],
      lunch: ['Nuggets', 'Mac & Cheese', 'Hot Dog', 'Pizza', 'PB&J', 'Grilled Cheese'],
      dinner: ['Spaghetti', 'Tacos', 'Pizza', 'Burger', 'Fries', 'Chicken Tenders']
    }
  }
];

export const DEFAULT_SHOPPING_LIST: ShoppingItem[] = [
  { id: 's1', name: 'Milk', quantity: '1 gallon', isBought: false, addedBy: 'u_mom', assignedTo: 'u_dad' },
  { id: 's2', name: 'Eggs', quantity: '1 dozen', isBought: false, addedBy: 'u_mom', assignedTo: 'u_mom' },
  { id: 's3', name: 'Bread', quantity: '2 loaves', isBought: true, addedBy: 'u_dad', assignedTo: 'u_dad' },
  { id: 's4', name: 'Apples', quantity: '6', isBought: false, addedBy: 'u_kid', assignedTo: 'u_mom' },
];

export const DEFAULT_WISHES: WishListItem[] = [
  { id: 'w1', userId: 'u_kid', dishName: 'Chocolate Lava Cake', mealType: 'snack', notes: 'Please!' },
  { id: 'w2', userId: 'u_dad', dishName: 'Steak Night', mealType: 'dinner', notes: 'Medium rare' },
];
