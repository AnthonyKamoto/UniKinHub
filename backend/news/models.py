from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator
from django.db import models
from django.utils import timezone


class Role(models.Model):
    """Modèle pour les rôles utilisateurs avec permissions"""

    ROLE_TYPES = [
        ("admin_global", "Administrateur Global"),
        ("moderateur", "Modérateur"),
        ("enseignant", "Enseignant"),
        ("publiant", "Publiant"),
        ("etudiant", "Étudiant"),
    ]

    nom = models.CharField(max_length=20, choices=ROLE_TYPES, unique=True)
    description = models.TextField(blank=True)
    permissions = models.JSONField(default=dict, blank=True)  # Permissions flexibles
    est_actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Rôle"
        verbose_name_plural = "Rôles"
        ordering = ["nom"]

    def __str__(self):
        return self.get_nom_display()


class Universite(models.Model):
    """Modèle pour les universités"""

    nom = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=10, unique=True)
    adresse = models.TextField(blank=True)
    ville = models.CharField(max_length=100, blank=True)
    pays = models.CharField(max_length=100, default="France")
    site_web = models.URLField(blank=True)
    est_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Université"
        verbose_name_plural = "Universités"
        ordering = ["nom"]

    def __str__(self):
        return f"{self.nom} ({self.code})"


class Faculte(models.Model):
    """Modèle pour les facultés"""

    nom = models.CharField(max_length=200)
    code = models.CharField(max_length=10)
    universite = models.ForeignKey(
        Universite, on_delete=models.CASCADE, related_name="facultes"
    )
    description = models.TextField(blank=True)
    est_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Faculté"
        verbose_name_plural = "Facultés"
        unique_together = ["nom", "universite"]
        ordering = ["universite", "nom"]

    def __str__(self):
        return f"{self.nom} - {self.universite.nom}"


class Departement(models.Model):
    """Modèle pour les départements"""

    nom = models.CharField(max_length=200)
    code = models.CharField(max_length=10)
    faculte = models.ForeignKey(
        Faculte, on_delete=models.CASCADE, related_name="departements"
    )
    description = models.TextField(blank=True)
    est_actif = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Département"
        verbose_name_plural = "Départements"
        unique_together = ["nom", "faculte"]
        ordering = ["faculte", "nom"]

    def __str__(self):
        return f"{self.nom} - {self.faculte.nom}"


class User(AbstractUser):
    """Modèle utilisateur étendu avec rôles et informations spécifiques"""

    # ANCIEN SYSTÈME - Gardé pour compatibilité (sera migré automatiquement)
    ROLE_CHOICES = [
        ("admin", "Administrateur"),
        ("moderator", "Modérateur"),
        ("publisher", "Publiant"),
        ("student", "Étudiant"),
    ]

    NOTIFICATION_FREQUENCY_CHOICES = [
        ("immediate", "Immédiat"),
        ("daily", "Quotidien"),
        ("weekly", "Hebdomadaire"),
        ("disabled", "Désactivé"),
    ]

    # SYSTÈME ACTUEL - Renommage pour transition
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    university = models.CharField(max_length=100, blank=True)
    program = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)

    # NOUVEAU SYSTÈME HIÉRARCHIQUE - À ajouter progressivement
    nouveau_role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="utilisateurs",
    )
    universite = models.ForeignKey(
        Universite,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="utilisateurs",
    )
    faculte = models.ForeignKey(
        Faculte,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="utilisateurs",
    )
    departement = models.ForeignKey(
        Departement,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="utilisateurs",
    )
    promotion = models.CharField(
        max_length=20, blank=True, help_text="Ex: L1, L2, M1, M2..."
    )

    # NOUVEAU: Informations de vérification
    verifie_par = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="utilisateurs_verifies",
    )
    date_verification = models.DateTimeField(null=True, blank=True)
    motif_verification = models.TextField(blank=True)

    # Préférences de notification
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    notification_frequency = models.CharField(
        max_length=20, choices=NOTIFICATION_FREQUENCY_CHOICES, default="immediate"
    )
    fcm_token = models.TextField(blank=True)  # Token FCM pour push notifications

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def role_display(self):
        """Retourne l'affichage du rôle (nouveau ou ancien système)"""
        if self.nouveau_role:
            return dict(Role.ROLE_TYPES).get(
                self.nouveau_role.nom, self.nouveau_role.nom
            )
        elif self.role:
            return dict(self.ROLE_CHOICES).get(self.role, self.role)
        return "Non défini"

    @property
    def organisation_complete(self):
        """Retourne l'organisation complète de l'utilisateur"""
        parts = []
        if self.universite:
            parts.append(self.universite.nom)
        if self.faculte:
            parts.append(self.faculte.nom)
        if self.departement:
            parts.append(self.departement.nom)
        if self.promotion:
            parts.append(f"Promotion {self.promotion}")
        return " - ".join(parts) if parts else (self.university or "Non défini")

    def __str__(self):
        return f"{self.username} ({self.role_display})"


