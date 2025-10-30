import React, { useState } from 'react';import React, { useState } from 'react';import React, { useState, useEffect } from 'react';import React from "react"import React from "react"

import {

  Box,import {

  Container,

  Grid,  Box,import {

  Paper,

  Typography,  Container,

  Avatar,

  Button,  Grid,  Box,import {import {

  Card,

  CardContent,  Paper,

  Chip,

  Tab,  Typography,  Container,

  Tabs,

  Switch,  Avatar,

  FormControlLabel,

  TextField,  Button,  Grid,    Box,    Box,

  Dialog,

  DialogTitle,  TextField,

  DialogContent,

  DialogActions,  Switch,  Paper,

  List,

  ListItem,  FormControlLabel,

  ListItemIcon,

  ListItemText  Card,  Typography,    Typography,    Typography,

} from '@mui/material';

import {  CardContent,

  Person,

  Edit,  Divider,  Avatar,

  Email,

  Phone,  List,

  School,

  Article,  ListItem,  Button,    Card,    Card,

  ThumbUp,

  Comment,  ListItemIcon,

  Visibility,

  Security,  ListItemText,  TextField,

  Notifications

} from '@mui/icons-material';  Chip,

import { useAuth } from '../contexts/AuthContext';

  LinearProgress,  Switch,    CardContent,    CardContent,

interface TabPanelProps {

  children?: React.ReactNode;  Tab,

  index: number;

  value: number;  Tabs,  FormControlLabel,

}

  IconButton,

function TabPanel(props: TabPanelProps) {

  const { children, value, index } = props;  Dialog,  Card,    Avatar,    Avatar,

  return (

    <div hidden={value !== index}>  DialogTitle,

      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}

    </div>  DialogContent,  CardContent,

  );

}  DialogActions,



const ProfilePage: React.FC = () => {  Snackbar,  Divider,    Grid,    Grid,

  const { user } = useAuth();

  const [tabValue, setTabValue] = useState(0);  Alert,

  const [editDialog, setEditDialog] = useState(false);

  const [notifications, setNotifications] = useState({  Badge  List,

    emailDigest: true,

    pushNotifications: true,} from '@mui/material';

    newsAlerts: false

  });import {  ListItem,    TextField,    TextField,



  const stats = [  Person,

    { icon: Article, label: 'Articles lus', value: 125, color: 'primary' },

    { icon: ThumbUp, label: 'Articles aimés', value: 43, color: 'success' },  Edit,  ListItemIcon,

    { icon: Comment, label: 'Commentaires', value: 28, color: 'info' },

    { icon: Visibility, label: 'Vues profil', value: 89, color: 'warning' }  Settings,

  ];

  Notifications,  ListItemText,    Button,    Button,

  return (

    <Container maxWidth="lg" sx={{ py: 4 }}>  Email,

      {/* En-tête du profil */}

      <Paper sx={{ p: 3, mb: 3 }}>  Phone,  Chip,

        <Grid container spacing={3} alignItems="center">

          <Grid item>  School,

            <Avatar sx={{ width: 80, height: 80 }}>

              {user?.first_name?.[0]}{user?.last_name?.[0]}  TrendingUp,  LinearProgress,    Switch,    Switch,

            </Avatar>

          </Grid>  Article,

          <Grid item xs>

            <Typography variant="h4" fontWeight="bold">  Visibility,  Tab,

              {user?.first_name} {user?.last_name}

            </Typography>  ThumbUp,

            <Typography variant="body1" color="text.secondary">

              @{user?.username}  Comment,  Tabs,    FormControlLabel,    FormControlLabel,

            </Typography>

            <Chip   Security,

              label={user?.is_staff ? 'Administrateur' : 'Étudiant'} 

              color="primary"   Language,  IconButton,

              size="small"

              sx={{ mt: 1 }}  Palette,

            />

          </Grid>  Save,  Dialog,    Divider,    Divider,

          <Grid item>

            <Button  Cancel,

              variant="contained"

              startIcon={<Edit />}  PhotoCamera  DialogTitle,

              onClick={() => setEditDialog(true)}

            >} from '@mui/icons-material';

              Modifier

            </Button>import { useAuth } from '../contexts/AuthContext';  DialogContent,    Alert,    Alert,

          </Grid>

        </Grid>

      </Paper>

interface TabPanelProps {  DialogActions,

      {/* Onglets */}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>  children?: React.ReactNode;

        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>

          <Tab label="Profil" />  index: number;  Snackbar,    Chip,    Chip,

          <Tab label="Statistiques" />

          <Tab label="Notifications" />  value: number;

        </Tabs>

      </Box>}  Alert,



      {/* Onglet Profil */}

      <TabPanel value={tabValue} index={0}>

        <Grid container spacing={3}>function TabPanel(props: TabPanelProps) {  Badge    Paper,    Paper,

          <Grid item xs={12} md={8}>

            <Card>  const { children, value, index, ...other } = props;

              <CardContent>

                <Typography variant="h6" gutterBottom>} from '@mui/material';

                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />

                  Informations personnelles  return (

                </Typography>

                <List>    <divimport {    LinearProgress,    LinearProgress,

                  <ListItem>

                    <ListItemIcon><Email /></ListItemIcon>      role="tabpanel"

                    <ListItemText primary="Email" secondary={user?.email} />

                  </ListItem>      hidden={value !== index}  Person,

                  <ListItem>

                    <ListItemIcon><Phone /></ListItemIcon>      id={`profile-tabpanel-${index}`}

                    <ListItemText primary="Téléphone" secondary="Non renseigné" />

                  </ListItem>      aria-labelledby={`profile-tab-${index}`}  Edit,    List,    List,

                  <ListItem>

                    <ListItemIcon><School /></ListItemIcon>      {...other}

                    <ListItemText 

                      primary="Statut"     >  Settings,

                      secondary={user?.is_staff ? 'Administrateur' : 'Étudiant'} 

                    />      {value === index && (

                  </ListItem>

                </List>        <Box sx={{ p: 3 }}>  Notifications,    ListItem,    ListItem,

              </CardContent>

            </Card>          {children}

          </Grid>

          <Grid item xs={12} md={4}>        </Box>  Email,

            <Card>

              <CardContent>      )}

                <Typography variant="h6" gutterBottom>Activité récente</Typography>

                <Typography variant="body2" color="text.secondary">    </div>  Phone,    ListItemIcon,    ListItemIcon,

                  Articles lus cette semaine: 12

                </Typography>  );

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>

                  Dernière connexion: Aujourd'hui}  School,

                </Typography>

              </CardContent>

            </Card>

          </Grid>function a11yProps(index: number) {  TrendingUp,    ListItemText,    ListItemText,

        </Grid>

      </TabPanel>  return {



      {/* Onglet Statistiques */}    id: `profile-tab-${index}`,  Article,

      <TabPanel value={tabValue} index={1}>

        <Grid container spacing={3}>    'aria-controls': `profile-tabpanel-${index}`,

          {stats.map((stat, index) => (

            <Grid item xs={12} sm={6} md={3} key={index}>  };  Visibility,    ListItemSecondaryAction,    ListItemSecondaryAction,

              <Card>

                <CardContent sx={{ textAlign: 'center' }}>}

                  <stat.icon sx={{ fontSize: 40, color: `${stat.color}.main`, mb: 1 }} />

                  <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>  ThumbUp,

                    {stat.value}

                  </Typography>const ProfilePage: React.FC = () => {

                  <Typography variant="body2" color="text.secondary">

                    {stat.label}  const { user } = useAuth();  Comment,    IconButton,    IconButton,

                  </Typography>

                </CardContent>  const [tabValue, setTabValue] = useState(0);

              </Card>

            </Grid>  const [editProfile, setEditProfile] = useState(false);  Schedule,

          ))}

        </Grid>  const [profileData, setProfileData] = useState({

      </TabPanel>

    firstName: user?.first_name || '',  Security,    Tooltip,    Tooltip,

      {/* Onglet Notifications */}

      <TabPanel value={tabValue} index={2}>    lastName: user?.last_name || '',

        <Card>

          <CardContent>    email: user?.email || '',  Language,

            <Typography variant="h6" gutterBottom>

              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />    phone: '',

              Préférences de notification

            </Typography>    bio: '',  Palette,    Badge,    Badge,

            <Grid container spacing={2} sx={{ mt: 2 }}>

              <Grid item xs={12}>    avatar: null as File | null

                <FormControlLabel

                  control={  });  Save,

                    <Switch

                      checked={notifications.emailDigest}  const [notifications, setNotifications] = useState({

                      onChange={(e) => setNotifications(prev => 

                        ({ ...prev, emailDigest: e.target.checked })    emailDigest: true,  Cancel,    FormControl,    FormControl,

                      )}

                    />    pushNotifications: true,

                  }

                  label="Résumé quotidien par email"    newsAlerts: true,  PhotoCamera

                />

              </Grid>    commentReplies: false,

              <Grid item xs={12}>

                <FormControlLabel    systemUpdates: true} from '@mui/icons-material';    InputLabel,    InputLabel,

                  control={

                    <Switch  });

                      checked={notifications.pushNotifications}

                      onChange={(e) => setNotifications(prev =>   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as const });import { useAuth } from '../contexts/AuthContext';

                        ({ ...prev, pushNotifications: e.target.checked })

                      )}

                    />

                  }  const userStats = {    Select,    Select,

                  label="Notifications push"

                />    articlesRead: 125,

              </Grid>

              <Grid item xs={12}>    articlesLiked: 43,interface TabPanelProps {

                <FormControlLabel

                  control={    commentsPosted: 28,

                    <Switch

                      checked={notifications.newsAlerts}    profileViews: 89,  children?: React.ReactNode;    MenuItem,    MenuItem,

                      onChange={(e) => setNotifications(prev => 

                        ({ ...prev, newsAlerts: e.target.checked })    favoriteCategories: ['Technologie', 'Science', 'Actualités'],

                      )}

                    />    readingStreak: 15  index: number;

                  }

                  label="Alertes actualités urgentes"  };

                />

              </Grid>  value: number;} from "@mui/material"} from "@mui/material"

            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {

              <Button variant="contained">

                Sauvegarder    setTabValue(newValue);}

              </Button>

            </Box>  };

          </CardContent>

        </Card>import {import {

      </TabPanel>

  const handleProfileChange = (field: string, value: string) => {

      {/* Dialog de modification */}

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>    setProfileData(prev => ({ ...prev, [field]: value }));function TabPanel(props: TabPanelProps) {

        <DialogTitle>Modifier le profil</DialogTitle>

        <DialogContent>  };

          <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid item xs={6}>  const { children, value, index, ...other } = props;    Person as PersonIcon,    Person as PersonIcon,

              <TextField

                fullWidth  const handleNotificationChange = (setting: string, value: boolean) => {

                label="Prénom"

                defaultValue={user?.first_name}    setNotifications(prev => ({ ...prev, [setting]: value }));

              />

            </Grid>  };

            <Grid item xs={6}>

              <TextField  return (    Email as EmailIcon,    Email as EmailIcon,

                fullWidth

                label="Nom"  const handleSaveProfile = () => {

                defaultValue={user?.last_name}

              />    setSnackbar({ open: true, message: 'Profil mis à jour avec succès!', severity: 'success' });    <div

            </Grid>

            <Grid item xs={12}>    setEditProfile(false);

              <TextField

                fullWidth  };      role="tabpanel"    Notifications as NotificationIcon,    Notifications as NotificationIcon,

                label="Email"

                type="email"

                defaultValue={user?.email}

              />  const handleSaveNotifications = () => {      hidden={value !== index}

            </Grid>

            <Grid item xs={12}>    setSnackbar({ open: true, message: 'Préférences de notification mises à jour!', severity: 'success' });

              <TextField

                fullWidth  };      id={`profile-tabpanel-${index}`}    Security as SecurityIcon,    Security as SecurityIcon,

                label="Téléphone"

                placeholder="Non renseigné"

              />

            </Grid>  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {      aria-labelledby={`profile-tab-${index}`}

          </Grid>

        </DialogContent>    const file = event.target.files?.[0];

        <DialogActions>

          <Button onClick={() => setEditDialog(false)}>Annuler</Button>    if (file) {      {...other}    School as SchoolIcon,    School as SchoolIcon,

          <Button onClick={() => setEditDialog(false)} variant="contained">

            Sauvegarder      setProfileData(prev => ({ ...prev, avatar: file }));

          </Button>

        </DialogActions>    }    >

      </Dialog>

    </Container>  };

  );

};      {value === index && (    Edit as EditIcon,    Edit as EditIcon,



export default ProfilePage;  return (

    <Container maxWidth="lg" sx={{ py: 4 }}>        <Box sx={{ p: 3 }}>

      <Paper sx={{ mb: 3, p: 3 }}>

        <Grid container spacing={3} alignItems="center">          {children}    Save as SaveIcon,    Save as SaveIcon,

          <Grid item>

            <Badge        </Box>

              overlap="circular"

              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}      )}    Cancel as CancelIcon,    Cancel as CancelIcon,

              badgeContent={

                <IconButton    </div>

                  color="primary"

                  component="label"  );    NotificationsActive as NotificationsActiveIcon,    NotificationsActive as NotificationsActiveIcon,

                  size="small"

                  sx={{}

                    bgcolor: 'background.paper',

                    border: '2px solid',    NotificationsOff as NotificationsOffIcon,    NotificationsOff as NotificationsOffIcon,

                    borderColor: 'primary.main',

                    '&:hover': { bgcolor: 'primary.main', color: 'white' }function a11yProps(index: number) {

                  }}

                >  return {    Schedule as ScheduleIcon,    Schedule as ScheduleIcon,

                  <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />

                  <PhotoCamera fontSize="small" />    id: `profile-tab-${index}`,

                </IconButton>

              }    'aria-controls': `profile-tabpanel-${index}`,    Favorite as FavoriteIcon,    Favorite as FavoriteIcon,

            >

              <Avatar  };

                sx={{ width: 100, height: 100 }}

                src={profileData.avatar ? URL.createObjectURL(profileData.avatar) : undefined}}    Visibility as VisibilityIcon,    Visibility as VisibilityIcon,

              >

                {user?.first_name?.[0]}{user?.last_name?.[0]}

              </Avatar>

            </Badge>const ProfilePage: React.FC = () => {    TrendingUp as StatsIcon,    TrendingUp as StatsIcon,

          </Grid>

          <Grid item xs>  const { user } = useAuth();

            <Typography variant="h4" fontWeight="bold">

              {user?.first_name} {user?.last_name}  const [tabValue, setTabValue] = useState(0);} from "@mui/icons-material"} from "@mui/icons-material"

            </Typography>

            <Typography variant="body1" color="text.secondary" gutterBottom>  const [editMode, setEditMode] = useState(false);

              @{user?.username}

            </Typography>  const [editProfile, setEditProfile] = useState(false);import { useAuth } from "../contexts/AuthContext"import { useAuth } from "../contexts/AuthContext"

            <Chip 

              label={user?.is_staff ? 'Administrateur' : 'Étudiant'}   const [profileData, setProfileData] = useState({

              color="primary" 

              variant="outlined"     firstName: user?.first_name || '',

            />

          </Grid>    lastName: user?.last_name || '',

          <Grid item>

            <Button    email: user?.email || '',const ProfilePage = () => {const ProfilePage = () => {

              variant="contained"

              startIcon={<Edit />}    phone: '',

              onClick={() => setEditProfile(true)}

            >    bio: '',    const { user, isInitialized } = useAuth()    const { user, isInitialized } = useAuth()

              Modifier le profil

            </Button>    avatar: null as File | null

          </Grid>

        </Grid>  });    const [editing, setEditing] = React.useState(false)    const [editing, setEditing] = React.useState(false)

      </Paper>

  const [notifications, setNotifications] = useState({

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>

        <Tabs value={tabValue} onChange={handleTabChange}>    emailDigest: true,    const [loading, setLoading] = React.useState(false)    const [loading, setLoading] = React.useState(false)

          <Tab label="Vue d'ensemble" {...a11yProps(0)} />

          <Tab label="Statistiques" {...a11yProps(1)} />    pushNotifications: true,

          <Tab label="Notifications" {...a11yProps(2)} />

          <Tab label="Paramètres" {...a11yProps(3)} />    newsAlerts: true,    const [profileData, setProfileData] = React.useState({    const [profileData, setProfileData] = React.useState({

        </Tabs>

      </Box>    commentReplies: false,



      <TabPanel value={tabValue} index={0}>    systemUpdates: true        first_name: user?.first_name || "",        first_name: user?.first_name || "",

        <Grid container spacing={3}>

          <Grid item xs={12} md={8}>  });

            <Card>

              <CardContent>  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as const });        last_name: user?.last_name || "",        last_name: user?.last_name || "",

                <Typography variant="h6" gutterBottom>

                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />

                  Informations personnelles

                </Typography>  const userStats = {        email: user?.email || "",        email: user?.email || "",

                <Divider sx={{ mb: 2 }} />

                <List>    articlesRead: 125,

                  <ListItem>

                    <ListItemIcon><Email /></ListItemIcon>    articlesLiked: 43,        university: user?.university || "",        university: user?.university || "",

                    <ListItemText primary="Email" secondary={user?.email} />

                  </ListItem>    commentsPosted: 28,

                  <ListItem>

                    <ListItemIcon><Phone /></ListItemIcon>    profileViews: 89,        program: user?.program || "",        program: user?.program || "",

                    <ListItemText primary="Téléphone" secondary={profileData.phone || 'Non renseigné'} />

                  </ListItem>    joinDate: '2024-01-15',

                  <ListItem>

                    <ListItemIcon><School /></ListItemIcon>    lastActive: '2024-01-20',        year: user?.year || "",        year: user?.year || "",

                    <ListItemText primary="Statut" secondary={user?.is_staff ? 'Administrateur' : 'Étudiant'} />

                  </ListItem>    favoriteCategories: ['Technologie', 'Science', 'Actualités'],

                </List>

              </CardContent>    readingStreak: 15    })    })

            </Card>

          </Grid>  };

          <Grid item xs={12} md={4}>

            <Card>

              <CardContent>

                <Typography variant="h6" gutterBottom>  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {

                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />

                  Activité récente    setTabValue(newValue);    // Préférences de notification    // Préférences de notification

                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>  };

                  <Typography variant="body2">Articles lus cette semaine</Typography>

                  <Chip label="12" color="primary" size="small" />    const [notificationPrefs, setNotificationPrefs] = React.useState({    const [notificationPrefs, setNotificationPrefs] = React.useState({

                </Box>

                <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />  const handleProfileChange = (field: string, value: string | boolean) => {

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>

                  <Typography variant="body2">Objectif de lecture</Typography>    setProfileData(prev => ({ ...prev, [field]: value }));        email_notifications: true,        email_notifications: true,

                  <Typography variant="body2">15/20</Typography>

                </Box>  };

              </CardContent>

            </Card>        push_notifications: true,        push_notifications: true,

          </Grid>

        </Grid>  const handleNotificationChange = (setting: string, value: boolean) => {

      </TabPanel>

    setNotifications(prev => ({ ...prev, [setting]: value }));        frequency: "daily", // immediate, daily, weekly        frequency: "daily", // immediate, daily, weekly

      <TabPanel value={tabValue} index={1}>

        <Grid container spacing={3}>  };

          {[

            { icon: Article, label: 'Articles lus', value: userStats.articlesRead, color: 'primary' },        categories: {        categories: {

            { icon: ThumbUp, label: 'Articles aimés', value: userStats.articlesLiked, color: 'success' },

            { icon: Comment, label: 'Commentaires', value: userStats.commentsPosted, color: 'info' },  const handleSaveProfile = () => {

            { icon: Visibility, label: 'Vues du profil', value: userStats.profileViews, color: 'warning' },

          ].map((stat, index) => (    // Simulation de sauvegarde            academic: true,            academic: true,

            <Grid item xs={12} sm={6} md={3} key={index}>

              <Card>    setSnackbar({ open: true, message: 'Profil mis à jour avec succès!', severity: 'success' });

                <CardContent sx={{ textAlign: 'center' }}>

                  <stat.icon sx={{ fontSize: 40, color: `${stat.color}.main`, mb: 1 }} />    setEditProfile(false);            events: true,            events: true,

                  <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>

                    {stat.value}  };

                  </Typography>

                  <Typography variant="body2" color="text.secondary">            infrastructure: false,            infrastructure: false,

                    {stat.label}

                  </Typography>  const handleSaveNotifications = () => {

                </CardContent>

              </Card>    // Simulation de sauvegarde            sports: true,            sports: true,

            </Grid>

          ))}    setSnackbar({ open: true, message: 'Préférences de notification mises à jour!', severity: 'success' });

          <Grid item xs={12}>

            <Card>    setEditMode(false);            general: true,            general: true,

              <CardContent>

                <Typography variant="h6" gutterBottom>Catégories préférées</Typography>  };

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>

                  {userStats.favoriteCategories.map((category, index) => (        },        },

                    <Chip key={index} label={category} variant="outlined" />

                  ))}  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {

                </Box>

              </CardContent>    const file = event.target.files?.[0];        importance_filter: "medium", // all, medium, high        importance_filter: "medium", // all, medium, high

            </Card>

          </Grid>    if (file) {

        </Grid>

      </TabPanel>      setProfileData(prev => ({ ...prev, avatar: file }));    })    })



      <TabPanel value={tabValue} index={2}>    }

        <Card>

          <CardContent>  };

            <Typography variant="h6" gutterBottom>

              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />

              Préférences de notification

            </Typography>  return (    // Statistiques utilisateur    // Statistiques utilisateur

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>    <Container maxWidth="lg" sx={{ py: 4 }}>

              {[

                { key: 'emailDigest', label: 'Résumé quotidien par email', desc: 'Recevez un résumé des actualités importantes' },      <Paper sx={{ mb: 3, p: 3 }}>    const [userStats] = React.useState({    const [userStats] = React.useState({

                { key: 'pushNotifications', label: 'Notifications push', desc: 'Notifications en temps réel sur votre appareil' },

                { key: 'newsAlerts', label: 'Alertes actualités', desc: 'Notifications pour les actualités urgentes' },        <Grid container spacing={3} alignItems="center">

                { key: 'commentReplies', label: 'Réponses aux commentaires', desc: 'Notifié quand quelqu\'un répond à vos commentaires' },

                { key: 'systemUpdates', label: 'Mises à jour système', desc: 'Informations sur les nouvelles fonctionnalités' },          <Grid item>        news_read: 42,        news_read: 42,

              ].map((setting) => (

                <Grid item xs={12} key={setting.key}>            <Badge

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>

                    <Box>              overlap="circular"        news_liked: 18,        news_liked: 18,

                      <Typography variant="body1" fontWeight="medium">

                        {setting.label}              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

                      </Typography>

                      <Typography variant="body2" color="text.secondary">              badgeContent={        news_shared: 5,        news_shared: 5,

                        {setting.desc}

                      </Typography>                <IconButton

                    </Box>

                    <FormControlLabel                  color="primary"        join_date: "2024-09-15",        join_date: "2024-09-15",

                      control={

                        <Switch                  aria-label="upload picture"

                          checked={notifications[setting.key as keyof typeof notifications]}

                          onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}                  component="label"        last_active: "2025-10-22",        last_active: "2025-10-22",

                        />

                      }                  size="small"

                      label=""

                    />                  sx={{    })    })

                  </Box>

                </Grid>                    bgcolor: 'background.paper',

              ))}

            </Grid>                    border: '2px solid',

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>

              <Button variant="contained" onClick={handleSaveNotifications}>                    borderColor: 'primary.main',

                Sauvegarder les préférences

              </Button>                    '&:hover': { bgcolor: 'primary.main', color: 'white' }    const handleSaveProfile = async () => {    const handleSaveProfile = async () => {

            </Box>

          </CardContent>                  }}

        </Card>

      </TabPanel>                >        setLoading(true)        setLoading(true)



      <TabPanel value={tabValue} index={3}>                  <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>                  <PhotoCamera fontSize="small" />        try {        try {

            <Card>

              <CardContent>                </IconButton>

                <Typography variant="h6" gutterBottom>

                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />              }            // TODO: Connecter à l'API Django            // TODO: Connecter à l'API Django

                  Sécurité

                </Typography>            >

                <List>

                  <ListItem>              <Avatar            await new Promise(resolve => setTimeout(resolve, 1500))            await new Promise(resolve => setTimeout(resolve, 1500))

                    <ListItemText primary="Changer le mot de passe" secondary="Dernière modification il y a 30 jours" />

                    <Button variant="outlined" size="small">Modifier</Button>                sx={{ width: 100, height: 100 }}

                  </ListItem>

                  <ListItem>                src={profileData.avatar ? URL.createObjectURL(profileData.avatar) : undefined}            console.log("Profil sauvegardé:", profileData)            console.log("Profil sauvegardé:", profileData)

                    <ListItemText primary="Authentification à deux facteurs" secondary="Désactivée" />

                    <Button variant="outlined" size="small">Activer</Button>              >

                  </ListItem>

                </List>                {user?.first_name?.[0]}{user?.last_name?.[0]}            setEditing(false)            setEditing(false)

              </CardContent>

            </Card>              </Avatar>

          </Grid>

          <Grid item xs={12} md={6}>            </Badge>            alert("Profil mis à jour avec succès !")            alert("Profil mis à jour avec succès !")

            <Card>

              <CardContent>          </Grid>

                <Typography variant="h6" gutterBottom>

                  <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />          <Grid item xs>        } catch (error) {        } catch (error) {

                  Préférences

                </Typography>            <Typography variant="h4" fontWeight="bold">

                <List>

                  <ListItem>              {user?.first_name} {user?.last_name}            console.error("Erreur:", error)            console.error("Erreur:", error)

                    <ListItemIcon><Language /></ListItemIcon>

                    <ListItemText primary="Langue" secondary="Français" />            </Typography>

                    <Button variant="outlined" size="small">Changer</Button>

                  </ListItem>            <Typography variant="body1" color="text.secondary" gutterBottom>        } finally {        } finally {

                  <ListItem>

                    <ListItemIcon><Palette /></ListItemIcon>              @{user?.username}

                    <ListItemText primary="Thème" secondary="Automatique" />

                    <Button variant="outlined" size="small">Changer</Button>            </Typography>            setLoading(false)            setLoading(false)

                  </ListItem>

                </List>            <Chip 

              </CardContent>

            </Card>              label={user?.is_staff ? 'Administrateur' : user?.role || 'Étudiant'}         }        }

          </Grid>

        </Grid>              color="primary" 

      </TabPanel>

              variant="outlined"     }    }

      <Dialog open={editProfile} onClose={() => setEditProfile(false)} maxWidth="sm" fullWidth>

        <DialogTitle>Modifier le profil</DialogTitle>            />

        <DialogContent>

          <Grid container spacing={2} sx={{ mt: 1 }}>          </Grid>

            <Grid item xs={6}>

              <TextField          <Grid item>

                fullWidth

                label="Prénom"            <Button    const handleSaveNotifications = async () => {    const handleSaveNotifications = async () => {

                value={profileData.firstName}

                onChange={(e) => handleProfileChange('firstName', e.target.value)}              variant="contained"

              />

            </Grid>              startIcon={<Edit />}        setLoading(true)        setLoading(true)

            <Grid item xs={6}>

              <TextField              onClick={() => setEditProfile(true)}

                fullWidth

                label="Nom"            >        try {        try {

                value={profileData.lastName}

                onChange={(e) => handleProfileChange('lastName', e.target.value)}              Modifier le profil

              />

            </Grid>            </Button>            // TODO: Connecter à l'API Django            // TODO: Connecter à l'API Django

            <Grid item xs={12}>

              <TextField          </Grid>

                fullWidth

                label="Email"        </Grid>            await new Promise(resolve => setTimeout(resolve, 1000))            await new Promise(resolve => setTimeout(resolve, 1000))

                type="email"

                value={profileData.email}      </Paper>

                onChange={(e) => handleProfileChange('email', e.target.value)}

              />            console.log("Préférences de notification sauvegardées:", notificationPrefs)            console.log("Préférences de notification sauvegardées:", notificationPrefs)

            </Grid>

            <Grid item xs={12}>      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>

              <TextField

                fullWidth        <Tabs value={tabValue} onChange={handleTabChange}>            alert("Préférences mises à jour !")            alert("Préférences mises à jour !")

                label="Téléphone"

                value={profileData.phone}          <Tab label="Vue d'ensemble" {...a11yProps(0)} />

                onChange={(e) => handleProfileChange('phone', e.target.value)}

              />          <Tab label="Statistiques" {...a11yProps(1)} />        } catch (error) {        } catch (error) {

            </Grid>

            <Grid item xs={12}>          <Tab label="Notifications" {...a11yProps(2)} />

              <TextField

                fullWidth          <Tab label="Paramètres" {...a11yProps(3)} />            console.error("Erreur:", error)            console.error("Erreur:", error)

                label="Bio"

                multiline        </Tabs>

                rows={3}

                value={profileData.bio}      </Box>        } finally {        } finally {

                onChange={(e) => handleProfileChange('bio', e.target.value)}

              />

            </Grid>

          </Grid>      <TabPanel value={tabValue} index={0}>            setLoading(false)            setLoading(false)

        </DialogContent>

        <DialogActions>        <Grid container spacing={3}>

          <Button onClick={() => setEditProfile(false)} startIcon={<Cancel />}>

            Annuler          <Grid item xs={12} md={8}>        }        }

          </Button>

          <Button onClick={handleSaveProfile} variant="contained" startIcon={<Save />}>            <Card>

            Sauvegarder

          </Button>              <CardContent>    }    }

        </DialogActions>

      </Dialog>                <Typography variant="h6" gutterBottom>



      <Snackbar                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />

        open={snackbar.open}

        autoHideDuration={6000}                  Informations personnelles

        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}

      >                </Typography>    const getFrequencyLabel = (freq: string) => {    const getFrequencyLabel = (freq: string) => {

        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>

          {snackbar.message}                <Divider sx={{ mb: 2 }} />

        </Alert>

      </Snackbar>                <List>        switch (freq) {        switch (freq) {

    </Container>

  );                  <ListItem>

};

                    <ListItemIcon><Email /></ListItemIcon>            case "immediate": return "Immédiate"            case "immediate": return "Immédiate"

export default ProfilePage;
                    <ListItemText primary="Email" secondary={user?.email} />

                  </ListItem>            case "daily": return "Quotidienne"            case "daily": return "Quotidienne"

                  <ListItem>

                    <ListItemIcon><Phone /></ListItemIcon>            case "weekly": return "Hebdomadaire"            case "weekly": return "Hebdomadaire"

                    <ListItemText primary="Téléphone" secondary={profileData.phone || 'Non renseigné'} />

                  </ListItem>            default: return "Quotidienne"            default: return "Quotidienne"

                  <ListItem>

                    <ListItemIcon><School /></ListItemIcon>        }        }

                    <ListItemText primary="Statut" secondary={user?.is_staff ? 'Administrateur' : 'Étudiant'} />

                  </ListItem>    }    }

                </List>

              </CardContent>

            </Card>

          </Grid>    if (!isInitialized) {    if (!isInitialized) {

          <Grid item xs={12} md={4}>

            <Card>        return (        return (

              <CardContent>

                <Typography variant="h6" gutterBottom>            <Box sx={{ p: 3, textAlign: "center" }}>            <Box sx={{ p: 3, textAlign: "center" }}>

                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />

                  Activité récente                <Typography>Chargement...</Typography>                <Typography>Chargement...</Typography>

                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>            </Box>            </Box>

                  <Typography variant="body2">Articles lus cette semaine</Typography>

                  <Chip label="12" color="primary" size="small" />        )        )

                </Box>

                <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />    }    }

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>

                  <Typography variant="body2">Objectif de lecture</Typography>

                  <Typography variant="body2">15/20</Typography>

                </Box>    if (!user) {    if (!user) {

              </CardContent>

            </Card>        return (        return (

          </Grid>

        </Grid>            <Box sx={{ p: 3, textAlign: "center" }}>            <Box sx={{ p: 3, textAlign: "center" }}>

      </TabPanel>

                <Typography variant="h5" color="error">                <Typography variant="h5" color="error">

      <TabPanel value={tabValue} index={1}>

        <Grid container spacing={3}>                    Connexion requise                    Connexion requise

          {[

            { icon: Article, label: 'Articles lus', value: userStats.articlesRead, color: 'primary' },                </Typography>                </Typography>

            { icon: ThumbUp, label: 'Articles aimés', value: userStats.articlesLiked, color: 'success' },

            { icon: Comment, label: 'Commentaires', value: userStats.commentsPosted, color: 'info' },                <Typography>                <Typography>

            { icon: Visibility, label: 'Vues du profil', value: userStats.profileViews, color: 'warning' },

          ].map((stat, index) => (                    Vous devez être connecté pour voir votre profil.                    Vous devez être connecté pour voir votre profil.

            <Grid item xs={12} sm={6} md={3} key={index}>

              <Card>                </Typography>                </Typography>

                <CardContent sx={{ textAlign: 'center' }}>

                  <stat.icon sx={{ fontSize: 40, color: `${stat.color}.main`, mb: 1 }} />            </Box>            </Box>

                  <Typography variant="h4" fontWeight="bold" color={`${stat.color}.main`}>

                    {stat.value}        )        )

                  </Typography>

                  <Typography variant="body2" color="text.secondary">    }    }

                    {stat.label}

                  </Typography>

                </CardContent>

              </Card>    return (    return (

            </Grid>

          ))}        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>

          <Grid item xs={12}>

            <Card>            <Grid container spacing={3}>            <Grid container spacing={3}>

              <CardContent>

                <Typography variant="h6" gutterBottom>Catégories préférées</Typography>                {/* Section Profil Principal */}                {/* Section Profil Principal */}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>

                  {userStats.favoriteCategories.map((category, index) => (                <Grid item xs={12} md={4}>                <Grid item xs={12} md={4}>

                    <Chip key={index} label={category} variant="outlined" />

                  ))}                    <Card sx={{ borderRadius: 3, overflow: "visible", position: "relative" }}>                    <Card sx={{ borderRadius: 3, overflow: "visible", position: "relative" }}>

                </Box>

              </CardContent>                        <Box sx={{                        <Box sx={{

            </Card>

          </Grid>                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",

        </Grid>

      </TabPanel>                            height: 120,                            height: 120,



      <TabPanel value={tabValue} index={2}>                            position: "relative"                            position: "relative"

        <Card>

          <CardContent>                        }}>                        }}>

            <Typography variant="h6" gutterBottom>

              <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />                            <Avatar                            <Avatar

              Préférences de notification

            </Typography>                                sx={{                                sx={{

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>                                    width: 100,                                    width: 100,

              {[

                { key: 'emailDigest', label: 'Résumé quotidien par email', desc: 'Recevez un résumé des actualités importantes' },                                    height: 100,                                    height: 100,

                { key: 'pushNotifications', label: 'Notifications push', desc: 'Notifications en temps réel sur votre appareil' },

                { key: 'newsAlerts', label: 'Alertes actualités', desc: 'Notifications pour les actualités urgentes' },                                    position: "absolute",                                    position: "absolute",

                { key: 'commentReplies', label: 'Réponses aux commentaires', desc: 'Notifié quand quelqu\'un répond à vos commentaires' },

                { key: 'systemUpdates', label: 'Mises à jour système', desc: 'Informations sur les nouvelles fonctionnalités' },                                    bottom: -50,                                    bottom: -50,

              ].map((setting) => (

                <Grid item xs={12} key={setting.key}>                                    left: "50%",                                    left: "50%",

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>

                    <Box>                                    transform: "translateX(-50%)",                                    transform: "translateX(-50%)",

                      <Typography variant="body1" fontWeight="medium">

                        {setting.label}                                    border: "4px solid white",                                    border: "4px solid white",

                      </Typography>

                      <Typography variant="body2" color="text.secondary">                                    fontSize: 36,                                    fontSize: 36,

                        {setting.desc}

                      </Typography>                                    bgcolor: "primary.main"                                    bgcolor: "primary.main"

                    </Box>

                    <FormControlLabel                                }}                                }}

                      control={

                        <Switch                            >                            >

                          checked={notifications[setting.key as keyof typeof notifications]}

                          onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}                                {user.first_name?.[0]}{user.last_name?.[0]}                                {user.first_name?.[0]}{user.last_name?.[0]}

                        />

                      }                            </Avatar>                            </Avatar>

                      label=""

                    />                        </Box>                        </Box>

                  </Box>

                </Grid>                                                

              ))}

            </Grid>                        <CardContent sx={{ pt: 7, textAlign: "center" }}>                        <CardContent sx={{ pt: 7, textAlign: "center" }}>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>

              <Button variant="contained" onClick={handleSaveNotifications}>                            <Typography variant="h5" fontWeight="bold" gutterBottom>                            <Typography variant="h5" fontWeight="bold" gutterBottom>

                Sauvegarder les préférences

              </Button>                                {user.first_name} {user.last_name}                                {user.first_name} {user.last_name}

            </Box>

          </CardContent>                            </Typography>                            </Typography>

        </Card>

      </TabPanel>                            <Chip                             <Chip 



      <TabPanel value={tabValue} index={3}>                                label={user.role || "Étudiant"}                                 label={user.role || "Étudiant"} 

        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>                                color="primary"                                 color="primary" 

            <Card>

              <CardContent>                                sx={{ mb: 2 }}                                sx={{ mb: 2 }}

                <Typography variant="h6" gutterBottom>

                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />                            />                            />

                  Sécurité

                </Typography>                            <Typography variant="body2" color="text.secondary" gutterBottom>                            <Typography variant="body2" color="text.secondary" gutterBottom>

                <List>

                  <ListItem>                                {user.university || "Université"}                                {user.university || "Université"}

                    <ListItemText primary="Changer le mot de passe" secondary="Dernière modification il y a 30 jours" />

                    <Button variant="outlined" size="small">Modifier</Button>                            </Typography>                            </Typography>

                  </ListItem>

                  <ListItem>                            <Typography variant="body2" color="text.secondary">                            <Typography variant="body2" color="text.secondary">

                    <ListItemText primary="Authentification à deux facteurs" secondary="Désactivée" />

                    <Button variant="outlined" size="small">Activer</Button>                                Membre depuis {new Date(userStats.join_date).toLocaleDateString("fr-FR")}                                Membre depuis {new Date(userStats.join_date).toLocaleDateString("fr-FR")}

                  </ListItem>

                </List>                            </Typography>                            </Typography>

              </CardContent>

            </Card>                        </CardContent>                        </CardContent>

          </Grid>

          <Grid item xs={12} md={6}>                    </Card>                    </Card>

            <Card>

              <CardContent>

                <Typography variant="h6" gutterBottom>

                  <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />                    {/* Statistiques */}                    {/* Statistiques */}

                  Préférences

                </Typography>                    <Card sx={{ mt: 3, borderRadius: 3 }}>                    <Card sx={{ mt: 3, borderRadius: 3 }}>

                <List>

                  <ListItem>                        <CardContent>                        <CardContent>

                    <ListItemIcon><Language /></ListItemIcon>

                    <ListItemText primary="Langue" secondary="Français" />                            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>                            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                    <Button variant="outlined" size="small">Changer</Button>

                  </ListItem>                                <StatsIcon color="primary" />                                <StatsIcon color="primary" />

                  <ListItem>

                    <ListItemIcon><Palette /></ListItemIcon>                                Statistiques                                Statistiques

                    <ListItemText primary="Thème" secondary="Automatique" />

                    <Button variant="outlined" size="small">Changer</Button>                            </Typography>                            </Typography>

                  </ListItem>

                </List>                            <Divider sx={{ mb: 2 }} />                            <Divider sx={{ mb: 2 }} />

              </CardContent>

            </Card>                                                        

          </Grid>

        </Grid>                            <Grid container spacing={2}>                            <Grid container spacing={2}>

      </TabPanel>

                                <Grid item xs={6}>                                <Grid item xs={6}>

      {/* Dialog pour modifier le profil */}

      <Dialog open={editProfile} onClose={() => setEditProfile(false)} maxWidth="sm" fullWidth>                                    <Box sx={{ textAlign: "center" }}>                                    <Box sx={{ textAlign: "center" }}>

        <DialogTitle>Modifier le profil</DialogTitle>

        <DialogContent>                                        <Typography variant="h4" color="primary" fontWeight="bold">                                        <Typography variant="h4" color="primary" fontWeight="bold">

          <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid item xs={6}>                                            {userStats.news_read}                                            {userStats.news_read}

              <TextField

                fullWidth                                        </Typography>                                        </Typography>

                label="Prénom"

                value={profileData.firstName}                                        <Typography variant="body2" color="text.secondary">                                        <Typography variant="body2" color="text.secondary">

                onChange={(e) => handleProfileChange('firstName', e.target.value)}

              />                                            Actualités lues                                            Actualités lues

            </Grid>

            <Grid item xs={6}>                                        </Typography>                                        </Typography>

              <TextField

                fullWidth                                    </Box>                                    </Box>

                label="Nom"

                value={profileData.lastName}                                </Grid>                                </Grid>

                onChange={(e) => handleProfileChange('lastName', e.target.value)}

              />                                <Grid item xs={6}>                                <Grid item xs={6}>

            </Grid>

            <Grid item xs={12}>                                    <Box sx={{ textAlign: "center" }}>                                    <Box sx={{ textAlign: "center" }}>

              <TextField

                fullWidth                                        <Typography variant="h4" color="error" fontWeight="bold">                                        <Typography variant="h4" color="error" fontWeight="bold">

                label="Email"

                type="email"                                            {userStats.news_liked}                                            {userStats.news_liked}

                value={profileData.email}

                onChange={(e) => handleProfileChange('email', e.target.value)}                                        </Typography>                                        </Typography>

              />

            </Grid>                                        <Typography variant="body2" color="text.secondary">                                        <Typography variant="body2" color="text.secondary">

            <Grid item xs={12}>

              <TextField                                            J'aime donnés                                            J'aime donnés

                fullWidth

                label="Téléphone"                                        </Typography>                                        </Typography>

                value={profileData.phone}

                onChange={(e) => handleProfileChange('phone', e.target.value)}                                    </Box>                                    </Box>

              />

            </Grid>                                </Grid>                                </Grid>

            <Grid item xs={12}>

              <TextField                                <Grid item xs={12}>                                <Grid item xs={12}>

                fullWidth

                label="Bio"                                    <Box sx={{ textAlign: "center" }}>                                    <Box sx={{ textAlign: "center" }}>

                multiline

                rows={3}                                        <Badge badgeContent={userStats.news_shared} color="secondary">                                        <Badge badgeContent={userStats.news_shared} color="secondary">

                value={profileData.bio}

                onChange={(e) => handleProfileChange('bio', e.target.value)}                                            <Chip                                             <Chip 

              />

            </Grid>                                                label="Actualités partagées"                                                 label="Actualités partagées" 

          </Grid>

        </DialogContent>                                                variant="outlined"                                                 variant="outlined" 

        <DialogActions>

          <Button onClick={() => setEditProfile(false)} startIcon={<Cancel />}>                                                icon={<VisibilityIcon />}                                                icon={<VisibilityIcon />}

            Annuler

          </Button>                                            />                                            />

          <Button onClick={handleSaveProfile} variant="contained" startIcon={<Save />}>

            Sauvegarder                                        </Badge>                                        </Badge>

          </Button>

        </DialogActions>                                    </Box>                                    </Box>

      </Dialog>

                                </Grid>                                </Grid>

      <Snackbar

        open={snackbar.open}                            </Grid>                            </Grid>

        autoHideDuration={6000}

        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}                        </CardContent>                        </CardContent>

      >

        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>                    </Card>                    </Card>

          {snackbar.message}

        </Alert>                </Grid>                </Grid>

      </Snackbar>

    </Container>

  );

};                {/* Section Informations & Paramètres */}                {/* Section Informations & Paramètres */}



