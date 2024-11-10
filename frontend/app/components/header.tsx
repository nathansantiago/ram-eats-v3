"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';


const Header: React.FC = () => {
    const router = useRouter();

    const handleProfile = async () => {
        router.replace('/dashboard/settings');
    };

    const handleHome = async () => {
        router.replace('/dashboard/home');
    }

    return (
        <header className='flex justify-between'>
            <h1 className='title cursor-pointer' onClick={handleHome}>RamEats</h1>
            {/* <Avatar onClick={handleProfile}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
        </header>
    );
};

export default Header;