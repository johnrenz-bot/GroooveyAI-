'use client';

import React, { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';

interface WelcomeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) => {
  const { setActiveTab } = useChat();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (!isControlled) {
      try {
        const dismissed = localStorage.getItem('grooveyy_welcome_dismissed');
        if (dismissed !== 'true') {
          setInternalIsOpen(true);
        }
      } catch {
        setInternalIsOpen(true);
      }
    }
  }, [isControlled]);

  const handleDismiss = () => {
    try {
      localStorage.setItem('grooveyy_welcome_dismissed', 'true');
    } catch {
      // storage unavailable fallback
    }

    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleGetStarted = () => {
    handleDismiss();
    setActiveTab('coach');
  };

  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
    name: string;
  } | null>(null);

  // Manage body scroll when lightbox is open
  useEffect(() => {
    if (lightboxImage) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lightboxImage]);

  // Dismiss on Escape key (prioritizing closing lightbox first)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          e.preventDefault();
          e.stopPropagation();
          setLightboxImage(null);
        } else if (isOpen) {
          handleDismiss();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxImage]);

  if (!isOpen) return null;

  const tools = [
    {
      name: 'Google Stitch',
      tagline: 'Visual UI & Component Design Engine',
      subtitle: 'Modern rapid prototyping and code stitch workflows',
      url: 'https://stitch.withgoogle.com/',
      logo: '/google-stitch-logo.png',
      preview: '/stitch-preview.png',
      badge: 'Visual Engine',
    },
    {
      name: 'Google AI Studio',
      tagline: 'Multimodal Gemini Intelligence',
      subtitle: 'Advanced prompt engineering & rehearsal reasoning',
      url: 'https://aistudio.google.com/',
      logo: '/google-aistudio-logo.svg',
      preview: '/aistudio-preview.png',
      badge: 'Gemini Core',
    },
    {
      name: 'Google Antigravity',
      tagline: 'Next-Gen Agentic Development IDE',
      subtitle: 'Autonomous pairing for complex full-stack web platforms',
      url: 'https://antigravity.google/',
      logo: '/google-antigravity-logo.svg',
      preview: '/antigravity-preview.png',
      badge: 'Agentic IDE',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 w-screen h-[100dvh] min-h-[100dvh] bg-[#FAF8F5]/98 backdrop-blur-2xl text-stone-900 flex flex-col justify-between overflow-y-auto selection:bg-[#FBE6D4] selection:text-[#92400e] animate-in fade-in duration-200"
    >
      <div className="w-full max-w-7xl mx-auto h-full min-h-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5">
        {/* Header: Full-width brand banner */}
        <header className="flex items-center justify-between pb-2 sm:pb-3 border-b border-[#E8E2D8] shrink-0">
          {/* Left: Actual GroovePH Logo + Introducing Badge + Developer Credit */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <img
              src="/grooveph-logo.png"
              alt="GroovePH Logo"
              className="h-7 sm:h-9 lg:h-10 w-auto object-contain select-none"
            />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFEAE2] border border-[#E0D9CD] text-stone-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              Introducing Grooveyy
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F5EFE6] border border-[#E7DEC8] text-stone-600">
              <span>Developer:</span>
              <strong className="text-stone-900 font-semibold">John Renz Bandianon</strong>
            </span>
          </div>

          {/* Right: Close (×) Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close welcome overlay"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-950 hover:bg-[#EAE4D8] border border-[#E2DDD3] transition-all cursor-pointer shadow-xs active:scale-95"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </header>

        {/* Hero Section: Centered, Expansive Showcase */}
        <section className="flex flex-col items-center text-center my-auto py-2 sm:py-3 shrink-0">
          {/* Centered Circular Mascot Frame */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white border-4 border-white shadow-xl ring-4 ring-[#FED7AA]/80 p-1 mb-2 hover:scale-105 transition-transform duration-300">
            <img
              src="/grooveyy-mascot.png"
              alt="Grooveyy Philippine Eagle Mascot"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>

          <h1
            id="welcome-modal-title"
            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 leading-tight"
          >
            Welcome to GroovePH!
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-[#EA580C] mt-1">
            Meet Grooveyy — your AI-powered performing arts companion.
          </p>
          <p className="text-xs sm:text-sm lg:text-base text-stone-600 max-w-2xl lg:max-w-3xl mx-auto mt-1.5 leading-relaxed font-medium">
            GrooveAI unifies the Philippine performing arts ecosystem — empowering dancers,
            vocalists, and actors with live technical coaching, audition preparation, and
            intelligent repertoire guidance directly linked with GroovePH.
          </p>
        </section>

        {/* Tool Cards: 3 Large Modern Responsive Showcase Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 my-auto shrink-0 w-full max-w-[1100px] mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group flex flex-col justify-between bg-white border border-[#E7E2D8] hover:border-[#EA580C]/60 hover:shadow-xl hover:-translate-y-1.5 rounded-[20px] p-[18px] sm:p-5 transition-all duration-300 ease-out text-left relative overflow-hidden min-h-[330px] w-full shadow-xs motion-reduce:transform-none motion-reduce:transition-none"
            >
              {/* Card Top: Logo + Name + External 'Open tool ↗' Link */}
              <div className="flex items-center justify-between gap-2 shrink-0">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 min-w-0 group/title focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] rounded-lg"
                  title={`Visit ${tool.name}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200/60 flex items-center justify-center p-1 shrink-0">
                    <img
                      src={tool.logo}
                      alt=""
                      aria-hidden="true"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-stone-900 truncate group-hover/title:text-[#EA580C] group-hover:text-[#EA580C] transition-colors duration-200">
                    {tool.name}
                  </span>
                </a>

                {/* Separate Open tool link for external website */}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${tool.name} in a new tab`}
                  className="flex items-center gap-1.5 shrink-0 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] rounded-full px-2 py-1 -mr-1 hover:bg-stone-50 transition-colors"
                >
                  <span className="text-[12px] font-semibold text-stone-500 group-hover/link:text-[#EA580C] transition-colors select-none">
                    Open tool
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#E5DFD4] flex items-center justify-center text-stone-400 group-hover/link:text-white group-hover/link:bg-[#EA580C] group-hover/link:border-[#EA580C] group-hover:text-white group-hover:bg-[#EA580C] group-hover:border-[#EA580C] transition-all duration-200 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px] transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:transform-none">
                      arrow_outward
                    </span>
                  </div>
                </a>
              </div>

              {/* Card Large Preview Image: Clicking opens responsive lightbox only */}
              <button
                type="button"
                onClick={() =>
                  setLightboxImage({
                    src: tool.preview,
                    alt: `${tool.name} preview`,
                    name: tool.name,
                  })
                }
                aria-label={`View enlarged preview of ${tool.name}`}
                className="relative w-full aspect-[16/9] rounded-[14px] overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs my-3 shrink-0 cursor-zoom-in text-left group/img focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]"
              >
                <img
                  src={tool.preview}
                  alt={`${tool.name} preview`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transform-none"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-stone-950/80 backdrop-blur-md text-white border border-white/10 shadow-xs select-none">
                  {tool.badge}
                </span>
                <span
                  className="absolute top-2 right-2 p-1 rounded-full bg-stone-950/60 backdrop-blur-md text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 shadow-sm pointer-events-none"
                  title="Click to enlarge"
                >
                  <span className="material-symbols-outlined text-[16px] block">
                    zoom_in
                  </span>
                </span>
              </button>

              {/* Card Text Content */}
              <div className="flex flex-col flex-1 justify-start">
                <h3 className="text-xs sm:text-[13px] font-semibold text-stone-800 leading-snug group-hover:text-stone-950 transition-colors">
                  {tool.tagline}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-1 leading-relaxed">
                  {tool.subtitle}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom CTA Banner: Full Width Rounded Banner */}
        <section className="w-full bg-white border-2 border-[#E7E2D8] rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:px-6 lg:py-3.5 flex flex-col sm:flex-row items-center justify-between shadow-xs hover:shadow-md transition-shadow gap-3 shrink-0 my-auto">
          <div className="flex items-center gap-3">
            <img
              src="/grooveyy-mascot.png"
              alt="Grooveyy"
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-[#FED7AA] bg-[#FFF7ED] p-0.5 shrink-0 select-none"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-stone-900">
                Ready to find your rhythm?
              </span>
              <span className="text-xs lg:text-sm text-stone-500 font-medium">
                Step into your personalized rehearsal room with AI coaching, repertoire library, and stage-ready feedback.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 lg:px-8 py-2.5 lg:py-3 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs sm:text-sm lg:text-base font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </section>

        {/* Footer: Google Stitch icon, GroovePH logo, domain, and developer credit */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between pt-2.5 border-t border-[#E8E2D8] text-[11px] lg:text-xs text-stone-500 gap-2 shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <img
              src="/google-stitch-logo.png"
              alt="Google Stitch Style Icon"
              className="h-4 lg:h-5 w-auto object-contain opacity-90"
            />
            <span className="text-stone-300">•</span>
            <img
              src="/grooveph-logo.png"
              alt="GroovePH"
              className="h-4 lg:h-5 w-auto object-contain opacity-90"
            />
            <span className="text-stone-300">•</span>
            <a
              href="https://grooveph.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EA580C] hover:underline font-semibold transition-colors"
            >
              grooveph.vercel.app
            </a>
            <span className="text-stone-300">•</span>
            <span className="text-stone-700 font-medium">
              Developed by <strong className="text-stone-900 font-semibold">John Renz Bandianon</strong>
            </span>
          </div>

          <span className="text-stone-400 text-[10px] lg:text-[11px] text-center sm:text-right">
            Independent developer showcase • Built for GroovePH with modern Google tools
          </span>
        </footer>
      </div>

      {/* Modern Responsive Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxImage.name} Fullscreen Preview`}
          className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          {/* Top Bar: Title & Close Button */}
          <div
            className="w-full max-w-6xl flex items-center justify-between pb-2 sm:pb-3 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight">
                {lightboxImage.name}
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">
                • Full Screen Preview
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label="Close preview"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/20 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">close</span>
            </button>
          </div>

          {/* Centered Image Container with object-fit: contain */}
          <div
            className="relative max-w-6xl w-full flex-1 flex items-center justify-center min-h-0 py-1 sm:py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/15 select-none animate-in zoom-in-95 duration-200"
            />
          </div>

          {/* Bottom Bar: Dismiss Hint */}
          <p
            className="text-[11px] sm:text-xs text-stone-400 pt-2 shrink-0 select-none text-center"
            onClick={(e) => e.stopPropagation()}
          >
            Click outside or press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-stone-200 font-mono text-[10px]">
              Esc
            </kbd>{' '}
            to close
          </p>
        </div>
      )}
    </div>
  );
};
