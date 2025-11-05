import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { rbacAPI } from "../services/api";
import {
  RoleSelector,
  UniversiteSelector,
} from "../components/RBAC/OrganisationSelectors";
import type { User, OrganisationStats, UserVerificationData } from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`users-tabpanel-${index}`}
      aria-labelledby={`users-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const UserManagementPage: React.FC = () => {
  const { user, canVerifyUsers, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<OrganisationStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // États pour les filtres
  const [filters, setFilters] = useState({
    role: null as number | null,
    universite: null as number | null,
    verified: null as boolean | null,
  });

  // États pour le dialogue de vérification
  const [verificationDialog, setVerificationDialog] = useState({
    open: false,
    user: null as User | null,
    approve: true,
    motif: "",
  });

  useEffect(() => {
    if (!canVerifyUsers() && !isAdmin()) {
      setError("Vous n'avez pas les permissions pour accéder à cette page");
      return;
    }

    loadUsers();
    loadStats();
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await rbacAPI.getUsers(filters);
      setUsers(response.results || (response as any)); // Handle both paginated and non-paginated responses
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await rbacAPI.getOrganisationStats();
      setStats(statsData);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Filtrer automatiquement selon l'onglet
    switch (newValue) {
      case 0: // Tous
        setFilters({ ...filters, verified: null });
        break;
      case 1: // Non vérifiés
        setFilters({ ...filters, verified: false });
        break;
      case 2: // Vérifiés
        setFilters({ ...filters, verified: true });
        break;
    }
  };

  const handleVerificationSubmit = async () => {
    if (!verificationDialog.user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const verificationData: UserVerificationData = {
        user_id: verificationDialog.user.id,
        approve: verificationDialog.approve,
        motif: verificationDialog.motif,
      };

      const response = await rbacAPI.verifyUser(verificationData);

      if (verificationDialog.approve) {
        setSuccess(
          `Utilisateur ${verificationDialog.user.username} vérifié avec succès`,
        );
      } else {
        setSuccess(
          `Vérification refusée pour ${verificationDialog.user.username}`,
        );
      }

      // Recharger les données
      loadUsers();
      loadStats();

      // Fermer le dialogue
      setVerificationDialog({
        open: false,
        user: null,
        approve: true,
        motif: "",
      });
    } catch (err) {
      setError("Erreur lors de la vérification");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openVerificationDialog = (targetUser: User, approve: boolean) => {
    setVerificationDialog({
      open: true,
      user: targetUser,
      approve,
      motif: "",
    });
  };

  const getVerificationStatusChip = (user: User) => {
    if (user.is_verified) {
      return (
        <Chip
          icon={<VerifiedIcon />}
          label="Vérifié"
          color="success"
          size="small"
        />
      );
    } else {
      return (
        <Chip
          icon={<PendingIcon />}
          label="En attente"
          color="warning"
          size="small"
        />
      );
    }
  };

  const getUnverifiedCount = () => {
    return users.filter((u) => !u.is_verified).length;
  };

  if (!canVerifyUsers() && !isAdmin()) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Vous n'avez pas les permissions pour accéder à cette page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Utilisateurs
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

      {/* Statistiques */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Utilisateurs
                </Typography>
                <Typography variant="h5">
                  {Object.values(stats.utilisateurs_par_role).reduce(
                    (a, b) => a + b,
                    0,
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  En attente
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {stats.utilisateurs_non_verifies}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Universités
                </Typography>
                <Typography variant="h5">{stats.universites_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Rôles
                </Typography>
                <Typography variant="h5">{stats.roles_count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FilterIcon sx={{ mr: 1 }} />
            Filtres
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <RoleSelector
                value={filters.role}
                onChange={(roleId) => setFilters({ ...filters, role: roleId })}
                label="Filtrer par rôle"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <UniversiteSelector
                value={filters.universite}
                onChange={(universiteId) =>
                  setFilters({
                    ...filters,
                    universite: universiteId,
                  })
                }
                label="Filtrer par université"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Statut de vérification</InputLabel>
                <Select
                  value={filters.verified ?? ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      verified:
                        e.target.value === ""
                          ? null
                          : e.target.value === "true",
                    })
                  }
                  label="Statut de vérification"
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="true">Vérifiés</MenuItem>
                  <MenuItem value="false">Non vérifiés</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadUsers}
                disabled={loading}
                fullWidth
              >
                Actualiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Tous les utilisateurs" />
            <Tab
              label={
                <Badge badgeContent={getUnverifiedCount()} color="error">
                  Non vérifiés
                </Badge>
              }
            />
            <Tab label="Vérifiés" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <UserTable
            users={users}
            loading={loading}
            onVerify={openVerificationDialog}
            showAll
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UserTable
            users={users.filter((u) => !u.is_verified)}
            loading={loading}
            onVerify={openVerificationDialog}
            showAll={false}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UserTable
            users={users.filter((u) => u.is_verified)}
            loading={loading}
            onVerify={openVerificationDialog}
            showAll={false}
          />
        </TabPanel>
      </Card>

      {/* Dialogue de vérification */}
      <Dialog
        open={verificationDialog.open}
        onClose={() =>
          setVerificationDialog({
            ...verificationDialog,
            open: false,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {verificationDialog.approve ? "Approuver" : "Rejeter"} l'utilisateur
        </DialogTitle>
        <DialogContent>
          {verificationDialog.user && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                {verificationDialog.user.first_name}{" "}
                {verificationDialog.user.last_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {verificationDialog.user.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {verificationDialog.user.organisation_complete}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label={
              verificationDialog.approve
                ? "Commentaire (optionnel)"
                : "Motif du refus"
            }
            multiline
            rows={3}
            value={verificationDialog.motif}
            onChange={(e) =>
              setVerificationDialog({
                ...verificationDialog,
                motif: e.target.value,
              })
            }
            placeholder={
              verificationDialog.approve
                ? "Commentaire pour l'approbation..."
                : "Expliquez pourquoi la vérification est refusée..."
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setVerificationDialog({
                ...verificationDialog,
                open: false,
              })
            }
          >
            Annuler
          </Button>
          <Button
            onClick={handleVerificationSubmit}
            color={verificationDialog.approve ? "success" : "error"}
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : verificationDialog.approve ? (
              "Approuver"
            ) : (
              "Rejeter"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Composant table réutilisable
interface UserTableProps {
  users: User[];
  loading: boolean;
  onVerify: (user: User, approve: boolean) => void;
  showAll: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onVerify,
  showAll,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="textSecondary">Aucun utilisateur trouvé</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Rôle</TableCell>
            <TableCell>Organisation</TableCell>
            {showAll && <TableCell>Statut</TableCell>}
            <TableCell>Inscription</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {user.nouveau_role_detail?.nom || user.role_display}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {user.organisation_complete || "Non définie"}
                </Typography>
              </TableCell>
              {showAll && (
                <TableCell>
                  {user.is_verified ? (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Vérifié"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<PendingIcon />}
                      label="En attente"
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
              )}
              <TableCell>
                <Typography variant="body2">
                  {new Date(user.date_joined).toLocaleDateString("fr-FR")}
                </Typography>
              </TableCell>
              <TableCell>
                {!user.is_verified && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Approuver">
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => onVerify(user, true)}
                      >
                        <ApproveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rejeter">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onVerify(user, false)}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {user.is_verified && (
                  <Typography variant="caption" color="textSecondary">
                    Vérifié
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserManagementPage;
