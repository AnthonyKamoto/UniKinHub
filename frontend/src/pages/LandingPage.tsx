import React from "react"
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Paper,
    Chip,
    useTheme,
    alpha,
    AppBar,
    Toolbar,
    Stack,
    Divider,
} from "@mui/material"
import {
    Article,
    Speed,
    Security,
    Group,
    TrendingUp,
    School,
    Notifications,
    CheckCircle,
    ArrowForward,
    Star,
    Login,
    Smartphone,
    Language,
    VerifiedUser,
    AutoAwesome,
} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"

const LandingPage: React.FC = () => {
    const theme = useTheme()
    const navigate = useNavigate()

    const features = [
        {
            icon: Article,
            title: "Actualités en temps réel",
            description:
                "Restez connecté aux dernières nouvelles de votre université avec des mises à jour instantanées.",
            color: "#1976D2",
        },
        {
            icon: Smartphone,
            title: "Multi-plateforme",
            description:
                "Accédez à vos actualités depuis n'importe quel appareil - web, mobile, partout.",
            color: "#42A5F5",
        },
        {
            icon: VerifiedUser,
            title: "Sécurisé et vérifié",
            description:
                "Système RBAC avancé avec vérification d'identité pour un environnement sûr.",
            color: "#1565C0",
        },
        {
            icon: School,
            title: "Communauté académique",
            description:
                "Connectez-vous avec étudiants, enseignants et administrateurs de Kinshasa.",
            color: "#0D47A1",
        },
    ]

    const stats = [
        { number: "1000+", label: "Étudiants actifs" },
        { number: "500+", label: "Articles publiés" },
        { number: "50+", label: "Catégories" },
        { number: "24/7", label: "Disponibilité" },
    ]

    const testimonials = [
        {
            name: "Grace Mbuyi",
            role: "Étudiante en Informatique",
            avatar: "GM",
            text: "UniKinHub m'aide à rester au courant de toutes les actualités importantes de l'université. Interface très intuitive !",
            rating: 5,
        },
        {
            name: "Josué Mukendi",
            role: "Étudiant en Sciences",
            avatar: "JM",
            text: "Excellent moyen de suivre les événements du campus. Les notifications sont très pratiques.",
            rating: 5,
        },
        {
            name: "Sarah Kabongo",
            role: "Étudiante en Arts",
            avatar: "SK",
            text: "J'adore pouvoir filtrer les actualités par catégorie. Très bien organisé !",
            rating: 4,
        },
    ]

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
            {/* Navigation Bar Moderne */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(25, 118, 210, 0.1)",
                }}
            >
                <Toolbar sx={{ py: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flexGrow: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
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
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#1976D2",
                                fontSize: "1.2rem",
                            }}
                        >
                            UniKinHub
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            onClick={() => navigate("/register-extended")}
                            variant="outlined"
                            sx={{
                                px: 3,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "#1976D2",
                                color: "#1976D2",
                                "&:hover": {
                                    borderColor: "#1565C0",
                                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            Créer un compte
                        </Button>
                        <Button
                            onClick={() => navigate("/login")}
                            startIcon={<Login />}
                            variant="contained"
                            sx={{
                                px: 3,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 600,
                                background:
                                    "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            Se connecter
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section Moderne */}
            <Box
                sx={{
                    pt: 12,
                    pb: 8,
                    background:
                        "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background Pattern Subtil */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(circle at 25px 25px, ${alpha(
                            "#fff",
                            0.1
                        )} 2px, transparent 0)`,
                        backgroundSize: "50px 50px",
                    }}
                />

                <Container
                    maxWidth="lg"
                    sx={{ position: "relative", zIndex: 1 }}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 4 }}>
                                <Chip
                                    label="Nouvelle plateforme étudiante"
                                    sx={{
                                        backgroundColor: alpha("#1976D2", 0.1),
                                        color: "#1976D2",
                                        mb: 3,
                                        fontWeight: 600,
                                        border: `1px solid ${alpha(
                                            "#1976D2",
                                            0.2
                                        )}`,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h1"
                                component="h1"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    fontSize: { xs: "2.5rem", md: "3.75rem" },
                                    lineHeight: 1.1,
                                    color: "#1a1a1a",
                                    mb: 3,
                                }}
                            >
                                UniKinHub
                                <Box
                                    component="span"
                                    sx={{
                                        display: "block",
                                        color: "#1976D2",
                                        fontSize: { xs: "2rem", md: "3rem" },
                                    }}
                                >
                                    Kinshasa
                                </Box>
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    color: "#666",
                                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                                    lineHeight: 1.4,
                                    fontWeight: 400,
                                }}
                            >
                                La plateforme moderne qui connecte les étudiants
                                aux actualités de leur université
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 5,
                                    color: "#888",
                                    fontSize: "1rem",
                                    lineHeight: 1.6,
                                    maxWidth: "500px",
                                }}
                            >
                                Restez informé des dernières nouvelles,
                                événements et annonces importantes de votre
                                campus en temps réel.
                            </Typography>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() =>
                                        navigate("/register-extended")
                                    }
                                    sx={{
                                        backgroundColor: "#1976D2",
                                        color: "white",
                                        fontWeight: 600,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1rem",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        boxShadow:
                                            "0 4px 12px rgba(25, 118, 210, 0.3)",
                                        "&:hover": {
                                            backgroundColor: "#1565C0",
                                            transform: "translateY(-1px)",
                                            boxShadow:
                                                "0 6px 16px rgba(25, 118, 210, 0.4)",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                    endIcon={<ArrowForward />}
                                >
                                    Créer un compte
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate("/login")}
                                    sx={{
                                        color: "#1976D2",
                                        borderColor: "#1976D2",
                                        px: 4,
                                        py: 1.5,
                                        fontSize: "1rem",
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            backgroundColor: alpha(
                                                "#1976D2",
                                                0.05
                                            ),
                                            borderColor: "#1976D2",
                                            transform: "translateY(-1px)",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    Se connecter
                                </Button>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: { xs: 350, md: 450 },
                                    position: "relative",
                                }}
                            >
                                {/* Interface preview moderne */}
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        maxWidth: 420,
                                    }}
                                >
                                    {/* Main card */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            borderRadius: 3,
                                            backgroundColor: "white",
                                            border: "1px solid #f0f0f0",
                                            boxShadow:
                                                "0 10px 40px rgba(0,0,0,0.1)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow:
                                                    "0 20px 60px rgba(0,0,0,0.15)",
                                            },
                                        }}
                                    >
                                        <Box sx={{ textAlign: "left" }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                sx={{ color: "#1976D2", mb: 3 }}
                                            >
                                                Interface étudiante
                                            </Typography>

                                            <Stack spacing={2.5}>
                                                {[
                                                    {
                                                        icon: (
                                                            <Smartphone
                                                                sx={{
                                                                    color: "#1976D2",
                                                                }}
                                                            />
                                                        ),
                                                        title: "Actualités en temps réel",
                                                        desc: "Recevez les dernières nouvelles",
                                                    },
                                                    {
                                                        icon: (
                                                            <VerifiedUser
                                                                sx={{
                                                                    color: "#1976D2",
                                                                }}
                                                            />
                                                        ),
                                                        title: "Accès sécurisé",
                                                        desc: "Authentification universitaire",
                                                    },
                                                    {
                                                        icon: (
                                                            <AutoAwesome
                                                                sx={{
                                                                    color: "#1976D2",
                                                                }}
                                                            />
                                                        ),
                                                        title: "Interface moderne",
                                                        desc: "Design intuitif et élégant",
                                                    },
                                                ].map((item, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "flex-start",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: 1,
                                                                borderRadius: 1.5,
                                                                backgroundColor:
                                                                    alpha(
                                                                        "#1976D2",
                                                                        0.1
                                                                    ),
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                minWidth: 40,
                                                                height: 40,
                                                            }}
                                                        >
                                                            {item.icon}
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="subtitle2"
                                                                fontWeight={600}
                                                                sx={{
                                                                    color: "#333",
                                                                    mb: 0.5,
                                                                }}
                                                            >
                                                                {item.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: "#666",
                                                                }}
                                                            >
                                                                {item.desc}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Paper>

                                    {/* Floating elements for visual appeal */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: -20,
                                            right: -20,
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #1976D2, #42A5F5)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: "1.5rem",
                                            boxShadow:
                                                "0 4px 12px rgba(25, 118, 210, 0.3)",
                                        }}
                                    >
                                        📱
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, backgroundColor: "#fafafa" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        <Typography
                            variant="h3"
                            component="h2"
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                color: "#1a1a1a",
                                fontSize: { xs: "2rem", md: "2.5rem" },
                            }}
                        >
                            Fonctionnalités principales
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontSize: "1.1rem",
                                fontWeight: 400,
                                maxWidth: "600px",
                                mx: "auto",
                            }}
                        >
                            Découvrez les outils qui rendent notre plateforme
                            unique
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        height: "100%",
                                        textAlign: "center",
                                        p: 4,
                                        borderRadius: 3,
                                        backgroundColor: "white",
                                        border: "1px solid #f0f0f0",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow:
                                                "0 12px 30px rgba(0,0,0,0.1)",
                                            borderColor: alpha("#1976D2", 0.2),
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            margin: "0 auto 24px",
                                            backgroundColor: alpha(
                                                "#1976D2",
                                                0.1
                                            ),
                                            borderRadius: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <feature.icon
                                            sx={{
                                                fontSize: 32,
                                                color: "#1976D2",
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        gutterBottom
                                        sx={{
                                            color: "#1a1a1a",
                                            mb: 2,
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: "0.95rem",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box
                sx={{
                    py: 8,
                    background:
                        "linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)",
                    color: "white",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        fontWeight={700}
                                        sx={{
                                            color: "white",
                                            fontSize: {
                                                xs: "2rem",
                                                md: "2.5rem",
                                            },
                                            textShadow:
                                                "0 2px 4px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        {stat.number}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: alpha("#fff", 0.9),
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            mt: 1,
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: "center", mb: 8 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            color: "#1a1a1a",
                            fontSize: { xs: "2rem", md: "2.5rem" },
                        }}
                    >
                        Témoignages étudiants
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            fontSize: "1.1rem",
                            fontWeight: 400,
                            maxWidth: "600px",
                            mx: "auto",
                        }}
                    >
                        Découvrez ce que pensent nos utilisateurs
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    p: 4,
                                    borderRadius: 3,
                                    backgroundColor: "white",
                                    border: "1px solid #f0f0f0",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow:
                                            "0 12px 30px rgba(0,0,0,0.1)",
                                        borderColor: alpha("#1976D2", 0.2),
                                    },
                                }}
                            >
                                <Box sx={{ mb: 3 }}>
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                sx={{
                                                    color: "#FFD700",
                                                    fontSize: 20,
                                                }}
                                            />
                                        )
                                    )}
                                </Box>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 3,
                                        fontSize: "1rem",
                                        lineHeight: 1.6,
                                        color: "#333",
                                        fontStyle: "italic",
                                    }}
                                >
                                    "{testimonial.text}"
                                </Typography>

                                <Divider sx={{ mb: 3 }} />

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            mr: 2,
                                            backgroundColor: "#1976D2",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {testimonial.avatar}
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            sx={{ color: "#1a1a1a" }}
                                        >
                                            {testimonial.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontSize: "0.9rem" }}
                                        >
                                            {testimonial.role}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 10,
                    backgroundColor: "#f8f9fa",
                    textAlign: "center",
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        component="h2"
                        fontWeight={700}
                        gutterBottom
                        sx={{
                            color: "#1a1a1a",
                            fontSize: { xs: "2rem", md: "2.5rem" },
                            mb: 2,
                        }}
                    >
                        Prêt à commencer ?
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 5,
                            color: "#666",
                            fontSize: "1.1rem",
                            fontWeight: 400,
                            maxWidth: "500px",
                            mx: "auto",
                        }}
                    >
                        Rejoignez notre communauté d'étudiants et restez
                        toujours informé des dernières actualités
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/register-extended")}
                            sx={{
                                backgroundColor: "#1976D2",
                                color: "white",
                                fontWeight: 600,
                                px: 5,
                                py: 2,
                                fontSize: "1.1rem",
                                borderRadius: 2,
                                textTransform: "none",
                                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.3)",
                                "&:hover": {
                                    backgroundColor: "#1565C0",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                        "0 8px 25px rgba(25, 118, 210, 0.4)",
                                },
                                transition: "all 0.2s ease",
                            }}
                            endIcon={<ArrowForward />}
                        >
                            Créer un compte
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate("/login")}
                            sx={{
                                color: "#1976D2",
                                borderColor: "#1976D2",
                                px: 5,
                                py: 2,
                                fontSize: "1.1rem",
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": {
                                    backgroundColor: alpha("#1976D2", 0.05),
                                    borderColor: "#1976D2",
                                    transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                            }}
                        >
                            Se connecter
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                sx={{
                    backgroundColor: "#1a1a1a",
                    color: "white",
                    py: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        background:
                                            "linear-gradient(135deg, #1976D2, #42A5F5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mr: 2,
                                    }}
                                >
                                    <Typography sx={{ fontSize: "1.2rem" }}>
                                        📱
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{ color: "white" }}
                                >
                                    UniKinHub
                                </Typography>
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(255, 255, 255, 0.85)",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.6,
                                    maxWidth: "400px",
                                }}
                            >
                                La plateforme moderne qui connecte les étudiants
                                aux actualités de leur université à Kinshasa.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    textAlign: { xs: "left", md: "right" },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: {
                                        xs: "flex-start",
                                        md: "flex-end",
                                    },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.85)",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    © 2025 UniKinHub
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.85)",
                                        fontSize: "0.9rem",
                                        mt: 0.5,
                                    }}
                                >
                                    Tous droits réservés
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        fontSize: "0.85rem",
                                        mt: 1,
                                        fontStyle: "italic",
                                    }}
                                >
                                    Développé par Anthony Kamoto
                                </Typography>
                                <Typography
                                    component="a"
                                    href="mailto:anthonykamoto1@gmail.com"
                                    variant="body2"
                                    sx={{
                                        color: "#42A5F5",
                                        fontSize: "0.85rem",
                                        textDecoration: "none",
                                        "&:hover": {
                                            color: "#64B5F6",
                                            textDecoration: "underline",
                                        },
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    anthonykamoto1@gmail.com
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default LandingPage
