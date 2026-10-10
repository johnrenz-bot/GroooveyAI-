'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { BottomNav } from './components/BottomNav';
import { ActiveCoaching } from './components/ActiveCoaching';
import { RepertoireView } from './components/RepertoireView';
import { ArtistProfileView } from './components/ArtistProfileView';
import { WelcomeModal } from './components/WelcomeModal';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage, isWelcomeModalOpen, closeWelcomeModal } = useChat();

  return (
    <div className="bg-[#F8F5F0] text-stone-800 font-sans flex flex-col min-h-screen relative selection:bg-[#FBE6D4] selection:text-[#92400e]">
      {/* Full-Screen Welcome Modal */}
      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={closeWelcomeModal} />
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          <div className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-full shadow-lg border border-zinc-700 flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Fixed Header */}
      <Header />

      {/* Slide-out Sidebar Drawer */}
      <SideDrawer />

      {/* Main View Port (Coach-First Architecture) */}
      <main className="flex-1 flex flex-col relative w-full">
        {(activeTab === 'coach' || activeTab === 'studio') && <ActiveCoaching />}
        {activeTab === 'repertoire' && <RepertoireView />}
        {activeTab === 'artist' && <ArtistProfileView />}
      </main>

      {/* Bottom Pinned Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <MainContent />
    </ChatProvider>
  );
}
