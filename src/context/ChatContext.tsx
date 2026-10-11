import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  Conversation,
  DisciplineType,
  ProficiencyLevel,
  RepertoireItem,
  ArtistProfile,
} from '../types';
import {
  streamChatCompletion,
  generateSessionTitle,
  checkServerHealth,
  ServerHealth,
} from '../services/api';

const CONVERSATIONS_STORAGE_KEY = 'grooveyy_conversations_v1';
const REPERTOIRE_STORAGE_KEY = 'grooveyy_repertoire_v1';
const ARTIST_PROFILE_STORAGE_KEY = 'grooveyy_artist_profile_v1';

const INITIAL_BAKER_RESPONSE = `## Vocal Pedagogy Breakdown
Sondheim’s patter relies on kinetic urgency rather than raw speed. Here is your targeted drill to anchor breath support and articulate cleanly without vocal fatigue.

### 1. Breath Anchoring & Subglottic Pressure
Maintain constant **lower intercostal suspension** across each 4-bar phrase. Treat your ribs like an open accordion that resists collapsing during rapid staccato syllables.

> **Tactile Cue:** Rest thumb and index finger against your lowest floating ribs. Inhale on a silent "K-K" surprise onset; feel lateral expansion hold steady through mm. 18.

### 2. Consonant Placement Matrix
Patter lines fail when the tongue creeps back toward the pharynx. Keep these staccato plosives on the upper dental ridge:

- **/t/ & /d/ Plosives (Tip Drill):** "It Takes Two" -> Crisp tongue-tip release; zero sub-glottal clamping.
- **/k/ & /p/ Enunciation (Soft Palate):** Fast velar rebound. Allow zero aspirate "h" escape between rapid leaps.

### 3. Acting the Objective: Vulnerability × Speed
The Baker is terrified of losing his wife’s partnership, yet he’s also discovering genuine awe. Speed is not anxiety—it is his mind racing to keep up with his heart. Every staccato bite is an attempt to nail down safety.

> **Action Verb:** "To lasso her trust with precision."`;

