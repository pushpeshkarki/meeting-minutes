'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User, Lock, Database, Palette, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ModelManager } from '@/components/ModelManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: ['Profile', 'Email', 'Password']
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: ['Email Notifications', 'Push Notifications', 'Meeting Reminders']
    },
    {
      title: 'Privacy',
      icon: <Lock className="w-5 h-5" />,
      items: ['Data Sharing', 'Meeting Access', 'Recording Settings']
    },
    {
      title: 'Storage',
      icon: <Database className="w-5 h-5" />,
      items: ['Storage Usage', 'Auto-delete Settings', 'Backup']
    },
    {
      title: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      items: ['Theme', 'Font Size', 'Language']
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models">
          <ModelManager />
        </TabsContent>
        
        <TabsContent value="general">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">General Settings</h2>
            {/* Add general settings here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
