import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className='flex flex-col min-h-screen min-w-screen p-4'>
            <div className='fixed top-0 left-0 px-4 pb-2 border-b w-full backdrop-filter backdrop-blur-lg bg-opacity-30'><Header /></div>
            <main className='my-[50px] flex-grow justify-center flex items-center max-w-full max-h-full overflow-auto'>
                {children}
            </main>
            <div className='justify-center flex items-center fixed bottom-0 left-[50%] translate-x-[-50%] backdrop-filter backdrop-blur-lg bg-opacity-30 w-full z-45 border-t'><Footer /></div>
        </div>
    );
};