export default ProfilePage;                <Grid item xs={12} md={8}>                <Grid item xs={12} md={8}>

                    {/* Informations personnelles */}                    {/* Informations personnelles */}

                    <Card sx={{ mb: 3, borderRadius: 3 }}>                    <Card sx={{ mb: 3, borderRadius: 3 }}>

                        <CardContent>                        <CardContent>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>

                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>                                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                    <PersonIcon color="primary" />                                    <PersonIcon color="primary" />

                                    Informations personnelles                                    Informations personnelles

                                </Typography>                                </Typography>

                                <Button                                <Button

                                    variant={editing ? "outlined" : "contained"}                                    variant={editing ? "outlined" : "contained"}

                                    startIcon={editing ? <CancelIcon /> : <EditIcon />}                                    startIcon={editing ? <CancelIcon /> : <EditIcon />}

                                    onClick={() => setEditing(!editing)}                                    onClick={() => setEditing(!editing)}

                                >                                >

                                    {editing ? "Annuler" : "Modifier"}                                    {editing ? "Annuler" : "Modifier"}

                                </Button>                                </Button>

                            </Box>                            </Box>



                            {loading && <LinearProgress sx={{ mb: 2 }} />}                            {loading && <LinearProgress sx={{ mb: 2 }} />}



                            <Grid container spacing={3}>                            <Grid container spacing={3}>

                                <Grid item xs={12} sm={6}>                                <Grid item xs={12} sm={6}>

                                    <TextField                                    <TextField

                                        fullWidth                                        fullWidth

                                        label="Prénom"                                        label="Prénom"

                                        value={profileData.first_name}                                        value={profileData.first_name}

                                        onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}                                        onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}

                                        disabled={!editing}                                        disabled={!editing}

                                    />                                    />

                                </Grid>                                </Grid>

                                <Grid item xs={12} sm={6}>                                <Grid item xs={12} sm={6}>

                                    <TextField                                    <TextField

                                        fullWidth                                        fullWidth

                                        label="Nom"                                        label="Nom"

                                        value={profileData.last_name}                                        value={profileData.last_name}

                                        onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}                                        onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}

                                        disabled={!editing}                                        disabled={!editing}

                                    />                                    />

                                </Grid>                                </Grid>

                                <Grid item xs={12}>                                <Grid item xs={12}>

                                    <TextField                                    <TextField

                                        fullWidth                                        fullWidth

                                        label="Email"                                        label="Email"

                                        value={profileData.email}                                        value={profileData.email}

                                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}                                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}

                                        disabled={!editing}                                        disabled={!editing}

                                        InputProps={{                                        InputProps={{

                                            startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />                                            startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />

                                        }}                                        }}

                                    />                                    />

                                </Grid>                                </Grid>

                                <Grid item xs={12} sm={6}>                                <Grid item xs={12} sm={6}>

                                    <TextField                                    <TextField

                                        fullWidth                                        fullWidth

                                        label="Université"                                        label="Université"

                                        value={profileData.university}                                        value={profileData.university}

                                        onChange={(e) => setProfileData({...profileData, university: e.target.value})}                                        onChange={(e) => setProfileData({...profileData, university: e.target.value})}

                                        disabled={!editing}                                        disabled={!editing}

                                        InputProps={{                                        InputProps={{

                                            startAdornment: <SchoolIcon sx={{ mr: 1, color: "text.secondary" }} />                                            startAdornment: <SchoolIcon sx={{ mr: 1, color: "text.secondary" }} />

                                        }}                                        }}

                                    />                                    />

                                </Grid>                                </Grid>

                                <Grid item xs={12} sm={6}>                                <Grid item xs={12} sm={6}>

                                    <TextField                                    <TextField

                                        fullWidth                                        fullWidth

                                        label="Programme d'études"                                        label="Programme d'études"

                                        value={profileData.program}                                        value={profileData.program}

                                        onChange={(e) => setProfileData({...profileData, program: e.target.value})}                                        onChange={(e) => setProfileData({...profileData, program: e.target.value})}

                                        disabled={!editing}                                        disabled={!editing}

                                    />                                    />

                                </Grid>                                </Grid>

                            </Grid>                            </Grid>



                            {editing && (                            {editing && (

                                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>                                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>

                                    <Button                                    <Button

                                        variant="contained"                                        variant="contained"

                                        startIcon={<SaveIcon />}                                        startIcon={<SaveIcon />}

                                        onClick={handleSaveProfile}                                        onClick={handleSaveProfile}

                                        disabled={loading}                                        disabled={loading}

                                    >                                    >

                                        Sauvegarder                                        Sauvegarder

                                    </Button>                                    </Button>

                                </Box>                                </Box>

                            )}                            )}

                        </CardContent>                        </CardContent>

                    </Card>                    </Card>



                    {/* Préférences de notification */}                    {/* Préférences de notification */}

                    <Card sx={{ borderRadius: 3 }}>                    <Card sx={{ borderRadius: 3 }}>

                        <CardContent>                        <CardContent>

                            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>                            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                <NotificationIcon color="primary" />                                <NotificationIcon color="primary" />

                                Préférences de notification                                Préférences de notification

                            </Typography>                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>

                                Personnalisez comment et quand vous souhaitez recevoir les notifications                                Personnalisez comment et quand vous souhaitez recevoir les notifications

                            </Typography>                            </Typography>



                            <Grid container spacing={3}>                            <Grid container spacing={3}>

                                {/* Fréquence */}                                {/* Types de notification */}

                                <Grid item xs={12} md={6}>                                <Grid item xs={12} md={6}>

                                    <FormControl fullWidth>                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>

                                        <InputLabel>Fréquence des notifications</InputLabel>                                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">

                                        <Select                                            Types de notification

                                            value={notificationPrefs.frequency}                                        </Typography>

                                            label="Fréquence des notifications"                                        <List dense>

                                            onChange={(e) => setNotificationPrefs({                                            <ListItem>

                                                ...notificationPrefs,                                                <ListItemIcon>

                                                frequency: e.target.value                                                    <EmailIcon color="primary" />

                                            })}                                                </ListItemIcon>

                                        >                                                <ListItemText primary="Notifications par email" />

                                            <MenuItem value="immediate">                                                <ListItemSecondaryAction>

                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>                                                    <Switch

                                                    <NotificationsActiveIcon fontSize="small" />                                                        checked={notificationPrefs.email_notifications}

                                                    Immédiate - À chaque nouvelle actualité                                                        onChange={(e) => setNotificationPrefs({

                                                </Box>                                                            ...notificationPrefs,

                                            </MenuItem>                                                            email_notifications: e.target.checked

                                            <MenuItem value="daily">                                                        })}

                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>                                                    />

                                                    <ScheduleIcon fontSize="small" />                                                </ListItemSecondaryAction>

                                                    Quotidienne - Résumé journalier                                            </ListItem>

                                                </Box>                                            <ListItem>

                                            </MenuItem>                                                <ListItemIcon>

                                            <MenuItem value="weekly">                                                    <NotificationsActiveIcon color="primary" />

                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>                                                </ListItemIcon>

                                                    <ScheduleIcon fontSize="small" />                                                <ListItemText primary="Notifications push" />

                                                    Hebdomadaire - Résumé de la semaine                                                <ListItemSecondaryAction>

                                                </Box>                                                    <Switch

                                            </MenuItem>                                                        checked={notificationPrefs.push_notifications}

                                        </Select>                                                        onChange={(e) => setNotificationPrefs({

                                    </FormControl>                                                            ...notificationPrefs,

                                </Grid>                                                            push_notifications: e.target.checked

                                                        })}

                                {/* Niveau d'importance minimum */}                                                    />

                                <Grid item xs={12} md={6}>                                                </ListItemSecondaryAction>

                                    <FormControl fullWidth>                                            </ListItem>

                                        <InputLabel>Importance minimum</InputLabel>                                        </List>

                                        <Select                                    </Paper>

                                            value={notificationPrefs.importance_filter}                                </Grid>

                                            label="Importance minimum"

                                            onChange={(e) => setNotificationPrefs({                                {/* Fréquence */}

                                                ...notificationPrefs,                                <Grid item xs={12} md={6}>

                                                importance_filter: e.target.value                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>

                                            })}                                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">

                                        >                                            Fréquence

                                            <MenuItem value="all">Toutes les actualités</MenuItem>                                        </Typography>

                                            <MenuItem value="medium">🟡 Moyen et urgent seulement</MenuItem>                                        <FormControl fullWidth sx={{ mt: 1 }}>

                                            <MenuItem value="high">🔴 Urgent seulement</MenuItem>                                            <InputLabel>Fréquence des notifications</InputLabel>

                                        </Select>                                            <Select

                                    </FormControl>                                                value={notificationPrefs.frequency}

                                </Grid>                                                label="Fréquence des notifications"

                                                onChange={(e) => setNotificationPrefs({

                                {/* Types de notification */}                                                    ...notificationPrefs,

                                <Grid item xs={12}>                                                    frequency: e.target.value

                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>                                                })}

                                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">                                            >

                                            Types de notification                                                <MenuItem value="immediate">

                                        </Typography>                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                        <List dense>                                                        <NotificationsActiveIcon fontSize="small" />

                                            <ListItem>                                                        Immédiate - À chaque nouvelle actualité

                                                <ListItemIcon>                                                    </Box>

                                                    <EmailIcon color="primary" />                                                </MenuItem>

                                                </ListItemIcon>                                                <MenuItem value="daily">

                                                <ListItemText primary="Notifications par email" />                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                                <ListItemSecondaryAction>                                                        <ScheduleIcon fontSize="small" />

                                                    <Switch                                                        Quotidienne - Résumé journalier

                                                        checked={notificationPrefs.email_notifications}                                                    </Box>

                                                        onChange={(e) => setNotificationPrefs({                                                </MenuItem>

                                                            ...notificationPrefs,                                                <MenuItem value="weekly">

                                                            email_notifications: e.target.checked                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                                        })}                                                        <ScheduleIcon fontSize="small" />

                                                    />                                                        Hebdomadaire - Résumé de la semaine

                                                </ListItemSecondaryAction>                                                    </Box>

                                            </ListItem>                                                </MenuItem>

                                            <ListItem>                                            </Select>

                                                <ListItemIcon>                                        </FormControl>

                                                    <NotificationsActiveIcon color="primary" />                                    </Paper>

                                                </ListItemIcon>                                </Grid>

                                                <ListItemText primary="Notifications push" />

                                                <ListItemSecondaryAction>                                {/* Catégories d'intérêt */}

                                                    <Switch                                <Grid item xs={12}>

                                                        checked={notificationPrefs.push_notifications}                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>

                                                        onChange={(e) => setNotificationPrefs({                                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">

                                                            ...notificationPrefs,                                            Catégories d'intérêt

                                                            push_notifications: e.target.checked                                        </Typography>

                                                        })}                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>

                                                    />                                            Sélectionnez les types d'actualités qui vous intéressent

                                                </ListItemSecondaryAction>                                        </Typography>

                                            </ListItem>                                        <Grid container spacing={2}>

                                        </List>                                            {Object.entries(notificationPrefs.categories).map(([category, enabled]) => (

                                    </Paper>                                                <Grid item xs={12} sm={6} md={4} key={category}>

                                </Grid>                                                    <FormControlLabel

                            </Grid>                                                        control={

                                                            <Switch

                            <Alert severity="info" sx={{ mt: 3 }}>                                                                checked={enabled}

                                <Typography variant="body2">                                                                onChange={(e) => setNotificationPrefs({

                                    <strong>Configuration actuelle:</strong> Vous recevrez des notifications {" "}                                                                    ...notificationPrefs,

                                    <strong>{getFrequencyLabel(notificationPrefs.frequency).toLowerCase()}</strong> pour les actualités{" "}                                                                    categories: {

                                    {notificationPrefs.importance_filter !== "all" &&                                                                         ...notificationPrefs.categories,

                                        `d'importance ${notificationPrefs.importance_filter === "high" ? "urgente" : "moyenne et urgente"} `                                                                        [category]: e.target.checked

                                    }                                                                    }

                                    par {notificationPrefs.email_notifications && notificationPrefs.push_notifications ? "email et push" :                                                                })}

                                         notificationPrefs.email_notifications ? "email uniquement" :                                                            />

                                         notificationPrefs.push_notifications ? "push uniquement" : "aucun moyen"}                                                        }

                                </Typography>                                                        label={category.charAt(0).toUpperCase() + category.slice(1)}

                            </Alert>                                                    />

                                                </Grid>

                            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>                                            ))}

                                <Button                                        </Grid>

                                    variant="contained"                                    </Paper>

                                    startIcon={<SaveIcon />}                                </Grid>

                                    onClick={handleSaveNotifications}

                                    disabled={loading}                                {/* Niveau d'importance minimum */}

                                >                                <Grid item xs={12} md={6}>

                                    Sauvegarder préférences                                    <FormControl fullWidth>

                                </Button>                                        <InputLabel>Importance minimum</InputLabel>

                            </Box>                                        <Select

                        </CardContent>                                            value={notificationPrefs.importance_filter}

                    </Card>                                            label="Importance minimum"

                </Grid>                                            onChange={(e) => setNotificationPrefs({

            </Grid>                                                ...notificationPrefs,

        </Box>                                                importance_filter: e.target.value

    )                                            })}

}                                        >

                                            <MenuItem value="all">Toutes les actualités</MenuItem>

export default ProfilePage                                            <MenuItem value="medium">🟡 Moyen et urgent seulement</MenuItem>
                                            <MenuItem value="high">🔴 Urgent seulement</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Alert severity="info" sx={{ mt: 3 }}>
                                <Typography variant="body2">
                                    <strong>Configuration actuelle:</strong> Vous recevrez des notifications {" "}
                                    <strong>{getFrequencyLabel(notificationPrefs.frequency).toLowerCase()}</strong> pour les actualités{" "}
                                    {notificationPrefs.importance_filter !== "all" && 
                                        `d'importance ${notificationPrefs.importance_filter === "high" ? "urgente" : "moyenne et urgente"} `
                                    }
                                    par {notificationPrefs.email_notifications && notificationPrefs.push_notifications ? "email et push" :
                                         notificationPrefs.email_notifications ? "email uniquement" :
                                         notificationPrefs.push_notifications ? "push uniquement" : "aucun moyen"}
                                </Typography>
                            </Alert>

                            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveNotifications}
                                    disabled={loading}
                                >
                                    Sauvegarder préférences
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProfilePage