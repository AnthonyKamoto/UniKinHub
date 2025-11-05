// ===== TYPES RBAC =====

export interface Role {
  id: number;
  nom: string;
  description: string;
  permissions: Record<string, any>;
  est_actif: boolean;
  created_at: string;
  utilisateurs_count: number;
}

export interface Universite {
  id: number;
  nom: string;
  code: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  site_web?: string;
  est_active: boolean;
  created_at: string;
  updated_at: string;
  facultes_count: number;
  utilisateurs_count: number;
}

export interface Faculte {
  id: number;
  nom: string;
  code: string;
  universite: number;
  universite_nom: string;
  description?: string;
  est_active: boolean;
  created_at: string;
  updated_at: string;
  departements_count: number;
  utilisateurs_count: number;
}

export interface Departement {
  id: number;
  nom: string;
  code: string;
  faculte: number;
  faculte_nom: string;
  universite_nom: string;
  description?: string;
  est_actif: boolean;
  created_at: string;
  updated_at: string;
  utilisateurs_count: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;

  // Ancien système (compatibilité)
  role: "student" | "teacher" | "publisher" | "admin";
  university: string;
  role_display: string;

  // Nouveau système RBAC
  nouveau_role?: number;
  nouveau_role_detail?: Role;
  universite?: number;
  universite_detail?: Universite;
  faculte?: number;
  faculte_detail?: Faculte;
  departement?: number;
  departement_detail?: Departement;
  promotion?: string;

  // Informations communes
  program?: string;
  phone_number?: string;
  is_verified: boolean;
  date_joined: string;
  organisation_complete: string;
  verifie_par?: number;
  verifie_par_nom?: string;
  date_verification?: string;

  // Autres
  email_notifications: boolean;
  fcm_token?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  author: User;
  category: Category;
  status: "draft" | "pending" | "published" | "rejected";
  importance: "low" | "medium" | "high" | "urgent";
  created_at: string;
  updated_at: string;
  publish_date: string | null;
  expiry_date: string | null;
  moderator?: User;
  moderation_comment?: string;
  moderated_at: string | null;
  target_universities: string[];
  target_programs: string[];
  views_count: number;
  likes_count: number;
}

export interface Notification {
  id: number;
  user: User;
  title: string;
  message: string;
  news?: News;
  created_at: string;
  is_read: boolean;
  notification_type: "news" | "moderation" | "system";
}

export interface ModerationLog {
  id: number;
  news: News;
  moderator: User;
  action: "approved" | "rejected" | "edited" | "deleted";
  reason: string;
  created_at: string;
}

export interface NotificationPreference {
  id: number;
  user: User;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: "immediate" | "daily" | "weekly" | "disabled";
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  news: News;
  user: User;
  content: string;
  created_at: string;
  is_approved: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "student" | "teacher";
  university: string;
}

// ===== NOUVEAUX TYPES RBAC =====

export interface RegisterDataExtended {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  nouveau_role: number;
  universite?: number;
  faculte?: number;
  departement?: number;
  promotion?: string;
  program?: string;
  phone_number?: string;
}

export interface UserVerificationData {
  user_id: number;
  approve: boolean;
  motif?: string;
}

export interface OrganisationStats {
  universites_count: number;
  facultes_count: number;
  departements_count: number;
  roles_count: number;
  utilisateurs_par_role: Record<string, number>;
  utilisateurs_non_verifies: number;
}

export interface AuthContextTypeExtended {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  registerExtended: (userData: RegisterDataExtended) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
  // Helpers pour le système RBAC
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  canVerifyUsers: () => boolean;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  category: number;
  importance?: "low" | "medium" | "high" | "urgent";
  target_universities?: string[];
  target_programs?: string[];
  program?: string;
  image?: File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
