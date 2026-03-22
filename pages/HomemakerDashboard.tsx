import React, { useState } from 'react';
import { Room, User, Recipe, Ingredient, ShoppingItem, MealType, WeeklyPlanItem } from '../types';
import { updateRoomData, updateUserInRoom, removeUserFromRoom, logMissingRecipe } from '../services/storage';
import { MEAL_TYPES, DEFAULT_RECIPES } from '../constants';
import { calculateMatchScore, getRecommendedRecipes, suggestNextMealType, generateProceduralRecipe, findBestMatch, findLayeredMatch, calculateRecipeNutritionalInfo, calculateRecipeCalories } from '../services/intelligence';
import { GLOBAL_RECIPE_DATABASE } from '../services/recipe_database';
import { Plus, Trash2, Youtube, Sparkles, ChefHat, ShoppingBag, Calendar, BookOpen, Send, User as UserIcon, Users, Settings, Edit, X, RefreshCw, Globe, Book, CheckCircle, Circle, Save, XCircle, Refrigerator, Zap, HeartPulse } from 'lucide-react';

interface HomemakerDashboardProps {
  room: Room;
  onRefresh: () => void;
}

const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
    const parseBold = (str: string) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-orange-900 dark:text-orange-300 font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="whitespace-pre-line leading-relaxed text-stone-700 dark:text-stone-300">
            {parseBold(text)}
        </div>
    );
};

