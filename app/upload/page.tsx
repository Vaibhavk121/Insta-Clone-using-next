"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import FileUpload from '../components/FileUpload';
import { IKUploadResponse } from 'imagekitio-next/dist/types/components/IKUpload/props';

export default function Upload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedVideo, setUploadedVideo] = useState<IKUploadResponse | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const { data: session } = useSession();

    if (!session) {
        router.push('/login');
        return null;
    }

    const handleUploadSuccess = (response: IKUploadResponse) => {
        console.log('Upload successful:', response);
        setUploadedVideo(response);
        setError('');
    };

    const handleUploadProgress = (progress: number) => {
        setUploadProgress(progress);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!uploadedVideo) {
            setError('Please upload a video file first');
            return;
        }

        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const videoData = {
                title: title.trim(),
                description: description.trim(),
                videoUrl: uploadedVideo.url,
                thumbnailUrl: uploadedVideo.thumbnailUrl || '',
                userId: session.user?.id || '',
                createdAt: new Date()
            };

            await apiClient.createVideo(videoData);
            router.push('/');
        } catch (err) {
            console.error('Failed to create video:', err);
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
                                Upload Video
                            </label>
                            <FileUpload
                                fileType="video"
                                onSuccess={handleUploadSuccess}
                                onProgress={handleUploadProgress}
                            />
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="mt-2">
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                                </div>
                            )}
                        </div>

                        {uploadedVideo && (
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <video
                                    src={uploadedVideo.url}
                                    controls
                                    className="w-full h-full object-cover"
                                    poster={uploadedVideo.thumbnailUrl}
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
                            disabled={loading || !uploadedVideo}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Post...' : 'Share'}
                        </button>
                    </form>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}