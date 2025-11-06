import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Mail as MailIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { adminAPI } from '../services/api'

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch real dashboard stats from API
  const [dashboardStats, setDashboardStats] = React.useState<{
    total_news: number
    recent_news: number
    unread_notifications: number
    popular_categories: any[]
    user_role: string
    user_university: string
  }>({
    total_news: 0,
    recent_news: 0,
    unread_notifications: 0,
    popular_categories: [],
    user_role: '',
    user_university: '',
  })

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const stats = await adminAPI.getStats()
        setDashboardStats(stats)
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err)
        setError('Impossible de charger les statistiques du tableau de bord')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const [recentActivity, setRecentActivity] = React.useState<any[]>([])
  const [pendingNews, setPendingNews] = React.useState<any[]>([])
  const [systemUsers, setSystemUsers] = React.useState<any[]>([])

  // Charger les actualités en attente
  React.useEffect(() => {
    const fetchPendingNews = async () => {
      try {
        const news = await adminAPI.getPendingNews()
        setPendingNews(news)
      } catch (err) {
        console.error(
          'Erreur lors du chargement des actualités en attente:',
          err
        )
      }
    }
    fetchPendingNews()
  }, [])

  // Charger les utilisateurs
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await adminAPI.getUsers()
        setSystemUsers(users)
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err)
      }
    }
    fetchUsers()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'active':
        return 'success'
      default:
        return 'default'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return '#f44336'
      case 'medium':
        return '#ff9800'
      case 'low':
        return '#4caf50'
      default:
        return '#9e9e9e'
    }
  }

  const speedDialActions = [
    { icon: <PersonAddIcon />, name: 'Ajouter utilisateur' },
    { icon: <ArticleIcon />, name: 'Créer actualité' },
    { icon: <MailIcon />, name: 'Envoyer notification' },
    { icon: <UploadIcon />, name: 'Import données' },
  ]

  if (user?.role !== 'admin') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Accès refusé
          </Typography>
          <Typography>
            Vous devez avoir les privilèges administrateur pour accéder à cette
            page.
          </Typography>
        </Alert>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Chargement des statistiques...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* En-tête */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              🔧 Tableau de bord Admin
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Bonjour {user.first_name}, voici un aperçu de votre système
            </Typography>
          </Box>
          <Tooltip title="Actualiser les données">
            <IconButton
              color="primary"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardStats.total_news}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Actualités publiées
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    <TrendingIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {dashboardStats.recent_news} cette semaine
                  </Typography>
                </Box>
                <ArticleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardStats.recent_news}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Actualités récentes
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    <TrendingIcon sx={{ fontSize: 16, mr: 0.5 }} />7 derniers
                    jours
                  </Typography>
                </Box>
                <ArticleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardStats.unread_notifications}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Notifications
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Non lues
                  </Typography>
                </Box>
                <Badge
                  badgeContent={dashboardStats.unread_notifications}
                  color="warning"
                >
                  <NotificationsIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardStats.popular_categories.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Catégories actives
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Avec publications
                  </Typography>
                </Box>
                <AnalyticsIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Onglets de gestion */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
            <Tab
              icon={<DashboardIcon />}
              label="Vue d'ensemble"
              iconPosition="start"
            />
            <Tab
              icon={<ArticleIcon />}
              label="Actualités"
              iconPosition="start"
            />
            <Tab
              icon={<PeopleIcon />}
              label="Utilisateurs"
              iconPosition="start"
            />
            <Tab
              icon={<AnalyticsIcon />}
              label="Statistiques"
              iconPosition="start"
            />
            <Tab
              icon={<SettingsIcon />}
              label="Paramètres"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Onglet Vue d'ensemble */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Activité récente */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <SpeedIcon color="primary" />
                Activité récente
              </Typography>
              {recentActivity.length === 0 ? (
                <Alert severity="info">
                  Aucune activité récente à afficher
                </Alert>
              ) : (
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        bgcolor: 'background.paper',
                        mb: 1,
                        borderRadius: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              getStatusColor(activity.status) === 'success'
                                ? 'success.main'
                                : 'warning.main',
                          }}
                        >
                          {activity.type === 'news_created' ? (
                            <ArticleIcon />
                          ) : activity.type === 'user_registered' ? (
                            <PeopleIcon />
                          ) : (
                            <ApproveIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${activity.user} ${activity.action}`}
                        secondary={
                          <Box>
                            {activity.title && (
                              <Typography variant="body2" color="primary">
                                {activity.title}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          size="small"
                          label={activity.status}
                          color={getStatusColor(activity.status) as any}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            {/* Actions rapides */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Actions rapides
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ArticleIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Créer une actualité
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Ajouter un utilisateur
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<MailIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Envoyer notification
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AnalyticsIcon />}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Voir rapports détaillés
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Onglet Actualités */}
        <TabPanel value={activeTab} index={1}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">Gestion des actualités</Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Nouvelle actualité
            </Button>
          </Box>

          {pendingNews.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {pendingNews.length} actualité(s) en attente de modération
              </Typography>
            </Alert>
          )}

          {pendingNews.length === 0 ? (
            <Alert severity="info">
              Aucune actualité en attente de modération
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      <strong>Titre</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Auteur</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Catégorie</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Importance</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingNews.map((news) => (
                    <TableRow key={news.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {news.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {news.author?.first_name} {news.author?.last_name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={news.category?.name || 'Non catégorisé'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={news.importance || 'normal'}
                          sx={{
                            backgroundColor: getImportanceColor(
                              news.importance || 'normal'
                            ),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(
                          news.written_at || news.created_at
                        ).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Approuver">
                            <IconButton size="small" color="success">
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
                            <IconButton size="small" color="primary">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rejeter">
                            <IconButton size="small" color="error">
                              <BlockIcon />
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

        {/* Onglet Utilisateurs */}
        <TabPanel value={activeTab} index={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">Gestion des utilisateurs</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                placeholder="Rechercher..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" startIcon={<PersonAddIcon />}>
                Nouvel utilisateur
              </Button>
            </Box>
          </Box>

          {systemUsers.length === 0 ? (
            <Alert severity="info">Aucun utilisateur trouvé</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell>
                      <strong>Utilisateur</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Rôle</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Université</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actualités</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Dernière activité</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {user.first_name?.[0]}
                            {user.last_name?.[0]}
                          </Avatar>
                          <Typography variant="body2">
                            {user.first_name} {user.last_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={user.role}
                          color={
                            user.role === 'admin'
                              ? 'error'
                              : user.role === 'moderator'
                                ? 'warning'
                                : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>{user.university || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          badgeContent={user.news_count || 0}
                          color="primary"
                        >
                          <ArticleIcon />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString(
                              'fr-FR'
                            )
                          : 'Jamais'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Modifier">
                            <IconButton size="small" color="primary">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Bloquer/Débloquer">
                            <IconButton size="small" color="warning">
                              <BlockIcon />
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

        {/* Onglet Statistiques */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Statistiques avancées
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Fonctionnalité en développement - Graphiques et analyses détaillées
            à venir
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Engagement utilisateurs
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Activité des 30 derniers jours
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ mt: 2 }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  75% d'engagement moyen
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Catégories populaires
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Académique" />
                    <Typography variant="body2">45%</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Événements" />
                    <Typography variant="body2">30%</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Infrastructure" />
                    <Typography variant="body2">25%</Typography>
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Onglet Paramètres */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" gutterBottom>
            Paramètres système
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Notifications
                </Typography>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notifications email automatiques"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notifications push"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Modération automatique"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Système
                </Typography>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Mode maintenance"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Logs détaillés"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Sauvegarde automatique"
                />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* SpeedDial pour actions rapides */}
      <SpeedDial
        ariaLabel="Actions rapides admin"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}
