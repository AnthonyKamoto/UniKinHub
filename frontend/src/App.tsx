import React from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import {
    Container,
    Typography,
    Box,
    Button,
    AppBar,
    Toolbar,
} from "@mui/material"
import { Home as HomeIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import HomePage from "./pages/HomePage"
import NewsDetailPage from "./pages/NewsDetailPage"
import CreateNewsPage from "./pages/CreateNewsPage"
import LandingPage from "./pages/LandingPage"
import ModerationListPage from "./pages/ModerationListPage"
import NotificationSettingsPage from "./pages/NotificationSettingsPage"
import RegisterExtendedPage from "./pages/RegisterExtendedPage"
import ProfileExtendedPage from "./pages/ProfileExtendedPage"
import UserManagementPage from "./pages/UserManagementPage"
// import ProfilePage from "./pages/ProfilePage" - Temporairement désactivé
import "./App.css"

// Composant pour gérer l'affichage de la page d'accueil
const HomePageOrLanding = () => {
    const { user } = useAuth()
    return user ? <HomePage /> : <LandingPage />
}

// Composant ProfilePage temporaire
const ProfilePageTemp = () => {
    const { user } = useAuth()

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Profil Utilisateur
            </Typography>

            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                }}
            >
                <Typography variant="h6">Informations personnelles</Typography>
                <Typography>
                    Nom: {user?.first_name} {user?.last_name}
                </Typography>
                <Typography>Email: {user?.email}</Typography>
                <Typography>
                    Statut: {user?.is_staff ? "Administrateur" : "Étudiant"}
                </Typography>
            </Box>

            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                }}
            >
                <Typography variant="h6">Statistiques</Typography>
                <Typography>Articles lus: 25</Typography>
                <Typography>Articles aimés: 8</Typography>
                <Typography>Commentaires: 12</Typography>
            </Box>
        </Box>
    )
}

// Composant AdminDashboard simplifié
const AdminDashboardSimple = () => {
    const { user } = useAuth()

    if (user?.role !== "admin") {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h5" color="error">
                    Accès refusé
                </Typography>
                <Typography>
                    Vous devez être administrateur pour accéder à cette page.
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Tableau de bord administrateur
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
                Bienvenue {user.first_name} ! Voici votre interface
                d'administration.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button variant="contained" size="large">
                    Gérer les actualités
                </Button>
                <Button variant="outlined" size="large">
                    Gérer les utilisateurs
                </Button>
                <Button variant="outlined" size="large">
                    Modérer les commentaires
                </Button>
            </Box>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Statistiques (Mock)
            </Typography>
            <Typography variant="body2" color="text.secondary">
                • Total actualités: 45
            </Typography>
            <Typography variant="body2" color="text.secondary">
                • En attente de modération: 8
            </Typography>
            <Typography variant="body2" color="text.secondary">
                • Utilisateurs inscrits: 234
            </Typography>
        </Box>
    )
}

// Barre de navigation moderne et épurée
const NavBar = () => {
    const { user, logout } = useAuth()

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar sx={{ py: 1 }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        fontSize: "1.3rem",
                    }}
                >
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "1.2rem",
                        }}
                    >
                        📰
                    </Box>
                    UniKinHub
                </Typography>

                {user ? (
                    <Box
                        sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                    >
                        <Button
                            color="inherit"
                            component={Link}
                            to="/create"
                            sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                                },
                            }}
                        >
                            ✏️ Créer
                        </Button>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/profile"
                            sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                                },
                            }}
                        >
                            👤 Profil
                        </Button>

                        <Button
                            color="inherit"
                            component={Link}
                            to="/notifications"
                            sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                                },
                            }}
                        >
                            🔔 Notifications
                        </Button>

                        {["admin", "moderator"].includes(user.role) && (
                            <Button
                                color="inherit"
                                component={Link}
                                to="/moderation"
                                sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    textTransform: "none",
                                    fontWeight: 500,
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.1)",
                                    },
                                }}
                            >
                                ⚖️ Modération
                            </Button>
                        )}

                        {user.role === "admin" && (
                            <Button
                                color="inherit"
                                component={Link}
                                to="/admin"
                                sx={{
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    textTransform: "none",
                                    fontWeight: 500,
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.1)",
                                    },
                                }}
                            >
                                ⚙️ Admin
                            </Button>
                        )}

                        <Button
                            color="inherit"
                            onClick={logout}
                            sx={{
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 500,
                                ml: 1,
                                border: "1px solid rgba(25, 118, 210, 0.3)",
                                "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.1)",
                                    borderColor: "rgba(25, 118, 210, 0.5)",
                                },
                            }}
                        >
                            🚪 Déconnexion ({user.first_name})
                        </Button>
                    </Box>
                ) : (
                    <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: "rgba(25, 118, 210, 0.5)",
                            "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.1)",
                                borderColor: "rgba(25, 118, 210, 0.8)",
                            },
                        }}
                    >
                        🔐 Connexion
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    )
}

