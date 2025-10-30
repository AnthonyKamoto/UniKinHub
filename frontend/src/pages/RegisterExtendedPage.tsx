import { useState, Component, ReactNode } from "react"
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
    Grid,
    Divider,
    Tabs,
    Tab,
    Paper,
    AppBar,
    Toolbar,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "../contexts/AuthContext"
import {
    RoleSelector,
    OrganisationSelector,
} from "../components/RBAC/OrganisationSelectors"
import type { RegisterDataExtended } from "../types"
import { ArrowBack, CheckCircle, Cancel } from "@mui/icons-material"

// ErrorBoundary pour capturer les erreurs React
class ErrorBoundary extends Component<
    { children: ReactNode; fallback?: ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: ReactNode; fallback?: ReactNode }) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error(
            "🔥 ErrorBoundary a capturé une erreur:",
            error,
            errorInfo
        )
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <Alert severity="error" sx={{ m: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            ❌ Une erreur s'est produite
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {this.state.error?.message || "Erreur inconnue"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Vérifiez que le backend Django est démarré sur
                            http://127.0.0.1:8000
                        </Typography>
                    </Alert>
                )
            )
        }

        return this.props.children
    }
}

// Schéma de validation pour l'inscription RBAC
const registerExtendedSchema = z
    .object({
        username: z
            .string()
            .min(3, "Le nom d'utilisateur doit faire au moins 3 caractères"),
        email: z.string().email("Email invalide"),
        password: z
            .string()
            .min(8, "Le mot de passe doit faire au moins 8 caractères")
            .regex(
                /[A-Z]/,
                "Le mot de passe doit contenir au moins une majuscule"
            )
            .regex(
                /[a-z]/,
                "Le mot de passe doit contenir au moins une minuscule"
            )
            .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
            .regex(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Le mot de passe doit contenir au moins un caractère spécial"
            ),
        password_confirm: z.string(),
        first_name: z.string().min(1, "Le prénom est requis"),
        last_name: z.string().min(1, "Le nom est requis"),
        nouveau_role: z.number().min(1, "Veuillez sélectionner un rôle"),
        universite: z.number().optional(),
        faculte: z.number().optional(),
        departement: z.number().optional(),
        promotion: z.string().optional(),
        program: z.string().optional(),
        phone_number: z.string().optional(),
    })
    .refine((data) => data.password === data.password_confirm, {
        message: "Les mots de passe ne correspondent pas",
        path: ["password_confirm"],
    })

