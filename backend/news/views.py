from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.db.models import Q, Count, F
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token

from .models import User, Category, News, NewsView, NewsLike, NotificationPreference, Notification
from .serializers import (
    UserSerializer, UserRegistrationSerializer, CategorySerializer,
    NewsSerializer, NewsCreateSerializer, NewsDetailSerializer,
    NotificationPreferenceSerializer, NotificationSerializer,
    UserExtendedSerializer
)
from .notification_service import NotificationService


class StandardResultsPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserExtendedSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class NewsListView(generics.ListAPIView):
    serializer_class = NewsSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsPagination
    
    def get_queryset(self):
        queryset = News.objects.filter(
            status='published',
            publish_date__lte=timezone.now()
        ).select_related('author', 'category').order_by('-publish_date')
        
        params = self.request.query_params
        
        if category_id := params.get('category'):
            queryset = queryset.filter(category_id=category_id)
        
        if importance := params.get('importance'):
            queryset = queryset.filter(importance=importance)
        
        if university := params.get('university'):
            queryset = queryset.filter(
                Q(target_universities__contains=[university]) | Q(target_universities=[])
            )
        
        if search := params.get('search'):
            queryset = queryset.filter(Q(title__icontains=search) | Q(content__icontains=search))
        
        return queryset


class NewsDetailView(generics.RetrieveAPIView):
    """API pour consulter une actualité en détail"""
    queryset = News.objects.filter(status='published')
    serializer_class = NewsDetailSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Enregistrer la vue
        ip_address = self.get_client_ip(request)
        NewsView.objects.get_or_create(
            news=instance,
            user=request.user if request.user.is_authenticated else None,
            ip_address=ip_address
        )
        
        # Mettre à jour le compteur de vues
        News.objects.filter(id=instance.id).update(views_count=F('views_count') + 1)
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class NewsCreateView(generics.CreateAPIView):
    """API pour créer une actualité"""
    serializer_class = NewsCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        news = serializer.save(author=self.request.user)
        
        # Envoyer une confirmation de soumission par email
        NotificationService.send_submission_confirmation(news)


class MyNewsListView(generics.ListAPIView):
    """API pour lister les actualités de l'utilisateur connecté"""
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    
    def get_queryset(self):
        return News.objects.filter(author=self.request.user).order_by('-created_at')


# ============== Vues de modération ==============

