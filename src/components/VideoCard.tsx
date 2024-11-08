import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VideoData } from '../lib/supabase-types';
import { ExternalLink, Lock } from 'lucide-react';

interface VideoCardProps {
  video: VideoData;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const location = useLocation();
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/0.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.youtube_id}`;

  // Safely handle potentially undefined tags
  const allTags = video.tags ? Object.values(video.tags).flat() : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          <ExternalLink className="text-white" size={48} />
        </a>
        {!video.is_public && (
          <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded-md flex items-center">
            <Lock className="w-4 h-4 mr-1" />
            <span className="text-sm">Private</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <Link 
          to={`/${video.category}/video/${video.id}`}
          state={{ searchParams: location.search }}
          className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors duration-200"
        >
          {video.title}
        </Link>
        <div className="flex flex-wrap gap-2 mt-2">
          {allTags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;