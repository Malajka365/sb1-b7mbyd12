import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import VideoUploadForm from './VideoUploadForm';
import { ArrowLeft } from 'lucide-react';
import { addVideo } from '../lib/video-service';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  const handleVideoUpload = async (
    title: string,
    description: string,
    url: string,
    tags: { [key: string]: string[] },
    isPublic: boolean
  ) => {
    if (!category) {
      alert('Category is required');
      return;
    }

    try {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      await addVideo(category, title, description, videoId, tags, isPublic);
      // Preserve filters when navigating back after upload
      navigate(`/${category}${location.search}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload video');
    }
  };

  if (!category) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error: Category is required</div>
          <Link to="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">
            <ArrowLeft className="inline mr-2" size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Create back link URL with preserved filters
  const backToGalleryUrl = `/${category}${location.search}`;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to={backToGalleryUrl} 
          className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to {category} Gallery
        </Link>
        <h1 className="text-3xl font-bold mb-6">Upload Video - {category}</h1>
        <VideoUploadForm onVideoUpload={handleVideoUpload} category={category} />
      </div>
    </div>
  );
};

export default UploadPage;