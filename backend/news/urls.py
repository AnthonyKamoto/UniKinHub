from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views
from .views_moderation import NewsViewSet

app_name = "news"

# Router pour les ViewSets
router = DefaultRouter()
router.register(r"news-api", NewsViewSet, basename="news-api")

urlpatterns = [
    # ViewSets API (nouvelle architecture)
    path("api/", include(router.urls)),
    # Routes existantes (compatibilité)
    # Authentification
    path("auth/login/", views.LoginAPIView.as_view(), name="login"),
    path("auth/logout/", views.LogoutAPIView.as_view(), name="logout"),
    path("auth/register/", views.UserRegistrationView.as_view(), name="register"),
    path("auth/user/", views.CurrentUserAPIView.as_view(), name="current-user"),
    path("auth/profile/", views.UserProfileView.as_view(), name="profile"),
    # Catégories
    path("categories/", views.CategoryListView.as_view(), name="categories"),
    # Actualités
    path("news/", views.NewsListView.as_view(), name="news-list"),
    path("news/<int:pk>/", views.NewsDetailView.as_view(), name="news-detail"),
    path("news/create/", views.NewsCreateView.as_view(), name="news-create"),
    path("news/my/", views.MyNewsListView.as_view(), name="my-news"),
    # Interactions
    path("news/<int:news_id>/like/", views.toggle_like, name="toggle-like"),
    # Préférences de notification
    path(
        "preferences/", views.NotificationPreferenceView.as_view(), name="preferences"
    ),
    # Notifications
    path("notifications/", views.NotificationListView.as_view(), name="notifications"),
    path(
        "notifications/<int:notification_id>/read/",
        views.mark_notification_read,
        name="mark-read",
    ),
    # Firebase Cloud Messaging
    path("fcm/register/", views.register_fcm_token, name="register-fcm-token"),
    path("fcm/unregister/", views.unregister_fcm_token, name="unregister-fcm-token"),
    # Statistiques
    path("dashboard/", views.DashboardStatsView.as_view(), name="dashboard"),
    # Modération
    path(
        "moderation/pending/", views.PendingNewsListView.as_view(), name="pending-news"
    ),
    path("moderation/news/<int:news_id>/", views.moderate_news, name="moderate-news"),
    path(
        "moderation/stats/",
        views.ModerationStatsView.as_view(),
        name="moderation-stats",
    ),
    path(
        "moderation/news/<int:news_id>/invalidate/",
        views.admin_invalidate_news,
        name="invalidate-news",
    ),
    # ===== NOUVELLES URLS RBAC =====
    # Organisation
    path("roles/", views.RoleListView.as_view(), name="roles"),
    path("universites/", views.UniversiteListView.as_view(), name="universites"),
    path("facultes/", views.FaculteListView.as_view(), name="facultes"),
    path("departements/", views.DepartementListView.as_view(), name="departements"),
    # Authentification étendue
    path(
        "auth/register-extended/",
        views.UserExtendedRegistrationView.as_view(),
        name="register-extended",
    ),
    path(
        "auth/profile-extended/",
        views.UserExtendedProfileView.as_view(),
        name="profile-extended",
    ),
    # Gestion des utilisateurs
    path("users/", views.UsersListView.as_view(), name="users-list"),
    path("users/verify/", views.verify_user, name="verify-user"),
    # Statistiques organisationnelles
    path(
        "organisation/stats/",
        views.OrganisationStatsView.as_view(),
        name="organisation-stats",
    ),
]
