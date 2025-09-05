"use client";
import { IVideo } from '@/models/Video';
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface VideoCardProps {
    video: IVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 1000) + 1);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);
        
        // Add heart animation
        const button = document.activeElement as HTMLElement;
        if (button) {
            button.classList.add('heart-animation');
            setTimeout(() => {
                button.classList.remove('heart-animation');
            }, 300);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <span className="font-semibold text-sm">{video.title || 'user'}</span>
                </div>
                <button className="text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>

            {/* Video/Image */}
            <div className="relative aspect-square bg-gray-100">
                {video.videoUrl ? (
                    <video 
                        className="w-full h-full object-cover"
                        controls
                        poster={video.thumbnailUrl}
                    >
                        <source src={video.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <button onClick={handleLike} className="p-1">
                            {liked ? (
                                <HeartSolid className="h-6 w-6 text-red-500" />
                            ) : (
                                <HeartIcon className="h-6 w-6 text-gray-700" />
                            )}
                        </button>
                        <button className="p-1">
                            <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-700" />
                        </button>
                        <button className="p-1">
                            <PaperAirplaneIcon className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>
                    <button className="p-1">
                        <BookmarkIcon className="h-6 w-6 text-gray-700" />
                    </button>
                </div>

                {/* Likes */}
                <div className="mb-2">
                    <span className="font-semibold text-sm">{likes.toLocaleString()} likes</span>
                </div>

                {/* Caption */}
                {video.description && (
                    <div className="mb-2">
                        <span className="font-semibold text-sm mr-2">{video.title || 'user'}</span>
                        <span className="text-sm">{video.description}</span>
                    </div>
                )}

                {/* Comments */}
                <div className="text-gray-500 text-sm mb-2">
                    View all comments
                </div>

                {/* Time */}
                <div className="text-gray-400 text-xs uppercase">
                    {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}