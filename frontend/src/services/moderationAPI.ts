/**
 * Service API étendu pour la modération et les nouvelles fonctionnalités
 * Gestion des rôles : Administrateurs, Modérateurs, Publiants, Étudiants
 */
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Types étendus
export interface NewsExtended {
  id: number;
  programme_ou_formation: string;
  draft_title: string;
  draft_content: string;
  final_title: string;
  final_content: string;
  title: string; // Titre à afficher (final ou draft)
  content: string; // Contenu à afficher (final ou draft)
  author: number;
  author_name: string;
  category: number;
  category_name: string;
  status: "draft" | "pending" | "published" | "rejected" | "invalidated";
  importance: "low" | "medium" | "high" | "urgent";
  written_at: string;
  created_at: string;
  updated_at: string;
  moderated_at: string | null;
  moderator: number | null;
  moderator_approved: boolean;
  moderation_comment: string;
  desired_publish_start: string;
  desired_publish_end: string | null;
  publish_date: string | null;
  expiry_date: string | null;
  admin_invalidated_by: number | null;
  admin_invalidation_reason: string;
  invalidated_at: string | null;
  views_count: number;
  likes_count: number;
  image: string | null;
  attachment: string | null;
  is_liked: boolean;
}

export interface NewsCreateData {
  programme_ou_formation: string;
  draft_title: string;
  draft_content: string;
  category: number;
  importance: "low" | "medium" | "high" | "urgent";
  desired_publish_start: string;
  desired_publish_end?: string;
  expiry_date?: string;
  image?: File;
  attachment?: File;
}

export interface NewsModerationData {
  final_title: string;
  final_content: string;
  moderator_approved: boolean;
  moderation_comment?: string;
}

export interface NewsInvalidationData {
  admin_invalidation_reason: string;
}

export interface UserPreferences {
  notification_frequency: "immediate" | "daily" | "weekly" | "disabled";
  email_notifications: boolean;
  push_notifications: boolean;
  program?: string;
  programme_ou_formation?: string;
}

/**
 * API de modération des news
 */
export const moderationAPI = {
  /**
   * Récupérer la liste des news en attente de modération
   */
  getPendingNews: async (): Promise<NewsExtended[]> => {
    const response = await api.get("/api/news-api/pending/");
    return response.data;
  },

  /**
   * Récupérer les news créées par l'utilisateur connecté
   */
  getMyNews: async (): Promise<NewsExtended[]> => {
    const response = await api.get("/api/news-api/my_news/");
    return response.data;
  },

  /**
   * Modérer une news (approuver ou rejeter avec modifications)
   */
  moderateNews: async (
    newsId: number,
    data: NewsModerationData,
  ): Promise<NewsExtended> => {
    const response = await api.post(`/api/news-api/${newsId}/moderate/`, data);
    return response.data;
  },

  /**
   * Approuver rapidement une news sans modifications
   */
  approveNews: async (
    newsId: number,
    comment?: string,
  ): Promise<{ message: string }> => {
    const response = await api.post(`/api/news-api/${newsId}/approve/`, {
      comment: comment || "Approuvé",
    });
    return response.data;
  },

  /**
   * Rejeter une news avec une raison
   */
  rejectNews: async (
    newsId: number,
    reason: string,
  ): Promise<{ message: string }> => {
    const response = await api.post(`/api/news-api/${newsId}/reject/`, {
      reason,
    });
    return response.data;
  },

  /**
   * Invalider une news publiée (admin uniquement)
   */
  invalidateNews: async (
    newsId: number,
    data: NewsInvalidationData,
  ): Promise<{ message: string }> => {
    const response = await api.post(
      `/api/news-api/${newsId}/invalidate/`,
      data,
    );
    return response.data;
  },
};

/**
 * API étendue pour les news
 */
