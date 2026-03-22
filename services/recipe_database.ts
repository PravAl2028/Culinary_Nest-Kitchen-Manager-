import { Recipe } from '../types';

export const GLOBAL_RECIPE_DATABASE: Recipe[] = [
  // --- INDIAN ---
  {
    id: 'db-1', name: 'Butter Chicken', type: 'dinner', isSpecial: true,
    description: 'Creamy tomato-based chicken curry',
    ingredients: ['Chicken', 'Butter', 'Cream', 'Tomato Puree', 'Garam Masala', 'Ginger-Garlic Paste'],
    nutritionalInfo: { calories: 450, protein: 32, carbs: 12, fat: 30, servingSize: '350g' },
    instructions: ['Marinate chicken in yogurt and spices.', 'Grill or pan-fry until cooked.', 'Simmer tomato puree with butter and cream.', 'Add chicken and cook until thick and creamy.']
  },
  {
    id: 'db-2', name: 'Paneer Tikka', type: 'snack', isSpecial: false,
    description: 'Grilled spiced cottage cheese',
    ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Onion', 'Spices'],
    nutritionalInfo: { calories: 320, protein: 18, carbs: 10, fat: 22, servingSize: '250g' },
    instructions: ['Mix cubes of paneer and veggies in spiced yogurt.', 'Thread onto skewers.', 'Grill or bake at 220°C until edges are charred.']
  },
  // --- ITALIAN ---
  {
    id: 'db-3', name: 'Margherita Pizza', type: 'dinner', isSpecial: false,
    description: 'Classic tomato and mozzarella pizza',
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella Cheese', 'Fresh Basil', 'Olive Oil'],
    nutritionalInfo: { calories: 250, protein: 12, carbs: 35, fat: 8, servingSize: '1 slice' },
    instructions: ['Roll out dough thinly.', 'Spread tomato sauce evenly.', 'Top with cheese and basil.', 'Bake in a very hot oven until crust is golden.']
  },
  {
    id: 'db-4', name: 'Lasagna', type: 'dinner', isSpecial: true,
    description: 'Layered pasta with meat and cheese',
    ingredients: ['Lasagna Sheets', 'Ground Beef', 'Ricotta', 'Mozzarella', 'Tomato Sauce'],
    nutritionalInfo: { calories: 650, protein: 45, carbs: 55, fat: 28, servingSize: '450g' },
    instructions: ['Brown beef and simmer into a thick sauce.', 'Layer pasta, sauce, and cheese in a baking dish.', 'Repeat for 3-4 layers.', 'Bake covered for 30 minutes, then uncovered for 10.']
  },
  // --- CHINESE ---
  {
    id: 'db-5', name: 'Kung Pao Chicken', type: 'dinner', isSpecial: false,
    description: 'Spicy stir-fry with peanuts',
    ingredients: ['Chicken', 'Peanuts', 'Chili Peppers', 'Soy Sauce', 'Vinegar', 'Garlic'],
    nutritionalInfo: { calories: 380, protein: 28, carbs: 15, fat: 22, servingSize: '300g' },
    instructions: ['Stir-fry chicken in a wok until opaque.', 'Add chili peppers, peanuts, and garlic.', 'Whisk sauce ingredients and pour into the wok.', 'Cook until sauce thickens and coats everything.']
  },
  {
    id: 'db-6', name: 'Dim Sum', type: 'lunch', isSpecial: false,
    description: 'Steamed dumplings',
    ingredients: ['Flour Wrappers', 'Shrimp/Meat', 'Ginger', 'Green Onion', 'Soy Sauce'],
    nutritionalInfo: { calories: 120, protein: 8, carbs: 15, fat: 3, servingSize: '3 pieces' },
    instructions: ['Place a spoonful of filling in each wrapper.', 'Pleat the edges to seal.', 'Steam in a bamboo basket for 8-10 minutes.']
  },
  // --- MEXICAN ---
  {
    id: 'db-7', name: 'Beef Tacos', type: 'dinner', isSpecial: false,
    description: 'Traditional corn tortillas with beef',
    ingredients: ['Corn Tortillas', 'Ground Beef', 'Lettuce', 'Cheese', 'Cumin', 'Salsa'],
    nutritionalInfo: { calories: 310, protein: 22, carbs: 24, fat: 14, servingSize: '2 tacos' },
    instructions: ['Brown beef with cumin and salt.', 'Warm tortillas on a griddle.', 'Fill with beef and top with fresh garnishes and salsa.']
  },
  {
    id: 'db-8', name: 'Guacamole', type: 'snack', isSpecial: false,
    description: 'Avocado dip',
    ingredients: ['Avocado', 'Lime Juice', 'Cilantro', 'Red Onion', 'Tomato'],
    nutritionalInfo: { calories: 150, protein: 2, carbs: 8, fat: 13, servingSize: '100g' },
    instructions: ['Mash avocados in a bowl.', 'Stir in lime juice, chopped onion, and cilantro.', 'Season with salt and serve immediately.']
  },
  // --- JAPANESE ---
  {
    id: 'db-9', name: 'Sushi Rolls (Maki)', type: 'lunch', isSpecial: true,
    description: 'Rice and seaweed rolls',
    ingredients: ['Sushi Rice', 'Nori (Seaweed)', 'Cucumber', 'Avocado', 'Raw Fish'],
    nutritionalInfo: { calories: 280, protein: 12, carbs: 45, fat: 6, servingSize: '6 pieces' },
    instructions: ['Spread rice on nori sheet.', 'Place fillings in the center.', 'Roll tightly using a bamboo mat.', 'Slice into small circular pieces.']
  },
  {
    id: 'db-10', name: 'Miso Soup', type: 'snack', isSpecial: false,
    description: 'Fermented soybean soup',
    ingredients: ['Miso Paste', 'Tofu', 'Seaweed', 'Dashi Stock', 'Green Onion'],
    nutritionalInfo: { calories: 80, protein: 6, carbs: 10, fat: 2, servingSize: '250g' },
    instructions: ['Heat dashi stock until simmering.', 'Whisk in miso paste until dissolved.', 'Add cubed tofu and seaweed.', 'Remove from heat and garnish with onions.']
  },
  // --- AMERICAN ---
  {
    id: 'db-11', name: 'Cheeseburger', type: 'lunch', isSpecial: false,
    description: 'Juicy beef patty with cheese',
    ingredients: ['Burger Bun', 'Ground Beef', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Onion'],
    nutritionalInfo: { calories: 520, protein: 35, carbs: 40, fat: 28, servingSize: '1 burger' },
    instructions: ['Form beef into patties and season.', 'Grill 4-5 mins per side.', 'Top with cheese until melted.', 'Serve in toasted buns with fresh veggies.']
  },
  {
    id: 'db-12', name: 'Caesar Salad', type: 'lunch', isSpecial: false,
    description: 'Romaine lettuce with creamy dressing',
    ingredients: ['Romaine Lettuce', 'Croutons', 'Parmesan', 'Caesar Dressing', 'Black Pepper'],
    nutritionalInfo: { calories: 280, protein: 10, carbs: 18, fat: 20, servingSize: '300g' },
    instructions: ['Tear lettuce into bite-size pieces.', 'Toss with dressing and croutons.', 'Shower with parmesan shavings.']
  },
  // --- MIDDLE EASTERN ---
  {
    id: 'db-13', name: 'Hummus', type: 'snack', isSpecial: false,
    description: 'Creamy chickpea dip',
    ingredients: ['Chickpeas', 'Tahini', 'Lemon Juice', 'Garlic', 'Olive Oil', 'Paprika'],
    nutritionalInfo: { calories: 220, protein: 8, carbs: 20, fat: 12, servingSize: '150g' },
    instructions: ['Blend chickpeas, tahini, lemon, and garlic until smooth.', 'Drizzle olive oil and sprinkle paprika on top.']
  },
  {
    id: 'db-14', name: 'Falafel', type: 'lunch', isSpecial: false,
    description: 'Deep-fried chickpea balls',
    ingredients: ['Chickpeas', 'Parsley', 'Garlic', 'Onion', 'Cumin', 'Flour'],
    nutritionalInfo: { calories: 350, protein: 15, carbs: 45, fat: 15, servingSize: '4 balls' },
    instructions: ['Pulse soaked chickpeas and herbs in a processor.', 'Form into balls or patties.', 'Deep fry until golden brown and crispy.']
  },
  // --- ARABIC / MEDITERRANEAN ---
  {
    id: 'db-15', name: 'Shakshuka', type: 'breakfast', isSpecial: true,
    description: 'Poached eggs in tomato sauce',
    ingredients: ['Eggs', 'Tomatoes', 'Bell Pepper', 'Onion', 'Garlic', 'Paprika', 'Cumin'],
    nutritionalInfo: { calories: 320, protein: 16, carbs: 20, fat: 18, servingSize: '350g' },
    instructions: ['Saute onions and peppers until soft.', 'Add tomatoes and spices and simmer for 15 mins.', 'Make small wells and crack eggs into them.', 'Cover and cook until egg whites are set but yolks are runny.']
  },
  // --- FRENCH ---
  {
    id: 'db-16', name: 'French Onion Soup', type: 'dinner', isSpecial: false,
    description: 'Sweet caramelized onion soup',
    ingredients: ['Onions', 'Beef Broth', 'Butter', 'Thyme', 'Gruyere Cheese', 'Baguette'],
    nutritionalInfo: { calories: 420, protein: 15, carbs: 35, fat: 22, servingSize: '400g' },
    instructions: ['Caramelize onions slowly in butter for 45 mins.', 'Add broth and thyme; simmer.', 'Top with baguette slice and cheese, then broil until bubbly.']
  },
  // --- THAI ---
  {
    id: 'db-17', name: 'Pad Thai', type: 'dinner', isSpecial: false,
    description: 'Stir-fried rice noodles',
    ingredients: ['Rice Noodles', 'Shrimp/Chicken', 'Peanuts', 'Bean Sprouts', 'Egg', 'Tamarind Sauce'],
    nutritionalInfo: { calories: 480, protein: 22, carbs: 65, fat: 18, servingSize: '450g' },
    instructions: ['Soak noodles until soft.', 'Stir-fry protein and set aside.', 'Scramble eggs, add noodles and tamarind sauce.', 'Toss in sprouts and set aside. Top with peanuts.']
  },
  {
    id: 'db-18', name: 'Green Curry', type: 'dinner', isSpecial: true,
    description: 'Spicy coconut milk curry',
    ingredients: ['Green Curry Paste', 'Coconut Milk', 'Bamboo Shoots', 'Basil', 'Chicken/Tofu'],
    nutritionalInfo: { calories: 410, protein: 25, carbs: 12, fat: 32, servingSize: '350g' },
    instructions: ['Fry curry paste in a little coconut cream.', 'Add protein and rest of coconut milk.', 'Add veggies and simmer until tender.', 'Season with fish sauce and palm sugar.']
  },
  // --- KOREAN ---
  {
    id: 'db-19', name: 'Bibimbap', type: 'lunch', isSpecial: false,
    description: 'Korean mixed rice with veggies',
    ingredients: ['Rice', 'Beef', 'Spinach', 'Mushrooms', 'Egg', 'Gochujang (Chili Paste)'],
    nutritionalInfo: { calories: 550, protein: 32, carbs: 75, fat: 15, servingSize: '1 bowl' },
    instructions: ['Sauté each veggie and meat separately.', 'Serve over warm rice in sections.', 'Top with a fried egg and a spoonful of gochujang.']
  },
  {
    id: 'db-20', name: 'Kimchi Stew (Kimchi Jjigae)', type: 'dinner', isSpecial: false,
    description: 'Spicy fermented cabbage soup',
    ingredients: ['Kimchi', 'Pork Belly', 'Tofu', 'Green Onion', 'Gochugaru (Chili Flakes)'],
    nutritionalInfo: { calories: 380, protein: 24, carbs: 15, fat: 22, servingSize: '400g' },
    instructions: ['Stir-fry kimchi and pork belly.', 'Add water/anchovy stock and gochugaru.', 'Simmer for 20 minutes.', 'Add tofu and cook for 5 more minutes.']
  },
  // --- GREEK ---
  {
    id: 'db-21', name: 'Moussaka', type: 'dinner', isSpecial: true,
    description: 'Eggplant and potato bake',
    ingredients: ['Eggplant', 'Ground Lamb/Beef', 'Tomato', 'Bechamel Sauce', 'Potatoes'],
    nutritionalInfo: { calories: 580, protein: 28, carbs: 45, fat: 32, servingSize: '450g' },
    instructions: ['Fry slices of eggplant and potato.', 'Layer with a rich spiced meat sauce.', 'Top with thick bechamel sauce.', 'Bake until golden brown.']
  },
  {
    id: 'db-22', name: 'Greek Salad', type: 'lunch', isSpecial: false,
    description: 'Fresh salad with feta',
    ingredients: ['Cucumber', 'Tomato', 'Olives', 'Feta Cheese', 'Red Onion', 'Dried Oregano'],
    nutritionalInfo: { calories: 210, protein: 8, carbs: 12, fat: 15, servingSize: '300g' },
    instructions: ['Chop veggies into large chunks.', 'Combine in a bowl with olives.', 'Top with a solid block of feta, oregano, and olive oil.']
  },
  // --- TURKISH ---
  {
    id: 'db-23', name: 'Kebab', type: 'dinner', isSpecial: false,
    description: 'Grilled skewed meat',
    ingredients: ['Ground Meat', 'Cumin', 'Sumac', 'Garlic', 'Bell Pepper'],
    nutritionalInfo: { calories: 350, protein: 30, carbs: 5, fat: 24, servingSize: '2 skewers' },
    instructions: ['Mix meat with spices and garlic.', 'Thread onto flat skewers.', 'Grill over charcoal for best smoky flavor.']
  },
  // --- SPANISH ---
  {
    id: 'db-24', name: 'Paella', type: 'dinner', isSpecial: true,
    description: 'Saffron rice with seafood',
    ingredients: ['Rice', 'Saffron', 'Shrimp', 'Mussels', 'Chicken', 'Peas', 'Bell Pepper'],
    nutritionalInfo: { calories: 520, protein: 35, carbs: 70, fat: 12, servingSize: '1 large plate' },
    instructions: ['Brown chicken and set aside.', 'Sauté veggies, add rice and saffron-infused stock.', 'Arrange seafood on top and cook until liquid is absorbed.', 'Avoid stirring to form a crust (socarrat) at the bottom.']
  },
  // --- VIETNAMESE ---
  {
    id: 'db-25', name: 'Pho', type: 'lunch', isSpecial: false,
    description: 'Beef noodle soup',
    ingredients: ['Rice Noodles', 'Beef slices', 'Basics (Star Anise, Cinnamon)', 'Beef Stock', 'Fresh Herbs'],
    nutritionalInfo: { calories: 350, protein: 25, carbs: 55, fat: 8, servingSize: '500ml' },
    instructions: ['Char ginger and onion, simmer in stock with spices for hours.', 'Blanch noodles and place in a bowl with raw beef slices.', 'Pour boiling hot stock over to cook the beef instantly.', 'Garnish with basil and lime.']
  },
  // --- BRAZILIAN ---
  {
    id: 'db-26', name: 'Feijoada', type: 'dinner', isSpecial: true,
    description: 'Black bean and pork stew',
    ingredients: ['Black Beans', 'Pork Ribs', 'Sausage', 'Bacon', 'Garlic', 'Bay Leaves'],
    nutritionalInfo: { calories: 720, protein: 55, carbs: 45, fat: 38, servingSize: '500g' },
    instructions: ['Soak beans overnight.', 'Boil beans with pork and sausage until tender.', 'Sauté garlic and mix into the beans.', 'Serve with rice and orange slices.']
  },
  // --- PERUVIAN ---
  {
    id: 'db-27', name: 'Ceviche', type: 'lunch', isSpecial: false,
    description: 'Fresh raw fish cured in citrus',
    ingredients: ['White Fish', 'Lime Juice', 'Red Onion', 'Chili Pepper', 'Cilantro'],
    nutritionalInfo: { calories: 240, protein: 32, carbs: 12, fat: 4, servingSize: '250g' },
    instructions: ['Cut fish into small cubes.', 'Toss with lime juice and let sit for 15-20 mins (cold).', 'Add onion, chili, and cilantro just before serving.']
  },
  // --- ETHIOPIAN ---
  {
    id: 'db-28', name: 'Injera & Doro Wat', type: 'dinner', isSpecial: true,
    description: 'Spicy chicken stew with spongy bread',
    ingredients: ['Teff Flour', 'Chicken', 'Berbere Spice', 'Onions', 'Niter Kibbeh (Spiced Butter)'],
    nutritionalInfo: { calories: 510, protein: 35, carbs: 65, fat: 15, servingSize: '1 large plate' },
    instructions: ['Ferment teff batter for 2-3 days for injera.', 'Slow-cook onions for hours until brown.', 'Add butter, spices, and chicken; simmer until tender.', 'Serve stew on top of the large flatbread.']
  },
  // --- MOROCCAN ---
  {
    id: 'db-29', name: 'Chicken Tagine', type: 'dinner', isSpecial: false,
    description: 'Slow-cooked stew with olives and lemon',
    ingredients: ['Chicken Thighs', 'Green Olives', 'Preserved Lemon', 'Saffron', 'Couscous'],
    nutritionalInfo: { calories: 430, protein: 28, carbs: 40, fat: 18, servingSize: '400g' },
    instructions: ['Brown chicken in a tagine or pot.', 'Sauté onions and spices.', 'Add olives, lemon, and a splash of water.', 'Simmer low until chicken is falling off the bone.']
  },
  // --- THAI (More) ---
  {
    id: 'db-30', name: 'Tom Yum Soup', type: 'snack', isSpecial: false,
    description: 'Hot and sour shrimp soup',
    ingredients: ['Shrimp', 'Lemongrass', 'Galangal', 'Kaffir Lime Leaves', 'Chili Paste'],
    nutritionalInfo: { calories: 180, protein: 18, carbs: 12, fat: 5, servingSize: '300ml' },
    instructions: ['Boil water with herbs until fragrant.', 'Add shrimp and mushrooms.', 'Stir in chili paste and fish sauce.', 'Finish with lime juice and fresh cilantro.']
  },
  // --- RUSSIAN ---
  {
    id: 'db-31', name: 'Beef Stroganoff', type: 'dinner', isSpecial: false,
    description: 'Beef in creamy mushroom sauce',
    ingredients: ['Beef Strips', 'Mushrooms', 'Sour Cream', 'Onion', 'Egg Noodles'],
    nutritionalInfo: { calories: 580, protein: 35, carbs: 45, fat: 32, servingSize: '400g' },
    instructions: ['Sauté beef and mushrooms until browned.', 'Stir in onions and cook until soft.', 'Lower heat and mix in sour cream.', 'Serve over hot egg noodles.']
  },
  {
    id: 'db-32', name: 'Borscht', type: 'lunch', isSpecial: false,
    description: 'Beetroot soup',
    ingredients: ['Beets', 'Cabbage', 'Potatoes', 'Beef', 'Sour Cream'],
    nutritionalInfo: { calories: 280, protein: 12, carbs: 32, fat: 10, servingSize: '400ml' },
    instructions: ['Simmer beef and beets until soft.', 'Add cabbage and potatoes.', 'Cook until veggies are tender.', 'Serve hot with a dollop of sour cream.']
  },
  // --- GERMAN ---
  {
    id: 'db-33', name: 'Schnitzel', type: 'dinner', isSpecial: false,
    description: 'Breaded fried meat',
    ingredients: ['Pork/Veal', 'Breadcrumbs', 'Egg', 'Flour', 'Lemon Plates'],
    nutritionalInfo: { calories: 620, protein: 38, carbs: 42, fat: 30, servingSize: '300g' },
    instructions: ['Pound meat until thin.', 'Coat in flour, then egg, then breadcrumbs.', 'Fry in hot oil until golden.', 'Serve with lemon wedges.']
  },
  // --- VIETNAMESE (More) ---
  {
    id: 'db-34', name: 'Banh Mi', type: 'lunch', isSpecial: false,
    description: 'Vietnamese sandwich',
    ingredients: ['Baguette', 'Pork/Pate', 'Pickled Carrots', 'Cucumber', 'Cilantro', 'Mayo'],
    nutritionalInfo: { calories: 450, protein: 22, carbs: 55, fat: 18, servingSize: '1 sandwich' },
    instructions: ['Toast the baguette.', 'Spread mayo and pate.', 'Fill with meat and pickled veggies.', 'Top with cilantro and chili slices.']
  },
  // --- PHILIPPINO ---
  {
    id: 'db-35', name: 'Adobo', type: 'dinner', isSpecial: false,
    description: 'Meat braised in soy and vinegar',
    ingredients: ['Chicken/Pork', 'Soy Sauce', 'Vinegar', 'Garlic', 'Peppercorns', 'Bay Leaves'],
    nutritionalInfo: { calories: 410, protein: 32, carbs: 8, fat: 28, servingSize: '350g' },
    instructions: ['Marinate meat in soy sauce and garlic.', 'Simmer in a pot with vinegar and spices until tender.', 'Pan-fry the meat pieces for a crispy finish.', 'Reduce the sauce and pour over.']
  },
  // --- LEBANESE ---
  {
    id: 'db-36', name: 'Tabbouleh', type: 'snack', isSpecial: false,
    description: 'Parsley and bulgur salad',
    ingredients: ['Parsley', 'Bulgur Wheat', 'Tomato', 'Mint', 'Lemon Juice'],
    nutritionalInfo: { calories: 180, protein: 4, carbs: 25, fat: 8, servingSize: '250g' },
    instructions: ['Soak bulgur until soft.', 'Finely chop a huge amount of parsley.', 'Mix with tomatoes, mint, and lemon-oil dressing.']
  },
  // --- EGYPTIAN ---
  {
    id: 'db-37', name: 'Koshary', type: 'lunch', isSpecial: true,
    description: 'Rice, lentils, and pasta mix',
    ingredients: ['Rice', 'Lentils', 'Macaroni', 'Chickpeas', 'Fried Onions', 'Tomato Sauce'],
    nutritionalInfo: { calories: 520, protein: 18, carbs: 85, fat: 10, servingSize: '450g' },
    instructions: ['Cook rice/lentils and pasta separately.', 'Mix them together.', 'Top with spicy tomato sauce and crispy fried onions.']
  },
  // --- SOUTH AFRICAN ---
  {
    id: 'db-38', name: 'Bobotie', type: 'dinner', isSpecial: true,
    description: 'Spiced minced meat with egg topping',
    ingredients: ['Minced Beef', 'Curry Powder', 'Bread soaked in milk', 'Raisins', 'Eggs', 'Milk'],
    nutritionalInfo: { calories: 480, protein: 25, carbs: 32, fat: 28, servingSize: '400g' },
    instructions: ['Cook mince with onions, spices, and raisins.', 'Place in a dish and top with egg-milk custard.', 'Bake until the custard is set and golden brown.']
  },
  // --- BRITISH ---
  {
    id: 'db-39', name: 'Fish and Chips', type: 'dinner', isSpecial: false,
    description: 'Battered fish with fried potatoes',
    ingredients: ['Cod/Haddock', 'Flour', 'Beer/Water', 'Potatoes', 'Tartar Sauce'],
    nutritionalInfo: { calories: 750, protein: 35, carbs: 65, fat: 38, servingSize: '500g' },
    instructions: ['Make a thick flour and beer batter.', 'Coat fish and deep fry until crispy.', 'Hand-cut and double-fry the potatoes.']
  },
  {
    id: 'db-40', name: 'Shepherd’s Pie', type: 'dinner', isSpecial: false,
    description: 'Meat pie with mashed potato crust',
    ingredients: ['Ground Lamb', 'Peas', 'Carrots', 'Mashed Potatoes', 'Gravy'],
    nutritionalInfo: { calories: 520, protein: 28, carbs: 45, fat: 24, servingSize: '400g' },
    instructions: ['Sauté lamb with veggies and gravy.', 'Spread in a baking dish.', 'Cover with thick mashed potatoes.', 'Bake until the top is peaked and browned.']
  },
  // --- PORTUGUESE ---
  {
    id: 'db-41', name: 'Piri Piri Chicken', type: 'dinner', isSpecial: false,
    description: 'Spicy grilled chicken',
    ingredients: ['Chicken Coat', 'Piri Piri Chilis', 'Garlic', 'Lemon Juice', 'Paprika'],
    nutritionalInfo: { calories: 380, protein: 35, carbs: 5, fat: 22, servingSize: '350g' },
    instructions: ['Make a paste of chilis, garlic, and oil.', 'Marinate chicken for 4+ hours.', 'Grill until charred and spicy.']
  },
  // --- INDIAN (More) ---
  {
    id: 'db-42', name: 'Biryani', type: 'dinner', isSpecial: true,
    description: 'Fragrant spiced rice with meat',
    ingredients: ['Basmati Rice', 'Chicken/Lamb', 'Saffron', 'Mint', 'Yogurt', 'Onions'],
    nutritionalInfo: { calories: 650, protein: 42, carbs: 85, fat: 18, servingSize: '1 large plate' },
    instructions: ['Par-boil rice with whole spices.', 'Marinate meat in yogurt and masala.', 'Layer rice and meat in a heavy pot (Dum cooking).', 'Seal and slow-cook for 45 minutes.']
  },
  {
    id: 'db-43', name: 'Dosa', type: 'breakfast', isSpecial: false,
    description: 'Thin crispy fermented crepe',
    ingredients: ['Rice & Lentil Batter', 'Oil/Ghee', 'Potato Masala'],
    nutritionalInfo: { calories: 280, protein: 8, carbs: 45, fat: 6, servingSize: '2 dosas' },
    instructions: ['Spread fermented batter on a hot griddle.', 'Drizzle oil and cook until crispy.', 'Stuff with potato masala and fold.']
  },
  {
    id: 'db-44', name: 'Samosa', type: 'snack', isSpecial: false,
    description: 'Crispy pastry with spicy filling',
    ingredients: ['Flour Crust', 'Potatoes', 'Peas', 'Spices'],
    nutritionalInfo: { calories: 150, protein: 3, carbs: 22, fat: 8, servingSize: '2 pieces' },
    instructions: ['Make cones from dough.', 'Fill with spicy potato mash.', 'Deep fry until golden brown.']
  },
  // --- SWISS ---
  {
    id: 'db-45', name: 'Cheese Fondue', type: 'dinner', isSpecial: true,
    description: 'Melted cheese for dipping',
    ingredients: ['Gruyere Cheese', 'Emmental Cheese', 'Garlic', 'White Wine', 'Bread Cubes'],
    nutritionalInfo: { calories: 750, protein: 45, carbs: 40, fat: 48, servingSize: '400g' },
    instructions: ['Rub pot with garlic.', 'Melt cheeses slowly with wine.', 'Dip bread cubes using long forks.']
  },
  // --- INDONESIAN ---
  {
    id: 'db-46', name: 'Nasi Goreng', type: 'dinner', isSpecial: false,
    description: 'Indonesian fried rice',
    ingredients: ['Rice', 'Sweet Soy Sauce (Kecap Manis)', 'Shrimp', 'Fried Egg', 'Shallots'],
    nutritionalInfo: { calories: 480, protein: 20, carbs: 70, fat: 15, servingSize: '400g' },
    instructions: ['Stir-fry cold rice with shrimp and kecap manis.', 'Top with a sunny-side-up egg and crispy fried shallots.']
  },
  // --- POLISH ---
  {
    id: 'db-47', name: 'Pierogi', type: 'lunch', isSpecial: false,
    description: 'Stuffed dumplings',
    ingredients: ['Dough Wrappers', 'Potato', 'Cheese', 'Butter', 'Onions'],
    nutritionalInfo: { calories: 350, protein: 12, carbs: 55, fat: 12, servingSize: '6 pieces' },
    instructions: ['Stuff dough with potato-cheese mash.', 'Boil until they float.', 'Sauté in butter with onions until crispy.']
  },
  // --- CANADIAN ---
  {
    id: 'db-48', name: 'Poutine', type: 'snack', isSpecial: false,
    description: 'Fries with cheese curds and gravy',
    ingredients: ['Fries', 'Cheese Curds', 'Brown Gravy'],
    nutritionalInfo: { calories: 550, protein: 15, carbs: 65, fat: 28, servingSize: '400g' },
    instructions: ['Heat hot fries.', 'Scatter cold cheese curds.', 'Pour hot gravy over to melt the cheese slightly.']
  },
  {
    id: 'db-49', name: 'Pancakes with Maple Syrup', type: 'breakfast', isSpecial: false,
    description: 'Classic fluffy pancakes',
    ingredients: ['Pancake Mix', 'Eggs', 'Milk', 'Maple Syrup', 'Butter'],
    nutritionalInfo: { calories: 420, protein: 10, carbs: 75, fat: 8, servingSize: '3 pancakes' },
    instructions: ['Whisk batter until mostly smooth.', 'Cook on a buttered griddle.', 'Stack and drench in real maple syrup.']
  },
  {
    id: 'db-50', name: 'Falafel Wrap', type: 'lunch', isSpecial: false,
    description: 'Pita bread with falafel balls',
    ingredients: ['Pita Bread', 'Falafel', 'Hummus', 'Tahini', 'Pickles'],
    nutritionalInfo: { calories: 450, protein: 15, carbs: 60, fat: 18, servingSize: '1 wrap' },
    instructions: ['Spread hummus on pita.', 'Add hot falafel and pickles.', 'Drizzle tahini and wrap tightly.']
  },
  {
    id: 'db-51', name: 'Roti (Chapati)', type: 'lunch', isSpecial: false,
    description: 'Traditional Indian whole wheat flatbread',
    ingredients: ['Whole Wheat Flour (Atta)', 'Water', 'Salt', 'Ghee'],
    nutritionalInfo: { calories: 120, protein: 3, carbs: 22, fat: 2, servingSize: '1 roti' },
    instructions: ['Knead flour and water into a soft dough.', 'Rest for 20 mins.', 'Roll into thin circles.', 'Cook on hot tawa until puffed.']
  },
  {
    id: 'db-52', name: 'Potato fry (Aloo Fry)', type: 'lunch', isSpecial: false,
    description: 'Crispy spiced potato stir-fry',
    ingredients: ['Potatoes', 'Cumin Seeds', 'Turmeric', 'Chili Powder', 'Curry Leaves'],
    nutritionalInfo: { calories: 210, protein: 3, carbs: 32, fat: 8, servingSize: '200g' },
    instructions: ['Dice potatoes into small cubes.', 'Temper oil with cumin and curry leaves.', 'Add potatoes and spices.', 'Fry on low heat until crispy and golden.']
  },
];
