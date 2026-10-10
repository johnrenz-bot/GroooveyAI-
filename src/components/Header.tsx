import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDrawerOpen,
    setIsDrawerOpen,
    createNewConversation,
    serverHealth,
    refreshHealth,
    openWelcomeModal,
  } = useChat();

  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getSubtitle = () => {
    switch (activeTab) {
      case 'coach':
      case 'studio':
        return 'Performing Arts Coach';
      case 'repertoire':
        return 'Repertoire Library';
      case 'artist':
        return 'Artist Profile';
      default:
        return 'Performing Arts Coach';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Amber-toned status badges (no harsh green)
  const getStatusBadge = () => {
    switch (serverHealth.status) {
      case 'ready':
        return {
          dotClass: 'bg-[#92400e]',
          badgeText: serverHealth.model || 'Gemini 3.8 Flash',
          label: 'Ready',
          borderClass: 'border-[#E6E0D6] hover:border-amber-700/40 bg-[#EFEAE3] text-stone-800',
        };
      case 'connecting':
        return {
          dotClass: 'bg-amber-500 animate-pulse',
          badgeText: 'Connecting...',
          label: 'Connecting',
          borderClass: 'border-amber-200 bg-[#FBE6D4]/60 text-[#92400e]',
        };
      case 'unavailable':
        return {
          dotClass: 'bg-amber-700',
          badgeText: 'High Demand (503)',
          label: 'Retrying',
          borderClass: 'border-amber-300 bg-amber-50 text-[#92400e]',
        };
      case 'configuration-error':
        return {
          dotClass: 'bg-amber-800',
          badgeText: 'Key Required',
          label: 'Setup Error',
          borderClass: 'border-amber-200 bg-amber-50 text-[#92400e]',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    // Transparent header bar with no bottom border
    <header className="fixed top-0 inset-x-0 z-40 bg-[#F8F5F0]/90 backdrop-blur-md border-none">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between max-w-3xl mx-auto">
        {/* Left: Menu Toggle + Brand + Showcase Badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Open rehearsal drawer menu"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-[#EFEAE3] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <div
            className="flex flex-col cursor-pointer select-none group"
            onClick={() => setActiveTab('coach')}
          >
            <span className="text-[17px] font-bold tracking-tight text-stone-900 group-hover:text-[#92400e] transition-colors">
              Grooveyy
            </span>
            <span className="text-[11px] text-stone-500 font-medium -mt-0.5">
              {getSubtitle()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openWelcomeModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#EFEAE2] border border-[#E0D9CD] text-stone-700 hover:text-stone-950 hover:border-orange-300 transition-colors cursor-pointer ml-1.5"
            title="Open Grooveyy Welcome Showcase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span>Showcase</span>
          </button>
        </div>

        {/* Center/Right: Amber Status Pill & Rehearsal Prompt */}
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setShowStatusPopover(!showStatusPopover)}
            className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border shadow-xs transition-all cursor-pointer ${statusInfo.borderClass}`}
            title="Click for AI provider and model details"
          >
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
            <span className="font-medium truncate max-w-[140px]">{statusInfo.badgeText}</span>
            <span className="material-symbols-outlined text-[15px] text-stone-500">
              expand_more
            </span>
          </button>

          {/* Status Details Modal */}
          {showStatusPopover && (
            <div className="absolute top-12 right-10 z-50 w-72 bg-[#FAF8F5] rounded-2xl shadow-lg border border-[#E3DDD4] p-4 text-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#EAE4DC] pb-2">
                <span className="font-semibold text-stone-900 text-sm">AI Engine Status</span>
                <span className="px-2 py-0.5 rounded-full font-medium text-[11px] bg-[#FBE6D4] text-[#92400e] border border-[#F5D5BE]">
                  {statusInfo.label}
                </span>
              </div>

              <div className="space-y-2 text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">Provider:</span>
                  <span className="font-medium text-stone-900">{serverHealth.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Active Model:</span>
                  <span className="font-medium text-[#92400e] font-mono text-[11px]">
                    {serverHealth.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Free Tier Limit:</span>
                  <span className="text-stone-800 font-medium">15 RPM / 1M TPM</span>
                </div>
                {serverHealth.secondaryFallbackAvailable && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Free Fallback:</span>
                    <span className="text-[#92400e] font-medium">Configured (Groq/OpenRouter)</span>
                  </div>
                )}
                <div className="pt-1 text-[11px] text-stone-500 leading-relaxed border-t border-[#EAE4DC]">
                  {serverHealth.message}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-[#EAE4DC]">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-lg bg-[#EFEAE3] hover:bg-[#E5DFD5] text-stone-800 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-[#E0D9CE]"
                >
                  <span
                    className={`material-symbols-outlined text-[14px] ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                  >
                    refresh
                  </span>
                  Check Connection
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusPopover(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* New Rehearsal Prompt */}
          <button
            type="button"
            aria-label="Start new rehearsal"
            onClick={() => createNewConversation()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-[#EFEAE3] border border-[#E3DDD4] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Start new rehearsal session"
          >
            <span className="material-symbols-outlined text-[19px]">add</span>
          </button>

          {/* Mascot Profile Button */}
          <button
            type="button"
            onClick={() => setActiveTab('artist')}
            className="w-9 h-9 rounded-full overflow-hidden p-0.5 bg-[#EDE9E3] hover:ring-2 hover:ring-[#92400e] transition-all cursor-pointer shadow-xs border border-[#E3DDD4]"
            title="Artist Profile"
          >
            <img
              src="/grooveyy-mascot.png"
              alt="Grooveyy Mascot Profile"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
