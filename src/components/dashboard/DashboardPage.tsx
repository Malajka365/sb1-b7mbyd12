import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import { LogOut, FolderPlus, Settings, Library, Home } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Return Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Gallery</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/dashboard/galleries"
            className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center">
              <Library className="w-10 h-10 text-blue-500 group-hover:text-blue-600 transition-colors" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">My Galleries</h3>
                <p className="mt-2 text-gray-600">View and manage your video galleries</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/create"
            className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center">
              <FolderPlus className="w-10 h-10 text-green-500 group-hover:text-green-600 transition-colors" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">Create Gallery</h3>
                <p className="mt-2 text-gray-600">Create a new video gallery</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/settings"
            className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center">
              <Settings className="w-10 h-10 text-purple-500 group-hover:text-purple-600 transition-colors" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">Settings</h3>
                <p className="mt-2 text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;