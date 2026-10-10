import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { DisciplineType } from '../types';

export const ArtistProfileView: React.FC = () => {
  const {
    artistProfile,
    updateArtistProfile,
    conversations,
    repertoire,
    clearAllConversations,
    hasApiKey,
    showToast,
  } = useChat();

  const [formData, setFormData] = useState(artistProfile);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setFormData(artistProfile);
  }, [artistProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtistProfile(formData);
  };

  const handleExportData = () => {
    const exportData = {
      profile: artistProfile,
      conversations,
      repertoire,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grooveyy-Studio-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Studio data exported successfully 💾');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-28 px-4 max-w-xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#FFDCBF] p-1 shadow-xs flex-shrink-0 border border-[#FFDCBF]">
          <img
            src="/grooveyy-mascot.png"
            alt="Grooveyy Mascot"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-headline-sm text-base font-bold text-[#1B1C1A] truncate">
            {artistProfile.name}
          </h1>
          <p className="font-label-md text-xs text-[#884E00] font-medium truncate">
            {artistProfile.roleTitle}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-[#EFEEEA] text-[#534437] font-label-sm text-[10px]">
              {artistProfile.primaryDiscipline}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#DAE2FF] text-[#001847] font-label-sm text-[10px]">
              {artistProfile.vocalRange}
            </span>
          </div>
        </div>
      </div>

      {/* Rehearsal Metrics & Studio Status */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-xl p-3 border border-[#E8E6DF] text-center">
          <div className="font-headline-sm text-lg font-bold text-[#884E00]">
            {conversations.length}
          </div>
          <div className="font-label-sm text-[10px] text-[#867465]">Active Rehearsals</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#E8E6DF] text-center">
          <div className="font-headline-sm text-lg font-bold text-[#305AB4]">
            {repertoire.length}
          </div>
          <div className="font-label-sm text-[10px] text-[#867465]">Saved Routines</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#E8E6DF] text-center">
          <div className="flex items-center justify-center gap-1 text-[#884E00]">
            <span className="w-2 h-2 rounded-full bg-[#884E00] animate-pulse" />
            <span className="font-label-sm text-xs font-bold">Online</span>
          </div>
          <div className="font-label-sm text-[10px] text-[#867465]">Gemini 3.8 Flash</div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8E6DF]/60 pb-3">
          <span className="material-symbols-outlined text-[#884E00]">person</span>
          <h2 className="font-headline-sm text-sm font-bold text-[#1B1C1A]">
            Artist Rehearsal Preferences
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-label-sm text-[#534437] font-medium mb-1">
              Performer Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-[#1B1C1A] outline-none focus:border-[#884E00]"
            />
          </div>

          <div>
            <label className="block font-label-sm text-[#534437] font-medium mb-1">
              Active Role / Audition Tag
            </label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              placeholder="e.g. Audition Candidate (The Baker)"
              className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-[#1B1C1A] outline-none focus:border-[#884E00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-[#534437] font-medium mb-1">
                Primary Discipline
              </label>
              <select
                value={formData.primaryDiscipline}
                onChange={(e) =>
                  setFormData({ ...formData, primaryDiscipline: e.target.value as DisciplineType })
                }
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-[#1B1C1A] outline-none focus:border-[#884E00]"
              >
                {['Singing', 'Dance', 'Acting', 'Theater', 'Music', 'Choreography'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-[#534437] font-medium mb-1">
                Vocal Range / Fach
              </label>
              <input
                type="text"
                value={formData.vocalRange}
                onChange={(e) => setFormData({ ...formData, vocalRange: e.target.value })}
                placeholder="e.g. Baritone (A2 - F4)"
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-[#1B1C1A] outline-none focus:border-[#884E00]"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block font-label-sm text-[#534437] font-medium mb-1">
              Upcoming Audition Target
            </label>
            <input
              type="text"
              value={formData.upcomingAudition}
              onChange={(e) => setFormData({ ...formData, upcomingAudition: e.target.value })}
              placeholder="e.g. Into the Woods (Callback in 3 days)"
              className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-[#1B1C1A] outline-none focus:border-[#884E00]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#884E00] hover:bg-[#6A3B00] text-white font-label-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Studio Data Management */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8E6DF]/60 pb-3">
          <span className="material-symbols-outlined text-[#534437]">database</span>
          <h2 className="font-headline-sm text-sm font-bold text-[#1B1C1A]">
            Storage & Studio Backups
          </h2>
        </div>

        <p className="font-body-sm text-xs text-[#534437] leading-relaxed">
          Your rehearsal sessions and saved repertoire are stored securely in your local browser workspace.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-[#EFEEEA] hover:bg-[#E9E8E4] text-[#1B1C1A] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Backup (JSON)
          </button>

          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#FFDAD6] text-[#B51C12] hover:bg-[#FFDAD6]/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              Clear Rehearsals
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#FFDAD6]/40 p-1.5 rounded-xl border border-[#FFDAD6]">
              <span className="text-[11px] text-[#93000A] font-medium px-1">Confirm clear?</span>
              <button
                type="button"
                onClick={() => {
                  clearAllConversations();
                  setShowClearConfirm(false);
                }}
                className="px-2.5 py-1 bg-[#B51C12] text-white rounded text-[11px] font-semibold cursor-pointer"
              >
                Yes, Clear
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 bg-white text-[#534437] rounded text-[11px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
