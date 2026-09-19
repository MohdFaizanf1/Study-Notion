import React from 'react';
import VideoCard from './VideoCard'; // Import the VideoCard component

const VideoGallery = () => {
  const videos = [
    { videoId: '1IhQXcv6b-M', title: 'Tech Tutorial 1' },
    { videoId: 'tgbNymZ7vqY', title: 'Tech Tutorial 2' },
    { videoId: 'lXjBEfKrQdM', title: 'Tech Tutorial 3' },
    // Add more videos as needed
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">Our Tech Tutorials</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <VideoCard key={index} videoId={video.videoId} title={video.title} />
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
