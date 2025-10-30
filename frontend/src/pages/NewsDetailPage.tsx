import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Avatar,
    Divider,
    Button,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Alert,
    CircularProgress,
    Paper,
    Stack,
} from "@mui/material"
import {
    Person,
    Visibility,
    Category as CategoryIcon,
    ArrowBack,
    Edit,
    Delete,
    Send,
    ThumbUp,
    Share,
} from "@mui/icons-material"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { newsAPI, commentAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import type { News, Comment } from "../types"

const commentSchema = z.object({
    content: z
        .string()
        .min(1, "Le commentaire ne peut pas être vide")
        .max(500, "Maximum 500 caractères"),
})

type CommentFormData = z.infer<typeof commentSchema>

const NewsDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [showCommentForm, setShowCommentForm] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
    })

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

    // Requête pour récupérer les commentaires
    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", id],
        queryFn: () => commentAPI.getComments(Number(id)),
        enabled: !!id,
    })

    // Mutation pour ajouter un commentaire
    const addCommentMutation = useMutation({
        mutationFn: (content: string) =>
            commentAPI.createComment(Number(id), content),
        onSuccess: () => {
            toast.success("Commentaire ajouté avec succès")
            queryClient.invalidateQueries({ queryKey: ["comments", id] })
            reset()
            setShowCommentForm(false)
        },
        onError: () => {
            toast.error("Erreur lors de l'ajout du commentaire")
        },
    })

    // Mutation pour supprimer un commentaire
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => commentAPI.deleteComment(commentId),
        onSuccess: () => {
            toast.success("Commentaire supprimé")
            queryClient.invalidateQueries({ queryKey: ["comments", id] })
        },
        onError: () => {
            toast.error("Erreur lors de la suppression")
        },
    })

    const onSubmitComment = (data: CommentFormData) => {
        addCommentMutation.mutate(data.content)
    }

    const handleDeleteComment = (commentId: number) => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer ce commentaire ?"
            )
        ) {
            deleteCommentMutation.mutate(commentId)
        }
    }

    const canEditArticle = () => {
        if (!user || !article) return false
        return user.role === "admin" || user.id === article.author.id
    }

    const canDeleteComment = (comment: Comment) => {
        if (!user) return false
        return user.role === "admin" || user.id === comment.user.id
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

    const handleShare = async () => {
        if (navigator.share && article) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.summary,
                    url: window.location.href,
                })
            } catch (error) {
                // Fallback: copier dans le presse-papiers
                navigator.clipboard.writeText(window.location.href)
                toast.success("Lien copié dans le presse-papiers")
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Lien copié dans le presse-papiers")
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
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                >
                    Retour à l'accueil
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
            {/* Bouton retour */}
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/")}
                sx={{ mb: 3 }}
            >
                Retour à l'accueil
            </Button>

            {/* Article principal */}
            <Card sx={{ mb: 4 }}>
                {article.image_url && (
                    <CardMedia
                        component="img"
                        height="300"
                        image={article.image_url}
                        alt={article.title}
                    />
                )}

                <CardContent>
                    {/* En-tête de l'article */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
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
                                <Visibility fontSize="small" color="action" />
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {article.view_count} vues
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                            Publié le{" "}
                            {format(
                                new Date(article.created_at),
                                "dd MMMM yyyy à HH:mm",
                                { locale: fr }
                            )}
                            {article.updated_at !== article.created_at &&
                                ` • Modifié le ${format(
                                    new Date(article.updated_at),
                                    "dd MMMM yyyy à HH:mm",
                                    { locale: fr }
                                )}`}
                        </Typography>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                        <Button
                            startIcon={<Share />}
                            onClick={handleShare}
                            variant="outlined"
                            size="small"
                        >
                            Partager
                        </Button>

                        {canEditArticle() && (
                            <>
                                <Button
                                    startIcon={<Edit />}
                                    onClick={() =>
                                        navigate(`/edit/${article.id}`)
                                    }
                                    variant="outlined"
                                    size="small"
                                >
                                    Modifier
                                </Button>
                                <Button
                                    startIcon={<Delete />}
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                >
                                    Supprimer
                                </Button>
                            </>
                        )}
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
                        Contenu
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                    >
                        {article.content}
                    </Typography>

                    {/* Raison de modération si rejeté */}
                    {article.status === "rejected" &&
                        article.moderation_reason && (
                            <Alert severity="warning" sx={{ mt: 3 }}>
                                <Typography variant="subtitle2">
                                    Raison du rejet :
                                </Typography>
                                {article.moderation_reason}
                            </Alert>
                        )}
                </CardContent>
            </Card>

            {/* Section commentaires */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Commentaires ({comments?.length || 0})
                </Typography>

                {/* Formulaire d'ajout de commentaire */}
                {user ? (
                    <Box sx={{ mb: 3 }}>
                        {!showCommentForm ? (
                            <Button
                                onClick={() => setShowCommentForm(true)}
                                variant="outlined"
                                startIcon={<Send />}
                            >
                                Ajouter un commentaire
                            </Button>
                        ) : (
                            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                                <form onSubmit={handleSubmit(onSubmitComment)}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Écrivez votre commentaire..."
                                        {...register("content")}
                                        error={!!errors.content}
                                        helperText={errors.content?.message}
                                        sx={{ mb: 2 }}
                                    />
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Send />}
                                            disabled={
                                                addCommentMutation.isPending
                                            }
                                        >
                                            {addCommentMutation.isPending
                                                ? "Envoi..."
                                                : "Publier"}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowCommentForm(false)
                                                reset()
                                            }}
                                        >
                                            Annuler
                                        </Button>
                                    </Box>
                                </form>
                            </Paper>
                        )}
                    </Box>
                ) : (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Vous devez être connecté pour commenter.
                    </Alert>
                )}

                {/* Liste des commentaires */}
                {commentsLoading ? (
                    <CircularProgress />
                ) : comments && comments.length > 0 ? (
                    <List>
                        {comments.map((comment, index) => (
                            <Box key={comment.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{ px: 0 }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            {comment.user.first_name[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography variant="subtitle2">
                                                    {comment.user.first_name}{" "}
                                                    {comment.user.last_name}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {format(
                                                        new Date(
                                                            comment.created_at
                                                        ),
                                                        "dd MMMM yyyy à HH:mm",
                                                        { locale: fr }
                                                    )}
                                                </Typography>
                                                {!comment.is_approved && (
                                                    <Chip
                                                        label="En attente"
                                                        size="small"
                                                        color="warning"
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 1 }}
                                            >
                                                {comment.content}
                                            </Typography>
                                        }
                                    />
                                    {canDeleteComment(comment) && (
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </ListItem>
                                {index < comments.length - 1 && (
                                    <Divider variant="inset" component="li" />
                                )}
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Typography color="text.secondary">
                        Aucun commentaire pour le moment.
                    </Typography>
                )}
            </Paper>
        </Box>
    )
}

export default NewsDetailPage
