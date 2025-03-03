'use client';

import React from 'react';
import { useSidebar } from '@/components/layout/Sidebar/SidebarProvider';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { isOpen } = useSidebar();
  
  return (
    <main 
      className={`flex-1 transition-all duration-300 ${
        isOpen ? 'ml-64' : 'ml-16'
      }`}
    >
      <div className="pl-8">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