class PendingNewsListView(generics.ListAPIView):
    """API pour lister les actualités en attente de modération"""
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    
    def get_queryset(self):
        # Vérifier les permissions RBAC
        user = self.request.user
        if hasattr(user, 'nouveau_role') and user.nouveau_role:
            role_permissions = user.nouveau_role.permissions or {}
            if not (role_permissions.get('can_manage_all') or role_permissions.get('can_moderate_news')):
                return News.objects.none()
        elif not (user.is_staff or user.role in ['admin', 'moderator']):
            return News.objects.none()
        
        return News.objects.filter(status='pending').select_related('author', 'category').order_by('-created_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def moderate_news(request, news_id):
    """API pour modérer une actualité (approuver/rejeter)"""
    from django.utils import timezone
    
    # Vérifier les permissions
    user = request.user
    if hasattr(user, 'nouveau_role') and user.nouveau_role:
        role_permissions = user.nouveau_role.permissions or {}
        if not (role_permissions.get('can_manage_all') or role_permissions.get('can_moderate_news')):
            return Response({'error': 'Permissions insuffisantes'}, status=status.HTTP_403_FORBIDDEN)
    elif not (user.is_staff or user.role in ['admin', 'moderator']):
        return Response({'error': 'Permissions insuffisantes'}, status=status.HTTP_403_FORBIDDEN)
    
    news = get_object_or_404(News, id=news_id, status='pending')
    action = request.data.get('action')  # 'approve' or 'reject'
    comment = request.data.get('comment', '')
    
    if action == 'approve':
        news.status = 'published'
        news.publish_date = timezone.now()
        news.moderator = user
        news.moderation_comment = comment
        news.moderated_at = timezone.now()
        news.save()
        
        # Envoyer notification d'approbation
        NotificationService.send_moderation_notification(news, 'approved')
        
        return Response({'message': 'Actualité approuvée', 'status': 'published'})
    
    elif action == 'reject':
        news.status = 'rejected'
        news.moderator = user
        news.moderation_comment = comment
        news.moderated_at = timezone.now()
        news.save()
        
        # Envoyer notification de rejet
        NotificationService.send_moderation_notification(news, 'rejected')
        
        return Response({'message': 'Actualité rejetée', 'status': 'rejected'})
    
    else:
        return Response({'error': 'Action invalide'}, status=status.HTTP_400_BAD_REQUEST)


# ============== Vues des interactions ==============

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_like(request, news_id):
    """API pour liker/disliker une actualité"""
    news = get_object_or_404(News, id=news_id, status='published')
    
    if request.method == 'POST':
        like, created = NewsLike.objects.get_or_create(news=news, user=request.user)
        if created:
            News.objects.filter(id=news_id).update(likes_count=F('likes_count') + 1)
        # Recharger pour obtenir le compteur mis à jour
        news.refresh_from_db()
        return Response({
            'message': 'Actualité likée' if created else 'Déjà liké',
            'liked': True,
            'likes_count': news.likes_count
        })
    
    elif request.method == 'DELETE':
        deleted, _ = NewsLike.objects.filter(news=news, user=request.user).delete()
        if deleted:
            News.objects.filter(id=news_id).update(likes_count=F('likes_count') - 1)
        # Recharger pour obtenir le compteur mis à jour
        news.refresh_from_db()
        return Response({
            'message': 'Like retiré' if deleted else 'Pas encore liké',
            'liked': False,
            'likes_count': news.likes_count
        })


# ============== Vues des préférences de notification ==============

class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    """API pour consulter et modifier les préférences de notification"""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        preference, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return preference


# ============== Vues des notifications ==============

class NotificationListView(generics.ListAPIView):
    """API pour lister les notifications de l'utilisateur"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    
    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, notification_id):
    """API pour marquer une notification comme lue"""
    notification = get_object_or_404(
        Notification, 
        id=notification_id, 
        user=request.user
    )
    
    if not notification.read_at:
        notification.read_at = timezone.now()
        notification.save()
    
    return Response({'message': 'Notification marquée comme lue'})


# ============== Vues de statistiques ==============

class DashboardStatsView(APIView):
    """API pour les statistiques du tableau de bord"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Statistiques générales
        total_news = News.objects.filter(status='published').count()
        unread_notifications = Notification.objects.filter(
            user=user, read_at__isnull=True
        ).count()
        
        # Actualités récentes (7 derniers jours)
        from datetime import timedelta
        week_ago = timezone.now() - timedelta(days=7)
        recent_news = News.objects.filter(
            status='published',
            publish_date__gte=week_ago
        ).count()
        
        # Catégories avec le plus d'actualités
        popular_categories = Category.objects.annotate(
            news_count=Count('news', filter=Q(news__status='published'))
        ).filter(news_count__gt=0).order_by('-news_count')[:5]
        
        categories_data = CategorySerializer(popular_categories, many=True).data
        
        data = {
            'total_news': total_news,
            'recent_news': recent_news,
            'unread_notifications': unread_notifications,
            'popular_categories': categories_data,
            'user_role': user.role,
            'user_university': user.university,
        }
        
        return Response(data)


# ============== Vues d'authentification API ==============

class LoginAPIView(APIView):
    """API pour se connecter et obtenir un token"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username et password requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user:
            # Vérification optionnelle du statut de vérification
            # TODO: En production, décommenter pour exiger la vérification
            # if not user.is_verified:
            #     return Response(
            #         {'error': 'Votre compte est en attente de vérification par un administrateur'}, 
            #         status=status.HTTP_403_FORBIDDEN
            #     )
            
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserExtendedSerializer(user).data
            })
        else:
            return Response(
                {'error': 'Identifiants invalides'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutAPIView(APIView):
    """API pour se déconnecter et supprimer le token"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Déconnexion réussie'})
        except:
            return Response({'error': 'Erreur lors de la déconnexion'}, 
                          status=status.HTTP_400_BAD_REQUEST)


class CurrentUserAPIView(APIView):
    """API pour obtenir les informations de l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ============== Vues de modération ==============

class PendingNewsListView(generics.ListAPIView):
    """API pour lister les actualités en attente de modération"""
    serializer_class = NewsDetailSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    
    def get_queryset(self):
        # Seuls les admin et modérateurs peuvent voir les actualités en attente
        if self.request.user.role not in ['admin', 'moderator']:
            return News.objects.none()
        
        return News.objects.filter(status='pending').select_related(
            'author', 'category', 'moderator'
        ).order_by('-created_at')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def moderate_news(request, news_id):
    """API pour modérer une actualité (approuver ou rejeter)"""
    
    # Vérifier les permissions
    if request.user.role not in ['admin', 'moderator']:
        return Response(
            {'error': 'Vous n\'avez pas les permissions pour modérer'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        news = get_object_or_404(News, id=news_id)
        action = request.data.get('action')
        reason = request.data.get('reason', '')
        
        if action not in ['approve', 'reject']:
            return Response(
                {'error': 'Action invalide. Utilisez "approve" ou "reject"'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Effectuer l'action de modération
        if action == 'approve':
            news.status = 'published'
            news.publish_date = timezone.now()
            
            # Créer une notification pour l'auteur
            Notification.objects.create(
                recipient=news.author,
                title=f'Article approuvé: {news.title}',
                message=f'Votre article "{news.title}" a été approuvé et publié.',
                notification_type='news_approved',
                related_news=news
            )
            
            # Envoyer une notification email
            NotificationService.send_moderation_notification(
                news=news,
                action='approved',
                moderator=request.user,
                reason=reason
            )
            
        elif action == 'reject':
            if not reason:
                return Response(
                    {'error': 'Une raison est requise pour rejeter un article'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            news.status = 'rejected'
            news.moderation_comment = reason
            
            # Créer une notification pour l'auteur
            Notification.objects.create(
                recipient=news.author,
                title=f'Article rejeté: {news.title}',
                message=f'Votre article "{news.title}" a été rejeté. Raison: {reason}',
                notification_type='news_rejected',
                related_news=news
            )
            
            # Envoyer une notification email
            NotificationService.send_moderation_notification(
                news=news,
                action='rejected',
                moderator=request.user,
                reason=reason
            )
        
        # Enregistrer les informations de modération
        news.moderator = request.user
        news.moderated_at = timezone.now()
        news.save()
        
        return Response({
            'message': f'Article {"approuvé" if action == "approve" else "rejeté"} avec succès',
            'news': NewsDetailSerializer(news).data
        })
        
    except News.DoesNotExist:
        return Response(
            {'error': 'Article non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de la modération: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ModerationStatsView(APIView):
    """API pour obtenir les statistiques de modération"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role not in ['admin', 'moderator']:
            return Response(
                {'error': 'Accès non autorisé'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'pending_count': News.objects.filter(status='pending').count(),
            'approved_today': News.objects.filter(
                status='published',
                publish_date__date=timezone.now().date()
            ).count(),
            'rejected_today': News.objects.filter(
                status='rejected',
                moderated_at__date=timezone.now().date()
            ).count(),
            'total_moderated': News.objects.filter(
                moderator=request.user
            ).count() if request.user.role == 'moderator' else News.objects.exclude(status__in=['draft', 'pending']).count()
        }
        
        return Response(stats)


# ===== NOUVELLES VUES RBAC =====

from .models import Role, Universite, Faculte, Departement
from .serializers import (
    RoleSerializer, UniversiteSerializer, FaculteSerializer, 
    DepartementSerializer, UserExtendedSerializer, UserRegistrationExtendedSerializer,
    UserVerificationSerializer
)


class RoleListView(generics.ListAPIView):
    """API pour lister les rôles disponibles"""
    queryset = Role.objects.filter(est_actif=True)
    serializer_class = RoleSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Désactiver la pagination


class UniversiteListView(generics.ListAPIView):
    """API pour lister les universités actives"""
    queryset = Universite.objects.filter(est_active=True).order_by('nom')
    serializer_class = UniversiteSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Désactiver la pagination


class FaculteListView(generics.ListAPIView):
    """API pour lister les facultés par université"""
    serializer_class = FaculteSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Désactiver la pagination
    
    def get_queryset(self):
        universite_id = self.request.query_params.get('universite', None)
        queryset = Faculte.objects.filter(est_active=True)
        
        if universite_id:
            queryset = queryset.filter(universite_id=universite_id)
        
        return queryset.order_by('nom')


class DepartementListView(generics.ListAPIView):
    """API pour lister les départements par faculté"""
    serializer_class = DepartementSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Désactiver la pagination
    
    def get_queryset(self):
        faculte_id = self.request.query_params.get('faculte', None)
        queryset = Departement.objects.filter(est_actif=True)
        
        if faculte_id:
            queryset = queryset.filter(faculte_id=faculte_id)
        
        return queryset.order_by('nom')


class UserExtendedRegistrationView(generics.CreateAPIView):
    """API pour l'inscription avec le nouveau système RBAC"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationExtendedSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Envoyer une notification de bienvenue
        try:
            NotificationService.send_welcome_notification(user)
        except Exception as e:
            print(f"Erreur notification bienvenue: {e}")
        
        # Créer le token pour l'utilisateur
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserExtendedSerializer(user).data,
            'token': token.key,
            'message': 'Inscription réussie. Votre compte est en attente de vérification.'
        }, status=status.HTTP_201_CREATED)


class UserExtendedProfileView(generics.RetrieveUpdateAPIView):
    """API pour consulter et modifier le profil utilisateur avec RBAC"""
    serializer_class = UserExtendedSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UsersListView(generics.ListAPIView):
    """API pour lister les utilisateurs (pour admin/modérateurs)"""
    serializer_class = UserExtendedSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsPagination
    
    def get_queryset(self):
        user = self.request.user
        
        # Vérifier les permissions
        if hasattr(user, 'nouveau_role') and user.nouveau_role:
            permissions = user.nouveau_role.permissions
            if not any(perm in permissions for perm in ['gerer_utilisateurs', 'moderer_contenu']):
                return User.objects.none()
        elif user.role not in ['admin', 'moderator']:
            return User.objects.none()
        
        queryset = User.objects.all().select_related(
            'nouveau_role', 'universite', 'faculte', 'departement'
        ).order_by('-date_joined')
        
        # Filtres
        role_id = self.request.query_params.get('role', None)
        if role_id:
            queryset = queryset.filter(nouveau_role_id=role_id)
        
        universite_id = self.request.query_params.get('universite', None)
        if universite_id:
            queryset = queryset.filter(universite_id=universite_id)
        
        is_verified = self.request.query_params.get('verified', None)
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')
        
        return queryset


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_user(request):
    """API pour vérifier un utilisateur"""
    serializer = UserVerificationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = request.user
    
    # Vérifier les permissions
    if hasattr(user, 'nouveau_role') and user.nouveau_role:
        permissions = user.nouveau_role.permissions
        can_verify = 'gerer_utilisateurs' in permissions
    else:
        can_verify = user.role in ['admin', 'moderator']
    
    if not can_verify:
        return Response(
            {'error': 'Vous n\'avez pas les permissions pour vérifier des utilisateurs.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        target_user = User.objects.get(id=serializer.validated_data['user_id'])
        approve = serializer.validated_data['approve']
        motif = serializer.validated_data.get('motif', '')
        
        if approve:
            target_user.is_verified = True
            target_user.verifie_par = user
            target_user.date_verification = timezone.now()
            target_user.save()
            
            # Envoyer notification d'approbation
            try:
                NotificationService.send_verification_notification(target_user, True, motif)
            except Exception as e:
                print(f"Erreur notification vérification: {e}")
            
            return Response({
                'message': 'Utilisateur vérifié avec succès',
                'user': UserExtendedSerializer(target_user).data
            })
        else:
            # Envoyer notification de rejet
            try:
                NotificationService.send_verification_notification(target_user, False, motif)
            except Exception as e:
                print(f"Erreur notification rejet: {e}")
            
            return Response({
                'message': 'Vérification refusée',
                'motif': motif
            })
            
    except User.DoesNotExist:
        return Response(
            {'error': 'Utilisateur introuvable'}, 
            status=status.HTTP_404_NOT_FOUND
        )


class OrganisationStatsView(APIView):
    """API pour obtenir les statistiques organisationnelles"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Vérifier les permissions
        if hasattr(user, 'nouveau_role') and user.nouveau_role:
            permissions = user.nouveau_role.permissions
            can_view_stats = 'voir_statistiques' in permissions
        else:
            can_view_stats = user.role in ['admin', 'moderator']
        
        if not can_view_stats:
            return Response(
                {'error': 'Accès non autorisé'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'universites_count': Universite.objects.filter(est_active=True).count(),
            'facultes_count': Faculte.objects.filter(est_active=True).count(),
            'departements_count': Departement.objects.filter(est_actif=True).count(),
            'roles_count': Role.objects.filter(est_actif=True).count(),
            'utilisateurs_par_role': {},
            'utilisateurs_non_verifies': User.objects.filter(is_verified=False).count(),
        }
        
        # Statistiques par rôle
        for role in Role.objects.filter(est_actif=True):
            stats['utilisateurs_par_role'][role.nom] = role.utilisateurs.count()
        
        return Response(stats)
