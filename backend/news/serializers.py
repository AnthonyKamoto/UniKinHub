from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (User, Category, News, NewsView, NewsLike, NotificationPreference, 
                    Notification, Role, Universite, Faculte, Departement)


class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'role', 'university', 'program', 'phone_number', 
                 'is_verified', 'date_joined')
        read_only_fields = ('id', 'date_joined', 'is_verified')


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'inscription des utilisateurs"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 
                 'first_name', 'last_name', 'role', 'university', 'program', 'phone_number')
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CategorySerializer(serializers.ModelSerializer):
    """Sérialiseur pour les catégories"""
    news_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'description', 'color', 'is_active', 'news_count')
    
    def get_news_count(self, obj):
        return obj.news.filter(status='published').count()


class NewsSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les actualités"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    is_liked = serializers.SerializerMethodField()
    time_since = serializers.SerializerMethodField()
    
    class Meta:
        model = News
        fields = ('id', 'title', 'content', 'author', 'author_name', 
                 'category', 'category_name', 'category_color', 'status', 'importance',
                 'created_at', 'updated_at', 'publish_date', 'expiry_date',
                 'target_universities', 'target_programs', 'views_count', 'likes_count',
                 'image', 'attachment', 'is_liked', 'time_since')
        read_only_fields = ('author', 'views_count', 'likes_count', 'created_at', 'updated_at')
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return NewsLike.objects.filter(news=obj, user=request.user).exists()
        return False
    
    def get_time_since(self, obj):
        from django.utils import timezone
        from django.utils.timesince import timesince
        return timesince(obj.created_at, timezone.now())


class NewsCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'actualités"""
    
    class Meta:
        model = News
        fields = ('title', 'content', 'category', 'importance', 
                 'target_universities', 'target_programs', 'publish_date', 
                 'expiry_date', 'image', 'attachment')
    
    def create(self, validated_data):
        from django.utils import timezone
        
        request = self.context.get('request')
        user = request.user
        validated_data['author'] = user
        
        # Déterminer le statut initial selon les permissions RBAC
        if hasattr(user, 'nouveau_role') and user.nouveau_role:
            role_permissions = user.nouveau_role.permissions or {}
            
            # Administrateurs et modérateurs peuvent publier directement
            if role_permissions.get('can_manage_all') or role_permissions.get('can_moderate_news'):
                validated_data['status'] = 'published'
                validated_data['publish_date'] = timezone.now()
            # Enseignants et publiants vérifiés : soumission en attente de modération
            elif role_permissions.get('can_create_content'):
                if role_permissions.get('requires_moderation', True):
                    validated_data['status'] = 'pending'
                else:
                    validated_data['status'] = 'published'
                    validated_data['publish_date'] = timezone.now()
            else:
                # Étudiants et autres : brouillon
                validated_data['status'] = 'draft'
        else:
            # Fallback sur l'ancien système de rôles
            if user.is_staff or user.role in ['admin', 'moderator']:
                validated_data['status'] = 'published'
                validated_data['publish_date'] = timezone.now()
            elif user.role in ['publisher']:
                validated_data['status'] = 'pending'
            else:
                validated_data['status'] = 'draft'
        
        return super().create(validated_data)


class NewsDetailSerializer(NewsSerializer):
    """Sérialiseur détaillé pour une actualité"""
    moderator_name = serializers.CharField(source='moderator.get_full_name', read_only=True)
    
    class Meta(NewsSerializer.Meta):
        fields = NewsSerializer.Meta.fields + ('moderation_comment', 'moderator_name', 'moderated_at')


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les préférences de notification"""
    categories_subscribed = CategorySerializer(many=True, read_only=True)
    categories_subscribed_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Category.objects.all(), 
        source='categories_subscribed'
    )
    
    class Meta:
        model = NotificationPreference
        fields = ('email_frequency', 'push_frequency', 'categories_subscribed', 
                 'categories_subscribed_ids', 'importance_threshold')


class NotificationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les notifications"""
    news_title = serializers.CharField(source='news.title', read_only=True)
    time_since = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ('id', 'title', 'message', 'news', 'news_title', 
                 'notification_type', 'status', 'sent_at', 'read_at', 
                 'created_at', 'time_since')
        read_only_fields = ('sent_at', 'created_at')
    
    def get_time_since(self, obj):
        from django.utils import timezone
        from django.utils.timesince import timesince
        return timesince(obj.created_at, timezone.now())


# ===== NOUVEAUX SERIALIZERS RBAC =====

class RoleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les rôles"""
    utilisateurs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Role
        fields = ('id', 'nom', 'description', 'permissions', 'est_actif', 
                 'created_at', 'utilisateurs_count')
        read_only_fields = ('created_at',)
    
    def get_utilisateurs_count(self, obj):
        return obj.utilisateurs.count()


class UniversiteSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les universités"""
    facultes_count = serializers.SerializerMethodField()
    utilisateurs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Universite
        fields = ('id', 'nom', 'code', 'adresse', 'ville', 'pays', 'site_web',
                 'est_active', 'created_at', 'updated_at', 'facultes_count', 'utilisateurs_count')
        read_only_fields = ('created_at', 'updated_at')
    
    def get_facultes_count(self, obj):
        return obj.facultes.filter(est_active=True).count()
    
    def get_utilisateurs_count(self, obj):
        return obj.utilisateurs.count()


class FaculteSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les facultés"""
    universite_nom = serializers.CharField(source='universite.nom', read_only=True)
    departements_count = serializers.SerializerMethodField()
    utilisateurs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Faculte
        fields = ('id', 'nom', 'code', 'universite', 'universite_nom', 'description',
                 'est_active', 'created_at', 'updated_at', 'departements_count', 'utilisateurs_count')
        read_only_fields = ('created_at', 'updated_at')
    
    def get_departements_count(self, obj):
        return obj.departements.filter(est_actif=True).count()
    
    def get_utilisateurs_count(self, obj):
        return obj.utilisateurs.count()


class DepartementSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les départements"""
    faculte_nom = serializers.CharField(source='faculte.nom', read_only=True)
    universite_nom = serializers.CharField(source='faculte.universite.nom', read_only=True)
    utilisateurs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Departement
        fields = ('id', 'nom', 'code', 'faculte', 'faculte_nom', 'universite_nom', 
                 'description', 'est_actif', 'created_at', 'updated_at', 'utilisateurs_count')
        read_only_fields = ('created_at', 'updated_at')
    
    def get_utilisateurs_count(self, obj):
        return obj.utilisateurs.count()


class UserExtendedSerializer(serializers.ModelSerializer):
    """Sérialiseur étendu pour les utilisateurs avec le nouveau système RBAC"""
    # Champs pour compatibilité (ancien système)
    role_display = serializers.CharField(read_only=True)
    
    # Champs pour le nouveau système
    nouveau_role_detail = RoleSerializer(source='nouveau_role', read_only=True)
    universite_detail = UniversiteSerializer(source='universite', read_only=True)
    faculte_detail = FaculteSerializer(source='faculte', read_only=True) 
    departement_detail = DepartementSerializer(source='departement', read_only=True)
    
    # Organisation complète
    organisation_complete = serializers.CharField(read_only=True)
    
    # Informations de vérification
    verifie_par_nom = serializers.CharField(source='verifie_par.get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 # Ancien système
                 'role', 'university', 'role_display',
                 # Nouveau système
                 'nouveau_role', 'nouveau_role_detail', 'universite', 'universite_detail',
                 'faculte', 'faculte_detail', 'departement', 'departement_detail', 'promotion',
                 # Informations communes
                 'program', 'phone_number', 'is_verified', 'date_joined',
                 'organisation_complete', 'verifie_par', 'verifie_par_nom', 'date_verification')
        read_only_fields = ('id', 'date_joined', 'role_display', 'organisation_complete')


class UserVerificationSerializer(serializers.Serializer):
    """Sérialiseur pour la vérification d'utilisateurs"""
    user_id = serializers.IntegerField()
    approve = serializers.BooleanField()
    motif = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    def validate_user_id(self, value):
        try:
            user = User.objects.get(id=value)
            if user.is_verified:
                raise serializers.ValidationError("Cet utilisateur est déjà vérifié.")
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Utilisateur introuvable.")


class UserRegistrationExtendedSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'inscription avec le nouveau système RBAC"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm',
                 'nouveau_role', 'universite', 'faculte', 'departement', 'promotion', 
                 'program', 'phone_number')
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        
        # Validation de cohérence organisationnelle
        if data.get('faculte') and data.get('universite'):
            if data['faculte'].universite != data['universite']:
                raise serializers.ValidationError("La faculté ne correspond pas à l'université.")
        
        if data.get('departement') and data.get('faculte'):
            if data['departement'].faculte != data['faculte']:
                raise serializers.ValidationError("Le département ne correspond pas à la faculté.")
        
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        # Auto-vérifier les nouveaux utilisateurs (pour faciliter le développement)
        # TODO: En production, envoyer un email de vérification et attendre validation admin
        user.is_verified = True
        user.save()
        
        return user