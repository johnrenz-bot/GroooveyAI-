import React from 'react';
import { useChat } from '../context/ChatContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useChat();

  const tabs: { id: 'coach' | 'repertoire' | 'artist'; label: string; icon: string }[] = [
    { id: 'coach', label: 'Coach', icon: 'forum' },
    { id: 'repertoire', label: 'Repertoire', icon: 'auto_stories' },
    { id: 'artist', label: 'Artist', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#F8F5F0]/90 backdrop-blur-xl border-t border-[#E8E2D8] shadow-[0_-2px_10px_rgba(40,30,20,0.03)] pb-safe">
      <div className="flex justify-around items-center h-16 px-6 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[72px] h-12 transition-all cursor-pointer rounded-xl ${
                isActive
                  ? 'text-[#92400e] font-semibold scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                  isActive ? 'bg-[#EFEAE3] text-[#92400e]' : 'bg-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {tab.icon}
                </span>
              </div>
              <span className="text-[11px] tracking-wide font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
