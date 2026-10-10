import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { DisciplineType } from '../types';

export const RepertoireView: React.FC = () => {
  const { repertoire, deleteRepertoireItem, createNewConversation, showToast } = useChat();
  const [filterDiscipline, setFilterDiscipline] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filterDiscipline === 'All'
      ? repertoire
      : repertoire.filter((r) => r.discipline === filterDiscipline);

  const handleDrillNow = (item: (typeof repertoire)[0]) => {
    createNewConversation(
      item.discipline,
      `Let's drill this saved repertoire piece: "${item.title}". Here are my saved notes: ${item.excerpt}. What is our next progression drill?`
    );
  };

  const handleCopyNotes = (notes: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(notes);
      showToast('Repertoire notes copied to clipboard 📋');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-28 px-4 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#884E00] text-[24px]">
            auto_stories
          </span>
          <h1 className="font-headline-lg-mobile text-xl font-bold text-[#1B1C1A]">
            Repertoire & Audition Library
          </h1>
        </div>
        <p className="font-body-sm text-xs text-[#534437]">
          Saved vocal cuts, choreography sequences, acting tactics, and rehearsal routines.
        </p>
      </div>

      {/* Discipline filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4 select-none">
        {['All', 'Singing', 'Dance', 'Acting', 'Theater', 'Music'].map((disc) => (
          <button
            key={disc}
            type="button"
            onClick={() => setFilterDiscipline(disc)}
            className={`px-3 py-1 rounded-full text-xs font-label-md transition-all cursor-pointer ${
              filterDiscipline === disc
                ? 'bg-[#884E00] text-white font-semibold shadow-xs'
                : 'bg-white text-[#534437] border border-[#E8E6DF] hover:bg-[#EFEEEA]'
            }`}
          >
            {disc}
          </button>
        ))}
      </div>

      {/* Repertoire Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-[#E8E6DF] my-4">
          <div className="w-12 h-12 rounded-full bg-[#EFEEEA] flex items-center justify-center mx-auto text-[#867465]">
            <span className="material-symbols-outlined text-[24px]">bookmark_border</span>
          </div>
          <h3 className="font-headline-sm text-sm font-bold text-[#1B1C1A]">
            No Repertoire Saved in this Category
          </h3>
          <p className="font-body-sm text-xs text-[#534437] max-w-xs mx-auto">
            Click the bookmark icon on any coaching breakdown in the chat to save your audition pieces here.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-[#E8E6DF] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFDCBF] text-[#2D1600] font-label-sm text-[10px] font-bold">
                        {item.discipline}
                      </span>
                      {item.targetBpm && (
                        <span className="px-2 py-0.5 rounded-full bg-[#EFEEEA] text-[#534437] font-label-sm text-[10px]">
                          ♩ {item.targetBpm} BPM
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-sm text-sm font-bold text-[#1B1C1A]">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteRepertoireItem(item.id)}
                    className="text-[#867465] hover:text-[#B51C12] p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <p className="font-body-sm text-xs text-[#534437] leading-relaxed">
                  {item.excerpt}
                </p>

                {item.tactileCue && (
                  <div className="bg-[#F4F4F0] rounded-xl p-2.5 flex items-start gap-2 text-xs text-[#534437] border border-[#E8E6DF]/60">
                    <span className="material-symbols-outlined text-[#305AB4] text-[16px] mt-0.5">
                      lightbulb
                    </span>
                    <div>
                      <strong className="text-[#1B1C1A]">Tactile Cue: </strong>
                      {item.tactileCue}
                    </div>
                  </div>
                )}

                {item.actionVerb && (
                  <div className="bg-[#FFDCBF]/30 rounded-xl p-2 flex items-center gap-2 text-xs text-[#884E00] border border-[#FFDCBF]">
                    <span className="material-symbols-outlined text-[16px]">theater_comedy</span>
                    <span>
                      <strong>Action Verb: </strong>
                      {item.actionVerb}
                    </span>
                  </div>
                )}

                {isExpanded && (
                  <div className="pt-2 border-t border-[#E8E6DF] text-xs font-mono bg-[#FAF9F5] p-3 rounded-xl whitespace-pre-wrap text-[#1B1C1A]">
                    {item.fullNotes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#E8E6DF]/50">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-xs text-[#867465] hover:text-[#1B1C1A] font-medium cursor-pointer"
                  >
                    {isExpanded ? 'Hide full notes' : 'View full notes'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyNotes(item.fullNotes)}
                      className="px-2.5 py-1 rounded-full bg-[#EFEEEA] hover:bg-[#E9E8E4] text-[#1B1C1A] text-xs font-medium transition-colors cursor-pointer"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDrillNow(item)}
                      className="px-3 py-1 rounded-full bg-[#884E00] hover:bg-[#6A3B00] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Drill on Stage →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