class Category(models.Model):
    """Catégories d'actualités"""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#007bff")  # Couleur hexadécimale
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class News(models.Model):
    """Modèle principal pour les actualités"""

    STATUS_CHOICES = [
        ("draft", "Brouillon"),
        ("pending", "En attente de modération"),
        ("published", "Publié"),
        ("rejected", "Rejeté"),
        ("invalidated", "Invalidé"),
    ]

    IMPORTANCE_CHOICES = [
        ("low", "Faible"),
        ("medium", "Moyenne"),
        ("high", "Importante"),
        ("urgent", "Urgente"),
    ]

    # Programme ou formation destinataire (REQUIS selon spécifications)
    programme_ou_formation = models.CharField(
        max_length=200,
        blank=True,
        default="",
        verbose_name="Programme ou formation destinataire",
        help_text="Programme ou formation concerné par cette news",
    )

    # Contenu avant modération (REQUIS)
    draft_title = models.CharField(
        max_length=200, blank=True, default="", verbose_name="Titre avant modération"
    )
    draft_content = models.TextField(
        blank=True, default="", verbose_name="Contenu avant modération"
    )

    # Contenu après modération (modifiable par modérateur)
    final_title = models.CharField(
        max_length=200, blank=True, default="", verbose_name="Titre après modération"
    )
    final_content = models.TextField(
        blank=True, default="", verbose_name="Contenu après modération"
    )

    # Auteur (publiant)
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="news_created",
        verbose_name="Auteur (publiant)",
    )

    # Catégorie
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="news",
        verbose_name="Catégorie",
    )

    # Statut et importance
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="draft", verbose_name="Statut"
    )
    importance = models.CharField(
        max_length=20,
        choices=IMPORTANCE_CHOICES,
        default="medium",
        verbose_name="Importance",
    )

    # Dates selon spécifications
    written_at = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de rédaction"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Date de modération (REQUIS selon spécifications)
    moderated_at = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de modération"
    )

    # Dates souhaitées de publication (REQUIS)
    desired_publish_start = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de publication souhaitée"
    )
    desired_publish_end = models.DateTimeField(
        null=True, blank=True, verbose_name="Date de fin de publication souhaitée"
    )

    # Date effective de publication (REQUIS selon spécifications)
    publish_date = models.DateTimeField(
        null=True, blank=True, verbose_name="Date effective de publication"
    )
    expiry_date = models.DateTimeField(
        null=True, blank=True, verbose_name="Date d'expiration"
    )

    # Informations de modération - Accord du modérateur (REQUIS)
    moderator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="news_moderated",
        verbose_name="Modérateur",
    )
    moderator_approved = models.BooleanField(
        default=False, verbose_name="Accord du modérateur"
    )
    moderation_comment = models.TextField(
        blank=True, verbose_name="Commentaire de modération"
    )

    # Administrateur ayant invalidé la news (REQUIS selon spécifications)
    admin_invalidated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="news_invalidated",
        verbose_name="Administrateur ayant invalidé",
    )

    # Motivation de l'invalidation (REQUIS selon spécifications)
    admin_invalidation_reason = models.TextField(
        blank=True, verbose_name="Motivation de l'invalidation"
    )
    invalidated_at = models.DateTimeField(
        null=True, blank=True, verbose_name="Date d'invalidation"
    )

    # Métadonnées
    target_universities = models.JSONField(
        default=list, blank=True
    )  # Liste des universités ciblées
    target_programs = models.JSONField(
        default=list, blank=True
    )  # Liste des programmes ciblés
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)

    # Fichiers joints
    image = models.ImageField(upload_to="news/images/", null=True, blank=True)
    attachment = models.FileField(upload_to="news/attachments/", null=True, blank=True)

    def approve(self, moderator_user, title=None, content=None):
        """Marque la news comme approuvée par un modérateur et met à jour le contenu final."""
        self.moderator = moderator_user
        self.moderated_at = timezone.now()
        self.moderator_approved = True
        if title:
            self.final_title = title
        else:
            self.final_title = (
                self.draft_title if not self.final_title else self.final_title
            )
        if content:
            self.final_content = content
        else:
            self.final_content = (
                self.draft_content if not self.final_content else self.final_content
            )
        # Par défaut, si publish_date non défini et desired_publish_start défini, utiliser desired_publish_start
        if not self.publish_date and self.desired_publish_start:
            self.publish_date = self.desired_publish_start
        self.status = "published"
        self.save()

    def reject(self, moderator_user, reason=""):
        """Marque la news comme rejetée et écrit la raison."""
        self.moderator = moderator_user
        self.moderated_at = timezone.now()
        self.moderator_approved = False
        self.moderation_comment = reason
        self.status = "rejected"
        self.save()

    def invalidate(self, admin_user, reason=""):
        """Invalide une news publiée (admin uniquement)."""
        self.admin_invalidated_by = admin_user
        self.admin_invalidation_reason = reason
        self.invalidated_at = timezone.now()
        self.status = "invalidated"
        self.save()

    class Meta:
        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "publish_date"]),
            models.Index(fields=["category", "status"]),
            models.Index(fields=["importance", "publish_date"]),
        ]

    def __str__(self):
        # Backwards-compatible display: use final_title when available
        display_title = getattr(self, "final_title", None) or getattr(
            self, "draft_title", ""
        )
        return f"{display_title} ({self.get_status_display()})"

    @property
    def title(self):
        """Compatibilité : nommage 'title' pour templates/ancien code"""
        return getattr(self, "final_title", None) or getattr(self, "draft_title", "")

    @property
    def content(self):
        """Compatibilité : nommage 'content' pour templates/ancien code"""
        return getattr(self, "final_content", None) or getattr(
            self, "draft_content", ""
        )


