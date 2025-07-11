import React from 'react';
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="bg-[#0A0A0A] border-b border-[#1E1E1E] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 bg-[#8563EF] rounded-md mr-2 flex items-center justify-center">
            <span className="font-bold text-lg text-white">B</span>
          </div>
          <span className="font-bold text-xl text-white">Byte</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/signin" className="text-[#9CA3AF] hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="bg-[#8563EF] hover:bg-[#7D5AE4] text-white px-4 py-2 rounded-md transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
