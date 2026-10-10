export type DisciplineType =
  | 'General'
  | 'Dance'
  | 'Singing'
  | 'Music'
  | 'Theater'
  | 'Acting'
  | 'Choreography'
  | 'Stage Performance';

export type ProficiencyLevel = 'All' | 'Beginner' | 'Intermediate' | 'Advanced / Audition';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  disciplineTag?: string;
  userRoleTitle?: string;
  isInitialMock?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  discipline: DisciplineType;
  level: ProficiencyLevel;
  contextTag?: string; // e.g. "Musical Theater / Sondheim Patter Lab"
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface RepertoireItem {
  id: string;
  title: string;
  discipline: DisciplineType;
  excerpt: string;
  fullNotes: string;
  tactileCue?: string;
  actionVerb?: string;
  targetBpm?: number;
  savedAt: number;
}

export interface ArtistProfile {
  name: string;
  roleTitle: string; // e.g. "Audition Candidate (The Baker)"
  primaryDiscipline: DisciplineType;
  vocalRange: string; // e.g. "Baritone (A2 - F4)"
  movementStyle: string; // e.g. "Contemporary / Musical Theatre"
  actingApproach: string; // e.g. "Objective-driven / Meisner"
  upcomingAudition: string; // e.g. "Into the Woods (Callback)"
}
