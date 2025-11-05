import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Badge,
  Fab,
  Tooltip,
  Paper,
  InputAdornment,
  Switch,
  FormControlLabel,
  CardActions,
  CardActionArea,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { newsAPI } from "../services/api";
import type { News } from "../types";

const HomePage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImportance, setSelectedImportance] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [darkMode, setDarkMode] = useState(false);
  const [likedNews, setLikedNews] = useState<Set<number>>(new Set());
  const [viewCounts, setViewCounts] = useState<Record<number, number>>({});

  // Modal pour afficher les détails d'une actualité
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Récupération des actualités
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getNews({
          status: "published",
        });
        const newsData = response.results || [];
        setNews(newsData);
        setFilteredNews(newsData);
        setAllNews(newsData);

        // Initialiser les likes avec les données du serveur
        const initialLikes = new Set<number>();
        newsData.forEach((item) => {
          if (item.is_liked) {
            initialLikes.add(item.id);
          }
        });
        setLikedNews(initialLikes);
      } catch (err) {
        console.error("Erreur lors du chargement des actualités:", err);
        setError("Erreur lors du chargement des actualités");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = news.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category?.name === selectedCategory;
      const matchesImportance =
        selectedImportance === "all" || item.importance === selectedImportance;

      return matchesSearch && matchesCategory && matchesImportance;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        case "importance":
          const importanceOrder = { high: 3, medium: 2, low: 1 };
          return (
            (importanceOrder[b.importance as keyof typeof importanceOrder] ||
              0) -
            (importanceOrder[a.importance as keyof typeof importanceOrder] || 0)
          );
        case "popular":
          return (viewCounts[b.id] || 0) - (viewCounts[a.id] || 0);
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
  }, [
    news,
    searchTerm,
    selectedCategory,
    selectedImportance,
    sortBy,
    viewCounts,
  ]);

  // Fonctions utilitaires
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case "high":
        return "Urgent";
      case "medium":
        return "Moyen";
      case "low":
        return "Faible";
      default:
        return "Non défini";
    }
  };

  const handleLike = async (newsId: number) => {
    try {
      const isCurrentlyLiked = likedNews.has(newsId);

      if (isCurrentlyLiked) {
        // Retirer le like
        await newsAPI.removeLike(newsId);
        setLikedNews((prev) => {
          const newSet = new Set(prev);
          newSet.delete(newsId);
          return newSet;
        });

        // Mettre à jour le compteur local
        setAllNews((prevNews) =>
          prevNews.map((item) =>
            item.id === newsId
              ? { ...item, likes_count: item.likes_count - 1 }
              : item,
          ),
        );
      } else {
        // Ajouter le like
        await newsAPI.toggleLike(newsId);
        setLikedNews((prev) => {
          const newSet = new Set(prev);
          newSet.add(newsId);
          return newSet;
        });

        // Mettre à jour le compteur local
        setAllNews((prevNews) =>
          prevNews.map((item) =>
            item.id === newsId
              ? { ...item, likes_count: item.likes_count + 1 }
              : item,
          ),
        );
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const handleView = (newsId: number) => {
    setViewCounts((prev) => ({
      ...prev,
      [newsId]: (prev[newsId] || 0) + 1,
    }));
    // Trouver l'actualité et ouvrir la modal
    const newsItem = filteredNews.find((item) => item.id === newsId);
    if (newsItem) {
      setSelectedNews(newsItem);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedNews(null), 200); // Attendre la fin de l'animation
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des actualités...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: 2,
        backgroundColor: darkMode ? "#121212" : "#fafafa",
        minHeight: "100vh",
      }}
    >
      {/* En-tête avec mode sombre */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              📰 UniKinHub
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {filteredNews.length} actualité
              {filteredNews.length > 1 ? "s" : ""} trouvée
              {filteredNews.length > 1 ? "s" : ""}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                icon={<LightModeIcon />}
                checkedIcon={<DarkModeIcon />}
              />
            }
            label="Mode sombre"
          />
        </Box>

        {/* Barre de recherche et filtres */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher des actualités..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                label="Catégorie"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Toutes</MenuItem>
                <MenuItem value="Académique">Académique</MenuItem>
                <MenuItem value="Événements">Événements</MenuItem>
                <MenuItem value="Administrative">Administrative</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Importance</InputLabel>
              <Select
                value={selectedImportance}
                label="Importance"
                onChange={(e) => setSelectedImportance(e.target.value)}
              >
                <MenuItem value="all">Toutes</MenuItem>
                <MenuItem value="high">🔴 Urgent</MenuItem>
                <MenuItem value="medium">🟡 Moyen</MenuItem>
                <MenuItem value="low">🟢 Faible</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                label="Trier par"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date">📅 Date</MenuItem>
                <MenuItem value="importance">⚡ Importance</MenuItem>
                <MenuItem value="popular">👀 Popularité</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Tooltip title="Actualiser">
              <IconButton
                color="primary"
                sx={{
                  p: 1.5,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
                onClick={() => window.location.reload()}
              >
                <TrendingIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Contenu principal */}
      {filteredNews.length === 0 && !loading ? (
        <Paper
          elevation={1}
          sx={{ p: 4, textAlign: "center", borderRadius: 3 }}
        >
          <SearchIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune actualité trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Essayez de modifier vos filtres ou votre recherche
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredNews.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                    cursor: "pointer",
                  },
                }}
              >
                <CardActionArea onClick={() => handleView(item.id)}>
                  {item.image && (
                    <Box
                      component="img"
                      src={`http://127.0.0.1:8000${item.image}`}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    {/* En-tête de la card */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Chip
                        size="small"
                        label={getImportanceLabel(item.importance || "low")}
                        sx={{
                          backgroundColor: getImportanceColor(
                            item.importance || "low",
                          ),
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <ViewIcon
                          sx={{
                            fontSize: 16,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {viewCounts[item.id] || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ lineHeight: 1.6 }}
                    >
                      {item.content?.substring(0, 120)}...
                    </Typography>

                    {/* Métadonnées */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: 12,
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {item.author?.first_name} {item.author?.last_name}
                      </Typography>
                      <Chip
                        size="small"
                        label={item.category?.name}
                        variant="outlined"
                        sx={{ ml: "auto" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 2,
                      }}
                    >
                      <ScheduleIcon
                        sx={{
                          fontSize: 14,
                          color: "text.secondary",
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.created_at || "").toLocaleDateString(
                          "fr-FR",
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>

                <CardActions
                  sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2,
                  }}
                >
                  <Box>
                    <Tooltip
                      title={
                        likedNews.has(item.id) ? "Ne plus aimer" : "J'aime"
                      }
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item.id);
                        }}
                        color={likedNews.has(item.id) ? "error" : "default"}
                      >
                        {likedNews.has(item.id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Partager">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(item.id);
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Lire plus
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Bouton flottant de filtres */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => {
          setSearchTerm("");
          setSelectedCategory("all");
          setSelectedImportance("all");
        }}
      >
        <FilterIcon />
      </Fab>

      {/* Modal de détails de l'actualité */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
        }}
      >
        {selectedNews && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {selectedNews.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    size="small"
                    label={getImportanceLabel(selectedNews.importance || "low")}
                    color={
                      selectedNews.importance === "urgent"
                        ? "error"
                        : selectedNews.importance === "high"
                          ? "warning"
                          : "default"
                    }
                  />
                  <Chip
                    size="small"
                    label={selectedNews.category?.name || "Non catégorisé"}
                    variant="outlined"
                  />
                </Box>
              </Box>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  color: "text.secondary",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3 }}>
              {/* Métadonnées */}
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {selectedNews.author?.username || "Anonyme"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(selectedNews.created_at || "").toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ViewIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {viewCounts[selectedNews.id] || 0} vues
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Contenu */}
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  color: "text.primary",
                }}
              >
                {selectedNews.content}
              </Typography>
            </DialogContent>

            <Divider />

            <DialogActions
              sx={{
                justifyContent: "space-between",
                px: 3,
                py: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip
                  title={
                    likedNews.has(selectedNews.id) ? "Ne plus aimer" : "J'aime"
                  }
                >
                  <IconButton
                    size="small"
                    onClick={() => handleLike(selectedNews.id)}
                    color={likedNews.has(selectedNews.id) ? "error" : "default"}
                  >
                    {likedNews.has(selectedNews.id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Partager">
                  <IconButton size="small" color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Button
                onClick={handleCloseModal}
                variant="contained"
                sx={{ borderRadius: 2 }}
              >
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default HomePage;
