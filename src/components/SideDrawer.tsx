import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { DisciplineType } from '../types';

export const SideDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    conversations,
    currentConversationId,
    selectConversation,
    deleteConversation,
    clearAllConversations,
    setSelectedDiscipline,
    createNewConversation,
    setActiveTab,
    openWelcomeModal,
  } = useChat();

  const [confirmClear, setConfirmClear] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const disciplines: { name: DisciplineType; icon: string; color: string }[] = [
    { name: 'Singing', icon: 'mic', color: 'text-[#92400e]' },
    { name: 'Acting', icon: 'masks', color: 'text-stone-800' },
    { name: 'Dance', icon: 'sports_gymnastics', color: 'text-amber-700' },
    { name: 'Music', icon: 'piano', color: 'text-stone-700' },
    { name: 'Theater', icon: 'theater_comedy', color: 'text-[#92400e]' },
    { name: 'Choreography', icon: 'directions_run', color: 'text-stone-800' },
    { name: 'Stage Performance', icon: 'qr_code_2', color: 'text-stone-700' },
  ];

  const handleDisciplineClick = (disc: DisciplineType) => {
    setSelectedDiscipline(disc);
    createNewConversation(disc);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-[#FAF8F5] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out border-r border-[#E3DDD4] ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E3DDD4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFEAE3] flex items-center justify-center border border-[#E0D9CE]">
              <span className="material-symbols-outlined text-[#92400e] text-[20px]">
                theater_comedy
              </span>
            </div>
            <span className="text-base font-bold text-stone-900 tracking-tight">
              Grooveyy Coach
            </span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsDrawerOpen(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-[#EFEAE3] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              createNewConversation();
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#92400e] text-white hover:bg-[#78350f] transition-all text-xs font-semibold shadow-xs active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Rehearsal Session</span>
          </button>

          {/* Disciplines Section */}
          <div className="space-y-1">
            <p className="px-2 text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Coaching Disciplines
            </p>
            {disciplines.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => handleDisciplineClick(d.name)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#EFEAE3] text-stone-700 hover:text-stone-950 transition-colors text-left cursor-pointer group"
              >
                <span className={`material-symbols-outlined text-[19px] ${d.color} group-hover:scale-110 transition-transform`}>
                  {d.icon}
                </span>
                <span className="text-xs font-medium flex-1">{d.name}</span>
                <span className="material-symbols-outlined text-[15px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  add
                </span>
              </button>
            ))}
          </div>

          {/* Recent Rehearsals */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-1">
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                Recent Rehearsals
              </p>
              {conversations.length > 1 && !confirmClear && (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-[10px] text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {confirmClear && (
              <div className="p-3 mb-2 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
                <p className="text-rose-900 font-semibold">Clear all rehearsal history?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearAllConversations();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-rose-700"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 bg-white border border-[#E3DDD4] text-stone-800 rounded-lg text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {conversations.map((c) => {
                const isActive = c.id === currentConversationId;
                const isDeleting = deleteConfirmId === c.id;

                if (isDeleting) {
                  return (
                    <div
                      key={c.id}
                      className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <span className="text-rose-900 truncate pr-1">Delete session?</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            deleteConversation(c.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-rose-600 text-white rounded font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 bg-white text-stone-600 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={c.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#EFEAE3] text-[#92400e] font-semibold shadow-xs border border-[#E2DDD4]'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-[#EFEAE3]/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectConversation(c.id)}
                      className="flex-1 text-left truncate pr-2 cursor-pointer"
                      title={c.title}
                    >
                      <span className="truncate block">{c.title}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-600 p-1 rounded transition-opacity cursor-pointer text-stone-400"
                      title="Delete conversation"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 bg-[#EFEAE3] border-t border-[#E3DDD4] flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              openWelcomeModal();
              setIsDrawerOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-stone-700 hover:text-stone-950 hover:bg-[#FAF8F5] rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-[#E0D9CD] bg-[#FAF8F5]/60"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#EA580C]">
                auto_awesome
              </span>
              <span>Introducing Grooveyy</span>
            </div>
            <span className="text-[10px] text-stone-400">Showcase</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('artist');
                setIsDrawerOpen(false);
              }}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer text-xs font-medium"
            >
              <span className="material-symbols-outlined text-[19px]">settings</span>
              <span>Artist Profile & Settings</span>
            </button>
            <img
              src="/grooveyy-mascot.png"
              alt="Profile Avatar"
              className="w-8 h-8 rounded-full object-cover select-none border border-[#E3DDD4]"
            />
          </div>
        </div>
      </aside>
    </>
  );
};