const SEED_BASE_TIME = 1728500000000;

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-sondheim-patter',
    title: 'Musical Theater / Sondheim Patter Lab',
    discipline: 'Singing',
    level: 'Advanced / Audition',
    contextTag: 'Audition Prep • Musical Theater / Sondheim Patter Lab',
    createdAt: SEED_BASE_TIME - 1000 * 60 * 60 * 2,
    updatedAt: SEED_BASE_TIME - 1000 * 60 * 30,
    messages: [
      {
        id: 'msg-seed-1',
        role: 'user',
        content: `I have a callback audition for Sondheim's Into the Woods (The Baker) in three days. I need help breaking down the patter in “It Takes Two” and mapping the emotional beats so I don't lose breath control during the faster staccato lines.`,
        timestamp: 'Today, 2:42 PM',
        userRoleTitle: 'Audition Candidate (The Baker)',
        isInitialMock: true,
      },
      {
        id: 'msg-seed-2',
        role: 'model',
        content: INITIAL_BAKER_RESPONSE,
        timestamp: 'Today, 2:43 PM',
        disciplineTag: 'Sondheim Staccato',
        isInitialMock: true,
      },
    ],
  },
  {
    id: 'conv-hamlet',
    title: 'Hamlet Act III Soliloquy Cadence',
    discipline: 'Acting',
    level: 'Advanced / Audition',
    contextTag: 'Classical Theater • Shakespearean Verse',
    createdAt: SEED_BASE_TIME - 1000 * 60 * 60 * 24,
    updatedAt: SEED_BASE_TIME - 1000 * 60 * 60 * 24,
    messages: [
      {
        id: 'msg-hamlet-1',
        role: 'user',
        content: 'How do I maintain iambic pentameter in "To be or not to be" without sounding sing-song or metronomic?',
        timestamp: 'Yesterday, 4:15 PM',
        userRoleTitle: 'Classical Actor',
      },
      {
        id: 'msg-hamlet-2',
        role: 'model',
        content: `### Verse Speaking Mastery: The Antithesis Pivot

The key to Shakespeare's verse is that thought moves on the line-endings, not the punctuation.

1. **Scansion with Living Pulses:** Mark the feminine endings (e.g. "question", "slings and arrows"). The extra unstressed 11th syllable is where Hamlet’s hesitation lives.
2. **Tactile Cue:** Step forward on stressed beats and physically freeze on caesuras (mid-line pauses). Feel how the breath suspension carries the philosophical debate.
3. **Action Verb:** "To weigh the gravity of oblivion against fortitude."`,
        timestamp: 'Yesterday, 4:16 PM',
        disciplineTag: 'Classical Verse Scansion',
      },
    ],
  },
  {
    id: 'conv-jazz-routine',
    title: 'Contemporary Jazz Routine #4',
    discipline: 'Dance',
    level: 'Intermediate',
    contextTag: 'Choreography & Musicality • Dynamic Quality',
    createdAt: SEED_BASE_TIME - 1000 * 60 * 60 * 48,
    updatedAt: SEED_BASE_TIME - 1000 * 60 * 60 * 48,
    messages: [
      {
        id: 'msg-jazz-1',
        role: 'user',
        content: 'I need an 8-count breakdown connecting a double pirouette into a floor sweep for contemporary jazz.',
        timestamp: '2 days ago',
        userRoleTitle: 'Contemporary Dancer',
      },
      {
        id: 'msg-jazz-2',
        role: 'model',
        content: `### 8-Count Kinetic Transition Breakdown

1. **Count 1-2:** Deep plié in 4th position. Engage lats and lower core. Spot stage-left.
2. **Count 3-4:** Relevé into double pirouette en dehors. Squeeze adductors.
3. **Count 5:** Controlled roll-down through the supporting metatarsal, dropping center of gravity smoothly.
4. **Count 6-7:** Right arm sweeps concentric floor arc, initiating torso spiral.
5. **Count 8:** Arrive in grounded 4th low stretch, eyes lifting sharply to front.

> **Safety Warning:** Ensure knees track cleanly over 2nd toes during the landing absorption to preserve meniscus integrity.`,
        timestamp: '2 days ago',
        disciplineTag: 'Kinetic Transition',
      },
    ],
  },
  {
    id: 'conv-soprano-breath',
    title: 'Soprano Breath Control Exercises',
    discipline: 'Singing',
    level: 'Intermediate',
    contextTag: 'Vocal Pedagogy • Appoggio Technique',
    createdAt: SEED_BASE_TIME - 1000 * 60 * 60 * 72,
    updatedAt: SEED_BASE_TIME - 1000 * 60 * 60 * 72,
    messages: [
      {
        id: 'msg-soprano-1',
        role: 'user',
        content: 'What SOVT exercises help ease into the high soprano register (G5–C6) without throat tension?',
        timestamp: '3 days ago',
        userRoleTitle: 'Lyric Soprano',
      },
      {
        id: 'msg-soprano-2',
        role: 'model',
        content: `### High Registration SOVT Warm-Up Protocol

Semi-Occluded Vocal Tract (SOVT) creates acoustic back-pressure that separates vocal fold margins and lowers phonation threshold pressure.

1. **Narrow Straw Phonation in Water:** Submerge 2cm into water. Glide smoothly from C4 to G5 on continuous bubbles.
2. **Lip Trill Sirens:** Focus on relaxed zygomatic (cheek) muscles and sternum elevation.
3. **Vocal Safety:** Never force pitch. If you feel constriction in the suprahyoid muscle group, step down a minor third and hydrate.`,
        timestamp: '3 days ago',
        disciplineTag: 'SOVT Acoustic Balancing',
      },
    ],
  },
];

