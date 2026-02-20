import { Room, User } from '../types';
import { DEFAULT_RECIPES, DEFAULT_USERS, DEFAULT_SHOPPING_LIST, DEFAULT_WISHES } from '../constants';

const API = '/api';

const generateId = () => Math.random().toString(36).substr(2, 9);

// ─── GET ROOM BY ID ──────────────────────────────────────────
export const getRoomById = async (id: string): Promise<Room | undefined> => {
  try {
    const res = await fetch(`${API}/rooms/${id}`);
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
};

// ─── ENTER ROOM (by name + password) ────────────────────────
export const getRoom = async (name: string, password: string): Promise<Room | undefined> => {
  try {
    const res = await fetch(`${API}/rooms/enter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
};

// ─── CREATE ROOM ─────────────────────────────────────────────
export const createRoom = async (name: string, password: string): Promise<Room> => {
  const res = await fetch(`${API}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      password,
      users: [...DEFAULT_USERS],
      recipes: [...DEFAULT_RECIPES],
      shoppingList: [...DEFAULT_SHOPPING_LIST],
      wishLists: [...DEFAULT_WISHES]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create room');
  return data;
};

// ─── UPDATE FULL ROOM DATA ───────────────────────────────────
export const updateRoomData = async (roomId: string, updates: Partial<Room>): Promise<Room | null> => {
  try {
    const res = await fetch(`${API}/rooms/${roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// ─── ADD OR UPDATE USER IN ROOM ──────────────────────────────
export const updateUserInRoom = async (roomId: string, user: User): Promise<void> => {
  await fetch(`${API}/rooms/${roomId}/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
};

// ─── REMOVE USER FROM ROOM ───────────────────────────────────
export const removeUserFromRoom = async (roomId: string, userId: string): Promise<void> => {
  await fetch(`${API}/rooms/${roomId}/users/${userId}`, {
    method: 'DELETE'
  });
};