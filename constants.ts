import { Recipe, User, ShoppingItem, WishListItem } from './types';

export const DEFAULT_RECIPES: Recipe[] = [
  { id: '1', name: 'Pancakes', type: 'breakfast', isSpecial: false, description: 'Fluffy homemade pancakes' },
  { id: '2', name: 'Oatmeal', type: 'breakfast', isSpecial: false, description: 'Healthy oats with fruits' },
  { id: '3', name: 'Grilled Cheese', type: 'lunch', isSpecial: false, description: 'Classic cheese melt' },
  { id: '4', name: 'Chicken Salad', type: 'lunch', isSpecial: false, description: 'Fresh greens with grilled chicken' },
  { id: '5', name: 'Spaghetti Bolognese', type: 'dinner', isSpecial: false, description: 'Pasta with meat sauce' },
  { id: '6', name: 'Roast Chicken', type: 'dinner', isSpecial: true, description: 'Sunday special roast' },
  { id: '7', name: 'Vegetable Stir Fry', type: 'dinner', isSpecial: false, description: 'Mixed veggies with soy sauce' },
  { id: '8', name: 'Fruit Smoothie', type: 'snack', isSpecial: false, description: 'Banana and berry blend' },
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