export const newsExtendedAPI = {
  /**
   * Récupérer toutes les news (avec filtres)
   */
  getAllNews: async (params?: {
    status?: string;
    importance?: string;
    program?: string;
    page?: number;
  }): Promise<NewsExtended[]> => {
    const response = await api.get("/api/news-api/", { params });
    return response.data;
  },

  /**
   * Récupérer une news par ID
   */
  getNewsById: async (id: number): Promise<NewsExtended> => {
    const response = await api.get(`/api/news-api/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle news
   */
  createNews: async (data: NewsCreateData): Promise<NewsExtended> => {
    const formData = new FormData();

    // Ajouter les champs obligatoires
    formData.append("programme_ou_formation", data.programme_ou_formation);
    formData.append("draft_title", data.draft_title);
    formData.append("draft_content", data.draft_content);
    formData.append("category", data.category.toString());
    formData.append("importance", data.importance);
    formData.append("desired_publish_start", data.desired_publish_start);

    // Ajouter les champs optionnels
    if (data.desired_publish_end) {
      formData.append("desired_publish_end", data.desired_publish_end);
    }
    if (data.expiry_date) {
      formData.append("expiry_date", data.expiry_date);
    }
    if (data.image) {
      formData.append("image", data.image);
    }
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    const response = await api.post("/api/news-api/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Mettre à jour une news
   */
  updateNews: async (
    id: number,
    data: Partial<NewsCreateData>,
  ): Promise<NewsExtended> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.patch(`/api/news-api/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Supprimer une news
   */
  deleteNews: async (id: number): Promise<void> => {
    await api.delete(`/api/news-api/${id}/`);
  },

  /**
   * Filtrer les news par importance
   */
  getNewsByImportance: async (
    importance: "low" | "medium" | "high" | "urgent",
  ): Promise<NewsExtended[]> => {
    const response = await api.get("/api/news-api/by_importance/", {
      params: { importance },
    });
    return response.data;
  },

  /**
   * Filtrer les news par programme/formation
   */
  getNewsByProgram: async (program: string): Promise<NewsExtended[]> => {
    const response = await api.get("/api/news-api/by_program/", {
      params: { program },
    });
    return response.data;
  },
};

/**
 * API des préférences utilisateur
 */
export const userPreferencesAPI = {
  /**
   * Récupérer les préférences de l'utilisateur
   */
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get("/auth/profile/");
    return {
      notification_frequency:
        response.data.notification_frequency || "immediate",
      email_notifications: response.data.email_notifications !== false,
      push_notifications: response.data.push_notifications !== false,
      program: response.data.program,
      programme_ou_formation: response.data.programme_ou_formation,
    };
  },

  /**
   * Mettre à jour les préférences de notification
   */
  updatePreferences: async (
    preferences: Partial<UserPreferences>,
  ): Promise<UserPreferences> => {
    const response = await api.patch("/auth/profile/", preferences);
    return response.data;
  },

  /**
   * Mettre à jour la fréquence de notification
   */
  updateNotificationFrequency: async (
    frequency: "immediate" | "daily" | "weekly" | "disabled",
  ): Promise<void> => {
    await api.patch("/auth/profile/", { notification_frequency: frequency });
  },
};

/**
 * API des catégories
 */
export const categoriesAPI = {
  /**
   * Récupérer toutes les catégories
   */
  getCategories: async (): Promise<
    Array<{ id: number; name: string; description: string; color: string }>
  > => {
    const response = await api.get("/categories/");
    return response.data;
  },
};

/**
 * API des statistiques
 */
export const statsAPI = {
  /**
   * Récupérer les statistiques de modération
   */
  getModerationStats: async (): Promise<{
    pending_count: number;
    approved_today: number;
    rejected_today: number;
    total_moderated: number;
  }> => {
    const response = await api.get("/moderation/stats/");
    return response.data;
  },

  /**
   * Récupérer les statistiques du dashboard
   */
  getDashboardStats: async (): Promise<{
    total_news: number;
    published_news: number;
    pending_news: number;
    total_users: number;
    recent_news: NewsExtended[];
  }> => {
    const response = await api.get("/dashboard/");
    return response.data;
  },
};

export default api;
