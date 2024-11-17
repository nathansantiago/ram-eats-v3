"use server";

import React from 'react';

const Header: React.FC = () => {
    return (
        <header className='flex justify-between items-center h-12'>
            <h1 className='title cursor-pointer'>RamEats</h1>
        </header>
    );
};

export default Header;