// Page de connexion
const LoginPage = () => {
    const { login, isLoading, user } = useAuth()
    const navigate = useNavigate()
    const [credentials, setCredentials] = React.useState({
        email: "",
        password: "",
    })
    const [error, setError] = React.useState("")

    // Rediriger si déjà connecté
    React.useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [user, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const success = await login(credentials.email, credentials.password)
            if (success) {
                navigate("/")
            } else {
                setError("Identifiants incorrects")
            }
        } catch (err) {
            setError("Identifiants incorrects")
        }
    }

    return (
        <>
            {/* Navigation Bar */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "white",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Toolbar>
                    <Button
                        startIcon={<HomeIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            color: "#1976D2",
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        Retour à l'accueil
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 700,
                            }}
                        >
                            📰
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#1976D2",
                            }}
                        >
                            UniKinHub
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm">
                <Box
                    sx={{
                        mt: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Connexion
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 3, width: "100%" }}
                    >
                        <Box sx={{ mb: 2 }}>
                            <label htmlFor="username" className="login-label">
                                Nom d'utilisateur:
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        email: e.target.value,
                                    })
                                }
                                placeholder=""
                                className="login-input"
                                required
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <label htmlFor="password" className="login-label">
                                Mot de passe:
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        password: e.target.value,
                                    })
                                }
                                placeholder=""
                                className="login-input"
                                required
                            />
                        </Box>

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

// Composant de protection des routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    return user ? <>{children}</> : <Navigate to="/login" replace />
}

// Composant pour routes admin uniquement
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    return user?.role === "admin" ? (
        <>{children}</>
    ) : (
        <Navigate to="/" replace />
    )
}

// Composant pour routes modérateurs et admin
const ModeratorRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    return user && ["admin", "moderator"].includes(user.role) ? (
        <>{children}</>
    ) : (
        <Navigate to="/" replace />
    )
}

// Composant App principal
const AppContent = () => {
    const { user } = useAuth()

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: user ? "#f5f5f5" : "transparent",
            }}
        >
            {user && <NavBar />}
            {user ? (
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <Routes>
                        <Route path="/" element={<HomePageOrLanding />} />
                        <Route path="/news/:id" element={<NewsDetailPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/register-extended"
                            element={<RegisterExtendedPage />}
                        />

                        {/* Routes protégées */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfileExtendedPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/create"
                            element={
                                <ProtectedRoute>
                                    <CreateNewsPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute>
                                    <NotificationSettingsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Routes admin uniquement */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboardSimple />
                                </AdminRoute>
                            }
                        />

                        {/* Route de modération pour admin et modérateurs */}
                        <Route
                            path="/moderation"
                            element={
                                <ModeratorRoute>
                                    <ModerationListPage />
                                </ModeratorRoute>
                            }
                        />

                        {/* Route de gestion des utilisateurs pour admin et modérateurs */}
                        <Route
                            path="/users"
                            element={
                                <ModeratorRoute>
                                    <UserManagementPage />
                                </ModeratorRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Container>
            ) : (
                <Routes>
                    <Route path="/" element={<HomePageOrLanding />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/register-extended"
                        element={<RegisterExtendedPage />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            )}
        </Box>
    )
}

// Export principal avec AuthProvider
export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}
