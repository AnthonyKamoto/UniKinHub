import axios from "axios"
import type {
    User,
    News,
    Category,
    Notification,
    Comment,
    LoginData,
    RegisterData,
    NewsFormData,
    PaginatedResponse,
    NotificationPreference,
} from "../types"

const API_BASE_URL = "http://127.0.0.1:8000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token")
    if (token) {
        config.headers.Authorization = `Token ${token}`
    }
    return config
})

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ne pas déconnecter automatiquement, laisser l'AuthContext gérer
        if (error.response?.status === 401) {
            console.log(
                "Erreur 401 détectée, mais ne pas déconnecter automatiquement"
            )
        }
        return Promise.reject(error)
    }
)

export const authAPI = {
    login: async (data: LoginData): Promise<{ user: User; token: string }> => {
        const response = await api.post("/auth/login/", data)
        return response.data
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout/")
    },

    register: async (
        data: RegisterData
    ): Promise<{ user: User; token: string }> => {
        const response = await api.post("/auth/register/", data)
        return response.data
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get("/auth/user/")
        return response.data
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.patch("/auth/profile/", data)
        return response.data
    },

    changePassword: async (data: {
        old_password: string
        new_password: string
    }): Promise<void> => {
        await api.post("/auth/change-password/", data)
    },
}

