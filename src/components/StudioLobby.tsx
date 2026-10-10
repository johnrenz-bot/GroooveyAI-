import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { DisciplineType } from '../types';

export const StudioLobby: React.FC = () => {
  const {
    selectedDiscipline,
    setSelectedDiscipline,
    sendMessage,
    isGenerating,
    createNewConversation,
    showToast,
  } = useChat();

  const [inputVal, setInputVal] = useState('');
  const [modelPreset, setModelPreset] = useState('Grooveyy Maestro 3.5');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterTabs: { name: DisciplineType; label: string; icon: string; color: string }[] = [
    { name: 'Dance', label: 'Dance', icon: 'sports_gymnastics', color: 'text-[#884E00]' },
    { name: 'Singing', label: 'Singing', icon: 'mic', color: 'text-[#305AB4]' },
    { name: 'Acting', label: 'Acting', icon: 'masks', color: 'text-[#B51C12]' },
    { name: 'Music', label: 'Music', icon: 'piano', color: 'text-[#884E00]' },
    { name: 'Choreography', label: 'Choreography', icon: 'directions_run', color: 'text-[#305AB4]' },
    { name: 'Stage Performance', label: 'Stage Prep', icon: 'qr_code_2', color: 'text-[#1B1C1A]' },
  ];

  const suggestionCards = [
    {
      title: 'Help me improve my dance technique',
      subtitle: 'Balance, pirouettes & alignment tips',
      icon: 'sports_gymnastics',
      iconBg: 'text-[#884E00]',
      discipline: 'Dance' as DisciplineType,
      prompt: 'Help me improve my dance technique. What are the key drills for balance, pirouette spotting, and core alignment?',
    },
    {
      title: 'Teach me vocal warm-up exercises',
      subtitle: 'Resonance, scale patterns & breath',
      icon: 'mic',
      iconBg: 'text-[#305AB4]',
      discipline: 'Singing' as DisciplineType,
      prompt: 'Teach me a safe 10-minute vocal warm-up routine with SOVT lip trills, breath support exercises, and resonance drills.',
    },
    {
      title: 'Help me prepare for an audition',
      subtitle: 'Monologue pacing & cold reading',
      icon: 'theater_comedy',
      iconBg: 'text-[#B51C12]',
      discipline: 'Acting' as DisciplineType,
      prompt: 'Help me prepare for an upcoming audition. Give me a strategy for monologue pacing, finding beats, and cold reading confidence.',
    },
    {
      title: 'Explain stage acting techniques',
      subtitle: 'Stanislavski, projection & cues',
      icon: 'movie',
      iconBg: 'text-[#884E00]',
      discipline: 'Theater' as DisciplineType,
      prompt: 'Explain Stanislavski and Uta Hagen stage acting techniques: how do I apply objective, obstacle, and tactic to a live scene?',
    },
  ];

  const handleCardClick = (prompt: string, discipline: DisciplineType) => {
    setSelectedDiscipline(discipline);
    createNewConversation(discipline, prompt);
  };

  const handleSend = () => {
    if (!inputVal.trim() || isGenerating) return;
    const text = inputVal.trim();
    setInputVal('');
    createNewConversation(selectedDiscipline, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Voice rehearsal dictation with Web Speech API
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Try typing your rehearsal query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      showToast('Listening... Speak your rehearsal cue or question 🎙️');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        showToast(`Captured: "${transcript.slice(0, 30)}..."`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Voice capture ended.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast(`Attached reference: ${file.name}`);
    setInputVal((prev) =>
      prev ? `${prev} [Attached Repertoire File: ${file.name}]` : `[Reference Excerpt: ${file.name}] `
    );
  };

  return (
    <div className="flex flex-col w-full px-4 pt-20 pb-28 max-w-xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-2 mb-4">
        {/* Mascot in glowing ambient circle */}
        <div className="relative flex items-center justify-center mb-3">
          <div className="absolute -inset-3 bg-[#FFDCBF]/40 rounded-full blur-xl transform scale-110" />
          <div className="relative w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center p-1.5 overflow-hidden border border-[#FFDCBF]">
            <img
              src="/grooveyy-mascot.png"
              alt="Grooveyy Performing Arts Companion"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>
          <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center text-[#884E00] border border-[#E8E6DF]">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
          </span>
        </div>

        {/* Meet Grooveyy Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F4F0] mb-3 shadow-xs border border-[#E8E6DF]">
          <span className="w-2 h-2 rounded-full bg-[#884E00] animate-pulse" />
          <span className="font-label-sm text-xs text-[#534437] tracking-wide font-medium">
            Meet Grooveyy, your Performing Arts AI
          </span>
        </div>

        <h1 className="font-headline-lg-mobile text-[25px] leading-tight text-[#1B1C1A] tracking-tight max-w-xs mb-2 font-bold">
          Hey, what would you like to explore in performing arts?
        </h1>
        <p className="font-body-sm text-xs text-[#534437] max-w-xs leading-relaxed">
          Your creative space for movement, music, and dramatic stage performance.
        </p>
      </div>

      {/* Discipline Horizontal Pill Carousel */}
      <div className="w-full mb-4 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 select-none">
        {filterTabs.map((tab) => {
          const isSelected = selectedDiscipline === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              onClick={() => setSelectedDiscipline(tab.name)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#884E00] text-white font-semibold'
                  : 'bg-white text-[#534437] hover:bg-[#E9E8E4] border border-[#E8E6DF]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[15px] ${
                  isSelected ? 'text-white' : tab.color
                }`}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Suggestion Cards 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
        {suggestionCards.map((card, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCardClick(card.prompt, card.discipline)}
            className="group text-left p-3.5 rounded-xl bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.98] border border-[#E8E6DF] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-lg bg-[#EFEEEA] flex items-center justify-center ${card.iconBg} group-hover:bg-[#FFDCBF] transition-colors`}
              >
                <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
              </div>
              <span className="material-symbols-outlined text-[#867465] text-[16px] group-hover:text-[#884E00] transition-colors">
                arrow_outward
              </span>
            </div>
            <div>
              <p className="font-headline-sm text-xs text-[#1B1C1A] font-semibold mb-1 line-clamp-2">
                {card.title}
              </p>
              <p className="font-body-sm text-[11px] text-[#867465] leading-tight">
                {card.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Elevated Composer Card */}
      <div className="w-full bg-white rounded-2xl shadow-md p-3.5 flex flex-col gap-2 border border-[#E8E6DF]">
        {/* Model Selector & Status Pill */}
        <div className="flex items-center justify-between px-1 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFEEEA] hover:bg-[#E9E8E4] text-[#534437] transition-colors cursor-pointer text-xs"
            >
              <span className="material-symbols-outlined text-[14px] text-[#884E00]">
                auto_awesome
              </span>
              <span className="font-label-sm text-xs font-semibold">{modelPreset}</span>
              <span className="material-symbols-outlined text-[14px] text-[#867465]">
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showModelMenu && (
              <div className="absolute top-8 left-0 z-50 w-56 bg-white rounded-xl shadow-lg border border-[#E8E6DF] py-1 text-xs space-y-0.5">
                {[
                  { name: 'Grooveyy Maestro 3.5', desc: 'Gemini 3.8 Flash • All-round coaching' },
                  { name: 'Sondheim Patter Lab', desc: 'Fast articulation & musical theater' },
                  { name: 'Stanislavski Acting Coach', desc: 'Emotional beats & scene analysis' },
                  { name: 'Choreography Director', desc: 'Movement mechanics & rhythm' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setModelPreset(item.name);
                      setShowModelMenu(false);
                      showToast(`Model calibrated: ${item.name}`);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#F4F4F0] cursor-pointer ${
                      modelPreset === item.name ? 'bg-[#FFDCBF]/30 text-[#884E00] font-semibold' : 'text-[#1B1C1A]'
                    }`}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-[10px] text-[#867465]">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[#867465]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#884E00] animate-pulse" />
            <span className="font-label-sm text-[11px] font-medium">Stage Ready</span>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputVal}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask Grooveyy about dance, music, acting..."
            className="w-full bg-transparent resize-none outline-none font-body-md text-sm text-[#1B1C1A] placeholder:text-[#867465]/70 px-1 py-1"
          />
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-[#E8E6DF]/40">
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileAttach}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
            />
            <button
              type="button"
              aria-label="Attach reference file"
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#867465] hover:text-[#1B1C1A] hover:bg-[#EFEEEA] transition-colors cursor-pointer"
              title="Attach sheet music excerpt or rehearsal take"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <button
              type="button"
              aria-label="Voice rehearsal dictation"
              onClick={handleToggleVoice}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isListening
                  ? 'bg-[#B51C12] text-white animate-pulse'
                  : 'text-[#867465] hover:text-[#1B1C1A] hover:bg-[#EFEEEA]'
              }`}
              title="Dictate rehearsal question"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>

          <button
            type="button"
            aria-label="Send prompt"
            onClick={handleSend}
            disabled={!inputVal.trim() || isGenerating}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer ${
              inputVal.trim() && !isGenerating
                ? 'bg-[#884E00] text-white hover:bg-[#6A3B00] active:scale-95'
                : 'bg-[#E3E2DF] text-[#867465] cursor-not-allowed opacity-60'
            }`}
            title="Send Rehearsal Cue"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
