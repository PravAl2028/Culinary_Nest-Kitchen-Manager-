import React, { useState } from 'react';
import { LogIn, PlusCircle } from 'lucide-react';
import { createRoom, getRoom } from '../services/storage';
import { Room } from '../types';

interface RoomAuthProps {
  onRoomEntered: (room: Room) => void;
  onBack: () => void;
}

export const RoomAuth: React.FC<RoomAuthProps> = ({ onRoomEntered, onBack }) => {
  const [mode, setMode] = useState<'enter' | 'create'>('enter');
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'enter') {
      const room = await getRoom(roomName, roomPassword);
      if (room) {
        onRoomEntered(room);
      } else {
        setError('Invalid room name or password.');
      }
    } else {
      try {
        if (!roomName.trim() || !roomPassword.trim()) {
            throw new Error("Please fill in all fields");
        }
        const room = await createRoom(roomName, roomPassword);
        onRoomEntered(room);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 w-full transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-stone-900 dark:text-white">
            {mode === 'enter' ? 'Enter Family Room' : 'Create New Room'}
        </h2>

        <form onSubmit={handleRoomSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Room Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="e.g. SmithFamily"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">Room Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
                value={roomPassword}
                onChange={e => setRoomPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-500 transition shadow-md flex items-center justify-center gap-2"
            >
              {mode === 'enter' ? <LogIn size={20} /> : <PlusCircle size={20} />}
              {mode === 'enter' ? 'Enter Room' : 'Create Room'}
            </button>

            <div className="text-center mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                className="text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 underline transition"
                onClick={() => {
                    setMode(mode === 'enter' ? 'create' : 'enter');
                    setError('');
                    setRoomName('');
                    setRoomPassword('');
                }}
              >
                {mode === 'enter' ? "New here? Create a family room" : "Already have a room? Login"}
              </button>
            </div>
            <div className="text-center">
                <button type="button" onClick={onBack} className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition">Back to Home</button>
            </div>
        </form>
      </div>
    </div>
  );
};
