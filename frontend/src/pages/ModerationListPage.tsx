import React, { useState } from "react"
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Grid,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    LinearProgress,
} from "@mui/material"
import {
    CheckCircle,
    Cancel,
    Visibility,
    Person,
    Schedule,
    TrendingUp,
    Article,
    Warning,
    Refresh,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface NewsItem {
    id: number
    title: string
    content: string
    author: {
        id: number
        username: string
        first_name: string
        last_name: string
        role: string
    }
    category: {
        id: number
        name: string
        color: string
    }
    status: string
    importance: string
    created_at: string
    view_count: number
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

const ModerationListPage: React.FC = () => {
    const { user } = useAuth()
    const [tabValue, setTabValue] = useState(0)
    const [pendingNews, setPendingNews] = useState<NewsItem[]>([])
    const [moderationDialog, setModerationDialog] = useState<{
        open: boolean
        news: NewsItem | null
        action: "approve" | "reject" | null
    }>({
        open: false,
        news: null,
        action: null,
    })
    const [rejectionReason, setRejectionReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState({
        pending_count: 0,
        approved_today: 0,
        rejected_today: 0,
        total_moderated: 0,
    })

    // Mock data pour la démonstration
    React.useEffect(() => {
        // Simulation des données en attente
        const mockPendingNews: NewsItem[] = [
            {
                id: 1,
                title: "Nouvelle bibliothèque universitaire",
                content:
                    "L'université inaugure une nouvelle bibliothèque moderne avec des espaces de travail collaboratif...",
                author: {
                    id: 2,
                    username: "marie.dubois",
                    first_name: "Marie",
                    last_name: "Dubois",
                    role: "publisher",
                },
                category: {
                    id: 1,
                    name: "Infrastructure",
                    color: "#2196F3",
                },
                status: "pending",
                importance: "medium",
                created_at: "2025-10-22T08:30:00Z",
                view_count: 15,
            },
            {
                id: 2,
                title: "URGENT: Report des examens de session",
                content:
                    "En raison de circonstances exceptionnelles, les examens de la session de novembre sont reportés...",
                author: {
                    id: 3,
                    username: "ahmed.hassan",
                    first_name: "Ahmed",
                    last_name: "Hassan",
                    role: "publisher",
                },
                category: {
                    id: 2,
                    name: "Académique",
                    color: "#FF9800",
                },
                status: "pending",
                importance: "urgent",
                created_at: "2025-10-22T10:15:00Z",
                view_count: 45,
            },
            {
                id: 3,
                title: "Concours de programmation inter-universitaire",
                content:
                    "Inscription ouverte pour le grand concours de programmation qui aura lieu le mois prochain...",
                author: {
                    id: 4,
                    username: "paul.martin",
                    first_name: "Paul",
                    last_name: "Martin",
                    role: "student",
                },
                category: {
                    id: 3,
                    name: "Événements",
                    color: "#4CAF50",
                },
                status: "pending",
                importance: "low",
                created_at: "2025-10-22T14:20:00Z",
                view_count: 8,
            },
        ]

        setPendingNews(mockPendingNews)
        setStats({
            pending_count: mockPendingNews.length,
            approved_today: 5,
            rejected_today: 2,
            total_moderated: 28,
        })
    }, [])

    // Vérification des permissions
    if (!user || !["admin", "moderator"].includes(user.role)) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Vous n'avez pas les permissions pour accéder à la
                    modération.
                </Alert>
            </Container>
        )
    }

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case "urgent":
                return "#f44336"
            case "high":
                return "#ff9800"
            case "medium":
                return "#2196f3"
            case "low":
                return "#4caf50"
            default:
                return "#757575"
        }
    }

    const getImportanceLabel = (importance: string) => {
        switch (importance) {
            case "urgent":
                return "Urgent"
            case "high":
                return "Élevée"
            case "medium":
                return "Moyenne"
            case "low":
                return "Faible"
            default:
                return importance
        }
    }

    const handleModerationAction = (
        news: NewsItem,
        action: "approve" | "reject"
    ) => {
        setModerationDialog({
            open: true,
            news,
            action,
        })
    }

    const executeModerationAction = async () => {
        if (!moderationDialog.news || !moderationDialog.action) return

        setLoading(true)

        try {
            // Simulation de l'appel API
            await new Promise((resolve) => setTimeout(resolve, 1000))

            if (moderationDialog.action === "approve") {
                // Retirer de la liste des en attente
                setPendingNews((prev) =>
                    prev.filter((n) => n.id !== moderationDialog.news!.id)
                )
                setStats((prev) => ({
                    ...prev,
                    pending_count: prev.pending_count - 1,
                    approved_today: prev.approved_today + 1,
                }))
            } else if (moderationDialog.action === "reject") {
                // Retirer de la liste des en attente
                setPendingNews((prev) =>
                    prev.filter((n) => n.id !== moderationDialog.news!.id)
                )
                setStats((prev) => ({
                    ...prev,
                    pending_count: prev.pending_count - 1,
                    rejected_today: prev.rejected_today + 1,
                }))
            }

            // Fermer le dialog
            setModerationDialog({ open: false, news: null, action: null })
            setRejectionReason("")
        } catch (error) {
            console.error("Erreur lors de la modération:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Centre de Modération
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Gérez les actualités en attente de validation
            </Typography>

            {/* Statistiques */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Schedule
                                sx={{
                                    fontSize: 40,
                                    color: "warning.main",
                                    mb: 1,
                                }}
                            />
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="warning.main"
                            >
                                {stats.pending_count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                En attente
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <CheckCircle
                                sx={{
                                    fontSize: 40,
                                    color: "success.main",
                                    mb: 1,
                                }}
                            />
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="success.main"
                            >
                                {stats.approved_today}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Approuvées aujourd'hui
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Cancel
                                sx={{
                                    fontSize: 40,
                                    color: "error.main",
                                    mb: 1,
                                }}
                            />
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="error.main"
                            >
                                {stats.rejected_today}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rejetées aujourd'hui
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <TrendingUp
                                sx={{
                                    fontSize: 40,
                                    color: "primary.main",
                                    mb: 1,
                                }}
                            />
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="primary.main"
                            >
                                {stats.total_moderated}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total modérées
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Onglets */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                >
                    <Tab label={`En attente (${stats.pending_count})`} />
                    <Tab label="Historique" />
                </Tabs>
            </Box>

            {/* Actualités en attente */}
            <TabPanel value={tabValue} index={0}>
                {pendingNews.length === 0 ? (
                    <Alert severity="info" sx={{ textAlign: "center" }}>
                        <Typography variant="h6">
                            Aucune actualité en attente
                        </Typography>
                        <Typography>
                            Toutes les actualités ont été traitées !
                        </Typography>
                    </Alert>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Article</TableCell>
                                    <TableCell>Auteur</TableCell>
                                    <TableCell>Importance</TableCell>
                                    <TableCell>Date de soumission</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingNews.map((news) => (
                                    <TableRow key={news.id}>
                                        <TableCell>
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="medium"
                                                >
                                                    {news.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    noWrap
                                                >
                                                    {news.content.substring(
                                                        0,
                                                        100
                                                    )}
                                                    ...
                                                </Typography>
                                                <Chip
                                                    label={news.category.name}
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
                                                        backgroundColor:
                                                            news.category
                                                                .color + "20",
                                                        color: news.category
                                                            .color,
                                                        border: `1px solid ${news.category.color}`,
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                    }}
                                                >
                                                    {news.author.first_name[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="medium"
                                                    >
                                                        {news.author.first_name}{" "}
                                                        {news.author.last_name}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {news.author.role}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={getImportanceLabel(
                                                    news.importance
                                                )}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        getImportanceColor(
                                                            news.importance
                                                        ) + "20",
                                                    color: getImportanceColor(
                                                        news.importance
                                                    ),
                                                    border: `1px solid ${getImportanceColor(
                                                        news.importance
                                                    )}`,
                                                    fontWeight: "bold",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {format(
                                                    new Date(news.created_at),
                                                    "dd/MM/yyyy",
                                                    { locale: fr }
                                                )}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {format(
                                                    new Date(news.created_at),
                                                    "HH:mm",
                                                    { locale: fr }
                                                )}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Box
                                                sx={{ display: "flex", gap: 1 }}
                                            >
                                                <Tooltip title="Approuver">
                                                    <IconButton
                                                        color="success"
                                                        onClick={() =>
                                                            handleModerationAction(
                                                                news,
                                                                "approve"
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        <CheckCircle />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Rejeter">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleModerationAction(
                                                                news,
                                                                "reject"
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        <Cancel />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Voir détails">
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </TabPanel>

            {/* Historique */}
            <TabPanel value={tabValue} index={1}>
                <Alert severity="info">
                    <Typography>
                        Fonctionnalité d'historique en cours de développement
                    </Typography>
                </Alert>
            </TabPanel>

            {/* Dialog de modération */}
            <Dialog
                open={moderationDialog.open}
                onClose={() =>
                    setModerationDialog({
                        open: false,
                        news: null,
                        action: null,
                    })
                }
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {moderationDialog.action === "approve"
                        ? "Approuver l'article"
                        : "Rejeter l'article"}
                </DialogTitle>

                <DialogContent>
                    {moderationDialog.news && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {moderationDialog.news.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Par {moderationDialog.news.author.first_name}{" "}
                                {moderationDialog.news.author.last_name}
                            </Typography>
                        </Box>
                    )}

                    {moderationDialog.action === "approve" ? (
                        <Alert severity="success">
                            <Typography>
                                Êtes-vous sûr de vouloir approuver et publier
                                cet article ?
                            </Typography>
                        </Alert>
                    ) : (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography>
                                    Veuillez indiquer la raison du rejet pour
                                    aider l'auteur à améliorer son article.
                                </Typography>
                            </Alert>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Raison du rejet"
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder="Expliquez pourquoi cet article ne peut pas être publié..."
                                required
                            />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() =>
                            setModerationDialog({
                                open: false,
                                news: null,
                                action: null,
                            })
                        }
                        disabled={loading}
                    >
                        Annuler
                    </Button>

                    <Button
                        onClick={executeModerationAction}
                        disabled={
                            loading ||
                            (moderationDialog.action === "reject" &&
                                !rejectionReason.trim())
                        }
                        variant="contained"
                        color={
                            moderationDialog.action === "approve"
                                ? "success"
                                : "error"
                        }
                    >
                        {loading && <LinearProgress sx={{ mr: 1 }} />}
                        {moderationDialog.action === "approve"
                            ? "Approuver"
                            : "Rejeter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ModerationListPage
