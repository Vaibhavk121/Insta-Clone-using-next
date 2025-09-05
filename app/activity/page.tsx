"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Activity() {
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
                    <h1 className="text-xl font-semibold mb-6">Activity</h1>
                    
                    <div className="space-y-4">
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Activity On Your Posts</h2>
                            <p className="text-gray-500 text-sm">
                                When someone likes or comments on one of your posts, you&apos;ll see it here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}