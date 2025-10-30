// Service API pour communiquer avec Django
const API_BASE_URL = "http://127.0.0.1:8000"

interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    role: "student" | "teacher" | "publisher" | "admin"
}

interface LoginCredentials {
    email: string
    password: string
}

interface LoginResponse {
    user: User
    message: string
}

class APIService {
    private baseURL: string

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL
    }

    // Helper pour les requêtes avec gestion des erreurs
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        }

        try {
            const response = await fetch(url, config)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error)
            throw error
        }
    }

    // Authentification
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            // Pour l'instant, on simule avec les données mock
            // TODO: Remplacer par un vrai appel API
            if (
                credentials.email === "admin@example.com" &&
                credentials.password === "admin"
            ) {
                return {
                    user: {
                        id: 1,
                        username: "admin",
                        email: "admin@example.com",
                        first_name: "Admin",
                        last_name: "User",
                        role: "admin",
                    },
                    message: "Connexion réussie",
                }
            }
            throw new Error("Identifiants incorrects")
        } catch (error) {
            throw error
        }
    }

    async logout(): Promise<void> {
        // TODO: Appel API Django logout
        console.log("Logout API call (mock)")
    }

    async getCurrentUser(): Promise<User | null> {
        // TODO: Appel API Django pour récupérer l'utilisateur actuel
        console.log("Get current user API call (mock)")
        return null
    }

    // Actualités
    async getNews() {
        return this.request("/api/news/")
    }

    async createNews(newsData: any) {
        return this.request("/api/news/create/", {
            method: "POST",
            body: JSON.stringify(newsData),
        })
    }

    async getNewsById(id: number) {
        return this.request(`/api/news/${id}/`)
    }

    // Profil utilisateur
    async updateProfile(profileData: any) {
        return this.request("/api/auth/profile/", {
            method: "PUT",
            body: JSON.stringify(profileData),
        })
    }

    // Administration
    async getAdminStats() {
        return this.request("/api/dashboard/")
    }
}

// Instance unique du service API
const apiService = new APIService()

export default apiService
export type { User, LoginCredentials, LoginResponse }
