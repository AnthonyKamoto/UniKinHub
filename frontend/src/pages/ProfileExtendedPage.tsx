import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  Alert,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AccountCircle as AccountCircleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { rbacAPI } from "../services/api";
import type { User } from "../types";

// Fonction pour calculer l'année académique en cours
const getCurrentAcademicYear = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // L'année académique commence généralement en septembre/octobre
  // Si on est entre janvier et août, l'année académique a commencé l'année précédente
  if (currentMonth >= 1 && currentMonth <= 8) {
    return `${currentYear - 1}-${currentYear}`;
  } else {
    return `${currentYear}-${currentYear + 1}`;
  }
};

const ProfileExtendedPage: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const academicYear = getCurrentAcademicYear();

  // États pour les champs modifiables (uniquement informations personnelles)
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  useEffect(() => {
    if (user) {
      setUserProfile(user);
      setEditData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Mise à jour uniquement des informations personnelles
      const updatedUser = await rbacAPI.updateUserExtended(editData);
      setUserProfile(updatedUser);
      setEditing(false);
      setSuccess("Profil mis à jour avec succès");
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
      });
    }
    setEditing(false);
    setError(null);
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const currentUser = userProfile || user;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Mon Profil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Section Informations personnelles */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">Informations personnelles</Typography>
                {!editing && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                    sx={{ ml: "auto" }}
                    size="small"
                  >
                    Modifier
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {editing ? (
                    <TextField
                      fullWidth
                      label="Prénom"
                      value={editData.first_name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          first_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Prénom
                      </Typography>
                      <Typography variant="body1">
                        {currentUser.first_name}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {editing ? (
                    <TextField
                      fullWidth
                      label="Nom"
                      value={editData.last_name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          last_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nom
                      </Typography>
                      <Typography variant="body1">
                        {currentUser.last_name}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <EmailIcon
                        sx={{
                          mr: 1,
                          color: "text.secondary",
                        }}
                      />
                      <Typography variant="body1">
                        {currentUser.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {editing ? (
                    <TextField
                      fullWidth
                      label="Téléphone"
                      value={editData.phone_number}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Téléphone
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <PhoneIcon
                          sx={{
                            mr: 1,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body1">
                          {currentUser.phone_number || "Non renseigné"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : "Sauvegarder"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Annuler
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Section Rôle et permissions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
                  <AccountCircleIcon />
                </Avatar>
                <Typography variant="h6">Rôle et permissions</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Statut
                </Typography>
                <Chip
                  icon={
                    currentUser.is_verified ? <VerifiedIcon /> : <PendingIcon />
                  }
                  label={
                    currentUser.is_verified
                      ? "Vérifié"
                      : "En attente de vérification"
                  }
                  color={currentUser.is_verified ? "success" : "warning"}
                  variant="outlined"
                />
              </Box>

              {/* Système RBAC */}
              {currentUser.nouveau_role_detail ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rôle (Nouveau système)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {currentUser.nouveau_role_detail.nom}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {currentUser.nouveau_role_detail.description}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rôle (Ancien système)
                  </Typography>
                  <Typography variant="body1">
                    {currentUser.role_display}
                  </Typography>
                </Box>
              )}

              {/* Permissions */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Permissions
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }}
                >
                  {hasPermission("can_view_content") && (
                    <Chip size="small" label="Voir contenu" />
                  )}
                  {hasPermission("can_create_content") && (
                    <Chip size="small" label="Créer contenu" />
                  )}
                  {hasPermission("can_moderate_news") && (
                    <Chip size="small" label="Modérer" />
                  )}
                  {hasPermission("can_verify_users") && (
                    <Chip size="small" label="Vérifier utilisateurs" />
                  )}
                  {hasPermission("can_manage_all") && (
                    <Chip size="small" label="Gérer tout" color="primary" />
                  )}
                </Box>
              </Box>

              {currentUser.date_verification && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Vérifié le
                  </Typography>
                  <Typography variant="body2">
                    {new Date(currentUser.date_verification).toLocaleDateString(
                      "fr-FR",
                    )}
                    {currentUser.verifie_par_nom && (
                      <span> par {currentUser.verifie_par_nom}</span>
                    )}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Section Organisation */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar sx={{ mr: 2, bgcolor: "info.main" }}>
                  <SchoolIcon />
                </Avatar>
                <Typography variant="h6">Organisation universitaire</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Organisation complète
                    </Typography>
                    <Typography variant="body1">
                      {currentUser.organisation_complete || "Non définie"}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List dense>
                    {currentUser.universite_detail && (
                      <ListItem>
                        <ListItemIcon>
                          <BusinessIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Université"
                          secondary={currentUser.universite_detail.nom}
                        />
                      </ListItem>
                    )}
                    {currentUser.faculte_detail && (
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Faculté"
                          secondary={currentUser.faculte_detail.nom}
                        />
                      </ListItem>
                    )}
                    {currentUser.departement_detail && (
                      <ListItem>
                        <ListItemIcon>
                          <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Département"
                          secondary={currentUser.departement_detail.nom}
                        />
                      </ListItem>
                    )}
                    {currentUser.promotion && (
                      <ListItem>
                        <ListItemText
                          primary="Promotion"
                          secondary={currentUser.promotion}
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemText
                        primary="Année académique"
                        secondary={academicYear}
                      />
                    </ListItem>
                    {currentUser.program && (
                      <ListItem>
                        <ListItemText
                          primary="Programme"
                          secondary={currentUser.program}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileExtendedPage;
