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
  const [view, setView] = useState<'landing' | 'auth' | 'lobby' | 'app'>(() => {
    return (localStorage.getItem('cn_view') as any) || 'landing';
  });
  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from memory if refreshing
  useEffect(() => {
    const savedRoomId = localStorage.getItem('cn_active_room_id');
    const savedUser = localStorage.getItem('cn_active_user');
    
    if (savedRoomId) {
      getRoomById(savedRoomId).then(r => {
        if (r) {
          setRoom(r);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Sync view to persistence
  useEffect(() => {
    localStorage.setItem('cn_view', view);
  }, [view]);

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
    localStorage.setItem('cn_active_user', JSON.stringify(u));
    setView('app');
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

  if (loading && view !== 'landing') {
    return (
      <Layout currentUser={null}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium">Restoring your session...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
        currentUser={user} 
        roomName={room?.name} 
        onLogout={handleUserLogout}
        onBack={view === 'auth' ? () => {
          setView('landing');
          localStorage.setItem('cn_view', 'landing');
        } : undefined}
    >
      {view === 'landing' && <Landing onStart={handleStart} />}
      
      {view === 'auth' && <RoomAuth onRoomEntered={handleRoomEntered} onBack={() => {
        setView('landing');
        localStorage.setItem('cn_view', 'landing');
      }} />}
      
      {view === 'lobby' && (
        room ? (
          <RoomLobby 
              room={room} 
              onUserLogin={handleUserLogin} 
              onExitRoom={handleExitRoom} 
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-500 mb-4">Room not found or session expired.</p>
            <button onClick={handleExitRoom} className="text-orange-600 font-bold underline">Go Back Home</button>
          </div>
        )
      )}
      
      {view === 'app' && (
        room && user ? (
          <>
            {user.role === 'homemaker' ? (
              <HomemakerDashboard room={room} onRefresh={handleRefreshData} />
            ) : (
              <FamilyDashboard room={room} user={user} onRefresh={handleRefreshData} />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-stone-500 mb-4">Session expired.</p>
            <button onClick={handleExitRoom} className="text-orange-600 font-bold underline">Go Back Home</button>
          </div>
        )
      )}
    </Layout>
  );
};

export default App;
