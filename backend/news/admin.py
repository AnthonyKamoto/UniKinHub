from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, Category, News, NewsView, NewsLike, NotificationPreference, Notification, Role, Universite, Faculte, Departement


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    """Administration des rôles"""
    list_display = ('nom', 'description', 'est_actif', 'created_at')
    list_filter = ('est_actif', 'created_at')
    search_fields = ('nom', 'description')


@admin.register(Universite)
class UniversiteAdmin(admin.ModelAdmin):
    """Administration des universités"""
    list_display = ('nom', 'code', 'ville', 'pays', 'est_active', 'created_at')
    list_filter = ('pays', 'est_active', 'created_at')
    search_fields = ('nom', 'code', 'ville', 'adresse')


@admin.register(Faculte)
class FaculteAdmin(admin.ModelAdmin):
    """Administration des facultés"""
    list_display = ('nom', 'code', 'universite', 'est_active', 'created_at')
    list_filter = ('universite', 'est_active', 'created_at')
    search_fields = ('nom', 'code', 'description', 'universite__nom')


@admin.register(Departement)
class DepartementAdmin(admin.ModelAdmin):
    """Administration des départements"""
    list_display = ('nom', 'code', 'faculte', 'get_universite', 'est_actif', 'created_at')
    list_filter = ('faculte__universite', 'est_actif', 'created_at')
    search_fields = ('nom', 'code', 'description', 'faculte__nom', 'faculte__universite__nom')
    
    def get_universite(self, obj):
        return obj.faculte.universite.nom
    get_universite.short_description = 'Université'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Administration des utilisateurs avec rôles étendus"""
    list_display = ('username', 'email', 'get_role_display', 'get_organisation', 'is_verified', 'is_active', 'date_joined')
    list_filter = ('role', 'universite', 'is_verified', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'universite__nom', 'university')
    
    def get_role_display(self, obj):
        return obj.role_display
    get_role_display.short_description = 'Rôle'
    
    def get_organisation(self, obj):
        if obj.universite:
            return f"{obj.universite.nom}"
        elif obj.university:
            return obj.university
        return "Non défini"
    get_organisation.short_description = 'Organisation'
    
    fieldsets = list(BaseUserAdmin.fieldsets) + [
        ('Système actuel', {
            'fields': ('role', 'university', 'program', 'phone_number', 'is_verified')
        }),
        ('Nouveau système organisationnel', {
            'fields': ('nouveau_role', 'universite', 'faculte', 'departement', 'promotion'),
            'classes': ('collapse',),
        }),
        ('Vérification avancée', {
            'fields': ('verifie_par', 'date_verification', 'motif_verification'),
            'classes': ('collapse',),
        }),
    ]
    
    add_fieldsets = list(BaseUserAdmin.add_fieldsets) + [
        ('Informations supplémentaires', {
            'fields': ('role', 'university', 'program', 'phone_number', 'email')
        }),
        ('Système organisationnel (optionnel)', {
            'fields': ('nouveau_role', 'universite', 'faculte', 'departement', 'promotion'),
            'classes': ('collapse',),
        }),
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Administration des catégories"""
    list_display = ('name', 'colored_name', 'description', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    
    def colored_name(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; border-radius: 3px;">{}</span>',
            obj.color,
            obj.name
        )
    colored_name.short_description = 'Nom avec couleur'


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    """Administration des actualités"""
    list_display = ('title', 'author', 'category', 'status', 'importance', 'publish_date', 'views_count')
    list_filter = ('status', 'importance', 'category', 'created_at', 'publish_date')
    search_fields = ('title', 'content', 'author__username')
    readonly_fields = ('views_count', 'likes_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'content', 'category', 'importance')
        }),
        ('Médias', {
            'fields': ('image', 'attachment'),
            'classes': ('collapse',)
        }),
        ('Ciblage', {
            'fields': ('target_universities', 'target_programs'),
            'classes': ('collapse',)
        }),
        ('Publication', {
            'fields': ('status', 'publish_date', 'expiry_date')
        }),
        ('Modération', {
            'fields': ('moderator', 'moderation_comment', 'moderated_at'),
            'classes': ('collapse',)
        }),
        ('Statistiques', {
            'fields': ('views_count', 'likes_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Création d'une nouvelle actualité
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(NewsView)
class NewsViewAdmin(admin.ModelAdmin):
    """Administration des vues d'actualités"""
    list_display = ('news', 'user', 'ip_address', 'viewed_at')
    list_filter = ('viewed_at',)
    search_fields = ('news__title', 'user__username', 'ip_address')
    readonly_fields = ('news', 'user', 'ip_address', 'viewed_at')


@admin.register(NewsLike)
class NewsLikeAdmin(admin.ModelAdmin):
    """Administration des likes d'actualités"""
    list_display = ('news', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('news__title', 'user__username')


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    """Administration des préférences de notification"""
    list_display = ('user', 'email_frequency', 'push_frequency', 'importance_threshold')
    list_filter = ('email_frequency', 'push_frequency', 'importance_threshold')
    search_fields = ('user__username', 'user__email')
    filter_horizontal = ('categories_subscribed',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Administration des notifications"""
    list_display = ('title', 'user', 'news', 'notification_type', 'status', 'sent_at')
    list_filter = ('notification_type', 'status', 'sent_at', 'created_at')
    search_fields = ('title', 'message', 'user__username', 'news__title')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'message', 'user', 'news')
        }),
        ('Configuration', {
            'fields': ('notification_type', 'status')
        }),
        ('Horodatage', {
            'fields': ('sent_at', 'read_at', 'created_at'),
            'classes': ('collapse',)
        }),
    )
