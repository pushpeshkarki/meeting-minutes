'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '@/components/layout/Sidebar/SidebarProvider';

const Sidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <div
      className={`h-screen bg-gray-100 border-r transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-end p-4">
        <Button variant="ghost" size="sm" onClick={toggle}>
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Meetings</h2>
          {/* Add meeting list here */}
        </div>
      )}
    </div>
  );
};

export default Sidebar; 