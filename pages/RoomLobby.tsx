import React, { useState } from 'react';
import { Room, User } from '../types';
import { updateUserInRoom } from '../services/storage';
import { User as UserIcon, LogOut, Plus, ChefHat, ArrowRight } from 'lucide-react';

interface RoomLobbyProps {
    room: Room;
    onUserLogin: (user: User) => void;
    onExitRoom: () => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({ room, onUserLogin, onExitRoom }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    
    // Create User Form State
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState<'member' | 'homemaker'>('member');
    const [newUserPassword, setNewUserPassword] = useState('');

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setPasswordInput('');
        setError('');
        setIsCreatingUser(false);
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        if (selectedUser.password === passwordInput) {
            onUserLogin(selectedUser);
        } else {
            setError('Incorrect password');
        }
    };

    const handleCreateUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newUserName.trim() || !newUserPassword.trim()) {
            setError('All fields are required');
            return;
        }

        const existingUser = room.users.find(u => u.name.toLowerCase() === newUserName.toLowerCase());
        if (existingUser) {
            setError('A user with this name already exists');
            return;
        }

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: newUserName,
            role: newUserRole,
            password: newUserPassword
        };

        await updateUserInRoom(room.id, newUser);
        onUserLogin(newUser);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 bg-stone-100 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                <div>
                    <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Who is cooking?</h2>
                    <p className="text-stone-500 dark:text-stone-400">Room: <span className="font-semibold text-orange-600 dark:text-orange-400">{room.name}</span></p>
                </div>
                <button 
                    onClick={onExitRoom}
                    className="flex items-center gap-2 text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 transition text-sm font-medium bg-white dark:bg-stone-800 px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-red-200 dark:hover:border-red-900"
                >
                    <LogOut size={16} /> Exit Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: User Selection */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-stone-700 dark:text-stone-300">Select Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {room.users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => handleUserClick(user)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${selectedUser?.id === user.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md ring-1 ring-orange-500' : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-sm'}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${user.role === 'homemaker' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}`}>
                                    {user.role === 'homemaker' ? <ChefHat size={20} /> : <UserIcon size={20} />}
                                </div>
                                <div className="font-bold text-stone-900 dark:text-white truncate">{user.name}</div>
                                <div className="text-xs text-stone-500 dark:text-stone-400 capitalize">{user.role === 'homemaker' ? 'Admin' : 'Member'}</div>
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                setIsCreatingUser(true);
                                setSelectedUser(null);
                                setError('');
                            }}
                            className={`p-4 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 flex flex-col items-center justify-center text-stone-400 dark:text-stone-500 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition min-h-[140px] ${isCreatingUser ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400' : ''}`}
                        >
                            <Plus size={32} className="mb-2" />
                            <span className="font-medium">Add Member</span>
                        </button>
                    </div>
                </div>

                {/* Right: Login/Create Form */}
                <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-lg border border-stone-100 dark:border-stone-800 flex flex-col justify-center min-h-[300px] transition-colors duration-300">
                    {selectedUser ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fadeIn">
                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedUser.role === 'homemaker' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}`}>
                                    {selectedUser.role === 'homemaker' ? <ChefHat size={32} /> : <UserIcon size={32} />}
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white">Hello, {selectedUser.name}!</h3>
                                <p className="text-stone-500 dark:text-stone-400 mt-1">Enter your password to cook.</p>
                            </div>
                            
                            <div>
                                <input 
                                    type="password"
                                    placeholder="Enter Password"
                                    className="w-full px-4 py-3.5 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center text-lg tracking-widest bg-stone-50 dark:bg-stone-800 dark:text-white transition-colors"
                                    value={passwordInput}
                                    onChange={e => setPasswordInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            
                            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}

                            <button type="submit" className="w-full bg-stone-900 dark:bg-stone-700 text-white font-bold py-3.5 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-600 transition flex items-center justify-center gap-2 shadow-md">
                                Login <ArrowRight size={20} />
                            </button>
                        </form>
                    ) : isCreatingUser ? (
                        <form onSubmit={handleCreateUserSubmit} className="space-y-5 animate-fadeIn">
                            <h3 className="text-2xl font-bold mb-6 text-center dark:text-white">New Profile</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Name</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Grandma"
                                    className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 dark:bg-stone-800 dark:text-white transition-colors"
                                    value={newUserName}
                                    onChange={e => setNewUserName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewUserRole('homemaker')}
                                        className={`p-3 rounded-lg border text-sm font-medium transition ${newUserRole === 'homemaker' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-700 dark:text-orange-400' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800'}`}
                                    >
                                        Homemaker
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewUserRole('member')}
                                        className={`p-3 rounded-lg border text-sm font-medium transition ${newUserRole === 'member' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500 text-orange-700 dark:text-orange-400' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800'}`}
                                    >
                                        Member
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">Create Password</label>
                                <input 
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-stone-50 dark:bg-stone-800 dark:text-white transition-colors"
                                    value={newUserPassword}
                                    onChange={e => setNewUserPassword(e.target.value)}
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

                            <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 dark:hover:bg-orange-500 transition shadow-md">
                                Create Profile
                            </button>
                        </form>
                    ) : (
                        <div className="text-center text-stone-400 dark:text-stone-600">
                            <UserIcon size={64} className="mx-auto mb-4 opacity-10" />
                            <p className="text-lg font-medium">Select a profile from the left<br/>or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
