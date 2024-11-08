import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, Users, Calendar } from 'lucide-react';

const GALLERIES = [
  {
    id: 'handball',
    name: 'Handball',
    description: 'Collection of handball training and match videos',
    videoCount: 24,
    viewCount: 1200,
    lastUpdated: '2024-03-15'
  },
  {
    id: 'physical',
    name: 'Physical',
    description: 'Physical training and workout videos',
    videoCount: 18,
    viewCount: 850,
    lastUpdated: '2024-03-14'
  }
];

const MyGalleriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Galleries</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GALLERIES.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {gallery.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {gallery.description}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <Video className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">{gallery.videoCount} videos</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">{gallery.viewCount} views</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">{new Date(gallery.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link
                    to={`/${gallery.id}`}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-center hover:bg-blue-600 transition-colors"
                  >
                    View Gallery
                  </Link>
                  <Link
                    to={`/${gallery.id}/manage`}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-center hover:bg-gray-200 transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyGalleriesPage;