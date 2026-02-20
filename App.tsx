import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { RoomAuth } from './pages/RoomAuth';
import { RoomLobby } from './pages/RoomLobby';
import { HomemakerDashboard } from './pages/HomemakerDashboard';
import { FamilyDashboard } from './pages/FamilyDashboard';
import { Room, User } from './types';
import { getRoomById } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'lobby' | 'app'>('landing');
  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Hydrate from memory if refreshing (simulate session)
  useEffect(() => {
    const savedRoomId = localStorage.getItem('cn_active_room_id');
    const savedUser = localStorage.getItem('cn_active_user');
    
    if (savedRoomId) {
      getRoomById(savedRoomId).then(r => {
        if (r) {
          setRoom(r);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setView('app');
          } else {
            setView('lobby');
          }
        }
      });
    }
  }, []);

  const handleStart = () => {
    setView('auth');
  };

  const handleRoomEntered = (r: Room) => {
    setRoom(r);
    localStorage.setItem('cn_active_room_id', r.id);
    setView('lobby');
  };

  const handleUserLogin = (u: User) => {
    setUser(u);
    setView('app');
    localStorage.setItem('cn_active_user', JSON.stringify(u));
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem('cn_active_user');
    setView('lobby');
  };

  const handleExitRoom = () => {
    setRoom(null);
    setUser(null);
    localStorage.removeItem('cn_active_room_id');
    localStorage.removeItem('cn_active_user');
    setView('landing');
  };

  const handleRefreshData = () => {
      // Re-fetch room data from storage to sync state
      if (room) {
        getRoomById(room.id).then(updated => {
          if (updated) setRoom(updated);
        });
      }
  };

  return (
    <Layout 
        currentUser={user} 
        roomName={room?.name} 
        onLogout={handleUserLogout} // This now just logs out the user
        onBack={view === 'auth' ? () => setView('landing') : undefined}
    >
      {view === 'landing' && <Landing onStart={handleStart} />}
      
      {view === 'auth' && <RoomAuth onRoomEntered={handleRoomEntered} onBack={() => setView('landing')} />}
      
      {view === 'lobby' && room && (
        <RoomLobby 
            room={room} 
            onUserLogin={handleUserLogin} 
            onExitRoom={handleExitRoom} 
        />
      )}
      
      {view === 'app' && room && user && (
        <>
          {user.role === 'homemaker' ? (
            <HomemakerDashboard room={room} onRefresh={handleRefreshData} />
          ) : (
            <FamilyDashboard room={room} user={user} onRefresh={handleRefreshData} />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
