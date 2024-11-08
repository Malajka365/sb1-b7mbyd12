import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, Globe, Lock } from 'lucide-react';
import { getTagGroups } from '../lib/video-service';
import type { TagGroup } from '../lib/supabase-types';

interface VideoUploadFormProps {
  onVideoUpload: (
    title: string,
    description: string,
    youtubeUrl: string,
    tags: { [key: string]: string[] },
    isPublic: boolean
  ) => void;
  category: string;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onVideoUpload, category }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>({});
  const [isPublic, setIsPublic] = useState(true);
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTagGroups = async () => {
      if (!category) return;
      
      try {
        const data = await getTagGroups(category);
        setTagGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tag groups');
      } finally {
        setLoading(false);
      }
    };

    loadTagGroups();
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract video ID from YouTube URL
    const videoId = extractYoutubeId(youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL. Please enter a valid URL.');
      return;
    }

    onVideoUpload(
      title,
      description,
      youtubeUrl,
      selectedTags,
      isPublic
    );
  };

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleTagToggle = (group: string, tag: string) => {
    setSelectedTags(prevTags => {
      const updatedTags = { ...prevTags };
      if (!updatedTags[group]) {
        updatedTags[group] = [];
      }
      if (updatedTags[group].includes(tag)) {
        updatedTags[group] = updatedTags[group].filter(t => t !== tag);
        if (updatedTags[group].length === 0) {
          delete updatedTags[group];
        }
      } else {
        updatedTags[group] = [...updatedTags[group], tag];
      }
      return updatedTags;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-bold mb-4">Add New Video</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
          YouTube URL
        </label>
        <input
          type="url"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visibility
        </label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            className={`flex items-center px-4 py-2 rounded-md ${
              isPublic
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            } border`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Public
          </button>
          <button
            type="button"
            onClick={() => setIsPublic(false)}
            className={`flex items-center px-4 py-2 rounded-md ${
              !isPublic
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            } border`}
          >
            <Lock className="w-4 h-4 mr-2" />
            Private
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Tags
        </label>
        <div className="space-y-4">
          {tagGroups.map((group) => (
            <div key={group.id} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{group.name}</h4>
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(group.name, tag)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                      selectedTags[group.name]?.includes(tag)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center w-full sm:w-auto"
      >
        <PlusCircle className="mr-2" size={20} />
        Add Video
      </button>
    </form>
  );
};

export default VideoUploadForm;