"use client"

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
    const router = useRouter();

    const handleProfile = async () => {
        router.replace('/dashboard/settings');
    };

    const handleHome = async () => {
        router.replace('/dashboard/home');
    }

    return (
        <header className='flex justify-between items-center'>
            <h1 className='title cursor-pointer' onClick={handleHome}>RamEats</h1>
            {/* <LogOut onClick={handleProfile} /> */}
        </header>
    );
};

export default Header;