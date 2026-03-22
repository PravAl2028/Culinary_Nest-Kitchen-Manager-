require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ─── MONGOOSE SCHEMA ─────────────────────────────────────────

const RoomSchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  users:        { type: mongoose.Schema.Types.Mixed, default: [] },
  recipes:      { type: mongoose.Schema.Types.Mixed, default: [] },
  inventory:    { type: mongoose.Schema.Types.Mixed, default: [] },
  shoppingList: { type: mongoose.Schema.Types.Mixed, default: [] },
  dailyPlans:   { type: mongoose.Schema.Types.Mixed, default: {} },
  wishLists:    { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);

const GlobalRequestSchema = new mongoose.Schema({
  dishName:   { type: String, required: true },
  roomId:     { type: String },
  requestedAt: { type: Date, default: Date.now }
});

const GlobalRequest = mongoose.model('GlobalRequest', GlobalRequestSchema);

const GeminiReferralSchema = new mongoose.Schema({
  dishName:   { type: String, required: true },
  roomId:     { type: String },
  referredAt: { type: Date, default: Date.now }
});

const GeminiReferral = mongoose.model('GeminiReferral', GeminiReferralSchema);

// ─── ROUTES ──────────────────────────────────────────────────

// GET /api/rooms/:id — get room by mongo id
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(roomToClient(room));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms/enter — find room by name + password
app.post('/api/rooms/enter', async (req, res) => {
  try {
    const { name, password } = req.body;
    const room = await Room.findOne({ name, password });
    if (!room) return res.status(401).json({ error: 'Invalid room name or password.' });
    res.json(roomToClient(room));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms — create a new room
app.post('/api/rooms', async (req, res) => {
  try {
    const { name, password, users, recipes, shoppingList, wishLists } = req.body;
    const exists = await Room.findOne({ name });
    if (exists) return res.status(409).json({ error: 'Room name already exists' });
    const room = await Room.create({ name, password, users, recipes, shoppingList, wishLists, inventory: [], dailyPlans: {} });
    res.status(201).json(roomToClient(room));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/rooms/:id — update entire room data
app.put('/api/rooms/:id', async (req, res) => {
  try {
    const updates = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(roomToClient(room));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/rooms/:id/users — add or update a user inside a room
app.put('/api/rooms/:id/users', async (req, res) => {
  try {
    const user = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const users = room.users || [];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) users.push(user);
    else users[idx] = user;

    room.users = users;
    room.markModified('users');
    await room.save();
    res.json(roomToClient(room));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/rooms/:id/users/:userId — remove a user from a room
app.delete('/api/rooms/:id/users/:userId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    room.users = (room.users || []).filter(u => u.id !== req.params.userId);
    room.markModified('users');
    await room.save();
    res.json(roomToClient(room));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/global/recipe-requests — log a missing recipe for the website owner
app.post('/api/global/recipe-requests', async (req, res) => {
  try {
    const { dishName, roomId } = req.body;
    if (!dishName) return res.status(400).json({ error: 'Dish name is required' });
    
    const request = await GlobalRequest.create({ dishName, roomId });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/global/gemini-referrals — log a redirection to external Gemini
app.post('/api/global/gemini-referrals', async (req, res) => {
  try {
    const { dishName, roomId } = req.body;
    if (!dishName) return res.status(400).json({ error: 'Dish name is required' });
    
    const referral = await GeminiReferral.create({ dishName, roomId });
    res.status(201).json(referral);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── HELPER: normalize mongo _id to id ───────────────────────
function roomToClient(room) {
  const obj = room.toObject ? room.toObject() : room;
  return { ...obj, id: obj._id.toString(), _id: undefined };
}

// ─── CONNECT & START ─────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
  console.error('❌ MongoDB connection failed (FULL ERROR):');
  console.error(err);
  process.exit(1);
  });