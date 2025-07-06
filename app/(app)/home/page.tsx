"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Video } from "@/types";
import VideoCard from "@/components/VideoCard";

function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback(async (url: string, title: string) => {
    
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      
      link.download = `${title}.mp4`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href); 
     
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-tr from-[#24243e] via-[#0f0c29] to-[#0f0c29] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl p-3 sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
            Browse Uploaded Videos
          </h1>
          <p className="mt-2 text-gray-400 text-lg">
            Watch or download your uploaded media in one place.
          </p>
        </header>

        {loading && (
          <div className="text-center text-gray-400">Loading videos...</div>
        )}

        {error && (
          <div className="text-center text-red-400">
            Failed to load videos. Please try again.
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