export const newsAPI = {
    getNews: async (params?: {
        category?: number
        search?: string
        status?: string
        page?: number
    }): Promise<PaginatedResponse<News>> => {
        const response = await api.get("/news/", { params })
        return response.data
    },

    getNewsById: async (id: number): Promise<News> => {
        const response = await api.get(`/news/${id}/`)
        return response.data
    },

    createNews: async (data: NewsFormData | FormData): Promise<News> => {
        // Si c'est déjà un FormData, l'envoyer directement
        if (data instanceof FormData) {
            const response = await api.post("/news/create/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            return response.data
        }

        // Sinon, construire FormData si nécessaire
        if (data.image) {
            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("content", data.content)
            formData.append("category", data.category.toString())
            if (data.importance) {
                formData.append("importance", data.importance)
            }
            if (
                data.target_universities &&
                data.target_universities.length > 0
            ) {
                formData.append(
                    "target_universities",
                    JSON.stringify(data.target_universities)
                )
            }
            if (data.target_programs && data.target_programs.length > 0) {
                formData.append(
                    "target_programs",
                    JSON.stringify(data.target_programs)
                )
            }
            formData.append("image", data.image)

            const response = await api.post("/news/create/", formData)
            return response.data
        }

        // Sinon, envoyer du JSON simple
        const payload = {
            title: data.title,
            content: data.content,
            category: parseInt(data.category.toString()),
            importance: data.importance || "medium",
            target_universities: data.target_universities || [],
            target_programs: data.target_programs || [],
        }

        console.log("=== PAYLOAD ENVOYÉ AU BACKEND ===", payload)
        console.log("Token présent?", !!localStorage.getItem("auth_token"))

        const response = await api.post("/news/create/", payload)
        console.log("=== RÉPONSE DU BACKEND ===", response.data)
        return response.data
    },

    updateNews: async (
        id: number,
        data: Partial<NewsFormData>
    ): Promise<News> => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === "image" && value instanceof File) {
                    formData.append(key, value)
                } else if (key !== "image") {
                    formData.append(key, value.toString())
                }
            }
        })

        const response = await api.patch(`/news/${id}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response.data
    },

    deleteNews: async (id: number): Promise<void> => {
        await api.delete(`/news/${id}/`)
    },

    moderateNews: async (
        id: number,
        action: "approve" | "reject",
        reason?: string
    ): Promise<News> => {
        const response = await api.post(`/news/${id}/moderate/`, {
            action,
            reason,
        })
        return response.data
    },

    getMyNews: async (): Promise<News[]> => {
        const response = await api.get("/news/my-articles/")
        return response.data
    },

    toggleLike: async (
        newsId: number
    ): Promise<{ message: string; liked: boolean; likes_count: number }> => {
        const response = await api.post(`/news/${newsId}/like/`)
        return response.data
    },

    removeLike: async (
        newsId: number
    ): Promise<{ message: string; liked: boolean; likes_count: number }> => {
        const response = await api.delete(`/news/${newsId}/like/`)
        return response.data
    },
}

export const categoryAPI = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get("/categories/")
        return response.data
    },

    createCategory: async (data: {
        name: string
        description: string
    }): Promise<Category> => {
        const response = await api.post("/categories/", data)
        return response.data
    },

    updateCategory: async (
        id: number,
        data: Partial<Category>
    ): Promise<Category> => {
        const response = await api.patch(`/categories/${id}/`, data)
        return response.data
    },

    deleteCategory: async (id: number): Promise<void> => {
        await api.delete(`/categories/${id}/`)
    },
}

export const notificationAPI = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get("/notifications/")
        return response.data
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.patch(`/notifications/${id}/`, { is_read: true })
    },

    markAllAsRead: async (): Promise<void> => {
        await api.post("/notifications/mark-all-read/")
    },
}

export const commentAPI = {
    getComments: async (newsId: number): Promise<Comment[]> => {
        const response = await api.get(`/news/${newsId}/comments/`)
        return response.data
    },

    createComment: async (
        newsId: number,
        content: string
    ): Promise<Comment> => {
        const response = await api.post(`/news/${newsId}/comments/`, {
            content,
        })
        return response.data
    },

    deleteComment: async (id: number): Promise<void> => {
        await api.delete(`/comments/${id}/`)
    },

    moderateComment: async (
        id: number,
        approved: boolean
    ): Promise<Comment> => {
        const response = await api.patch(`/comments/${id}/`, {
            is_approved: approved,
        })
        return response.data
    },
}

export const adminAPI = {
    getStats: async (): Promise<{
        total_news: number
        pending_news: number
        total_users: number
        total_comments: number
    }> => {
        const response = await api.get("/admin/stats/")
        return response.data
    },

    getUsers: async (): Promise<User[]> => {
        const response = await api.get("/admin/users/")
        return response.data
    },

    updateUserRole: async (userId: number, role: string): Promise<User> => {
        const response = await api.patch(`/admin/users/${userId}/`, { role })
        return response.data
    },

    getPendingNews: async (): Promise<News[]> => {
        const response = await api.get("/news/?status=pending")
        return response.data.results
    },
}

export const preferencesAPI = {
    getPreferences: async (): Promise<NotificationPreference> => {
        const response = await api.get("/preferences/")
        return response.data
    },

    updatePreferences: async (
        data: Partial<NotificationPreference>
    ): Promise<NotificationPreference> => {
        const response = await api.patch("/preferences/", data)
        return response.data
    },
}

// ===== NOUVELLES API RBAC =====

import type {
    Role,
    Universite,
    Faculte,
    Departement,
    RegisterDataExtended,
    UserVerificationData,
    OrganisationStats,
} from "../types"

export const rbacAPI = {
    // Récupération des données organisationnelles
    getRoles: async (): Promise<Role[]> => {
        const response = await api.get("/roles/")
        // Gérer à la fois les réponses paginées et non paginées
        return Array.isArray(response.data)
            ? response.data
            : response.data.results || []
    },

    getUniversites: async (): Promise<Universite[]> => {
        const response = await api.get("/universites/")
        // Gérer à la fois les réponses paginées et non paginées
        return Array.isArray(response.data)
            ? response.data
            : response.data.results || []
    },

    getFacultes: async (universiteId?: number): Promise<Faculte[]> => {
        const url = universiteId
            ? `/facultes/?universite=${universiteId}`
            : "/facultes/"
        const response = await api.get(url)
        // Gérer à la fois les réponses paginées et non paginées
        return Array.isArray(response.data)
            ? response.data
            : response.data.results || []
    },

    getDepartements: async (faculteId?: number): Promise<Departement[]> => {
        const url = faculteId
            ? `/departements/?faculte=${faculteId}`
            : "/departements/"
        const response = await api.get(url)
        // Gérer à la fois les réponses paginées et non paginées
        return Array.isArray(response.data)
            ? response.data
            : response.data.results || []
    },

    // Authentification étendue
    registerExtended: async (
        data: RegisterDataExtended
    ): Promise<{
        user: User
        token: string
        message: string
    }> => {
        const response = await api.post("/auth/register-extended/", data)
        return response.data
    },

    getCurrentUserExtended: async (): Promise<User> => {
        const response = await api.get("/auth/profile-extended/")
        return response.data
    },

    updateUserExtended: async (data: Partial<User>): Promise<User> => {
        const response = await api.patch("/auth/profile-extended/", data)
        return response.data
    },

    // Gestion des utilisateurs
    getUsers: async (params?: {
        role?: number
        universite?: number
        verified?: boolean
    }): Promise<PaginatedResponse<User>> => {
        const searchParams = new URLSearchParams()
        if (params?.role) searchParams.append("role", params.role.toString())
        if (params?.universite)
            searchParams.append("universite", params.universite.toString())
        if (params?.verified !== undefined)
            searchParams.append("verified", params.verified.toString())

        const url = `/users/${
            searchParams.toString() ? `?${searchParams}` : ""
        }`
        const response = await api.get(url)
        return response.data
    },

    verifyUser: async (
        data: UserVerificationData
    ): Promise<{
        message: string
        user?: User
        motif?: string
    }> => {
        const response = await api.post("/users/verify/", data)
        return response.data
    },

    // Statistiques
    getOrganisationStats: async (): Promise<OrganisationStats> => {
        const response = await api.get("/organisation/stats/")
        return response.data
    },
}

export default api
