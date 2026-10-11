'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const CURRENT_USER_ID = 'uuid-de-prueba-123'; // Reemplazar con el ID del usuario logueado

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNextProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/feed/${CURRENT_USER_ID}`);
      const data = await res.json();
      setProfile(data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error cargando feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextProfile();
  }, []);

  const handleSwipe = async (action) => {
    if (!profile) return;

    try {
      const res = await fetch(`${API_URL}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: CURRENT_USER_ID,
          target_id: profile.id,
          action: action, // 'like' o 'pass'
        }),
      });
      const data = await res.json();
      
      if (data.match) {
        alert('¡Hubo Match! 🎉');
      }

      fetchNextProfile();
    } catch (error) {
      console.error('Error al enviar swipe:', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (!profile) return <div className="flex justify-center items-center h-screen">No hay más perfiles cerca.</div>;

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-96 bg-gray-300 relative">
          <img 
            src={profile.avatar_url || 'https://via.placeholder.com/400x500'} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
            <p className="text-sm opacity-90">{profile.bio}</p>
          </div>
        </div>
        <div className="flex justify-around p-4 bg-white">
          <button 
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 rounded-full bg-red-100 text-red-500 font-bold text-xl shadow hover:bg-red-200"
          >
            ✕
          </button>
          <button 
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 rounded-full bg-green-100 text-green-500 font-bold text-xl shadow hover:bg-green-200"
          >
            ♥
          </button>
        </div>
      </div>
    </main>
  );
}