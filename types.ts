export type Role = 'homemaker' | 'member';

export interface UserPreferences {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  password?: string; // Optional for backward compatibility, but enforced in UI
  preferences?: UserPreferences;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Recipe {
  id: string;
  name: string;
  type: MealType;
  description?: string;
  isSpecial: boolean; // True if it's a "Special Dish"
  instructions?: string; // AI generated or manual
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  assignedTo?: string; // User ID
  isBought: boolean;
  addedBy: string; // User ID
}

export interface Vote {
  userId: string;
  recipeId: string;
  comment?: string;
}

export interface DailyPlan {
  date: string; // ISO Date string YYYY-MM-DD
  proposedRecipes: Recipe[]; // List of recipes mom proposed
  finalizedRecipes: Recipe[]; // What was actually decided
  votes: Vote[];
}

export interface WishListItem {
  id: string;
  userId: string;
  dishName: string;
  mealType: MealType;
  notes?: string;
}

export interface MealPlanDetail {
  dish: string;
}

export interface WeeklyPlanItem {
  day: string;
  breakfast: MealPlanDetail;
  lunch: MealPlanDetail;
  dinner: MealPlanDetail;
}

export interface Room {
  id: string;
  name: string;
  password: string; // Plaintext for MVP demo only
  users: User[];
  recipes: Recipe[]; // "What Mom can make"
  inventory: Ingredient[];
  shoppingList: ShoppingItem[];
  dailyPlans: Record<string, DailyPlan>; // Keyed by date
  wishLists: WishListItem[];
}

export interface AppState {
  currentRoomId: string | null;
  currentUser: User | null;
}