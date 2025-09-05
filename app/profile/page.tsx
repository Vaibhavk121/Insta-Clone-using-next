"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Profile() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-md mx-auto bg-white min-h-screen pt-16 pb-16">
                <div className="p-4">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
                            <div className="w-18 h-18 bg-white rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-600">
                                    {session.user?.email?.[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold">{session.user?.email}</h1>
                            <div className="flex space-x-6 mt-2">
                                <div className="text-center">
                                    <div className="font-semibold">0</div>
                                    <div className="text-gray-500 text-sm">posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold">0</div>
                                    <div className="text-gray-500 text-sm">followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold">0</div>
                                    <div className="text-gray-500 text-sm">following</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                        <button className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                            Edit Profile
                        </button>
                        <button 
                            onClick={() => {
                                import('next-auth/react').then(({ signOut }) => signOut());
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Posts Grid */}
                    <div className="mt-8">
                        <div className="border-t border-gray-200 pt-4">
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 border-2 border-gray-300 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Share Photos and Videos</h2>
                                <p className="text-gray-500 text-sm mb-4">
                                    When you share photos and videos, they will appear on your profile.
                                </p>
                                <button 
                                    onClick={() => router.push('/upload')}
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    Share your first photo or video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}