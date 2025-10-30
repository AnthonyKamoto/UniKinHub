import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "../contexts/AuthContext"

const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, "Le nom d'utilisateur doit faire au moins 3 caractères"),
        email: z.string().email("Email invalide"),
        password: z
            .string()
            .min(6, "Le mot de passe doit faire au moins 6 caractères"),
        confirmPassword: z.string(),
        first_name: z.string().min(1, "Le prénom est requis"),
        last_name: z.string().min(1, "Le nom est requis"),
        role: z.enum(["student", "teacher"], {
            errorMap: () => ({ message: "Veuillez sélectionner un rôle" }),
        }),
        university: z.string().min(1, "L'université est requise"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
    const navigate = useNavigate()
    const { register: registerUser, isLoading, user } = useAuth()
    const [error, setError] = useState("")

    // Rediriger si déjà connecté
    if (user) {
        navigate("/", { replace: true })
        return null
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        setError("")
        try {
            const { confirmPassword, ...registerData } = data
            const success = await registerUser(registerData)
            if (success) {
                navigate("/", { replace: true })
            }
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du compte")
        }
    }

    const universities = [
        "Université de Kinshasa (UNIKIN)",
        "Université Pédagogique Nationale (UPN)",
        "Université Protestante au Congo (UPC)",
        "Institut Supérieur de Commerce (ISC)",
        "Institut Supérieur Pédagogique de Gombe (ISPG)",
        "Université Libre de Kinshasa (ULK)",
        "Université Simon Kimbangu (USK)",
        "Institut Supérieur des Techniques Appliquées (ISTA)",
        "Autre",
    ]

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100",
                p: 2,
            }}
        >
            <Card sx={{ maxWidth: 500, width: "100%" }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Inscription
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Créez votre compte UniKinHub
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Prénom"
                                variant="outlined"
                                {...register("first_name")}
                                error={!!errors.first_name}
                                helperText={errors.first_name?.message}
                                disabled={isLoading || isSubmitting}
                            />
                            <TextField
                                fullWidth
                                label="Nom"
                                variant="outlined"
                                {...register("last_name")}
                                error={!!errors.last_name}
                                helperText={errors.last_name?.message}
                                disabled={isLoading || isSubmitting}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Nom d'utilisateur"
                            variant="outlined"
                            margin="normal"
                            {...register("username")}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            disabled={isLoading || isSubmitting}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            disabled={isLoading || isSubmitting}
                        />

                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.role}
                        >
                            <InputLabel>Rôle</InputLabel>
                            <Select
                                label="Rôle"
                                {...register("role")}
                                disabled={isLoading || isSubmitting}
                            >
                                <MenuItem value="student">Étudiant</MenuItem>
                                <MenuItem value="teacher">Enseignant</MenuItem>
                            </Select>
                            {errors.role && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 0.5, ml: 2 }}
                                >
                                    {errors.role.message}
                                </Typography>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.university}
                        >
                            <InputLabel>Université</InputLabel>
                            <Select
                                label="Université"
                                {...register("university")}
                                disabled={isLoading || isSubmitting}
                            >
                                {universities.map((uni) => (
                                    <MenuItem key={uni} value={uni}>
                                        {uni}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.university && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 0.5, ml: 2 }}
                                >
                                    {errors.university.message}
                                </Typography>
                            )}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Mot de passe"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            disabled={isLoading || isSubmitting}
                        />

                        <TextField
                            fullWidth
                            label="Confirmer le mot de passe"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            disabled={isLoading || isSubmitting}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading || isSubmitting}
                        >
                            {isLoading || isSubmitting ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Créer un compte"
                            )}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Déjà un compte ?{" "}
                            <Link component={RouterLink} to="/login">
                                Se connecter
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default RegisterPage
