"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Upload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const { data: session } = useSession();

    if (!session) {
        router.push('/login');
        return null;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
                setError('');
            } else {
                setError('Please select a video file');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!videoFile) {
            setError('Please select a video file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // In a real app, you'd upload the file to a service like ImageKit or AWS S3
            // For now, we'll create a mock video entry
            const videoData = {
                title,
                description,
                videoUrl: URL.createObjectURL(videoFile), // This is just for demo
                thumbnailUrl: '',
                userId: session.user?.id || '',
                createdAt: new Date()
            };

            await apiClient.createVideo(videoData);
            router.push('/');
        } catch {
            setError('Failed to upload video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-md mx-auto bg-white min-h-screen pt-16 pb-16">
                <div className="p-4">
                    <h1 className="text-xl font-semibold mb-6">Create new post</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Video
                            </label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {videoFile && (
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a title for your video"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write a caption..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !videoFile}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Uploading...' : 'Share'}
                        </button>
                    </form>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}