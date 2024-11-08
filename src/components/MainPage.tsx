import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, CircleDot, UserPlus, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { getGalleries } from '../lib/gallery-service';
import type { Gallery } from '../lib/supabase-types';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGalleries = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getGalleries();
        setGalleries(data);
      } catch (err) {
        console.error('Error loading galleries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load galleries');
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/${category}`);
  };

  const defaultGalleries = [
    {
      id: 'handball',
      name: 'Handball',
      icon: <CircleDot className="w-16 h-16 text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
    },
    {
      id: 'physical',
      name: 'Physical',
      icon: <Dumbbell className="w-16 h-16 text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-4">
        <div className="flex justify-end gap-2">
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                My Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4 pt-16 pb-32">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
          Video Gallery Platform
        </h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl">
          Explore curated video collections or create your own gallery to share with others
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {defaultGalleries.map((gallery) => (
            <button
              key={gallery.id}
              onClick={() => handleCategoryClick(gallery.id)}
              className="group flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {gallery.icon}
              <span className="text-2xl font-bold text-gray-800">{gallery.name}</span>
            </button>
          ))}

          {!user ? (
            <button
              onClick={() => navigate('/register')}
              className="group flex flex-col items-center justify-center p-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <UserPlus className="w-16 h-16 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-white">Register</span>
              <p className="text-white text-opacity-90 text-sm mt-2 text-center">Create your own gallery</p>
            </button>
          ) : (
            <>
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-12">
                  {error}
                </div>
              ) : (
                galleries.map((gallery) => (
                  <button
                    key={gallery.id}
                    onClick={() => handleCategoryClick(gallery.category)}
                    className="group flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CircleDot className="w-16 h-16 text-indigo-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-2xl font-bold text-gray-800">{gallery.name}</span>
                    {!gallery.is_public && (
                      <span className="mt-2 text-sm text-gray-500">(Private)</span>
                    )}
                  </button>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;