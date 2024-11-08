import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Upload, Settings, Tags, Home } from 'lucide-react';
import VideoCard from './VideoCard';
import TagFilter from './TagFilter';
import { VideoData, TagGroup } from '../lib/supabase-types';
import { getVideos, getTagGroups } from '../lib/video-service';
import { useAuth } from '../lib/auth-context';

const VIDEOS_PER_PAGE_OPTIONS = [20, 50, 100];

const CategoryGallery: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [videosPerPage, setVideosPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTags, setActiveTags] = useState<{ [key: string]: string[] }>(() => {
    try {
      const tagsParam = searchParams.get('tags');
      return tagsParam ? JSON.parse(decodeURIComponent(tagsParam)) : {};
    } catch {
      return {};
    }
  });
  
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');

  useEffect(() => {
    if (!category) {
      navigate('/');
      return;
    }
    
    const loadData = async () => {
      try {
        const [videosData, tagGroupsData] = await Promise.all([
          getVideos(category),
          getTagGroups(category)
        ]);
        
        // If not logged in, only show public videos
        const filteredVideos = user ? videosData : videosData.filter(video => video.is_public);
        setVideos(filteredVideos);
        setTagGroups(tagGroupsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, navigate, user]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    if (Object.keys(activeTags).length > 0) {
      params.set('tags', encodeURIComponent(JSON.stringify(activeTags)));
    } else {
      params.delete('tags');
    }
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, activeTags, setSearchParams]);

  const handleTagToggle = (group: string, tagName: string) => {
    setActiveTags(prevTags => {
      const updatedTags = { ...prevTags };
      if (!updatedTags[group]) {
        updatedTags[group] = [];
      }
      
      const tagIndex = updatedTags[group].indexOf(tagName);
      if (tagIndex > -1) {
        updatedTags[group] = updatedTags[group].filter(t => t !== tagName);
        if (updatedTags[group].length === 0) {
          delete updatedTags[group];
        }
      } else {
        updatedTags[group] = [...updatedTags[group], tagName];
      }
      return updatedTags;
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleVideosPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVideosPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const filteredVideos = videos.filter((video) => {
    const matchesTags = Object.entries(activeTags).every(([group, tags]) => {
      if (tags.length === 0) return true;
      return video.tags && 
             typeof video.tags === 'object' && 
             video.tags[group] && 
             Array.isArray(video.tags[group]) && 
             tags.every(tag => video.tags[group].includes(tag));
    });
    
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTags && matchesSearch;
  });

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold capitalize mb-4 sm:mb-0">{category} Videos</h1>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 flex items-center"
            >
              <Home className="mr-2" size={20} />
              Home
            </Link>
            {user && (
              <>
                <Link
                  to={`/${category}/upload`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                >
                  <Upload className="mr-2" size={20} />
                  Upload
                </Link>
                <Link
                  to={`/${category}/manage`}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
                >
                  <Settings className="mr-2" size={20} />
                  Manage
                </Link>
                <Link
                  to={`/${category}/tags`}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                >
                  <Tags className="mr-2" size={20} />
                  Tags
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <TagFilter 
          tagGroups={tagGroups} 
          activeTags={activeTags} 
          onTagToggle={handleTagToggle} 
        />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Videos per page:</span>
            <select
              value={videosPerPage}
              onChange={handleVideosPerPageChange}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              {VIDEOS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredVideos.length)} of {filteredVideos.length} videos
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No videos found. Try adjusting your search or filters.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pb-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryGallery;