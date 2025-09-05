"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { HeartIcon, HomeIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function Header() {
    const { data: session } = useSession();

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-50">
            <div className="max-w-md mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        Instagram
                    </Link>
                    
                    {session ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="p-1">
                                <HomeIcon className="h-6 w-6 text-gray-700" />
                            </Link>
                            <Link href="/upload" className="p-1">
                                <PlusCircleIcon className="h-6 w-6 text-gray-700" />
                            </Link>
                            <Link href="/activity" className="p-1">
                                <HeartIcon className="h-6 w-6 text-gray-700" />
                            </Link>
                            <Link href="/profile" className="p-1">
                                <UserCircleIcon className="h-6 w-6 text-gray-700" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/login" 
                                className="text-blue-500 hover:text-blue-600 font-medium"
                            >
                                Log in
                            </Link>
                            <Link 
                                href="/register" 
                                className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}


export default Header