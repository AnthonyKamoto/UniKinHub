"""
Permissions personnalisées pour le système de news
Gère les permissions pour :
- Administrateurs : gestion des utilisateurs et des rôles, contrôle de la publication
- Modérateurs : validation/refus des news, commentaires d'invalidation
- Publiants : création et soumission des news
- Étudiants : consultation des news
"""

from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """Permission pour les administrateurs uniquement"""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )


class IsModeratorOrAdmin(permissions.BasePermission):
    """Permission pour les modérateurs et administrateurs"""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Admins ont toujours accès
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Vérifier le rôle de modérateur (ancien et nouveau système)
        if request.user.role == "moderator":
            return True

        if hasattr(request.user, "nouveau_role") and request.user.nouveau_role:
            return request.user.nouveau_role.nom == "moderateur"

        return False


class IsPublisherOrAdmin(permissions.BasePermission):
    """Permission pour les publiants et administrateurs"""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Admins ont toujours accès
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Vérifier le rôle de publiant (ancien et nouveau système)
        if request.user.role in ["publisher", "moderator"]:
            return True

        if hasattr(request.user, "nouveau_role") and request.user.nouveau_role:
            return request.user.nouveau_role.nom in [
                "publiant",
                "moderateur",
                "enseignant",
            ]

        return False

    def has_object_permission(self, request, view, obj):
        """
        Permission au niveau objet :
        - Les publiants peuvent modifier leurs propres news
        - Les modérateurs et admins peuvent modifier toutes les news
        """
        if request.user.is_staff or request.user.is_superuser:
            return True

        # Vérifier si l'utilisateur est modérateur
        is_moderator = request.user.role == "moderator" or (
            hasattr(request.user, "nouveau_role")
            and request.user.nouveau_role
            and request.user.nouveau_role.nom == "moderateur"
        )

        if is_moderator:
            return True

        # Les publiants peuvent modifier leurs propres news
        return obj.author == request.user


class IsStudentOrAbove(permissions.BasePermission):
    """Permission pour les étudiants et rôles supérieurs (lecture)"""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class CanModerateNews(permissions.BasePermission):
    """Permission spécifique pour modérer les news"""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Vérifier les permissions Django
        if request.user.has_perm("news.can_moderate"):
            return True

        # Vérifier le rôle
        return (
            request.user.is_staff
            or request.user.role == "moderator"
            or (
                hasattr(request.user, "nouveau_role")
                and request.user.nouveau_role
                and request.user.nouveau_role.nom == "moderateur"
            )
        )


class CanInvalidateNews(permissions.BasePermission):
    """Permission spécifique pour invalider les news (admin uniquement)"""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Vérifier les permissions Django
        if request.user.has_perm("news.can_invalidate"):
            return True

        # Seuls les admins peuvent invalider
        return request.user.is_staff or request.user.is_superuser


class CanPublishNews(permissions.BasePermission):
    """Permission spécifique pour publier des news"""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Vérifier les permissions Django
        if request.user.has_perm("news.can_publish"):
            return True

        # Vérifier le rôle
        return (
            request.user.is_staff
            or request.user.role in ["publisher", "moderator"]
            or (
                hasattr(request.user, "nouveau_role")
                and request.user.nouveau_role
                and request.user.nouveau_role.nom
                in ["publiant", "moderateur", "enseignant"]
            )
        )