class NewsView(models.Model):
    """Suivi des vues des actualités"""

    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name="views")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["news", "user", "ip_address"]
        indexes = [
            models.Index(fields=["news", "viewed_at"]),
        ]


class NewsLike(models.Model):
    """Likes des actualités"""

    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["news", "user"]


class NotificationPreference(models.Model):
    """Préférences de notification des utilisateurs"""

    FREQUENCY_CHOICES = [
        ("immediate", "Immédiate"),
        ("daily", "Quotidienne"),
        ("weekly", "Hebdomadaire"),
        ("never", "Jamais"),
    ]

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="notification_preference"
    )
    email_frequency = models.CharField(
        max_length=20, choices=FREQUENCY_CHOICES, default="daily"
    )
    push_frequency = models.CharField(
        max_length=20, choices=FREQUENCY_CHOICES, default="immediate"
    )
    categories_subscribed = models.ManyToManyField(Category, blank=True)
    importance_threshold = models.CharField(
        max_length=20, choices=News.IMPORTANCE_CHOICES, default="medium"
    )

    def __str__(self):
        return f"Préférences de {self.user.username}"


class Notification(models.Model):
    """Notifications envoyées aux utilisateurs"""

    TYPE_CHOICES = [
        ("email", "Email"),
        ("push", "Push"),
        ("in_app", "In-App"),
    ]

    STATUS_CHOICES = [
        ("pending", "En attente"),
        ("sent", "Envoyé"),
        ("failed", "Échec"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    news = models.ForeignKey(
        News, on_delete=models.CASCADE, related_name="notifications"
    )
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    title = models.CharField(max_length=200)
    message = models.TextField()
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["news", "notification_type"]),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username}"


class ModerationLog(models.Model):
    """Historique des actions de modération"""

    ACTION_CHOICES = [
        ("created", "Créé"),
        ("submitted", "Soumis pour modération"),
        ("approved", "Approuvé"),
        ("rejected", "Rejeté"),
        ("edited", "Modifié"),
        ("deleted", "Supprimé"),
    ]

    news = models.ForeignKey(
        News, on_delete=models.CASCADE, related_name="moderation_logs"
    )
    moderator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="moderation_actions"
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    reason = models.TextField(
        blank=True, help_text="Raison de l'action (optionnel pour approbation)"
    )
    previous_content = models.TextField(
        blank=True, help_text="Contenu avant modification"
    )
    new_content = models.TextField(
        blank=True, help_text="Nouveau contenu après modification"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["news", "action"]),
            models.Index(fields=["moderator", "timestamp"]),
        ]

    def __str__(self):
        return f"{self.get_action_display()} - {self.news.title} par {self.moderator.username}"


class Comment(models.Model):
    """Commentaires sur les actualités"""

    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["news", "is_approved"]),
        ]

    def __str__(self):
        return f"Commentaire de {self.author.username} sur {self.news.title}"
