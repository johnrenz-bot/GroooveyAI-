import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { InteractivePracticeBar } from './InteractivePracticeBar';
import { DisciplineType } from '../types';

export const ActiveCoaching: React.FC = () => {
  const {
    currentConversation,
    sendMessage,
    isGenerating,
    streamingText,
    stopGeneration,
    saveToRepertoire,
    showToast,
    error,
    clearError,
    artistProfile,
    selectedDiscipline,
    setSelectedDiscipline,
  } = useChat();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | DisciplineType>('All');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message or stream update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, streamingText]);

  // Adjust textarea height dynamically
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isGenerating) return;
    const text = inputVal.trim();
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStarterClick = (promptText: string, discipline?: DisciplineType) => {
    if (discipline) {
      setSelectedDiscipline(discipline);
    }
    setInputVal(promptText);
    sendMessage(promptText);
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Copied rehearsal breakdown to clipboard 📋');
    }
  };

  const handleSaveRepertoire = (title: string, notes: string) => {
    saveToRepertoire({
      title: title || currentConversation?.title || 'Rehearsal Notes',
      discipline: currentConversation?.discipline || selectedDiscipline || 'General',
      excerpt: notes.slice(0, 120) + '...',
      fullNotes: notes,
      targetBpm: 108,
    });
  };

  const handleExport = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grooveyy-${(currentConversation?.title || 'Rehearsal').replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported rehearsal notes 📄');
  };

  // Web Speech API Voice Rehearsal Dictation
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser environment.');
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
      showToast('Listening... Speak your cue 🎙️');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        showToast(`Dictated: "${transcript.slice(0, 30)}..."`);
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
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
      prev ? `${prev} [Attached Repertoire Reference: ${file.name}]` : `[Reference Excerpt: ${file.name}] `
    );
  };

  // Clickable Starter Prompts across all 6 core performing arts areas
  const starterPrompts = [
    {
      category: 'Singing' as DisciplineType,
      discipline: 'Singing' as DisciplineType,
      icon: 'mic',
      title: 'Vocal Warm-up & SOVT',
      tagline: 'Breath support & resonance',
      prompt: 'Give me a safe 10-minute vocal warm-up routine with SOVT lip trills, straw phonation, and appoggio breath support exercises.',
    },
    {
      category: 'Acting' as DisciplineType,
      discipline: 'Acting' as DisciplineType,
      icon: 'masks',
      title: 'Monologue & Beat Analysis',
      tagline: 'Objective, obstacle & tactics',
      prompt: 'Help me break down a dramatic monologue: how do I identify objective, obstacle, tactics, and transition beats using Stanislavski technique?',
    },
    {
      category: 'Dance' as DisciplineType,
      discipline: 'Dance' as DisciplineType,
      icon: 'sports_gymnastics',
      title: 'Pirouette Spotting & Balance',
      tagline: 'Spotting, core & landing drills',
      prompt: 'What kinetic drills improve balance and spotting during double pirouettes without falling off relevé or sickling the ankle?',
    },
    {
      category: 'Musical Theater' as DisciplineType,
      discipline: 'Singing' as DisciplineType,
      icon: 'piano',
      title: 'Patter Articulation & Speed',
      tagline: 'Rapid consonants & breath',
      prompt: 'How do I steady my breathing and articulate rapid musical theater patter lines (like Sondheim or Gilbert & Sullivan) without vocal fatigue?',
    },
    {
      category: 'Auditions' as DisciplineType,
      discipline: 'Stage Performance' as DisciplineType,
      icon: 'theater_comedy',
      title: 'Callback & Slate Confidence',
      tagline: 'Cold reading & adjustment notes',
      prompt: 'How do I deliver a confident audition slate and quickly adapt when a casting director gives sudden adjustment notes during a callback?',
    },
    {
      category: 'Rehearsals' as DisciplineType,
      discipline: 'Music' as DisciplineType,
      icon: 'timer',
      title: 'Structured 30-Min Drill',
      tagline: 'Metronome pacing & muscle memory',
      prompt: 'Build me a structured 30-minute practice plan with incremental metronome BPM targets to lock in muscle memory without burnout.',
    },
  ];

  const filteredStarters = activeCategory === 'All'
    ? starterPrompts
    : starterPrompts.filter((s) => s.category === activeCategory || s.discipline === activeCategory);

  const messages = currentConversation?.messages || [];
  const contextTag =
    currentConversation?.contextTag ||
    `${currentConversation?.discipline || selectedDiscipline || 'Stage'} • Live Coaching Lab`;

  return (
    <div className="flex-1 flex flex-col relative w-full pt-16 pb-28 bg-[#F8F5F0] min-h-[calc(100vh-4rem)]">
      {/* Floating Centered Session Pill with soft beige #EFEAE3 and amber #92400e accent */}
      <div className="sticky top-16 z-20 px-4 py-2 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#EFEAE3] text-stone-800 px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(40,30,20,0.04)] border border-[#E4DDD3] max-w-full text-xs">
          <span className="material-symbols-outlined text-[#92400e] text-[16px] flex-shrink-0">
            music_note
          </span>
          <span className="font-semibold text-[#92400e] tracking-tight truncate">
            {currentConversation?.discipline || selectedDiscipline}
          </span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-700 font-medium truncate">
            {currentConversation?.title || contextTag}
          </span>
        </div>
      </div>

      {/* Error / High-Demand Status Notification */}
      {error && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-3">
          <div className="p-3.5 bg-[#FBE6D4]/90 border border-[#F5D5BE] rounded-xl flex items-center justify-between text-xs text-[#92400e] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#92400e] text-[18px]">info</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-[#92400e] hover:text-stone-900 font-bold text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Conversation Canvas */}
      <div className="px-4 pt-4 pb-28 space-y-7 max-w-2xl mx-auto w-full flex-1">
        {/* Welcome Screen / Empty State on Paper Background */}
        {messages.length === 0 && !isGenerating && (
          <div className="py-6 sm:py-10 px-2 sm:px-4 text-center space-y-6 animate-fade-in">
            {/* Mascot in soft paper frame */}
            <div className="relative inline-flex items-center justify-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EFEAE3] shadow-xs flex items-center justify-center p-1 border-2 border-[#E2DCD3] overflow-hidden">
                <img
                  src="/grooveyy-mascot.png"
                  alt="Grooveyy Mascot"
                  className="w-full h-full object-cover rounded-full select-none"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#FBE6D4] shadow-xs border border-[#F5D5BE] flex items-center justify-center text-[#92400e]">
                <span className="material-symbols-outlined text-[14px]">music_note</span>
              </span>
            </div>

            {/* Welcome Headings */}
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                What are we rehearsing today?
              </h2>
              <p className="text-xs sm:text-[14px] text-stone-600 leading-relaxed">
                Grooveyy is your performing arts coach for vocal technique, choreography, monologue beats, and audition prep.
              </p>
            </div>

            {/* Discipline Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {(['All', 'Singing', 'Acting', 'Dance', 'Musical Theater', 'Auditions', 'Rehearsals'] as const).map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#92400e] text-white shadow-xs'
                        : 'bg-[#EFEAE3] text-stone-700 hover:text-stone-950 hover:bg-[#E5DFD5] border border-[#E2DDD4]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Clickable Starter Prompts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              {filteredStarters.map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleStarterClick(starter.prompt, starter.discipline)}
                  className="group p-3.5 rounded-2xl bg-[#EFEAE3]/80 border border-[#E4DDD3] shadow-xs hover:border-[#92400e]/40 hover:bg-[#EAE4DA] transition-all active:scale-[0.99] flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FBE6D4] text-[#92400e] border border-[#F5D5BE]">
                      <span className="material-symbols-outlined text-[18px]">
                        {starter.icon}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-stone-400 text-[16px] group-hover:text-[#92400e] group-hover:translate-x-0.5 transition-all">
                      arrow_forward
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-900 group-hover:text-[#92400e] transition-colors">
                      {starter.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                      {starter.tagline}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Turns */}
        {messages.map((msg, index) => {
          // User message turn: Soft gray-beige bubbles #EDE9E3 with candidate name and role above, Delivered timestamp below
          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end pl-6 sm:pl-16">
                {/* Candidate Name & Role above message */}
                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium mb-1 mr-1">
                  <span className="text-stone-700 font-semibold">
                    {artistProfile.name || 'Candidate'}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span>{msg.userRoleTitle || artistProfile.roleTitle || 'Artist'}</span>
                </div>

                {/* Soft gray-beige message bubble #EDE9E3 */}
                <div className="bg-[#EDE9E3] text-stone-800 rounded-2xl rounded-tr-xs px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-[#E3DDD4] max-w-[92%] sm:max-w-[82%]">
                  <p className="text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>

                {/* Subtle Delivered timestamp below message */}
                <span className="text-[11px] text-stone-400 mt-1 mr-1 font-medium">
                  Delivered • {msg.timestamp || 'Just now'}
                </span>
              </div>
            );
          }

          // AI reply: Rendered DIRECTLY on cream background #F8F5F0 (NO white card, NO border, NO rounded container, NO shadow)
          const isInitialSondheimTurn = msg.isInitialMock && index === 1;
          const mentionsMetronome =
            msg.content.toLowerCase().includes('metronome') ||
            msg.content.toLowerCase().includes('bpm') ||
            msg.content.toLowerCase().includes('patter') ||
            msg.content.toLowerCase().includes('tempo');

          return (
            <div key={msg.id} className="flex items-start gap-3.5 w-full pr-1 sm:pr-4">
              {/* Mascot Avatar with small amber status dot */}
              <div className="flex-shrink-0 relative mt-0.5">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-[#E3DDD4] bg-[#EDE9E3]">
                  <img
                    src="/grooveyy-mascot.png"
                    alt="Grooveyy Mascot"
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#92400e] ring-2 ring-[#F8F5F0]" />
              </div>

              {/* Response rendered directly on cream background */}
              <div className="flex-1 min-w-0 space-y-2.5">
                {/* Header: Name “Grooveyy Performing Arts Coach” + subtle category badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-stone-900 tracking-tight">
                    Grooveyy Performing Arts Coach
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EFEAE3] text-[#92400e] text-[11px] font-medium border border-[#E4DDD3]">
                    {msg.disciplineTag || currentConversation?.discipline || 'Coach'}
                  </span>
                </div>

                {/* Markdown content directly on cream canvas */}
                <div className="text-[15px] sm:text-base leading-relaxed text-stone-800">
                  <MarkdownRenderer content={msg.content} />
                </div>

                {/* Interactive Practice Bar for rhythm/tempo */}
                {(isInitialSondheimTurn || mentionsMetronome) && (
                  <div className="pt-1">
                    <InteractivePracticeBar
                      initialBpm={108}
                      label="Rehearsal mm. 14–32 • Patter Lab"
                    />
                  </div>
                )}

                {/* Action Bar & Outside Timestamp */}
                <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D8]">
                  <div className="flex items-center gap-1 text-stone-600">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content)}
                      className="p-1.5 rounded-lg hover:bg-[#EFEAE3] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                      title="Copy notes"
                    >
                      <span className="material-symbols-outlined text-[17px]">content_copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveRepertoire(
                          `Drill: ${currentConversation?.title || 'Session'}`,
                          msg.content
                        )
                      }
                      className="p-1.5 rounded-lg hover:bg-[#EFEAE3] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                      title="Save to Repertoire"
                    >
                      <span className="material-symbols-outlined text-[17px]">bookmark_add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExport(msg.content)}
                      className="p-1.5 rounded-lg hover:bg-[#EFEAE3] text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                      title="Export Rehearsal Notes"
                    >
                      <span className="material-symbols-outlined text-[17px]">ios_share</span>
                    </button>
                  </div>

                  {/* Timestamp moved outside header */}
                  <span className="text-[11px] text-stone-400 font-medium">
                    {msg.timestamp || 'Today'}
                  </span>
                </div>

                {/* Follow-up Quick Action Chips */}
                {isInitialSondheimTurn && (
                  <div className="pt-1 space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => sendMessage('Drill tongue-twister measures 22–26 at 96 BPM')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFEAE3] text-stone-700 hover:text-[#92400e] hover:border-[#92400e]/40 border border-[#E3DDD4] transition-all text-xs cursor-pointer active:scale-95 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[#92400e] text-[15px]">
                          repeat
                        </span>
                        <span>Drill measures 22–26 at 96 BPM</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          sendMessage('Adjust for Baritone key (-1 tone) and mark breath points')
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFEAE3] text-stone-700 hover:text-[#92400e] hover:border-[#92400e]/40 border border-[#E3DDD4] transition-all text-xs cursor-pointer active:scale-95 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-stone-700 text-[15px]">
                          piano
                        </span>
                        <span>Adjust for Baritone key (-1 tone)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Streaming Response: rendered directly on cream canvas */}
        {isGenerating && (
          <div className="flex items-start gap-3.5 w-full pr-1 sm:pr-4 animate-fade-in">
            <div className="flex-shrink-0 relative mt-0.5">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-[#E3DDD4] bg-[#EDE9E3]">
                <img
                  src="/grooveyy-mascot.png"
                  alt="Grooveyy"
                  className="w-full h-full object-cover animate-pulse"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#92400e] ring-2 ring-[#F8F5F0] animate-ping" />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <span>Grooveyy Performing Arts Coach</span>
                  <span className="text-xs text-[#92400e] font-normal flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] animate-spin">
                      progress_activity
                    </span>
                    Formulating coaching cue...
                  </span>
                </span>
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#EFEAE3] text-stone-700 hover:bg-[#E5DFD5] transition-colors cursor-pointer border border-[#E2DCD3]"
                >
                  Stop
                </button>
              </div>

              {streamingText ? (
                <div className="text-[15px] sm:text-base leading-relaxed text-stone-800">
                  <MarkdownRenderer content={streamingText} />
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="h-2.5 bg-[#EFEAE3] rounded-full w-3/4 animate-pulse" />
                  <div className="h-2.5 bg-[#EFEAE3] rounded-full w-5/6 animate-pulse" />
                  <div className="h-2.5 bg-[#EFEAE3] rounded-full w-1/2 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Docked Floating Paper Composer */}
      <div className="fixed bottom-16 inset-x-0 z-30 px-3 sm:px-4 py-2.5 backdrop-blur-md bg-[#F8F5F0]/90 border-t border-[#E8E2D8]">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSend}
            className="bg-[#FAF8F5] rounded-2xl shadow-[0_4px_16px_rgba(40,30,20,0.06)] border border-[#E3DDD4] focus-within:border-[#92400e]/50 focus-within:ring-2 focus-within:ring-[#92400e]/10 transition-all p-2 flex flex-col gap-1.5"
          >
            {/* Auto-expanding dynamic textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputVal}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Ask Grooveyy for vocal mechanics, choreography cues, or scene beats..."
              className="w-full bg-transparent resize-none outline-none text-[15px] text-stone-800 placeholder:text-stone-400 px-2 pt-1 min-h-[38px] max-h-[160px] leading-relaxed"
            />

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between px-1 pt-1 border-t border-[#EFEAE3]">
              <div className="flex items-center gap-1">
                {/* File Attachment */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileAttach}
                  className="hidden"
                  accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                />
                <button
                  type="button"
                  aria-label="Attach sheet music or script notes"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-[#EFEAE3] transition-colors cursor-pointer"
                  title="Attach repertoire file or sheet music notes"
                >
                  <span className="material-symbols-outlined text-[19px]">attach_file</span>
                </button>

                {/* Voice Rehearsal Dictation */}
                <button
                  type="button"
                  aria-label="Voice rehearsal dictation"
                  onClick={handleToggleVoice}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-[#92400e] text-white animate-pulse'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-[#EFEAE3]'
                  }`}
                  title="Dictate rehearsal question"
                >
                  <span className="material-symbols-outlined text-[19px]">mic</span>
                </button>

                <span className="hidden sm:inline-block text-[11px] text-stone-400 pl-2">
                  Enter to send • Shift + Enter for newline
                </span>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                aria-label="Send cue to Grooveyy"
                disabled={!inputVal.trim() || isGenerating}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  inputVal.trim() && !isGenerating
                    ? 'bg-[#92400e] text-white hover:bg-[#78350f] active:scale-90 shadow-xs'
                    : 'bg-[#EDE9E3] text-stone-400 cursor-not-allowed opacity-60'
                }`}
                title="Send rehearsal cue"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
