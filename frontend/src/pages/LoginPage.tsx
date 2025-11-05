import { useState } from "react";
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
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { ArrowBack } from "@mui/icons-material";

const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user } = useAuth();
  const [error, setError] = useState("");

  const from = (location.state as any)?.from?.pathname || "/";

  // Rediriger si déjà connecté
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    }
  };

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

      {/* Login Form */}
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
        <Card sx={{ maxWidth: 400, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Connexion
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connectez-vous à votre compte UniKinHub
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                placeholder=""
                variant="outlined"
                margin="normal"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={isLoading || isSubmitting}
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                placeholder=""
                variant="outlined"
                margin="normal"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
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
                  "Se connecter"
                )}
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Pas encore de compte ?{" "}
                <Link component={RouterLink} to="/register-extended">
                  Créer un compte
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default LoginPage;
