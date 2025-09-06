"use client";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import VideoCard from "./components/VideoCard";
import BottomNav from "./components/BottomNav";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Fetching videos...");
        const data = await apiClient.getVideos();
        console.log("Received data:", data);
        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching videos: ", error);
        // Set empty array on error so the UI shows "No videos yet"
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoDelete = (videoId: string) => {
    setVideos(prevVideos => prevVideos.filter(video => video._id?.toString() !== videoId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="pt-16 pb-16">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : videos.length > 0 ? (
            <div className="space-y-0">
              {videos.map((video) => (
                <VideoCard 
                  key={video._id?.toString() || Math.random().toString()} 
                  video={video} 
                  onDelete={handleVideoDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No videos yet. Start sharing!</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
