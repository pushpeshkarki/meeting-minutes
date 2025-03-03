'use client';

import './globals.css'
import { Source_Sans_3 } from 'next/font/google'
import { SidebarProvider } from '@/components/layout/Sidebar/SidebarProvider'
import Sidebar from '@/components/layout/Sidebar'
import MainContent from '@/components/layout/MainContent'

const sourceSans3 = Source_Sans_3({ subsets: ['latin'] })

export { metadata } from './metadata'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sourceSans3.className}>
        <SidebarProvider>
          <div className="flex h-screen">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
