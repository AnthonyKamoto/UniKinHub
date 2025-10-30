import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import { authAPI, rbacAPI } from "../services/api"
import type { User, RegisterData, RegisterDataExtended } from "../types"

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<boolean>
    register: (userData: RegisterData) => Promise<boolean>
    registerExtended: (userData: RegisterDataExtended) => Promise<boolean>
    logout: () => void
    isLoading: boolean
    isInitialized: boolean
    // Helpers pour le système RBAC
    hasPermission: (permission: string) => boolean
    isAdmin: () => boolean
    isModerator: () => boolean
    canVerifyUsers: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialiser l'authentification au démarrage
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Récupérer le token et l'utilisateur depuis localStorage
                const savedToken = localStorage.getItem("auth_token")
                const savedUser = localStorage.getItem("auth_user")

                if (savedToken && savedUser) {
                    try {
                        const userData = JSON.parse(savedUser)
                        setUser(userData)
                        console.log(
                            "Utilisateur restauré depuis localStorage:",
                            userData.username
                        )

                        // Optionnel : vérifier si le token est toujours valide
                        // Mais ne pas bloquer la connexion si l'API n'est pas disponible
                        authAPI.getCurrentUser().catch((error) => {
                            console.log(
                                "Vérification du token échouée (pas grave):",
                                error.message
                            )
                        })
                    } catch (error) {
                        console.log(
                            "Erreur de parsing de l'utilisateur sauvegardé:",
                            error
                        )
                        localStorage.removeItem("auth_token")
                        localStorage.removeItem("auth_user")
                    }
                }
            } catch (error) {
                console.error("Erreur d'initialisation:", error)
            } finally {
                setIsInitialized(true)
            }
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true)
        try {
            // L'API Django utilise username au lieu d'email
            const response = await authAPI.login({ username: email, password })

            // Sauvegarder le token et l'utilisateur
            localStorage.setItem("auth_token", response.token)
            localStorage.setItem("auth_user", JSON.stringify(response.user))

            setUser(response.user)
            return true
        } catch (error) {
            console.error("Erreur de connexion:", error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData: RegisterData): Promise<boolean> => {
        setIsLoading(true)
        try {
            const response = await authAPI.register(userData)

            // Sauvegarder le token et l'utilisateur
            localStorage.setItem("auth_token", response.token)
            localStorage.setItem("auth_user", JSON.stringify(response.user))

            setUser(response.user)
            return true
        } catch (error) {
            console.error("Erreur d'inscription:", error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const registerExtended = async (
        userData: RegisterDataExtended
    ): Promise<boolean> => {
        setIsLoading(true)
        try {
            // Nettoyer les données : retirer les champs undefined
            const cleanedData = Object.fromEntries(
                Object.entries(userData).filter(
                    ([_, value]) => value !== undefined
                )
            ) as RegisterDataExtended

            console.log("📤 Données envoyées au backend:", cleanedData)
            const response = await rbacAPI.registerExtended(cleanedData)

            // Sauvegarder le token et l'utilisateur
            localStorage.setItem("auth_token", response.token)
            localStorage.setItem("auth_user", JSON.stringify(response.user))

            setUser(response.user)
            return true
        } catch (error: any) {
            console.error("❌ Erreur d'inscription étendue:", error)
            console.error("❌ Détails de l'erreur:", error.response?.data)

            // Extraire le message d'erreur détaillé
            let errorMessage = "Erreur lors de l'inscription"

            if (error.response?.data) {
                const data = error.response.data
                // Si c'est un objet avec des erreurs de champs
                if (typeof data === "object" && !data.message && !data.error) {
                    const fieldErrors = Object.entries(data)
                        .map(([field, errors]: [string, any]) => {
                            const errorList = Array.isArray(errors)
                                ? errors
                                : [errors]
                            return `${field}: ${errorList.join(", ")}`
                        })
                        .join(" | ")
                    errorMessage = fieldErrors
                } else {
                    errorMessage =
                        data.message || data.error || JSON.stringify(data)
                }
            } else if (error.message) {
                errorMessage = error.message
            }

            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        try {
            // Appeler l'API Django pour détruire le token
            await authAPI.logout()
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error)
        } finally {
            setUser(null)
            localStorage.removeItem("auth_user")
            localStorage.removeItem("auth_token")
            setIsLoading(false)
        }
    }

    // ===== HELPERS RBAC =====

    const hasPermission = (permission: string): boolean => {
        if (!user) return false

        // Nouveau système RBAC
        if (user.nouveau_role_detail?.permissions) {
            return user.nouveau_role_detail.permissions[permission] === true
        }

        // Fallback sur l'ancien système
        const rolePermissions: Record<string, string[]> = {
            admin: [
                "can_manage_all",
                "can_verify_users",
                "can_moderate_news",
                "can_create_content",
                "can_view_content",
            ],
            publisher: ["can_create_content", "can_view_content"],
            teacher: ["can_create_content", "can_view_content"],
            student: ["can_view_content"],
        }

        return rolePermissions[user.role]?.includes(permission) || false
    }

    const isAdmin = (): boolean => {
        if (!user) return false

        // Nouveau système
        if (user.nouveau_role_detail) {
            return (
                user.nouveau_role_detail.nom === "admin_global" ||
                hasPermission("can_manage_all")
            )
        }

        // Ancien système
        return user.role === "admin"
    }

    const isModerator = (): boolean => {
        if (!user) return false

        // Nouveau système
        if (user.nouveau_role_detail) {
            return (
                user.nouveau_role_detail.nom === "moderateur" ||
                hasPermission("can_moderate_news")
            )
        }

        // Ancien système (admin peut modérer)
        return user.role === "admin"
    }

    const canVerifyUsers = (): boolean => {
        if (!user) return false

        // Nouveau système
        if (user.nouveau_role_detail) {
            return hasPermission("can_verify_users")
        }

        // Ancien système
        return user.role === "admin"
    }

    const value: AuthContextType = {
        user,
        login,
        register,
        registerExtended,
        logout,
        isLoading,
        isInitialized,
        hasPermission,
        isAdmin,
        isModerator,
        canVerifyUsers,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
