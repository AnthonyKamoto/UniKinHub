// Service API pour communiquer avec Django
const API_BASE_URL = "http://127.0.0.1:8000";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "student" | "teacher" | "publisher" | "admin";
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  message: string;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Helper pour les requêtes avec gestion des erreurs
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentification
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Appel réel à l'API Django pour l'authentification
      const res = await fetch(`${this.baseURL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || err?.error || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Sauvegarder token et utilisateur
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("auth_user", JSON.stringify(data.user));
      }

      return { user: data.user, message: "Connexion réussie" };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/api/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
      });
    } catch (e) {
      // ignore errors
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch(`${this.baseURL}/api/auth/user/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("auth_token")}`,
        },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("getCurrentUser error", e);
      return null;
    }
  }

  // Actualités
  async getNews() {
    return this.request("/api/news/");
  }

  async createNews(newsData: any) {
    return this.request("/api/news/create/", {
      method: "POST",
      body: JSON.stringify(newsData),
    });
  }

  async getNewsById(id: number) {
    return this.request(`/api/news/${id}/`);
  }

  // Profil utilisateur
  async updateProfile(profileData: any) {
    return this.request("/api/auth/profile/", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Administration
  async getAdminStats() {
    return this.request("/api/dashboard/");
  }
}

// Instance unique du service API
const apiService = new APIService();

export default apiService;
export type { User, LoginCredentials, LoginResponse };