export const HomemakerDashboard: React.FC<HomemakerDashboardProps> = ({ room, onRefresh }) => {
    if (!room || !room.users || !room.shoppingList) {
  return <div>Loading dashboard...</div>;
}
  const [view, setView] = useState<'recipes' | 'plan' | 'assistant' | 'shopping' | 'family'>('recipes');
  
  // AI State
  const [aiSuggestions, setAiSuggestions] = useState<{suggestions: string[], reasoning: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestionScope, setSuggestionScope] = useState<'cookbook' | 'global'>('global');
  
  // Inventory State
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientQty, setNewIngredientQty] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanItem[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // General State
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeType, setNewRecipeType] = useState(MEAL_TYPES[0]);
  const [selectedRecipeForDetails, setSelectedRecipeForDetails] = useState<Recipe | null>(null);
  const [recipeDetails, setRecipeDetails] = useState<string>('');
  
  // Shopping List State
  const [isAddingShopItem, setIsAddingShopItem] = useState(false);
  const [shopItemName, setShopItemName] = useState('');
  const [shopItemQty, setShopItemQty] = useState('1');
  
  // Admin State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');

  // Daily Plan State
  const today = new Date().toISOString().split('T')[0];
  const todaysPlan =
  room.dailyPlans?.[today] || {
    date: today,
    proposedRecipes: [],
    finalizedRecipes: [],
    votes: []
  };

  // Data Sync & Cleanup
  React.useEffect(() => {
    let needsUpdate = false;
    const updatedRecipes = room.recipes.map(r => {
      let updated = { ...r };
      const def = DEFAULT_RECIPES.find(dr => dr.id === r.id);
      
      if (def && (!r.ingredients || r.ingredients.length === 0)) {
        updated = { ...updated, ingredients: def.ingredients, nutritionalInfo: def.nutritionalInfo };
        needsUpdate = true;
      }
      
      if ((updated.type as any) === 'recipe') {
        const match = GLOBAL_RECIPE_DATABASE.find(dbR => dbR.name === updated.name);
        updated.type = match ? match.type : 'lunch';
        needsUpdate = true;
      }
      
      return updated;
    });

    const fixedDailyPlans = { ...room.dailyPlans };
    if (fixedDailyPlans[today]) {
        const plan = fixedDailyPlans[today];
        if (plan.proposedRecipes.some(r => (r.type as any) === 'recipe')) {
            needsUpdate = true;
            plan.proposedRecipes = plan.proposedRecipes.map(r => {
                if ((r.type as any) === 'recipe') {
                    const match = GLOBAL_RECIPE_DATABASE.find(dbR => dbR.name === r.name);
                    return { ...r, type: match ? match.type : 'lunch' };
                }
                return r;
            });
        }
    }

    if (needsUpdate) {
      updateRoomData(room.id, { recipes: updatedRecipes, dailyPlans: fixedDailyPlans }).then(() => onRefresh());
    }
  }, [room.recipes, room.dailyPlans, room.id, today, onRefresh]);

  const handleAddRecipe = async () => {
    if (!newRecipeName.trim()) return;
    try {
        const newRecipe: Recipe = {
          id: Math.random().toString(36).substr(2, 9),
          name: newRecipeName,
          type: newRecipeType,
          isSpecial: false,
          description: 'Added by Mom',
          ingredients: [],
          nutritionalInfo: { 
            calories: 0, 
            protein: 0, 
            carbs: 0, 
            fat: 0
          }
        };
        const updatedRecipes = [...(room.recipes || []), newRecipe];
        const res = await updateRoomData(room.id, { recipes: updatedRecipes });
        if (!res) throw new Error("API returned null");
        
        setNewRecipeName('');
        setIsAddingRecipe(false);
        onRefresh();
    } catch (err) {
        console.error("Failed to add recipe:", err);
        alert("Error saving recipe. Please check your connection.");
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
      if(confirm("Are you sure you want to delete this recipe?")) {
          const updatedRecipes = room.recipes.filter(r => r.id !== recipeId);
          const res = await updateRoomData(room.id, { recipes: updatedRecipes });
          if (!res) {
              console.error("Failed to delete recipe: Room not found or API error.");
              alert("Error deleting recipe. Please try again.");
          } else {
              onRefresh();
          }
      }
  };

  const toggleProposedRecipe = async (recipe: Recipe) => {
    const isProposed = todaysPlan.proposedRecipes.some(r => r.id === recipe.id);
    let newProposed;
    if (isProposed) {
      newProposed = todaysPlan.proposedRecipes.filter(r => r.id !== recipe.id);
    } else {
      // Calculate nutritional info if missing or zero
      let updatedRecipe = { ...recipe };
      if (!updatedRecipe.nutritionalInfo || updatedRecipe.nutritionalInfo.calories === 0) {
          const info = await calculateRecipeNutritionalInfo(updatedRecipe);
          updatedRecipe.nutritionalInfo = info;
      }
      newProposed = [...todaysPlan.proposedRecipes, updatedRecipe];
    }
    
    await updateRoomData(room.id, {
      dailyPlans: {
        ...room.dailyPlans,
        [today]: { ...todaysPlan, proposedRecipes: newProposed }
      }
    });
    onRefresh();
  };

  // Inventory Handlers
  const handleAddIngredient = async () => {
    if (!newIngredientName.trim()) return;
    const newIng: Ingredient = {
        id: Math.random().toString(36).substr(2, 9),
        name: newIngredientName,
        quantity: newIngredientQty || '1'
    };
    await updateRoomData(room.id, { inventory: [...room.inventory, newIng] });
    setNewIngredientName('');
    setNewIngredientQty('');
    onRefresh();
  };

  const handleDeleteIngredient = async (id: string) => {
      const updated = room.inventory.filter(i => i.id !== id);
      await updateRoomData(room.id, { inventory: updated });
      onRefresh();
  };

  const handleAiSuggest = () => {
    setIsAiLoading(true);
    
    setTimeout(() => {
        const topSuggestions = [...room.recipes, ...DEFAULT_RECIPES]
            .map(r => ({ r, score: calculateMatchScore(r, room.inventory) }))
            .sort((a,b) => b.score - a.score)
            .slice(0, 4);

        setAiSuggestions({
            suggestions: topSuggestions.map(s => s.r.name),
            reasoning: `Based on your current pantry items like ${room.inventory.slice(0,3).map(i => i.name).join(', ')}, these 4 dishes have the highest ingredient match! You're almost ready to cook these right now.`
        });
        setIsAiLoading(false);
    }, 800);
  };

  const handleGenerateWeeklyPlan = () => {
      setIsGeneratingPlan(true);
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const newPlan: WeeklyPlanItem[] = days.map(day => {
          // Combine all family preferences for the best variety
          const allBreakfasts = room.users.flatMap(u => u.preferences?.breakfast || []);
          const allLunches = room.users.flatMap(u => u.preferences?.lunch || []);
          const allDinners = room.users.flatMap(u => u.preferences?.dinner || []);

          const pickRandom = (list: string[]) => list[Math.floor(Math.random() * list.length)] || 'Surprise Dish';

          return {
              day,
              breakfast: { dish: pickRandom(allBreakfasts) },
              lunch: { dish: pickRandom(allLunches) },
              dinner: { dish: pickRandom(allDinners) }
          };
      });

      setTimeout(() => {
          setWeeklyPlan(newPlan);
          setIsGeneratingPlan(false);
      }, 1000);
  };


  const renderMessageText = (text: string) => {
    return text.split('\n\n').map((para, pi) => {
        const isHeader = para.startsWith('###');
        const content = isHeader ? para.replace('###', '').trim() : para;
        
        // Skip rendering redundant raw ingredient headers since we build a custom UI for them below
        const cleanUpper = content.trim().toUpperCase();
        if (cleanUpper === '**INGREDIENTS:**' || cleanUpper === 'INGREDIENTS:' || cleanUpper === 'INGREDIENTS' || cleanUpper === '**INGREDIENTS**') {
            return null;
        }

        // Detailed check for ingredient list (bullets)
        const lines = content.split('\n');
        if (lines.some(l => l.trim().startsWith('•'))) {
            return (
                <div key={pi} className="mb-6 last:mb-0 space-y-1.5 bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Ingredients</span>
                    {lines.map((line, li) => {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('•')) {
                            const match = trimmed.match(/• (.*?) \(([\d]+ kcal)\)$/);
                            if (match) {
                                const [_, name, cals] = match;
                                return (
                                    <div key={li} className="flex justify-between items-center gap-4 py-1 border-b border-stone-100/50 dark:border-stone-800/50 last:border-0 group">
                                        <span className="text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{name}</span>
                                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-lg border border-orange-100 dark:border-orange-900/50 whitespace-nowrap shadow-sm">
                                            {cals}
                                        </span>
                                    </div>
                                );
                            }
                        }
                        return <span key={li} className="block text-stone-700 dark:text-stone-300">{line}</span>;
                    })}
                </div>
            );
        }

        const parts = content.split(/(\[.*?\]\(.*?\))/g);
        const renderedParts = parts.map((part, i) => {
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                const [_, label, url] = linkMatch;
                if (url.includes('gemini.google.com')) {
                    return (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition transform mt-2">
                            <Sparkles size={14} />
                            <span>{label}</span>
                        </a>
                    );
                }
                return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">{label}</a>;
            }
            
            // Handle bold text **bold**
            const boldParts = part.split(/(\*\*.*?\*\*)/g);
            return boldParts.map((bp, bpi) => {
                if (bp.startsWith('**') && bp.endsWith('**')) {
                    return <strong key={bpi} className="font-bold text-stone-900 dark:text-white">{bp.slice(2, -2)}</strong>;
                }
                return bp;
            });
        });

        return (
            <span key={pi} className={`block mb-4 last:mb-0 whitespace-pre-line leading-relaxed ${isHeader ? 'font-bold text-xl text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-2 mb-4' : 'text-stone-700 dark:text-stone-300'}`}>
                {renderedParts}
            </span>
        );
    });
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user' as const, text: chatInput };
    setChatHistory([...chatHistory, userMsg]);
    setChatInput('');
    setIsAiLoading(true);

    let response = "I'm your Local Kitchen Assistant! I don't need the internet to help you.";
    const input = chatInput.toLowerCase();

    // 1. Search for specific recipe requests using the high-capacity database
    const allRecipes = [...room.recipes, ...DEFAULT_RECIPES, ...GLOBAL_RECIPE_DATABASE];
    const recipeMatch = findBestMatch(chatInput, allRecipes);
    
    if (recipeMatch && (input.includes('recipe') || input.includes('how to') || input.includes('steps') || input.includes('make'))) {
        const displayName = recipeMatch.name.toLowerCase().endsWith('recipe') ? recipeMatch.name : `${recipeMatch.name} Recipe`;
        const calorieResult = await calculateRecipeCalories(recipeMatch);
        response = `### ${displayName} (${calorieResult.total} kcal)\n\n**Description:** ${recipeMatch.description}\n\n${recipeMatch.ingredients.map(ing => `• ${ing} (${calorieResult.breakdown[ing] || 0} kcal)`).join('\n')}\n\n**Instructions:**\n${recipeMatch.instructions?.filter(s => s.trim()).map((s, i) => `${i+1}. ${s}`).join('\n')}`;
    }     else if ((input.includes('recipe') || input.includes('how to') || input.includes('steps') || input.includes('make')) || (input.length >= 3 && !input.startsWith('hi') && !input.startsWith('hello') && !input.includes('inventory') && !input.includes('cook'))) {
        const dishName = chatInput.replace(/recipe|how to|steps|cook|make/gi, '').trim() || "Special Dish";
        
        // Try matching with the expanded dataset
        const extendedMatch = findLayeredMatch(chatInput);
        
        if (extendedMatch) {
           const displayName = extendedMatch.name.toLowerCase().endsWith('recipe') ? extendedMatch.name : `${extendedMatch.name} Recipe`;
           const calorieResult = await calculateRecipeCalories(extendedMatch);
           response = `### ${displayName} (${calorieResult.total} kcal)\n\n${extendedMatch.ingredients.map(ing => `• ${ing} (${calorieResult.breakdown[ing] || 0} kcal)`).join('\n')}\n\n**Instructions:**\n${extendedMatch.instructions?.filter(s => s.trim()).map((s, i) => `${i+1}. ${s}`).join('\n')}`;
        } else {
           logMissingRecipe(dishName);
           const procedural = generateProceduralRecipe(dishName);
           const calorieResult = await calculateRecipeCalories(procedural);
           response = `### ${procedural.name} (Estimated - ${calorieResult.total} kcal)\n\nI couldn't find an exact match for "${dishName}" in your cookbook or the extended database. Here's a procedural estimate:\n\n${procedural.ingredients.map(ing => `• ${ing} (${calorieResult.breakdown[ing] || 0} kcal)`).join('\n')}\n\n**Instructions:**\n${procedural.instructions?.filter(s => s.trim()).map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n*Note: This recipe was synthesized based on similar dishes.*`;
        }
    }
    // 2. Suggestions based on pantry
    else if (input.includes('cook') || input.includes('suggestion') || input.includes('eat')) {
        const topMatch = room.recipes
            .map(r => ({ r, score: calculateMatchScore(r, room.inventory) }))
            .sort((a,b) => b.score - a.score)[0];
        response = `Based on your pantry, I highly recommend cooking **${topMatch.r.name}**. You have ${calculateMatchScore(topMatch.r, room.inventory)}% of the ingredients ready!`;
    } 
    // 3. Preferences logic
    else if (input.includes('who likes') || input.includes('preference')) {
        response = "I've analyzed the family preferences. Dad loves spicy food, while the kids are currently voting most for Pancakes and Spaghetti!";
    } 
    // 4. Inventory logic
    else if (input.includes('inventory') || input.includes('pantry')) {
        response = `You currently have ${room.inventory.length} items in your kitchen, including ${room.inventory.slice(0, 3).map(i => i.name).join(', ')}.`;
    } 
    // 5. Greetings
    else if (input.includes('hello') || input.includes('hi')) {
        response = "Hello! I'm your offline Kitchen Chef. Ask me for a recipe (like 'Potato Fry Recipe'), or about your pantry!";
    } 
    else {
        response = "I can definitely help with that! Try asking for a specific recipe (e.g., 'Potato Fry recipe') or ask what you can cook with your current pantry.";
    }

    const aiMsg = { role: 'ai' as const, text: response };
    setChatHistory(prev => [...prev, aiMsg]);
    setIsAiLoading(false);
  };

  const handleGetRecipeDetails = async (recipeName: string) => {
    // Find the recipe in room or database using fuzzy match
    const allRecipes = [...room.recipes, ...DEFAULT_RECIPES, ...GLOBAL_RECIPE_DATABASE];
    const recipe = findBestMatch(recipeName, allRecipes);
    
    if (recipe && recipe.instructions && recipe.instructions.length > 0) {
        const formatted = `### ${recipe.name}\n\n**Ingredients:**\n${recipe.ingredients.map(i => `- ${i}`).join('\n')}\n\n**Instructions:**\n${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}`;
        setSelectedRecipeForDetails(recipe);
        setRecipeDetails(formatted);
    } else {
        const extendedMatch = findLayeredMatch(recipeName);
        if (extendedMatch) {
            const formatted = `### ${extendedMatch.name}\n\n**Ingredients:**\n${extendedMatch.ingredients.map(i => `- ${i}`).join('\n')}\n\n**Instructions:**\n${extendedMatch.instructions?.filter(s => s.trim()).map((step, idx) => `${idx + 1}. ${step}`).join('\n')}`;
            setSelectedRecipeForDetails(extendedMatch);
            setRecipeDetails(formatted);
        } else {
            logMissingRecipe(recipeName);
            const procedural = generateProceduralRecipe(recipeName);
            const formatted = `### ${procedural.name} (Estimated)\n\nI didn't find this in our books. Here is a procedural guide:\n\n**Ingredients:**\n${procedural.ingredients.map(i => `- ${i}`).join('\n')}\n\n**Instructions:**\n${procedural.instructions?.filter(s => s.trim()).map((step, idx) => `${idx + 1}. ${step}`).join('\n')}`;
            setRecipeDetails(formatted);
        }
    }
  };

  const handleAssignShopItem = async (item: ShoppingItem, userId: string) => {
    const updatedList = room.shoppingList.map(i => i.id === item.id ? { ...i, assignedTo: userId } : i);
    await updateRoomData(room.id, { shoppingList: updatedList });
    onRefresh();
  };

  const handleAddShoppingItem = () => {
      setIsAddingShopItem(true);
  };

  const saveShoppingItem = async () => {
    if (!shopItemName.trim()) return;
    const newItem: ShoppingItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: shopItemName,
        quantity: shopItemQty,
        isBought: false,
        addedBy: 'homemaker',
        assignedTo: ''
    };
    await updateRoomData(room.id, { shoppingList: [...room.shoppingList, newItem]});
    setShopItemName('');
    setShopItemQty('1');
    setIsAddingShopItem(false);
    onRefresh();
  };

  const cancelAddShoppingItem = () => {
    setShopItemName('');
    setShopItemQty('1');
    setIsAddingShopItem(false);
  };

  const handleDeleteShoppingItem = async (itemId: string) => {
      if(confirm("Are you sure you want to delete this item?")) {
          const updatedList = room.shoppingList.filter(i => i.id !== itemId);
          await updateRoomData(room.id, { shoppingList: updatedList });
          onRefresh();
      }
  };

  const handleClearBoughtItems = async () => {
      if(confirm("Remove all items marked as bought?")) {
          const updatedList = room.shoppingList.filter(i => !i.isBought);
          await updateRoomData(room.id, { shoppingList: updatedList });
          onRefresh();
      }
  };

  const toggleShopItemStatus = async (item: ShoppingItem) => {
      const updatedList = room.shoppingList.map(i => i.id === item.id ? { ...i, isBought: !i.isBought } : i);
      await updateRoomData(room.id, { shoppingList: updatedList });
      onRefresh();
  }

  const startEditUser = (user: User) => {
      setEditingUser(user);
      setEditUserName(user.name);
      setEditUserPassword(user.password || '');
  };

  const saveEditUser = async () => {
      if (!editingUser) return;
      const updatedUser: User = { ...editingUser, name: editUserName, password: editUserPassword };
      await updateUserInRoom(room.id, updatedUser);
      setEditingUser(null);
      onRefresh();
  };

  const deleteUser = async (userId: string) => {
      if (confirm('Are you sure you want to remove this family member?')) {
          try {
              await removeUserFromRoom(room.id, userId);
              onRefresh();
          } catch (err) {
              console.error("Failed to delete user:", err);
              alert("Error removing family member. Please ensure the server is connected.");
          }
      }
  };

  const getVotersNames = (recipeId: string) => {
      const voteIds = todaysPlan.votes.filter(v => v.recipeId === recipeId).map(v => v.userId);
      return room.users.filter(u => voteIds.includes(u.id)).map(u => u.name).join(', ');
  }

  return (
    <div className="pb-24">
      <div>
        
        {view === 'recipes' && (
          <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/60 dark:bg-stone-900/60 backdrop-blur-lg p-4 rounded-3xl border border-white/20 dark:border-stone-700 shadow-sm">
                 <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white pl-2">My Cookbook</h2>
                 {!isAddingRecipe && (
                    <button 
                        onClick={() => setIsAddingRecipe(true)}
                        className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 sm:px-5 py-2.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition flex items-center gap-2 text-sm"
                    >
                        <Plus size={18} /> Add Recipe
                    </button>
                 )}
             </div>

             {isAddingRecipe && (
                <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-6 rounded-3xl mb-6 border border-white/20 dark:border-stone-800 shadow-lg animate-fadeIn">
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                             <input 
                                type="text" 
                                autoFocus
                                placeholder="Recipe name (e.g. Masala Dosa)" 
                                className="flex-1 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 bg-white/50 dark:bg-stone-800/50 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 transition"
                                value={newRecipeName}
                                onChange={e => setNewRecipeName(e.target.value)}
                             />
                             <select 
                                className="border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-3 bg-white/50 dark:bg-stone-800/50 dark:text-white outline-none cursor-pointer focus:ring-2 focus:ring-orange-500 transition"
                                value={newRecipeType}
                                onChange={e => setNewRecipeType(e.target.value as any)}
                             >
                                {MEAL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                             </select>
                        </div>
                        <div className="flex gap-2 justify-end">
                             <button 
                                onClick={() => setIsAddingRecipe(false)}
                                className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                             >
                                Cancel
                             </button>
                             <button 
                                onClick={handleAddRecipe}
                                disabled={!newRecipeName.trim()}
                                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                             >
                                <Save size={20} /> Save Recipe
                             </button>
                        </div>
                 </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {room.recipes.map(recipe => (
                    <div key={recipe.id} className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-white/40 dark:border-stone-800 p-5 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{recipe.name}</h3>
                                <span className="text-xs uppercase font-semibold tracking-wider bg-white/50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 px-3 py-1 rounded-full border border-stone-100 dark:border-stone-700">{recipe.type}</span>
                            </div>
                            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteRecipe(recipe.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full transition" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={() => handleGetRecipeDetails(recipe.name)} className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 p-2 rounded-full transition" title="Get Help/Recipe">
                                    <ChefHat size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
             
             {selectedRecipeForDetails && (
                 <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
                     <div className="bg-white/95 dark:bg-stone-900/95 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 relative shadow-2xl border border-white/20 dark:border-stone-700">
                         <button onClick={() => setSelectedRecipeForDetails(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition bg-stone-100 dark:bg-stone-800 p-2 rounded-full"><X size={20} /></button>
                         <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-stone-900 dark:text-white"><ChefHat className="text-orange-600 dark:text-orange-500" size={32} /> {selectedRecipeForDetails.name}</h2>
                         <div className="flex gap-3 mb-8">
                            <a href={`https://www.youtube.com/results?search_query=how+to+cook+${encodeURIComponent(selectedRecipeForDetails.name)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition shadow-md"><Youtube size={20} /> Watch on YouTube</a>
                         </div>
                         <div className="prose prose-stone dark:prose-invert max-w-none bg-stone-50/50 dark:bg-stone-800/30 p-6 rounded-2xl border border-stone-100 dark:border-stone-800">
                             <MarkdownText text={recipeDetails} />
                         </div>
                     </div>
                 </div>
             )}
          </div>
        )}

        {view === 'plan' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Calendar size={120} /></div>
                <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 relative z-10 tracking-tight">Planning for {today}</h2>
                <p className="opacity-90 relative z-10 font-medium text-orange-50 text-sm sm:text-lg">Select dishes from your cookbook to propose to the family.</p>
            </div>

            <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-stone-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2"><BookOpen size={24} className="text-orange-600" /> Select Dishes</h3>
                    <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-2xl border border-orange-100 dark:border-orange-900/50">
                        <Zap size={18} className="text-orange-600" />
                        <span className="text-xs font-bold text-orange-900 dark:text-orange-200 uppercase tracking-wider">Suggested: {suggestNextMealType(room.dailyPlans || {})}</span>
                    </div>
                </div>
                <div className="space-y-8">
                    {MEAL_TYPES.map(type => (
                        <div key={type}>
                            <h4 className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-3 tracking-widest border-b border-stone-200 dark:border-stone-700 pb-2">{type}</h4>
                            <div className="flex flex-wrap gap-2">
                                {room.recipes.filter(r => r.type === type).map(recipe => {
                                    const isSelected = todaysPlan.proposedRecipes.some(r => r.id === recipe.id);
                                    return (
                                        <button
                                            key={recipe.id}
                                            onClick={() => toggleProposedRecipe(recipe)}
                                            className={`group relative px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${isSelected ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-105' : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-orange-400 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {recipe.name}
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${calculateMatchScore(recipe, room.inventory) > 70 ? 'bg-green-100 dark:bg-green-900/50 text-green-700' : 'bg-stone-100 dark:bg-stone-700 text-stone-500'}`}>
                                                    {calculateMatchScore(recipe, room.inventory)}%
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                                {room.recipes.filter(r => r.type === type).length === 0 && <span className="text-sm text-stone-400 italic">No recipes found.</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-stone-700 p-6">
                <h3 className="font-bold text-xl mb-6 text-stone-800 dark:text-white flex items-center gap-2"><Users size={24} className="text-orange-600" /> Current Votes</h3>
                {todaysPlan.proposedRecipes.length === 0 ? (
                    <div className="text-center py-8 text-stone-500 dark:text-stone-500 italic bg-stone-50/50 dark:bg-stone-800/30 rounded-2xl">No dishes proposed yet.</div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {todaysPlan.proposedRecipes.map(r => (
                            <div key={r.id} className="p-5 border border-white/50 dark:border-stone-700 bg-white/40 dark:bg-stone-800/40 backdrop-blur-sm rounded-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-stone-800 dark:text-white text-lg">{r.name}</span>
                                    <div className="text-xs bg-white dark:bg-stone-800 px-3 py-1 rounded-full shadow-sm text-stone-700 dark:text-stone-200 font-bold border border-stone-100 dark:border-stone-700">
                                        {todaysPlan.votes.filter(v => v.recipeId === r.id).length} votes
                                    </div>
                                </div>
                                <div className="text-xs text-stone-500 dark:text-stone-400">
                                    <span className="font-semibold">Voters:</span> {getVotersNames(r.id) || "Waiting for votes..."}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-stone-700 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2"><HeartPulse size={24} className="text-rose-600" /> Health Summary</h3>
                    <div className="text-xs font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-600 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100 dark:border-rose-900/50">Daily Goal: 2000 kcal</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Calories', val: todaysPlan.proposedRecipes.reduce((acc, r) => acc + (r.nutritionalInfo?.calories || 0), 0), unit: 'kcal' },
                        { label: 'Protein', val: todaysPlan.proposedRecipes.reduce((acc, r) => acc + (r.nutritionalInfo?.protein || 0), 0), unit: 'g' },
                        { label: 'Carbs', val: todaysPlan.proposedRecipes.reduce((acc, r) => acc + (r.nutritionalInfo?.carbs || 0), 0), unit: 'g' },
                        { label: 'Fats', val: todaysPlan.proposedRecipes.reduce((acc, r) => acc + (r.nutritionalInfo?.fat || 0), 0), unit: 'g' },
                    ].map(item => (
                        <div key={item.label} className="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-inner">
                            <p className="text-[10px] uppercase font-black text-stone-400 dark:text-stone-500 mb-1 tracking-wider">{item.label}</p>
                            <p className="text-xl font-bold text-stone-900 dark:text-white">{item.val} <span className="text-xs font-normal opacity-60 ml-0.5">{item.unit}</span></p>
                        </div>
                    ))}
                </div>
            </div>

             <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 backdrop-blur-xl p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-lg">
                <div className="flex flex-col md:flex-row items-start gap-6">
                     <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-inner"><Calendar size={32} /></div>
                     <div className="flex-1 w-full">
                        <h3 className="font-bold text-xl text-indigo-900 dark:text-indigo-200 mb-2">Weekly Smart Plan</h3>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4 leading-relaxed">Generate a 7-day routine based on everyone's "Regular Menu" preferences.</p>
                        
                        {weeklyPlan.length === 0 && (
                            <button onClick={handleGenerateWeeklyPlan} disabled={isGeneratingPlan} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50 flex items-center gap-2">
                                {isGeneratingPlan ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                {isGeneratingPlan ? "Analyzing Preferences..." : "Generate 7-Day Plan"}
                            </button>
                        )}

                        {weeklyPlan.length > 0 && (
                            <div className="mt-6 bg-white/80 dark:bg-stone-900/80 rounded-2xl shadow-md border border-stone-200 dark:border-stone-800 overflow-hidden">
                                <div className="flex justify-between items-center p-6 border-b border-stone-100 dark:border-stone-800">
                                    <h4 className="font-bold text-stone-800 dark:text-white text-lg">Recommended Routine</h4>
                                    <button onClick={() => setWeeklyPlan([])} className="text-xs font-semibold text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition bg-stone-50 dark:bg-stone-800 px-3 py-1 rounded-full">Clear Plan</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-stone-50/50 dark:bg-stone-800/50">
                                            <tr>
                                                <th className="p-4 font-bold text-stone-600 dark:text-stone-300">Day</th>
                                                <th className="p-4 font-bold text-stone-600 dark:text-stone-300">Breakfast</th>
                                                <th className="p-4 font-bold text-stone-600 dark:text-stone-300">Lunch</th>
                                                <th className="p-4 font-bold text-stone-600 dark:text-stone-300">Dinner</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                            {weeklyPlan.map((day, idx) => (
                                                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors">
                                                    <td className="p-4 font-bold text-stone-900 dark:text-white">{day.day}</td>
                                                    <td className="p-4 text-stone-700 dark:text-stone-300">{day.breakfast.dish}</td>
                                                    <td className="p-4 text-stone-700 dark:text-stone-300">{day.lunch.dish}</td>
                                                    <td className="p-4 text-stone-700 dark:text-stone-300">{day.dinner.dish}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                     </div>
                </div>
             </div>
          </div>
        )}

        {view === 'assistant' && (
            <div className="space-y-6 h-[calc(100vh-200px)] flex flex-col animate-fadeIn">
                <div className="flex-1 overflow-y-auto bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-stone-700 p-6 space-y-6 custom-scrollbar">
                    
                    {/* Recommendation Engine */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-400"><Sparkles size={24} /></div>
                                <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-lg">AI Chef Suggestions</h3>
                            </div>
                            
                            {/* Structured Inventory Management */}
                            <div className="bg-white/50 dark:bg-stone-900/50 rounded-2xl p-5 border border-white/20 dark:border-stone-800">
                                <h4 className="font-bold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Refrigerator size={18} /> Kitchen Inventory
                                </h4>
                                
                                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                    <input 
                                        className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-white dark:bg-stone-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ingredient Name (e.g. Tomatoes)"
                                        value={newIngredientName}
                                        onChange={e => setNewIngredientName(e.target.value)}
                                    />
                                    <input 
                                        className="w-full sm:w-24 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-white dark:bg-stone-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Qty"
                                        value={newIngredientQty}
                                        onChange={e => setNewIngredientQty(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleAddIngredient} 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition shadow-md flex items-center justify-center"
                                        disabled={!newIngredientName.trim()}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 min-h-[50px] content-start">
                                    {room.inventory.length === 0 ? (
                                        <span className="text-xs text-stone-400 italic py-2">Pantry is empty. Add items to help AI.</span>
                                    ) : (
                                        room.inventory.map(item => (
                                            <div key={item.id} className="bg-white dark:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm flex items-center gap-2 shadow-sm animate-fadeIn">
                                                <span className="text-stone-800 dark:text-stone-200 font-medium">{item.name} <span className="opacity-60 text-xs font-normal">({item.quantity})</span></span>
                                                <button onClick={() => handleDeleteIngredient(item.id)} className="text-stone-400 hover:text-red-500 transition"><X size={14} /></button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                             <div className="flex items-center justify-between gap-4 mt-2">
                                <div className="flex bg-white/50 dark:bg-stone-900/50 rounded-full p-1 border border-white/20 dark:border-stone-800">
                                    <button 
                                        onClick={() => setSuggestionScope('cookbook')}
                                        className={`px-4 py-2 rounded-full text-xs font-bold transition ${suggestionScope === 'cookbook' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'}`}
                                    >
                                        Pantry Match
                                    </button>
                                    <button 
                                        onClick={() => setSuggestionScope('global')}
                                        className={`px-4 py-2 rounded-full text-xs font-bold transition ${suggestionScope === 'global' ? 'bg-indigo-600 text-white shadow-md' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'}`}
                                    >
                                        Preferences
                                    </button>
                                </div>

                                <button 
                                    onClick={() => {
                                        setIsAiLoading(true);
                                        setTimeout(() => {
                                            if (suggestionScope === 'cookbook') {
                                                const matches = room.recipes
                                                    .map(r => ({ r, score: calculateMatchScore(r, room.inventory) }))
                                                    .sort((a,b) => b.score - a.score)
                                                    .filter(x => x.score > 0)
                                                    .slice(0, 5);
                                                
                                                setAiSuggestions({
                                                    reasoning: `Based on your pantry ingredients (${room.inventory.map(i => i.name).join(', ')}), these recipes have the highest match scores.`,
                                                    suggestions: matches.map(m => `${m.r.name} (${m.score}% Match)`)
                                                });
                                            } else {
                                                const user = room.users.find(u => u.role === 'homemaker')!;
                                                const recs = getRecommendedRecipes(user, room.recipes).slice(0, 5);
                                                setAiSuggestions({
                                                    reasoning: `Based on your stated preferences (${user.preferences?.breakfast.join(', ')}...), here are your top recommended dishes.`,
                                                    suggestions: recs.map(r => r.name)
                                                });
                                            }
                                            setIsAiLoading(false);
                                        }, 800);
                                    }} 
                                    disabled={isAiLoading} 
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 flex items-center gap-2"
                                >
                                    {isAiLoading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                                    {isAiLoading ? 'Analyzing...' : 'Run Intelligence'}
                                </button>
                            </div>
                            
                            {aiSuggestions && (
                                <div className="mt-4 bg-white/80 dark:bg-stone-900/80 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 animate-fadeIn">
                                    <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 italic border-b border-stone-100 dark:border-stone-800 pb-3">{aiSuggestions.reasoning}</p>
                                    <div className="space-y-3">
                                        {aiSuggestions.suggestions.map((s, i) => (
                                            <div key={i} className="flex items-center justify-between group">
                                                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> {s}
                                                </span>
                                                <button onClick={() => handleGetRecipeDetails(s)} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                                                    View Recipe
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="space-y-4">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed backdrop-blur-sm ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white/50 dark:bg-stone-800/50 text-stone-800 dark:text-stone-200 rounded-tl-none border border-white/20 dark:border-stone-700'}`}>
                                    {renderMessageText(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isChatting && <div className="text-stone-400 dark:text-stone-500 text-xs animate-pulse pl-4">Chef is typing...</div>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <input className="flex-1 border border-stone-200 dark:border-stone-700 rounded-full px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none bg-white/80 dark:bg-stone-800/80 backdrop-blur-md text-stone-900 dark:text-white shadow-lg transition" placeholder="Ask for a recipe, cooking tip..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
                    <button onClick={handleChat} disabled={!chatInput.trim() || isChatting} className="bg-orange-600 text-white p-4 rounded-full hover:bg-orange-700 disabled:opacity-50 transition shadow-lg hover:shadow-orange-500/30 hover:scale-110"><Send size={24} /></button>
                </div>
            </div>
        )}

        {view === 'shopping' && (
            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/60 dark:bg-stone-900/60 backdrop-blur-lg p-4 rounded-3xl border border-white/20 dark:border-stone-700 shadow-sm">
                    <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white pl-2">Shopping List</h2>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={handleClearBoughtItems} className="bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-4 py-2.5 rounded-full font-bold hover:bg-stone-300 dark:hover:bg-stone-700 flex items-center gap-2 transition text-xs sm:text-sm">
                            <CheckCircle size={18} /> Clear Bought
                        </button>
                        {!isAddingShopItem && (
                            <button onClick={handleAddShoppingItem} className="bg-stone-900 dark:bg-stone-700 text-white px-5 py-2.5 rounded-full font-bold hover:bg-stone-800 dark:hover:bg-stone-600 flex items-center gap-2 shadow-lg transition">
                                <Plus size={18} /> Add Item
                            </button>
                        )}
                    </div>
                </div>
                
                {isAddingShopItem && (
                    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-stone-700 shadow-lg flex flex-col sm:flex-row gap-4 animate-fadeIn">
                        <input 
                            autoFocus
                            placeholder="Item name (e.g. Milk)" 
                            className="flex-1 px-5 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            value={shopItemName}
                            onChange={e => setShopItemName(e.target.value)}
                        />
                        <input 
                            placeholder="Qty" 
                            className="w-full sm:w-24 px-5 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            value={shopItemQty}
                            onChange={e => setShopItemQty(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={saveShoppingItem} className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-700 transition shadow-md flex items-center justify-center gap-2"><Save size={18} /> Save</button>
                            <button onClick={cancelAddShoppingItem} className="bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-4 py-3 rounded-2xl font-bold hover:bg-stone-300 dark:hover:bg-stone-700 transition"><XCircle size={18} /></button>
                        </div>
                    </div>
                )}

                <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-stone-700 overflow-hidden shadow-lg">
                    {/* Mobile: card view */}
                    <div className="sm:hidden divide-y divide-stone-100 dark:divide-stone-800">
                        {room.shoppingList.map(item => (
                            <div key={item.id} className="p-4 flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <button onClick={() => toggleShopItemStatus(item)} className={`mt-0.5 flex-shrink-0 transition ${item.isBought ? 'text-green-500' : 'text-stone-300 dark:text-stone-600'}`}>
                                        {item.isBought ? <CheckCircle size={22} /> : <Circle size={22} />}
                                    </button>
                                    <div className="min-w-0">
                                        <span className={`font-medium block truncate transition-all ${item.isBought ? 'line-through text-stone-400' : 'text-stone-900 dark:text-white'}`}>
                                            {item.name} <span className="text-xs text-stone-400 font-normal">{item.quantity}</span>
                                        </span>
                                        <select className="mt-1 text-xs bg-transparent border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 text-stone-500 dark:text-stone-400 w-full max-w-[160px]" value={item.assignedTo || ''} onChange={(e) => handleAssignShopItem(item, e.target.value)}>
                                            <option value="">-- Unassigned --</option>
                                            {room.users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteShoppingItem(item.id)} className="text-stone-300 hover:text-red-500 p-1 flex-shrink-0 transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {room.shoppingList.length === 0 && (
                            <div className="p-10 text-center text-stone-400 italic">No items yet.</div>
                        )}
                    </div>
                    {/* Desktop: table view */}
                    <table className="hidden sm:table w-full text-left border-collapse">
                        <thead className="bg-white/40 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-700">
                            <tr>
                                <th className="p-5 font-bold text-stone-600 dark:text-stone-300 text-sm uppercase tracking-wide">Item</th>
                                <th className="p-5 font-bold text-stone-600 dark:text-stone-300 text-sm uppercase tracking-wide">Assigned To</th>
                                <th className="p-5 font-bold text-stone-600 dark:text-stone-300 text-sm uppercase tracking-wide text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {room.shoppingList.map(item => (
                                <tr key={item.id} className="hover:bg-white/40 dark:hover:bg-stone-800/40 transition duration-200">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toggleShopItemStatus(item)} className={`transition ${item.isBought ? 'text-green-500' : 'text-stone-300 dark:text-stone-600 hover:text-stone-400'}`}>
                                                {item.isBought ? <CheckCircle size={24} /> : <Circle size={24} />}
                                            </button>
                                            <span className={`text-lg font-medium transition-all ${item.isBought ? 'line-through text-stone-400 dark:text-stone-600' : 'text-stone-900 dark:text-white'}`}>
                                                {item.name} <span className="text-sm text-stone-500 dark:text-stone-400 font-normal ml-2 bg-stone-100 dark:bg-stone-800/50 px-2 py-0.5 rounded-md">{item.quantity}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <select className="bg-transparent border border-transparent hover:border-stone-300 dark:hover:border-stone-600 rounded-lg px-2 py-1 text-sm font-medium focus:ring-0 text-stone-600 dark:text-stone-300 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition" value={item.assignedTo || ''} onChange={(e) => handleAssignShopItem(item, e.target.value)}>
                                            <option value="">-- Unassigned --</option>
                                            {room.users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>))}
                                        </select>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button onClick={() => handleDeleteShoppingItem(item.id)} className="text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {room.shoppingList.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-stone-400 dark:text-stone-600 italic">No items yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {view === 'family' && (
            <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white pl-2">Family Management</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {room.users.map(u => (
                        <div key={u.id} className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-stone-700 shadow-sm flex items-center justify-between group hover:border-orange-300 dark:hover:border-orange-700 transition duration-300 hover:shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg shadow-inner ${u.role === 'homemaker' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                                    {u.role === 'homemaker' ? <ChefHat size={28} /> : <UserIcon size={28} />}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-stone-900 dark:text-white">{u.name}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold tracking-wider">{u.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 transition duration-300">
                                <button onClick={() => startEditUser(u)} className="p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl text-stone-600 dark:text-stone-400 transition" title="Edit Profile"><Edit size={20} /></button>
                                <button onClick={() => deleteUser(u.id)} className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 transition" title="Delete Profile"><Trash2 size={20} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {editingUser && (
                    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
                        <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl p-8 rounded-3xl w-full max-w-sm border border-white/20 dark:border-stone-700 shadow-2xl">
                            <h3 className="font-bold text-xl mb-6 dark:text-white">Edit Profile: <span className="text-orange-600 dark:text-orange-400">{editingUser.name}</span></h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1.5 block">Name</label>
                                    <input className="w-full border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={editUserName} onChange={e => setEditUserName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1.5 block">Password</label>
                                    <input className="w-full border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-3 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={editUserPassword} onChange={e => setEditUserPassword(e.target.value)} />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={saveEditUser} className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition shadow-lg hover:shadow-orange-500/30">Save Changes</button>
                                    <button onClick={() => setEditingUser(null)} className="flex-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold py-3 rounded-xl hover:bg-stone-300 dark:hover:bg-stone-700 transition">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

      </div>

      {/* FLOATING NAVBAR */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-stone-700 rounded-full px-1 sm:px-2 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 z-50">
        {[
            { id: 'recipes', icon: BookOpen, label: 'Cookbook' },
            { id: 'plan', icon: Calendar, label: 'Plan' },
            { id: 'assistant', icon: Sparkles, label: 'AI Chef' },
            { id: 'shopping', icon: ShoppingBag, label: 'Shop' },
            { id: 'family', icon: Users, label: 'Family' },
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full transition-all duration-300 ${view === tab.id ? 'bg-orange-600 text-white shadow-lg scale-110 -translate-y-1 sm:-translate-y-2' : 'text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200'}`}
            >
                <tab.icon size={20} strokeWidth={view === tab.id ? 2.5 : 2} />
                {view === tab.id && <span className="text-[9px] sm:text-[10px] font-bold mt-0.5 animate-fadeIn">{tab.label}</span>}
            </button>
        ))}
      </div>
    </div>
  );
};