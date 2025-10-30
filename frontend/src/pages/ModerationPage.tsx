import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Stack,
    Chip,
    Avatar,
    Divider,
    Paper,
    Grid,
} from "@mui/material"
import {
    CheckCircle,
    Cancel,
    Edit,
    ArrowBack,
    Visibility,
    Person,
    Category as CategoryIcon,
    History,
} from "@mui/icons-material"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { newsAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import type { News } from "../types"

const moderationSchema = z.object({
    reason: z.string().min(1, "Une raison est requise pour le rejet"),
})

type ModerationFormData = z.infer<typeof moderationSchema>

const ModerationPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [action, setAction] = useState<"approve" | "reject" | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ModerationFormData>({
        resolver: zodResolver(moderationSchema),
    })

    // Vérification des permissions
    if (!user || !["admin", "moderator"].includes(user.role)) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Vous n'avez pas les permissions pour modérer les articles
                </Alert>
            </Box>
        )
    }

    // Requête pour récupérer l'article
    const {
        data: article,
        isLoading: articleLoading,
        error: articleError,
    } = useQuery({
        queryKey: ["news", id],
        queryFn: () => newsAPI.getNewsById(Number(id)),
        enabled: !!id,
    })

    // Mutation pour modérer l'article
    const moderateMutation = useMutation({
        mutationFn: ({
            action,
            reason,
        }: {
            action: "approve" | "reject"
            reason?: string
        }) => newsAPI.moderateNews(Number(id), action, reason),
        onSuccess: (data) => {
            const message =
                data.status === "published"
                    ? "Article approuvé"
                    : "Article rejeté"
            toast.success(message)
            queryClient.invalidateQueries({ queryKey: ["news"] })
            queryClient.invalidateQueries({ queryKey: ["admin-pending-news"] })
            navigate("/admin")
        },
        onError: () => {
            toast.error("Erreur lors de la modération")
        },
    })

    const handleModerationAction = (actionType: "approve" | "reject") => {
        setAction(actionType)
        if (actionType === "approve") {
            // Approuver directement
            moderateMutation.mutate({ action: actionType })
        } else {
            // Ouvrir le dialog pour la raison du rejet
            setDialogOpen(true)
        }
    }

    const onSubmitRejection = (data: ModerationFormData) => {
        if (action === "reject") {
            moderateMutation.mutate({ action, reason: data.reason })
            setDialogOpen(false)
            reset()
        }
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
        setAction(null)
        reset()
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "success"
            case "pending":
                return "warning"
            case "draft":
                return "info"
            case "rejected":
                return "error"
            default:
                return "default"
        }
    }

    if (articleLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (articleError || !article) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Article non trouvé ou erreur lors du chargement
                </Alert>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/admin")}
                    sx={{ mt: 2 }}
                >
                    Retour au tableau de bord
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
            {/* En-tête */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/admin")}
                    sx={{ mb: 2 }}
                >
                    Retour au tableau de bord
                </Button>
                <Typography variant="h4" component="h1" gutterBottom>
                    Modération d'article
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Examinez cet article et décidez de son approbation ou de son
                    rejet
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Article à modérer */}
                <Grid item xs={12} md={8}>
                    <Card>
                        {article.image_url && (
                            <CardMedia
                                component="img"
                                height="250"
                                image={article.image_url}
                                alt={article.title}
                            />
                        )}

                        <CardContent>
                            {/* En-tête de l'article */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                >
                                    {article.title}
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mb: 2 }}
                                >
                                    <Chip
                                        icon={<CategoryIcon />}
                                        label={article.category.name}
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Chip
                                        label={article.status}
                                        color={getStatusColor(article.status)}
                                        size="small"
                                    />
                                </Stack>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }}>
                                            {article.author.first_name[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight="medium"
                                            >
                                                {article.author.first_name}{" "}
                                                {article.author.last_name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {article.author.role} -{" "}
                                                {article.author.university}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Visibility
                                            fontSize="small"
                                            color="action"
                                        />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {article.view_count} vues
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Soumis le{" "}
                                    {format(
                                        new Date(article.created_at),
                                        "dd MMMM yyyy à HH:mm",
                                        { locale: fr }
                                    )}
                                </Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* Résumé */}
                            <Typography variant="h6" gutterBottom>
                                Résumé
                            </Typography>
                            <Typography
                                variant="body1"
                                paragraph
                                sx={{ fontStyle: "italic", mb: 3 }}
                            >
                                {article.summary}
                            </Typography>

                            {/* Contenu */}
                            <Typography variant="h6" gutterBottom>
                                Contenu complet
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                            >
                                {article.content}
                            </Typography>

                            {/* Raison de rejet précédente si applicable */}
                            {article.status === "rejected" &&
                                article.moderation_reason && (
                                    <Alert severity="warning" sx={{ mt: 3 }}>
                                        <Typography variant="subtitle2">
                                            Raison du rejet précédent :
                                        </Typography>
                                        {article.moderation_reason}
                                    </Alert>
                                )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Panneau de modération */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Actions de modération
                        </Typography>

                        <Alert
                            severity="info"
                            sx={{ mb: 3 }}
                            icon={<History />}
                        >
                            Cet article est en attente de modération depuis le{" "}
                            {format(
                                new Date(article.created_at),
                                "dd MMMM yyyy",
                                { locale: fr }
                            )}
                        </Alert>

                        {article.status === "pending" && (
                            <Stack spacing={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircle />}
                                    onClick={() =>
                                        handleModerationAction("approve")
                                    }
                                    disabled={moderateMutation.isPending}
                                    size="large"
                                >
                                    Approuver l'article
                                </Button>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="error"
                                    startIcon={<Cancel />}
                                    onClick={() =>
                                        handleModerationAction("reject")
                                    }
                                    disabled={moderateMutation.isPending}
                                    size="large"
                                >
                                    Rejeter l'article
                                </Button>

                                <Divider />

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() =>
                                        navigate(`/edit/${article.id}`)
                                    }
                                >
                                    Modifier l'article
                                </Button>
                            </Stack>
                        )}

                        {article.status !== "pending" && (
                            <Alert severity="info">
                                Cet article a déjà été modéré.
                                <br />
                                Statut actuel: <strong>{article.status}</strong>
                            </Alert>
                        )}

                        {/* Informations sur l'auteur */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Informations sur l'auteur
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <Avatar sx={{ width: 40, height: 40 }}>
                                    {article.author.first_name[0]}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        fontWeight="medium"
                                    >
                                        {article.author.first_name}{" "}
                                        {article.author.last_name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {article.author.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack spacing={1}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Rôle:
                                    </Typography>
                                    <Chip
                                        label={article.author.role}
                                        size="small"
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Université:
                                    </Typography>
                                    <Typography variant="body2">
                                        {article.author.university}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Membre depuis:
                                    </Typography>
                                    <Typography variant="body2">
                                        {format(
                                            new Date(
                                                article.author.date_joined
                                            ),
                                            "MMMM yyyy",
                                            { locale: fr }
                                        )}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog pour la raison du rejet */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Rejeter l'article: "{article.title}"</DialogTitle>
                <DialogContent>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                    >
                        Veuillez expliquer la raison du rejet. Cette information
                        sera communiquée à l'auteur.
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmitRejection)}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Raison du rejet"
                            placeholder="Expliquez pourquoi cet article ne peut pas être publié..."
                            {...register("reason")}
                            error={!!errors.reason}
                            helperText={errors.reason?.message}
                            sx={{ mt: 2 }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Annuler</Button>
                    <Button
                        onClick={handleSubmit(onSubmitRejection)}
                        variant="contained"
                        color="error"
                        disabled={moderateMutation.isPending}
                    >
                        {moderateMutation.isPending
                            ? "Rejet en cours..."
                            : "Rejeter l'article"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ModerationPage