type RegisterExtendedFormData = z.infer<typeof registerExtendedSchema>

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`registration-tabpanel-${index}`}
            aria-labelledby={`registration-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    )
}

// Fonction pour vérifier les critères du mot de passe
interface PasswordCriteria {
    minLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
}

const checkPasswordCriteria = (password: string): PasswordCriteria => {
    return {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
}

// Composant pour afficher l'indicateur de force du mot de passe
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const criteria = checkPasswordCriteria(password)
    const criteriaCount = Object.values(criteria).filter(Boolean).length
    const strength = (criteriaCount / 5) * 100

    const getStrengthColor = () => {
        if (strength < 40) return "error"
        if (strength < 80) return "warning"
        return "success"
    }

    const getStrengthLabel = () => {
        if (strength < 40) return "Faible"
        if (strength < 80) return "Moyen"
        return "Fort"
    }

    if (!password) return null

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="caption" sx={{ mr: 1 }}>
                    Force du mot de passe:
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: "bold",
                        color:
                            strength < 40
                                ? "error.main"
                                : strength < 80
                                ? "warning.main"
                                : "success.main",
                    }}
                >
                    {getStrengthLabel()}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={strength}
                color={getStrengthColor()}
                sx={{ height: 8, borderRadius: 1, mb: 2 }}
            />
            <Typography
                variant="caption"
                sx={{ fontWeight: "bold", mb: 1, display: "block" }}
            >
                Critères requis :
            </Typography>
            <List dense disablePadding>
                <ListItem disablePadding sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {criteria.minLength ? (
                            <CheckCircle
                                sx={{ fontSize: 20, color: "success.main" }}
                            />
                        ) : (
                            <Cancel
                                sx={{ fontSize: 20, color: "error.main" }}
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary="Au moins 8 caractères"
                        primaryTypographyProps={{
                            variant: "caption",
                            color: criteria.minLength
                                ? "success.main"
                                : "text.secondary",
                        }}
                    />
                </ListItem>
                <ListItem disablePadding sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {criteria.hasUpperCase ? (
                            <CheckCircle
                                sx={{ fontSize: 20, color: "success.main" }}
                            />
                        ) : (
                            <Cancel
                                sx={{ fontSize: 20, color: "error.main" }}
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary="Une lettre majuscule (A-Z)"
                        primaryTypographyProps={{
                            variant: "caption",
                            color: criteria.hasUpperCase
                                ? "success.main"
                                : "text.secondary",
                        }}
                    />
                </ListItem>
                <ListItem disablePadding sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {criteria.hasLowerCase ? (
                            <CheckCircle
                                sx={{ fontSize: 20, color: "success.main" }}
                            />
                        ) : (
                            <Cancel
                                sx={{ fontSize: 20, color: "error.main" }}
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary="Une lettre minuscule (a-z)"
                        primaryTypographyProps={{
                            variant: "caption",
                            color: criteria.hasLowerCase
                                ? "success.main"
                                : "text.secondary",
                        }}
                    />
                </ListItem>
                <ListItem disablePadding sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {criteria.hasNumber ? (
                            <CheckCircle
                                sx={{ fontSize: 20, color: "success.main" }}
                            />
                        ) : (
                            <Cancel
                                sx={{ fontSize: 20, color: "error.main" }}
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary="Un chiffre (0-9)"
                        primaryTypographyProps={{
                            variant: "caption",
                            color: criteria.hasNumber
                                ? "success.main"
                                : "text.secondary",
                        }}
                    />
                </ListItem>
                <ListItem disablePadding sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {criteria.hasSpecialChar ? (
                            <CheckCircle
                                sx={{ fontSize: 20, color: "success.main" }}
                            />
                        ) : (
                            <Cancel
                                sx={{ fontSize: 20, color: "error.main" }}
                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        primary="Un caractère spécial (!@#$%...)"
                        primaryTypographyProps={{
                            variant: "caption",
                            color: criteria.hasSpecialChar
                                ? "success.main"
                                : "text.secondary",
                        }}
                    />
                </ListItem>
            </List>
        </Box>
    )
}

const RegisterExtendedPage = () => {
    const navigate = useNavigate()
    const { registerExtended, isLoading, user } = useAuth()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [tabValue, setTabValue] = useState(0)
    const [componentError, setComponentError] = useState<string | null>(null)

    // Rediriger si déjà connecté
    if (user) {
        navigate("/", { replace: true })
        return null
    }

    // Gestion d'erreur globale
    if (componentError) {
        return (
            <>
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
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/")}
                            sx={{
                                color: "#1976D2",
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Retour à l'accueil
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        minHeight: "calc(100vh - 64px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                        p: 2,
                    }}
                >
                    <Card sx={{ maxWidth: 600, width: "100%" }}>
                        <CardContent sx={{ p: 4 }}>
                            <Alert severity="error">
                                <Typography variant="h6" gutterBottom>
                                    Erreur de chargement
                                </Typography>
                                <Typography variant="body2">
                                    {componentError}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Vérifiez que le serveur backend est démarré.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => window.location.reload()}
                                    sx={{ mt: 2 }}
                                >
                                    Réessayer
                                </Button>
                            </Alert>
                        </CardContent>
                    </Card>
                </Box>
            </>
        )
    }

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterExtendedFormData>({
        resolver: zodResolver(registerExtendedSchema),
        defaultValues: {
            nouveau_role: undefined,
            universite: undefined,
            faculte: undefined,
            departement: undefined,
        },
    })

    const watchedValues = watch(["universite", "faculte", "departement"])
    const watchedPassword = watch("password")

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    const onSubmit = async (data: RegisterExtendedFormData) => {
        console.log("🚀 onSubmit appelé avec les données:", data)
        setError("")
        setSuccess("")

        try {
            console.log("📤 Envoi des données au backend...")
            const success = await registerExtended(data)
            console.log("✅ Inscription réussie:", success)
            if (success) {
                setSuccess("✅ Compte créé avec succès ! Redirection...")
                setTimeout(() => {
                    navigate("/news", { replace: true })
                }, 1500)
            }
        } catch (err: any) {
            console.error("❌ Erreur lors de l'inscription:", err)
            setError(err.message || "Erreur lors de la création du compte")
        }
    }

    const onInvalid = (errors: any) => {
        console.error("❌ Validation échouée:", errors)
        setError("Veuillez remplir tous les champs obligatoires correctement")

        // Trouver le premier onglet avec une erreur
        if (
            errors.username ||
            errors.email ||
            errors.first_name ||
            errors.last_name ||
            errors.password ||
            errors.password_confirm
        ) {
            setTabValue(0)
        } else if (errors.nouveau_role) {
            setTabValue(1)
        } else {
            setTabValue(2)
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
                        startIcon={<ArrowBack />}
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

            {/* Registration Form */}
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    p: 2,
                }}
            >
                <Card sx={{ maxWidth: 600, width: "100%" }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Créer un compte
                        </Typography>
                        <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: 3 }}
                        >
                            Rejoignez la communauté des étudiants de Kinshasa
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                                {Object.keys(errors).length > 0 && (
                                    <Box component="ul" sx={{ mt: 1, mb: 0 }}>
                                        {Object.entries(errors).map(
                                            ([field, err]: [string, any]) => (
                                                <li key={field}>
                                                    <strong>{field}</strong>:{" "}
                                                    {err?.message}
                                                </li>
                                            )
                                        )}
                                    </Box>
                                )}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <Paper sx={{ mb: 3 }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                            >
                                <Tab label="Informations personnelles" />
                                <Tab label="Rôle et Organisation" />
                                <Tab label="Informations complémentaires" />
                            </Tabs>
                        </Paper>

                        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                            <TabPanel value={tabValue} index={0}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Prénom"
                                            {...register("first_name")}
                                            error={!!errors.first_name}
                                            helperText={
                                                errors.first_name?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nom"
                                            {...register("last_name")}
                                            error={!!errors.last_name}
                                            helperText={
                                                errors.last_name?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Nom d'utilisateur"
                                            {...register("username")}
                                            error={!!errors.username}
                                            helperText={
                                                errors.username?.message
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="email"
                                            label="Email"
                                            {...register("email")}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Mot de passe"
                                            {...register("password")}
                                            error={!!errors.password}
                                            helperText={
                                                errors.password?.message
                                            }
                                        />
                                        <PasswordStrengthIndicator
                                            password={watchedPassword || ""}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            label="Confirmer le mot de passe"
                                            {...register("password_confirm")}
                                            error={!!errors.password_confirm}
                                            helperText={
                                                errors.password_confirm?.message
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <ErrorBoundary>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Controller
                                                name="nouveau_role"
                                                control={control}
                                                render={({ field }) => (
                                                    <RoleSelector
                                                        value={
                                                            field.value || null
                                                        }
                                                        onChange={(roleId) =>
                                                            field.onChange(
                                                                roleId
                                                            )
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                            {errors.nouveau_role && (
                                                <Typography
                                                    color="error"
                                                    variant="caption"
                                                    sx={{
                                                        mt: 1,
                                                        display: "block",
                                                    }}
                                                >
                                                    {
                                                        errors.nouveau_role
                                                            .message
                                                    }
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Organisation universitaire
                                                    (optionnel)
                                                </Typography>
                                            </Divider>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Controller
                                                name="universite"
                                                control={control}
                                                render={({ field }) => (
                                                    <OrganisationSelector
                                                        universite={
                                                            field.value || null
                                                        }
                                                        faculte={
                                                            watchedValues[1] ||
                                                            null
                                                        }
                                                        departement={
                                                            watchedValues[2] ||
                                                            null
                                                        }
                                                        onUniversiteChange={(
                                                            universiteId
                                                        ) => {
                                                            setValue(
                                                                "universite",
                                                                universiteId ||
                                                                    undefined
                                                            )
                                                            setValue(
                                                                "faculte",
                                                                undefined
                                                            )
                                                            setValue(
                                                                "departement",
                                                                undefined
                                                            )
                                                        }}
                                                        onFaculteChange={(
                                                            faculteId
                                                        ) => {
                                                            setValue(
                                                                "faculte",
                                                                faculteId ||
                                                                    undefined
                                                            )
                                                            setValue(
                                                                "departement",
                                                                undefined
                                                            )
                                                        }}
                                                        onDepartementChange={(
                                                            departementId
                                                        ) => {
                                                            setValue(
                                                                "departement",
                                                                departementId ||
                                                                    undefined
                                                            )
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </ErrorBoundary>
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl
                                            fullWidth
                                            error={!!errors.promotion}
                                        >
                                            <InputLabel>Promotion</InputLabel>
                                            <Select
                                                label="Promotion"
                                                defaultValue=""
                                                {...register("promotion")}
                                            >
                                                <MenuItem value="">
                                                    <em>Sélectionner</em>
                                                </MenuItem>
                                                <MenuItem value="L1">
                                                    L1 (Licence 1ère année)
                                                </MenuItem>
                                                <MenuItem value="L2">
                                                    L2 (Licence 2ème année)
                                                </MenuItem>
                                                <MenuItem value="L3">
                                                    L3 (Licence 3ème année)
                                                </MenuItem>
                                                <MenuItem value="M1">
                                                    M1 (Master 1ère année)
                                                </MenuItem>
                                                <MenuItem value="M2">
                                                    M2 (Master 2ème année)
                                                </MenuItem>
                                                <MenuItem value="Doctorat">
                                                    Doctorat
                                                </MenuItem>
                                                <MenuItem value="Autre">
                                                    Autre
                                                </MenuItem>
                                            </Select>
                                            {errors.promotion && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                    sx={{ mt: 0.5, ml: 1.5 }}
                                                >
                                                    {errors.promotion?.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Programme d'études"
                                            placeholder="ex: Informatique, Médecine..."
                                            {...register("program")}
                                            error={!!errors.program}
                                            helperText={errors.program?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Numéro de téléphone"
                                            type="tel"
                                            {...register("phone_number")}
                                            error={!!errors.phone_number}
                                            helperText={
                                                errors.phone_number?.message
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <Box
                                sx={{
                                    mt: 4,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    {tabValue > 0 && (
                                        <Button
                                            onClick={() =>
                                                setTabValue(tabValue - 1)
                                            }
                                            sx={{ mr: 1 }}
                                        >
                                            Précédent
                                        </Button>
                                    )}
                                    {tabValue < 2 && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                // Vérifier si on peut passer à l'étape suivante
                                                if (tabValue === 0) {
                                                    // Vérifier les champs de l'onglet 0
                                                    const hasErrors = !!(
                                                        errors.username ||
                                                        errors.email ||
                                                        errors.password ||
                                                        errors.password_confirm ||
                                                        errors.first_name ||
                                                        errors.last_name
                                                    )
                                                    const password =
                                                        watchedPassword || ""
                                                    const criteria =
                                                        checkPasswordCriteria(
                                                            password
                                                        )
                                                    const allCriteriaMet =
                                                        Object.values(
                                                            criteria
                                                        ).every(Boolean)

                                                    if (
                                                        hasErrors ||
                                                        !allCriteriaMet
                                                    ) {
                                                        setError(
                                                            "Veuillez remplir tous les champs correctement et respecter les critères du mot de passe avant de continuer"
                                                        )
                                                        return
                                                    }
                                                }
                                                setError("")
                                                setTabValue(tabValue + 1)
                                            }}
                                        >
                                            Suivant
                                        </Button>
                                    )}
                                </Box>

                                {tabValue === 2 && (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting || isLoading}
                                        sx={{ minWidth: 120 }}
                                    >
                                        {isSubmitting || isLoading ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            "S'inscrire"
                                        )}
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ mt: 2, textAlign: "center" }}>
                                <Typography variant="body2">
                                    Vous avez déjà un compte ?{" "}
                                    <Link component={RouterLink} to="/login">
                                        Se connecter
                                    </Link>
                                </Typography>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default RegisterExtendedPage
