"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, MagnifyingGlassIcon as SearchSolid, PlusCircleIcon as PlusSolid, HeartIcon as HeartSolid, UserCircleIcon as UserSolid } from '@heroicons/react/24/solid';

export default function BottomNav() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (!session) return null;

    const navItems = [
        { href: '/', icon: HomeIcon, activeIcon: HomeSolid, label: 'Home' },
        { href: '/search', icon: MagnifyingGlassIcon, activeIcon: SearchSolid, label: 'Search' },
        { href: '/upload', icon: PlusCircleIcon, activeIcon: PlusSolid, label: 'Create' },
        { href: '/activity', icon: HeartIcon, activeIcon: HeartSolid, label: 'Activity' },
        { href: '/profile', icon: UserCircleIcon, activeIcon: UserSolid, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.activeIcon : item.icon;
                        
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center p-2"
                            >
                                <Icon className={`h-6 w-6 ${isActive ? 'text-black' : 'text-gray-600'}`} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}