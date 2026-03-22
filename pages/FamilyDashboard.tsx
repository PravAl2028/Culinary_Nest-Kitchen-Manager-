import React, { useState } from 'react';
import { Room, User, WishListItem } from '../types';
import { updateRoomData, updateUserInRoom } from '../services/storage';
import { ThumbsUp, Plus, ShoppingCart, Heart, Coffee, Sun, Save, Utensils, CheckCircle, Circle, Zap, Activity } from 'lucide-react';
import { MEAL_TYPES, DEFAULT_RECIPES } from '../constants';
import { calculateMatchScore } from '../services/intelligence';
import { GLOBAL_RECIPE_DATABASE } from '../services/recipe_database';

interface FamilyDashboardProps {
  room: Room;
  user: User;
  onRefresh: () => void;
}

export const FamilyDashboard: React.FC<FamilyDashboardProps> = ({ room, user, onRefresh }) => {
  
  const [activeTab, setActiveTab] = useState<'today' | 'wishes' | 'shopping' | 'menu'>('today');
  const [newWish, setNewWish] = useState('');
  const [wishMealType, setWishMealType] = useState(MEAL_TYPES[0]);

  // Preference State
  const [prefBreakfast, setPrefBreakfast] = useState(user.preferences?.breakfast.join('\n') || '');
  const [prefLunch, setPrefLunch] = useState(user.preferences?.lunch.join('\n') || '');
  const [prefDinner, setPrefDinner] = useState(user.preferences?.dinner.join('\n') || '');
  const [menuMessage, setMenuMessage] = useState('');

  // Today's plan
  const today = new Date().toISOString().split('T')[0];
  const todaysPlan =
    room.dailyPlans?.[today] ?? {
    date: today,
    proposedRecipes: [],
    finalizedRecipes: [],
    votes: []
  };

  const handleVote = async (recipeId: string) => {
    if (!todaysPlan) return;
    const currentVotes = todaysPlan.votes || [];
    const newVotes = currentVotes.filter(v => v.userId !== user.id);
    newVotes.push({ userId: user.id, recipeId });
    
    const updatedPlan = { ...todaysPlan, votes: newVotes };
    await updateRoomData(room.id, {
      dailyPlans: { ...room.dailyPlans, [today]: updatedPlan }
    });
    onRefresh();
  };

  const handleAddWish = async () => {
    if (!newWish.trim()) return;
    const item: WishListItem = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      dishName: newWish,
      mealType: wishMealType as any,
    };
    const newWishes = [...room.wishLists, item];
    await updateRoomData(room.id, { wishLists: newWishes });
    setNewWish('');
    onRefresh();
  };

  const handleToggleShopItem = async (itemId: string, currentStatus: boolean) => {
    const updatedList = room.shoppingList.map(item => 
      item.id === itemId ? { ...item, isBought: !currentStatus } : item
    );
    await updateRoomData(room.id, { shoppingList: updatedList });
    onRefresh();
  };

  const handleSaveMenu = async () => {
      const parseList = (text: string) => text.split('\n').map(s => s.trim()).filter(s => s);
      const bList = parseList(prefBreakfast);
      const lList = parseList(prefLunch);
      const dList = parseList(prefDinner);

      if (bList.length < 6 || lList.length < 6 || dList.length < 6) {
          setMenuMessage("Please add at least 6 items for each meal type!");
          return;
      }

      const updatedUser = { 
          ...user, 
          preferences: {
              breakfast: bList,
              lunch: lList,
              dinner: dList
          }
      };
      await updateUserInRoom(room.id, updatedUser);
      setMenuMessage("Menu preferences saved! Mom can now create a smart weekly plan.");
      onRefresh();
  };

  // Data Sync & Cleanup
  React.useEffect(() => {
    let needsUpdate = false;
    const updatedRecipes = (room.recipes || []).map(r => {
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

  return (
    <div className="pb-24 animate-fadeIn">
      {/* CONTENT */}
      {activeTab === 'today' && (
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-lg p-6 rounded-3xl border border-white/20 dark:border-stone-700 shadow-sm">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-white flex items-center gap-3"><Sun className="text-orange-500" size={32} /> What's Cooking Today?</h2>
          </div>
          
          {!todaysPlan || todaysPlan.proposedRecipes.length === 0 ? (
            <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl p-12 rounded-3xl text-center text-stone-500 dark:text-stone-400 shadow-lg border border-white/20 dark:border-stone-700">
              <Coffee size={80} className="mx-auto mb-6 opacity-20" />
              <p className="text-2xl font-bold">Mom hasn't planned the menu yet.<br/><span className="text-base font-normal opacity-70">Check back later!</span></p>
            </div>
          ) : (
            <div className="space-y-8">
              {MEAL_TYPES.map(type => {
                const recipesForType = todaysPlan.proposedRecipes.filter(r => r.type === type);
                if (recipesForType.length === 0) return null;

                return (
                  <div key={type} className="animate-fadeIn">
                    <h3 className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-4 tracking-widest pl-2 border-l-4 border-orange-500 flex items-center gap-2">
                       {type === 'breakfast' && <Coffee size={14} />}
                       {type === 'lunch' && <Sun size={14} />}
                       {type === 'dinner' && <Utensils size={14} />}
                       {type}
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {recipesForType.map(recipe => {
                        const voteCount = todaysPlan.votes.filter(v => v.recipeId === recipe.id).length;
                        const hasVoted = todaysPlan.votes.some(v => v.recipeId === recipe.id && v.userId === user.id);

                        return (
                          <div key={recipe.id} className={`p-6 rounded-3xl border transition-all duration-300 ${hasVoted ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-900/30 backdrop-blur-md shadow-lg ring-1 ring-orange-500' : 'border-white/20 dark:border-stone-700 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl hover:-translate-y-1'}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-full mb-3 inline-block shadow-sm">
                                  {recipe.type}
                                </span>
                                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1">{recipe.name}</h3>
                                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">{recipe.description}</p>
                              </div>
                              {recipe.isSpecial && <Heart className="text-pink-500 fill-current drop-shadow-md" size={28} />}
                            </div>
                            
                            <div className="flex gap-4 mb-6">
                              <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-3 rounded-2xl border border-green-100 dark:border-green-900/30 flex items-center gap-2">
                                <Activity size={18} className="text-green-600" />
                                <span className="text-lg font-bold text-green-700 dark:text-green-300">{recipe.nutritionalInfo?.calories || 0} <span className="text-xs font-normal opacity-70">kcal</span></span>
                              </div>
                              <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
                                <Zap size={18} className="text-blue-600" />
                                <span className="text-lg font-bold text-blue-700 dark:text-green-300">{calculateMatchScore(recipe, room.inventory)}% <span className="text-xs font-normal opacity-70">match</span></span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleVote(recipe.id)}
                              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${hasVoted ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-[1.02]' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 shadow-inner'}`}
                            >
                              <ThumbsUp size={22} className={hasVoted ? 'animate-bounce' : ''} />
                              {hasVoted ? 'Liked!' : 'Vote for this!'}
                              <span className={`ml-2 px-3 py-1 rounded-full text-xs ${hasVoted ? 'bg-orange-500/50' : 'bg-stone-200 dark:bg-stone-700'}`}>{voteCount} votes</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishes' && (
        <div className="space-y-8">
           <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-stone-700">
             <h3 className="text-2xl font-bold mb-6 dark:text-white flex items-center gap-2"><Heart className="text-pink-500" /> Request a Special Dish</h3>
             <div className="flex flex-col gap-3">
               <input 
                 type="text" 
                 placeholder="E.g., Lasagna, Chocolate Cake..." 
                 className="flex-1 border border-stone-200 dark:border-stone-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-orange-500 outline-none bg-white/50 dark:bg-stone-800/50 dark:text-white transition shadow-inner"
                 value={newWish}
                 onChange={(e) => setNewWish(e.target.value)}
               />
               <div className="flex gap-3">
                 <select 
                   className="flex-1 border border-stone-200 dark:border-stone-700 rounded-2xl px-4 py-3 bg-white/50 dark:bg-stone-800/50 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer transition shadow-sm"
                   value={wishMealType}
                   onChange={(e) => setWishMealType(e.target.value as any)}
                 >
                   {MEAL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                 </select>
                 <button 
                  onClick={handleAddWish}
                  className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/30"
                 >
                   <Plus size={20} /> Add
                 </button>
               </div>
             </div>
           </div>

           <div className="space-y-4">
             <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 px-2">My Requests</h3>
             {room.wishLists.filter(w => w.userId === user.id).length === 0 ? (
               <div className="p-12 text-center text-stone-400 dark:text-stone-500 italic bg-white/40 dark:bg-stone-900/40 rounded-3xl border border-white/20 dark:border-stone-800 backdrop-blur-md">No requests yet. Start wishing!</div>
             ) : (
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                 {room.wishLists.filter(w => w.userId === user.id).map(wish => (
                   <div key={wish.id} className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-stone-700 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300">
                     <div>
                       <p className="font-bold text-lg dark:text-white">{wish.dishName}</p>
                       <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-semibold tracking-wider bg-stone-100/50 dark:bg-stone-800/50 px-2 py-1 rounded mt-1 inline-block">{wish.mealType}</span>
                     </div>
                     <Heart size={24} className="text-pink-400 fill-pink-50 dark:fill-pink-900/20" />
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      )}

      {activeTab === 'menu' && (
          <div className="space-y-6">
              <div className="bg-indigo-50/80 dark:bg-indigo-950/40 backdrop-blur-xl p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full text-indigo-600 dark:text-indigo-400 shadow-inner"><Utensils size={32} /></div>
                      <div>
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">My Regular Menu</h2>
                        <p className="text-indigo-700 dark:text-indigo-300 text-sm">Help Mom plan by listing at least 6 items you love for each meal!</p>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
                      <div className="space-y-3">
                          <label className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider pl-2">Breakfast (Min 6)</label>
                          <textarea 
                            className="w-full h-64 p-5 rounded-2xl border border-white/50 dark:border-stone-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white/60 dark:bg-stone-900/60 dark:text-white shadow-inner transition backdrop-blur-sm"
                            placeholder="Oatmeal&#10;Pancakes&#10;Eggs..."
                            value={prefBreakfast}
                            onChange={e => setPrefBreakfast(e.target.value)}
                          />
                          <p className="text-xs text-right text-stone-400 font-medium">{prefBreakfast.split('\n').filter(s=>s.trim()).length} items</p>
                      </div>
                      <div className="space-y-3">
                          <label className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider pl-2">Lunch (Min 6)</label>
                          <textarea 
                            className="w-full h-64 p-5 rounded-2xl border border-white/50 dark:border-stone-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white/60 dark:bg-stone-900/60 dark:text-white shadow-inner transition backdrop-blur-sm"
                            placeholder="Sandwich&#10;Salad&#10;Rice..."
                            value={prefLunch}
                            onChange={e => setPrefLunch(e.target.value)}
                          />
                          <p className="text-xs text-right text-stone-400 font-medium">{prefLunch.split('\n').filter(s=>s.trim()).length} items</p>
                      </div>
                      <div className="space-y-3">
                          <label className="text-xs font-bold uppercase text-stone-500 dark:text-stone-400 tracking-wider pl-2">Dinner (Min 6)</label>
                          <textarea 
                            className="w-full h-64 p-5 rounded-2xl border border-white/50 dark:border-stone-700 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white/60 dark:bg-stone-900/60 dark:text-white shadow-inner transition backdrop-blur-sm"
                            placeholder="Pasta&#10;Soup&#10;Tacos..."
                            value={prefDinner}
                            onChange={e => setPrefDinner(e.target.value)}
                          />
                          <p className="text-xs text-right text-stone-400 font-medium">{prefDinner.split('\n').filter(s=>s.trim()).length} items</p>
                      </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-indigo-200 dark:border-indigo-900/50 pt-6">
                      <p className={`text-sm font-bold ${menuMessage.includes('saved') ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{menuMessage}</p>
                      <button 
                        onClick={handleSaveMenu}
                        className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
                      >
                          <Save size={20} /> Save My Menu
                      </button>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'shopping' && (
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-lg p-6 rounded-3xl border border-white/20 dark:border-stone-700 shadow-sm">
            <h2 className="text-2xl font-bold flex items-center gap-3 dark:text-white">
                <ShoppingCart className="text-orange-600 dark:text-orange-400" size={28} />
                Shopping Duty
            </h2>
          </div>
          
          <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-stone-700 overflow-hidden">
            <div className="p-6 bg-orange-50/50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-800/50">
              <h3 className="font-bold text-orange-900 dark:text-orange-200 text-lg">Items Assigned to Me</h3>
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {room.shoppingList.filter(i => i.assignedTo === user.id).length === 0 ? (
                 <div className="p-12 text-center text-stone-500 dark:text-stone-400 italic">No items assigned to you. You're free!</div>
              ) : (
                room.shoppingList.filter(i => i.assignedTo === user.id).map(item => (
                  <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-stone-800/50 transition duration-200">
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleToggleShopItem(item.id, item.isBought)} className={`transition ${item.isBought ? 'text-green-500' : 'text-stone-300 dark:text-stone-600 hover:text-stone-400'}`}>
                          {item.isBought ? <CheckCircle size={28} /> : <Circle size={28} />}
                      </button>
                      <span className={`text-xl transition-all duration-300 ${item.isBought ? 'line-through text-stone-400 dark:text-stone-600' : 'text-stone-900 dark:text-white font-medium'}`}>
                        {item.name} <span className="text-sm text-stone-500 dark:text-stone-400 font-normal ml-2 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg">({item.quantity})</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING NAVBAR */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-stone-700 rounded-full px-1 sm:px-2 py-1 sm:py-2 flex items-center gap-1 sm:gap-2 z-50">
        {[
            { id: 'today', icon: Sun, label: 'Today' },
            { id: 'wishes', icon: Heart, label: 'Wishes' },
            { id: 'shopping', icon: ShoppingCart, label: 'Shop' },
            { id: 'menu', icon: Utensils, label: 'Menu' },
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg scale-110 -translate-y-1 sm:-translate-y-2' : 'text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200'}`}
            >
                <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                {activeTab === tab.id && <span className="text-[8px] sm:text-[9px] font-bold mt-0.5 animate-fadeIn">{tab.label}</span>}
            </button>
        ))}
      </div>
    </div>
  );
};