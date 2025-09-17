import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-start items-center border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <img src="/logo1.png" alt="Logo 1" className="h-8 w-auto" />
        <img src="/logo2.png" alt="Logo 2" className="h-8 w-auto" />
      </div>
    </header>
  );
};

export default Header;