const SEED_REPERTOIRE: RepertoireItem[] = [
  {
    id: 'rep-1',
    title: 'Into the Woods (The Baker) — It Takes Two Patter Drill',
    discipline: 'Singing',
    excerpt: 'Sondheim patter breakdown with lower intercostal breath suspension and plosives articulation matrix.',
    fullNotes: INITIAL_BAKER_RESPONSE,
    tactileCue: 'Rest thumb and index finger against lowest floating ribs; inhale on silent "K-K" onset.',
    actionVerb: 'To lasso her trust with precision.',
    targetBpm: 108,
    savedAt: SEED_BASE_TIME - 1000 * 60 * 15,
  },
  {
    id: 'rep-2',
    title: 'Shakespeare Soliloquy Breath Anchors',
    discipline: 'Acting',
    excerpt: 'Antithesis phrasing on line-endings with physical rhythm pauses for Hamlet Act III.',
    fullNotes: 'Maintain forward momentum on feminine endings without sing-song meter collapse.',
    actionVerb: 'To weigh the gravity of oblivion against fortitude.',
    savedAt: SEED_BASE_TIME - 1000 * 60 * 60 * 20,
  },
];

const DEFAULT_ARTIST_PROFILE: ArtistProfile = {
  name: 'John Renz Bandianon',
  roleTitle: 'Lead Developer & Performing Arts Artist',
  primaryDiscipline: 'Singing',
  vocalRange: 'Baritone (A2 - F4)',
  movementStyle: 'Musical Theatre / Contemporary Jazz',
  actingApproach: 'Stanislavski / Objective Actioning',
  upcomingAudition: 'Into the Woods (Callback in 3 days)',
};

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string;
  currentConversation: Conversation | undefined;
  activeTab: 'studio' | 'coach' | 'repertoire' | 'artist';
  setActiveTab: (tab: 'studio' | 'coach' | 'repertoire' | 'artist') => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isGenerating: boolean;
  streamingText: string;
  selectedDiscipline: DisciplineType;
  setSelectedDiscipline: (d: DisciplineType) => void;
  selectedLevel: ProficiencyLevel;
  setSelectedLevel: (l: ProficiencyLevel) => void;
  repertoire: RepertoireItem[];
  saveToRepertoire: (item: Omit<RepertoireItem, 'id' | 'savedAt'>) => void;
  deleteRepertoireItem: (id: string) => void;
  artistProfile: ArtistProfile;
  updateArtistProfile: (profile: Partial<ArtistProfile>) => void;
  createNewConversation: (discipline?: DisciplineType, initialPrompt?: string) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  sendMessage: (content: string) => Promise<void>;
  stopGeneration: () => void;
  error: string | null;
  clearError: () => void;
  hasApiKey: boolean;
  serverHealth: ServerHealth;
  refreshHealth: (fresh?: boolean) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isWelcomeModalOpen: boolean;
  setIsWelcomeModalOpen: (open: boolean) => void;
  openWelcomeModal: () => void;
  closeWelcomeModal: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [currentConversationId, setCurrentConversationId] = useState<string>(
    SEED_CONVERSATIONS[0]?.id || 'conv-sondheim-patter'
  );
  // Coach is the default landing view (Coach-First architecture)
  const [activeTab, setActiveTab] = useState<'studio' | 'coach' | 'repertoire' | 'artist'>('coach');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineType>('Singing');
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>('All');
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [serverHealth, setServerHealth] = useState<ServerHealth>({
    status: 'connecting',
    provider: 'Google Gemini',
    model: 'gemini-3.8-flash',
    activeProvider: 'gemini',
    message: 'Connecting to AI Coach...',
    hasKey: true,
    fallbackModels: ['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3-flash-preview'],
    secondaryFallbackAvailable: false,
    freeTierNote: 'Gemini Developer API Free Tier',
    checkedAt: Date.now(),
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('grooveyy_welcome_dismissed');
      if (dismissed !== 'true') {
        setIsWelcomeModalOpen(true);
      }
    } catch {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  const openWelcomeModal = () => setIsWelcomeModalOpen(true);
  const closeWelcomeModal = () => {
    try {
      localStorage.setItem('grooveyy_welcome_dismissed', 'true');
    } catch {}
    setIsWelcomeModalOpen(false);
  };
  const [repertoire, setRepertoire] = useState<RepertoireItem[]>(SEED_REPERTOIRE);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(DEFAULT_ARTIST_PROFILE);
  const [isHydrated, setIsHydrated] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const refreshHealth = async (fresh = false) => {
    try {
      const h = await checkServerHealth(fresh);
      setServerHealth(h);
      setHasApiKey(h.hasKey);
    } catch {
      setServerHealth((prev) => ({
        ...prev,
        status: 'unavailable',
        message: 'Unable to reach backend health endpoint',
      }));
    }
  };

  // Truthful health check on mount and periodic gentle refresh
  useEffect(() => {
    refreshHealth(false);
    const interval = setInterval(() => {
      refreshHealth(false);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Hydrate state from localStorage after mount to match SSR initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed);
          if (parsed[0]?.id) {
            setCurrentConversationId(parsed[0].id);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored conversations', e);
    }

    try {
      const storedRep = localStorage.getItem(REPERTOIRE_STORAGE_KEY);
      if (storedRep) {
        const parsed = JSON.parse(storedRep);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRepertoire(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored repertoire', e);
    }

    try {
      const storedProfile = localStorage.getItem(ARTIST_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed && typeof parsed === 'object') {
          setArtistProfile((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored artist profile', e);
    }

    setIsHydrated(true);
  }, []);

  // Save conversations to localStorage (only after hydration to prevent overwriting stored data)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
    } catch (err) {
      console.warn('Could not persist conversations to storage', err);
    }
  }, [conversations, isHydrated]);

  // Save repertoire to localStorage (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(REPERTOIRE_STORAGE_KEY, JSON.stringify(repertoire));
    } catch (err) {
      console.warn('Could not persist repertoire to storage', err);
    }
  }, [repertoire, isHydrated]);

  // Save artist profile to localStorage (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ARTIST_PROFILE_STORAGE_KEY, JSON.stringify(artistProfile));
    } catch (err) {
      console.warn('Could not persist artist profile to storage', err);
    }
  }, [artistProfile, isHydrated]);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const createNewConversation = (discipline?: DisciplineType, initialPrompt?: string) => {
    const disc = discipline || selectedDiscipline || 'General';
    const newId = `conv-${Date.now()}`;
    const newTitle = initialPrompt ? initialPrompt.slice(0, 32) : `New ${disc} Rehearsal`;

    const newConv: Conversation = {
      id: newId,
      title: newTitle,
      discipline: disc,
      level: selectedLevel,
      contextTag: `${disc} • Live Coaching Session`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newId);
    setActiveTab('coach');
    setIsDrawerOpen(false);

    if (initialPrompt) {
      // Send the initial prompt directly
      sendMessageToConv(newId, initialPrompt, disc, selectedLevel);
    }
  };

  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
    setActiveTab('coach');
    setIsDrawerOpen(false);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        // Create an empty fresh session
        const fresh: Conversation = {
          id: `conv-${Date.now()}`,
          title: 'New Coaching Session',
          discipline: 'General',
          level: 'All',
          contextTag: 'Stage Ready • Session 1',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [],
        };
        setCurrentConversationId(fresh.id);
        return [fresh];
      }
      if (currentConversationId === id) {
        setCurrentConversationId(filtered[0].id);
      }
      return filtered;
    });
    showToast('Conversation removed');
  };

  const clearAllConversations = () => {
    const fresh: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Coaching Session',
      discipline: 'General',
      level: 'All',
      contextTag: 'Stage Ready • Session 1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setConversations([fresh]);
    setCurrentConversationId(fresh.id);
    showToast('All conversation history cleared');
  };

  const saveToRepertoire = (item: Omit<RepertoireItem, 'id' | 'savedAt'>) => {
    const newItem: RepertoireItem = {
      ...item,
      id: `rep-${Date.now()}`,
      savedAt: Date.now(),
    };
    setRepertoire((prev) => [newItem, ...prev]);
    showToast('Saved to your Repertoire Library! 🎭');
  };

  const deleteRepertoireItem = (id: string) => {
    setRepertoire((prev) => prev.filter((r) => r.id !== id));
    showToast('Removed from Repertoire');
  };

  const updateArtistProfile = (profile: Partial<ArtistProfile>) => {
    setArtistProfile((prev) => ({ ...prev, ...profile }));
    showToast('Artist profile updated');
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setStreamingText('');
  };

  const sendMessageToConv = async (
    targetConvId: string,
    content: string,
    discipline: DisciplineType,
    level: ProficiencyLevel
  ) => {
    if (!content.trim() || isGenerating) return;

    setError(null);
    setIsGenerating(true);
    setStreamingText('');

    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: timeStr,
      userRoleTitle: artistProfile.roleTitle || 'Artist Candidate',
    };

    // Append user message immediately
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          return {
            ...c,
            updatedAt: Date.now(),
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    // If first message in this conversation, generate concise title asynchronously
    const targetConv = conversations.find((c) => c.id === targetConvId);
    if (!targetConv || targetConv.messages.length === 0) {
      generateSessionTitle(content).then((autoTitle) => {
        if (autoTitle) {
          setConversations((prev) =>
            prev.map((c) => (c.id === targetConvId ? { ...c, title: autoTitle } : c))
          );
        }
      });
    }

    // Build context message list
    const currentMessages = targetConv ? [...targetConv.messages, userMsg] : [userMsg];

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedText = '';

    await streamChatCompletion(
      currentMessages,
      discipline,
      level,
      {
        onChunk: (chunk: string) => {
          accumulatedText += chunk;
          setStreamingText(accumulatedText);
        },
        onError: (err: string) => {
          setIsGenerating(false);
          setStreamingText('');
          setError(err);
          // Append error info to model response if any was collected, or show in banner
          if (accumulatedText.trim()) {
            const modelMsg: ChatMessage = {
              id: `msg-${Date.now()}-ai`,
              role: 'model',
              content: accumulatedText + `\n\n*(Note: Generation ended with error: ${err})*`,
              timestamp: timeStr,
              disciplineTag: discipline !== 'General' ? discipline : 'Coaching Note',
            };
            setConversations((prev) =>
              prev.map((c) =>
                c.id === targetConvId ? { ...c, messages: [...c.messages, modelMsg] } : c
              )
            );
          }
        },
        onFinish: () => {
          setIsGenerating(false);
          const finalContent = accumulatedText.trim();
          setStreamingText('');
          abortControllerRef.current = null;

          if (finalContent) {
            const modelMsg: ChatMessage = {
              id: `msg-${Date.now()}-ai`,
              role: 'model',
              content: finalContent,
              timestamp: timeStr,
              disciplineTag: discipline !== 'General' ? discipline : 'Studio Coach',
            };

            setConversations((prev) =>
              prev.map((c) => {
                if (c.id === targetConvId) {
                  return {
                    ...c,
                    updatedAt: Date.now(),
                    messages: [...c.messages, modelMsg],
                  };
                }
                return c;
              })
            );
          }
        },
      },
      controller.signal
    );
  };

  const sendMessage = async (content: string) => {
    // Make sure we are on coach tab
    setActiveTab('coach');

    let targetId = currentConversationId;
    if (!targetId || !conversations.some((c) => c.id === targetId)) {
      const freshId = `conv-${Date.now()}`;
      const freshConv: Conversation = {
        id: freshId,
        title: content.slice(0, 30),
        discipline: selectedDiscipline,
        level: selectedLevel,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      setConversations((prev) => [freshConv, ...prev]);
      setCurrentConversationId(freshId);
      targetId = freshId;
    }

    const current = conversations.find((c) => c.id === targetId);
    const disc = current?.discipline || selectedDiscipline;
    const lvl = current?.level || selectedLevel;

    await sendMessageToConv(targetId, content, disc, lvl);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        currentConversation,
        activeTab,
        setActiveTab,
        isDrawerOpen,
        setIsDrawerOpen,
        isGenerating,
        streamingText,
        selectedDiscipline,
        setSelectedDiscipline,
        selectedLevel,
        setSelectedLevel,
        repertoire,
        saveToRepertoire,
        deleteRepertoireItem,
        artistProfile,
        updateArtistProfile,
        createNewConversation,
        selectConversation,
        deleteConversation,
        clearAllConversations,
        sendMessage,
        stopGeneration,
        error,
        clearError: () => setError(null),
        hasApiKey,
        serverHealth,
        refreshHealth,
        toastMessage,
        showToast,
        isWelcomeModalOpen,
        setIsWelcomeModalOpen,
        openWelcomeModal,
        closeWelcomeModal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
