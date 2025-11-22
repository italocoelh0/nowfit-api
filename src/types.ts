
// types.ts

export type Page =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'updatePassword'
  | 'onboarding'
  | 'recipeSelection'
  | 'exerciseSelection'
  | 'dashboard'
  | 'profileView'
  | 'chatView'
  | 'recording'
  | 'checkout';

export interface Professional {
  id: string;
  name: string;
  avatarUrl: string;
  specialty: 'Nutricionista' | 'Personal Trainer';
  bio: string;
  services: string[];
  monthlyPrice: number; // in Flames
  icon: string;
  coverImageUrl: string;
  portfolioImages: string[];
  testimonials: { quote: string; clientName: string }[];
}

export interface ConsultancySubscription {
  professionalId: string;
  startDate: string; // ISO string
}

export type DashboardSection =
  | 'home'
  | 'feed'
  | 'events'
  | 'rotina'
  | 'alimentacao'
  | 'treinos'
  | 'explore'
  | 'search'
  | 'profile'
  | 'editProfile'
  | 'adminPanel'
  | 'notifications'
  | 'flamesStore'
  | 'activityTracker'
  | 'consultancy';

export type MuscleGroup =
  | 'Peito'
  | 'Costas'
  | 'Pernas'
  | 'Ombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Abdômen'
  | 'Cardio'
  | 'Antebraço';

export type ExerciseCategory =
  | 'Musculação'
  | 'Aeróbico'
  | 'Funcional'
  | 'Alongamento'
  | 'Em casa'
  | 'Mobilidade'
  | 'Elástico'
  | 'MAT Pilates'
  | 'Laboral';

export type ExerciseLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Recipe {
  id: number;
  nome: string;
  tipo: 'salgada' | 'doce';
  icon: string;
  categoria: string;
  ingredientes: string[];
  modoPreparo: string[];
  beneficio: string;
}

export interface Exercise {
  id: number;
  nome: string;
  videoId: string;
  descricao: string;
  nivel: ExerciseLevel;
  duracao: string;
  calorias: string;
  grupoMuscular: MuscleGroup;
  categoria: ExerciseCategory;
}

export interface OnboardingData {
  username: string;
  age?: number;
  weight?: number;
  height?: number;
  goals?: string[];
}

export type RoutineType = 'none' | 'manual' | 'ai';

export interface DailyRoutine {
  day: number;
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
  snack: Recipe | null;
  exercises: Exercise[];
}

export interface UserRoutine {
  type: RoutineType;
  startDate: string;
  duration: number;
  dailyRoutines: DailyRoutine[];
  targetWeight?: number;
  currentIMC?: number;
  targetIMC?: number;
}

export interface RecordedActivity {
  id: string;
  sport: Sport;
  date: string; // ISO string
  distance: number; // in km
  time: number; // in seconds
  pace: number; // in seconds per km
  mapImageUrl?: string; // URL da imagem estática do mapa
}

export interface Badge {
  id: string;
  name: string;
  type: 'badge' | 'frame';
  imageUrl: string;
  price: number;
}

export interface CreateUser{
  email: string;
  name: string;
  passwordHash: string;
  birthDate: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  birthDate: string;
  userAvatar: string;
  username: string;
  age: number;
  weight: number;
  height: number;
  goals: string[];
  selectedRecipes: Recipe[];
  selectedExercises: Exercise[];
  isAdmin?: boolean;
  routine?: UserRoutine;
  bio?: string;
  activityType?: string;
  isProfilePublic?: boolean;
  followerIds: string[];
  followingIds: string[];
  blockedUserIds: string[];
  flameBalance: number;
  isVerified: boolean;
  consultancy?: ConsultancySubscription;
  activities?: RecordedActivity[];
  ownedBadgeIds?: string[];
  equippedBadgeId?: string | null;
}

export interface GeneratedPlan {
  motivation: string;
  mealPlan: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  workout: { name: string; duration: string }[];
}

export interface Comment {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  username: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: { lat: number; lon: number };
  likedByUserIds: string[];
  comments: Comment[];
  originalPostId?: number; // Para rastrear compartilhamentos
  isPriority?: boolean;
  authorIsVerified?: boolean;
}

export interface Notification {
  id: number;
  message: string;
}

export interface AppNotification {
  id: number;
  type: 'new_follower';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  timestamp: string;
  read: boolean;
}

export interface CheckinItemData {
  key: string;
  icon: string;
  label: string;
}

export interface UITexts {
  login: { [key: string]: string };
  register: { [key: string]: string };
  onboarding: { [key: string]: string };
  recipeSelection: { [key: string]: string };
  exerciseSelection: { [key: string]: string };
  dashboard: { [key: string]: string };
  home: { [key: string]: string };
  aiCoach: { [key: string]: string };
  alimentacao: { [key: string]: string };
  treinos: { [key: string]: string };

  rotina?: {
    title: string;
    subtitle: string;
    createRoutine: string;
    generateWithAI: string;
    resetRoutine: string;
    activeRoutineTitle: string;
  };

  profile: { [key: string]: string };
  socialFeed: { [key: string]: string };
  adminPanel: { [key: string]: string };
}

export interface Sport {
  key: string;
  name: string;
  icon: string;
}

// Eventos
export interface EventUpdate {
  id: number;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
}

export type EventType = 'Trilha' | 'Corrida' | 'Ciclismo' | 'Outro';

export interface EventData {
  id: number;
  creatorId: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string; // ISO string
  time: string; // "HH:mm"
  location: {
    state: string;
    city: string;
  };
  type: EventType;
  participantIds: string[];
  updates: EventUpdate[];
}

// mensagens / chat
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  goals: string[];
  age: number;
  weight: number;
  lastActivity: string;
}

export interface DirectMessage {
  id: number;
  senderId: string;
  receiverId: string;
  text?: string;
  audioUrl?: string;
  timestamp: string;
  read: boolean;
}

export interface ChatConversation {
  id: number;
  otherUser: UserProfile;
  lastMessage: DirectMessage;
  unreadCount: number;
}

export interface EventComment {
  id: number;
  event_id: number;
  user_id: string;
  text: string;
  created_at: string;
  profile: {
    name: string;
    user_avatar: string;
  };
}

export interface ActivitySplit {
  km: number;
  pace: number; // s/km
  elevation: number;
}
