"use client";
import { IVideo } from '@/models/Video';
import { HeartIcon, ChatBubbleOvalLeftIcon, PaperAirplaneIcon, BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface VideoCardProps {
    video: IVideo;
    onDelete?: (videoId: string) => void;
}

export default function VideoCard({ video, onDelete }: VideoCardProps) {
    const { data: session } = useSession();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(Math.floor(Math.random() * 1000) + 1);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);

        const button = document.activeElement as HTMLElement;
        if (button) {
            button.classList.add('heart-animation');
            setTimeout(() => {
                button.classList.remove('heart-animation');
            }, 300);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this video?')) {
            return;
        }

        const videoId = video._id?.toString();
        if (!videoId) {
            alert('Unable to delete video: Invalid video ID');
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/videos?id=${videoId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete?.(videoId);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete video');
            }
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Failed to delete video');
        } finally {
            setIsDeleting(false);
        }
    };

    const isOwner = session?.user?.email === video.userEmail;

    return (
        <div className="bg-white border-b border-gray-200">

            <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <span className="font-semibold text-sm">{video.userEmail || 'Unknown User'}</span>
                </div>
                <div className="flex items-center space-x-2">
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1"
                            title="Delete video"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button className="text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
            </div>


            <div className="relative aspect-square bg-gray-100">
                {video.videoUrl && !video.videoUrl.startsWith('blob:') ? (
                    <video
                        className="w-full h-full object-cover"
                        controls
                        poster={video.thumbnailUrl}
                        onError={(e) => {
                            console.error('Video failed to load:', video.videoUrl);
                            (e.target as HTMLVideoElement).style.display = 'none';
                        }}
                    >
                        <source src={video.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : video.thumbnailUrl ? (
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col">
                        <svg className="w-16 h-16 mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">Video unavailable</p>
                        {video.videoUrl?.startsWith('blob:') && (
                            <p className="text-xs mt-1 text-center px-4">
                                This video uses a temporary URL and needs to be re-uploaded
                            </p>
                        )}
                    </div>
                )}
            </div>


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


                <div className="mb-2">
                    <span className="font-semibold text-sm">{likes.toLocaleString()} likes</span>
                </div>


                {video.description && (
                    <div className="mb-2">
                        <span className="font-semibold text-sm mr-2">{video.userEmail || 'Unknown User'}</span>
                        <span className="text-sm">{video.description}</span>
                    </div>
                )}


                <div className="text-gray-500 text-sm mb-2">
                    View all comments
                </div>

                <div className="text-gray-400 text-xs uppercase">
                    {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}