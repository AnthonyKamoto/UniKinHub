import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Box,
  Button,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: "immediate" | "daily" | "weekly";
}

const NotificationSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: false,
    notification_frequency: "immediate",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      // Charger les préférences actuelles
      setPreferences({
        email_notifications: user.email_notifications || false,
        push_notifications: user.push_notifications || false,
        notification_frequency: user.notification_frequency || "immediate",
      });
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await api.patch("/auth/profile/", preferences);

      setMessage({
        type: "success",
        text: "Préférences de notification mises à jour avec succès !",
      });

      // Mettre à jour le contexte utilisateur si nécessaire
      // updateUser(response.data);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setMessage({
        type: "error",
        text: "Erreur lors de la mise à jour des préférences",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = (
    frequency: "immediate" | "daily" | "weekly",
  ) => {
    setPreferences((prev) => ({
      ...prev,
      notification_frequency: frequency,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Chargement...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Préférences de Notification
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configurez comment vous souhaitez recevoir les notifications.
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Types de notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Types de Notifications
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.email_notifications}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          email_notifications: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Notifications par email"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4, mb: 2 }}
                >
                  Recevez des emails pour les nouvelles importantes et les mises
                  à jour de vos articles.
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.push_notifications}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          push_notifications: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Notifications push"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  Recevez des notifications instantanées sur votre appareil
                  (nécessite l'autorisation du navigateur).
                </Typography>
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Fréquence des notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fréquence des Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choisissez à quelle fréquence recevoir les résumés d'actualités.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Chip
                  label="Immédiate"
                  variant={
                    preferences.notification_frequency === "immediate"
                      ? "filled"
                      : "outlined"
                  }
                  color={
                    preferences.notification_frequency === "immediate"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleFrequencyChange("immediate")}
                  sx={{ justifyContent: "flex-start" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 2, mb: 1 }}
                >
                  Notification instantanée à chaque nouvelle actualité
                  importante
                </Typography>

                <Chip
                  label="Quotidienne"
                  variant={
                    preferences.notification_frequency === "daily"
                      ? "filled"
                      : "outlined"
                  }
                  color={
                    preferences.notification_frequency === "daily"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleFrequencyChange("daily")}
                  sx={{ justifyContent: "flex-start" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 2, mb: 1 }}
                >
                  Résumé quotidien des nouvelles actualités
                </Typography>

                <Chip
                  label="Hebdomadaire"
                  variant={
                    preferences.notification_frequency === "weekly"
                      ? "filled"
                      : "outlined"
                  }
                  color={
                    preferences.notification_frequency === "weekly"
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleFrequencyChange("weekly")}
                  sx={{ justifyContent: "flex-start" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 2 }}
                >
                  Résumé hebdomadaire de toutes les actualités
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations sur les notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Types d'Emails que Vous Recevrez
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "success.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="white">
                      Article Approuvé
                    </Typography>
                    <Typography variant="body2" color="white">
                      Confirmation quand votre article est publié
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "warning.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="white">
                      Article Rejeté
                    </Typography>
                    <Typography variant="body2" color="white">
                      Notification avec les commentaires de révision
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "info.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="white">
                      Confirmation de Soumission
                    </Typography>
                    <Typography variant="body2" color="white">
                      Accusé de réception de votre article
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="white">
                      Résumés Périodiques
                    </Typography>
                    <Typography variant="body2" color="white">
                      Digest des nouvelles actualités
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={saving}
          sx={{ minWidth: 200 }}
        >
          {saving ? "Sauvegarde..." : "Sauvegarder les Préférences"}
        </Button>
      </Box>
    </Container>
  );
};

export default NotificationSettingsPage;
