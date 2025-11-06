import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Paper,
  Chip,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Send as SendIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { newsAPI, categoryAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

interface Category {
  id: number
  name: string
  description?: string
}

const CreateNewsPage = () => {
  const { user, isInitialized } = useAuth()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = React.useState(0)
  const [isPreview, setIsPreview] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    category: '',
    summary: '',
    importance: 'medium',
    program: '',
    tags: '',
    scheduledDate: '',
    draft: false,
  })
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string>('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])

  const steps = [
    'Informations de base',
    'Contenu détaillé',
    'Options avancées',
    'Aperçu & Publication',
  ]

  // Charger les catégories depuis l'API
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getCategories()
        setCategories(response.results || response || [])
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
        // Catégories par défaut en cas d'erreur
        setCategories([
          { id: 1, name: 'Académique' },
          { id: 2, name: 'Événements' },
          { id: 3, name: 'Infrastructure' },
        ])
      }
    }
    loadCategories()
  }, [])

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Informations de base
        if (!formData.title.trim()) newErrors.title = 'Le titre est requis'
        if (!formData.category) newErrors.category = 'La catégorie est requise'
        if (!formData.importance)
          newErrors.importance = "L'importance est requise"
        break
      case 1: // Contenu détaillé
        if (!formData.content.trim())
          newErrors.content = 'Le contenu est requis'
        if (!formData.summary.trim()) newErrors.summary = 'Le résumé est requis'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = async (isDraft = false) => {
    setLoading(true)

    try {
      // Préparer FormData pour l'upload d'image avec le système de modération
      const formDataToSend = new FormData()
      // Utiliser draft_title et draft_content pour le système de modération
      formDataToSend.append('draft_title', formData.title)
      formDataToSend.append('draft_content', formData.content)
      // Convertir category en nombre (ID)
      formDataToSend.append('category', String(parseInt(formData.category)))
      formDataToSend.append('importance', formData.importance || 'medium')
      formDataToSend.append('programme_ou_formation', formData.program || '')
      formDataToSend.append(
        'target_universities',
        JSON.stringify(formData.program ? [formData.program] : [])
      )
      formDataToSend.append('target_programs', JSON.stringify([]))
      formDataToSend.append('desired_publish_start', new Date().toISOString())

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      // Créer l'actualité via l'API ViewSet
      await newsAPI.createNews(formDataToSend)

      alert(
        isDraft
          ? 'Brouillon sauvegardé avec succès !'
          : 'Actualité créée avec succès !'
      )

      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        summary: '',
        importance: 'medium',
        program: '',
        tags: '',
        scheduledDate: '',
        draft: false,
      })
      setImageFile(null)
      setImagePreview('')
      setActiveStep(0)

      // Rediriger vers la page d'accueil
      navigate('/news')
    } catch (error: any) {
      console.error('=== ERREUR COMPLÈTE ===', error)
      console.error("=== RÉPONSE D'ERREUR ===", error.response?.data)
      console.error('=== STATUS ===', error.response?.status)

      let errorMessage = 'Erreur inconnue'
      if (error.response?.data) {
        // Si c'est un objet d'erreurs de validation
        if (typeof error.response.data === 'object') {
          errorMessage = JSON.stringify(error.response.data, null, 2)
        } else {
          errorMessage = error.response.data.detail || error.response.data
        }
      } else {
        errorMessage = error.message
      }

      alert("Erreur lors de la création de l'actualité:\n" + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5 MB")
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const handleChange = (field: string) => (e: any) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      })
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

  if (!isInitialized) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Chargement...</Typography>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Connexion requise
        </Typography>
        <Typography>
          Vous devez être connecté pour créer une actualité.
        </Typography>
      </Box>
    )
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'actualité"
                value={formData.title}
                onChange={handleChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                required
                placeholder="Ex: Nouvelle bibliothèque numérique disponible"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={formData.category}
                  label="Catégorie"
                  onChange={handleChange('category')}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.importance}>
                <InputLabel>Niveau d'importance</InputLabel>
                <Select
                  value={formData.importance}
                  label="Niveau d'importance"
                  onChange={handleChange('importance')}
                >
                  <MenuItem value="low">
                    🟢 Faible - Information générale
                  </MenuItem>
                  <MenuItem value="medium">
                    🟡 Moyen - Important à savoir
                  </MenuItem>
                  <MenuItem value="high">🔴 Urgent - Action requise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Programme/Public cible"
                value={formData.program}
                onChange={handleChange('program')}
                placeholder="Ex: Tous étudiants, L1 Informatique, Master Sciences..."
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Résumé (affiché sur la page d'accueil)"
                value={formData.summary}
                onChange={handleChange('summary')}
                error={!!errors.summary}
                helperText={errors.summary || 'Maximum 200 caractères'}
                multiline
                rows={3}
                required
                inputProps={{ maxLength: 200 }}
              />
              <Typography variant="caption" color="text.secondary">
                {formData.summary.length}/200 caractères
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenu détaillé de l'actualité"
                value={formData.content}
                onChange={handleChange('content')}
                error={!!errors.content}
                helperText={errors.content}
                required
                multiline
                rows={10}
                placeholder="Rédigez ici le contenu complet de votre actualité..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (séparés par des virgules)"
                value={formData.tags}
                onChange={handleChange('tags')}
                placeholder="Ex: bibliothèque, numérique, ressources, gratuit"
                helperText="Ajoutez des mots-clés pour faciliter la recherche"
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Image de l'actualité (optionnelle)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {imageFile ? "Changer l'image" : 'Ajouter une image'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box sx={{ position: 'relative', mt: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      style={{
                        width: '100%',
                        maxHeight: 300,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'error.dark',
                        },
                      }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                )}
                <Typography variant="caption" color="textSecondary">
                  Formats acceptés: JPG, PNG, GIF (max 5 MB)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.draft}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        draft: e.target.checked,
                      })
                    }
                  />
                }
                label="Enregistrer comme brouillon"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Les brouillons ne sont pas publiés et peuvent être modifiés plus
                tard
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Programmer la publication"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={handleChange('scheduledDate')}
                InputLabelProps={{ shrink: true }}
                helperText="Laisser vide pour publier immédiatement"
              />
            </Grid>
          </Grid>
        )
      case 3:
        return (
          <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <PreviewIcon color="primary" />
              Aperçu de l'actualité
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 3,
                backgroundColor: 'white',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Chip
                  label={
                    formData.importance === 'high'
                      ? '🔴 Urgent'
                      : formData.importance === 'medium'
                        ? '🟡 Moyen'
                        : '🟢 Faible'
                  }
                  sx={{
                    backgroundColor: getImportanceColor(formData.importance),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
                <Chip label={formData.category} variant="outlined" />
              </Box>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                {formData.title || "Titre de l'actualité"}
              </Typography>

              {imagePreview && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={imagePreview}
                    alt={formData.title}
                    style={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}

              <Typography variant="body1" color="text.secondary" paragraph>
                {formData.summary || "Résumé de l'actualité"}
              </Typography>

              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
              >
                {formData.content || "Contenu détaillé de l'actualité"}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.first_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.program || 'Public général'} •{' '}
                    {new Date().toLocaleDateString('fr-FR')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {formData.tags && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  {formData.tags.split(',').map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag.trim()}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {formData.scheduledDate && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ScheduleIcon />
                  Publication programmée pour le{' '}
                  {new Date(formData.scheduledDate).toLocaleString('fr-FR')}
                </Box>
              </Alert>
            )}

            {formData.draft && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Cette actualité sera enregistrée comme brouillon et ne sera pas
                publiée
              </Alert>
            )}
          </Paper>
        )
      default:
        return null
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          ✍️ Créer une nouvelle actualité
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && <LinearProgress sx={{ mb: 3 }} />}

        <Box component="div">
          {renderStepContent(activeStep)}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              pt: 3,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Button
              type="button"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<CancelIcon />}
            >
              Précédent
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 ? (
                <>
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    onClick={() => handleSubmit(true)}
                  >
                    Sauvegarder brouillon
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    disabled={loading}
                    startIcon={<SendIcon />}
                    sx={{ minWidth: 150 }}
                    onClick={() => handleSubmit(false)}
                  >
                    {loading ? 'Publication...' : 'Publier'}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<CheckIcon />}
                >
                  Suivant
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default CreateNewsPage
