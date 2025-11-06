"""
Vues API pour la modération et l'invalidation des news
Gestion des rôles : Administrateurs, Modérateurs, Publiants, Étudiants
"""

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ModerationLog, News
from .notification_service import NotificationService
from .permissions import (CanInvalidateNews, CanModerateNews, IsAdminUser,
                          IsModeratorOrAdmin, IsPublisherOrAdmin)
from .serializers import (NewsCreateSerializer, NewsDetailSerializer,
                          NewsInvalidationSerializer, NewsModerationSerializer,
                          NewsSerializer)
from .tasks import notify_on_news_published_task


class NewsViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion complète des news selon les rôles.

    Permissions :
    - Création : Publiants, Modérateurs, Admins
    - Lecture : Tous les utilisateurs authentifiés
    - Modération : Modérateurs, Admins
    - Invalidation : Admins uniquement
    """

    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Sélectionner le serializer approprié selon l'action"""
        if self.action == "create":
            return NewsCreateSerializer
        elif self.action in ["moderate", "approve"]:
            return NewsModerationSerializer
        elif self.action == "invalidate":
            return NewsInvalidationSerializer
        elif self.action == "retrieve":
            return NewsDetailSerializer
        return NewsSerializer

    def get_permissions(self):
        """Définir les permissions selon l'action"""
        if self.action in ["create"]:
            permission_classes = [IsAuthenticated, IsPublisherOrAdmin]
        elif self.action in ["moderate", "approve", "reject"]:
            permission_classes = [IsAuthenticated, IsModeratorOrAdmin]
        elif self.action == "invalidate":
            permission_classes = [IsAuthenticated, IsAdminUser]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsPublisherOrAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filtrer les news selon le rôle de l'utilisateur :
        - Admins/Modérateurs : toutes les news
        - Publiants : leurs propres news + news publiées
        - Étudiants : news publiées de leur programme uniquement
        """
        user = self.request.user
        queryset = News.objects.select_related("author", "category", "moderator")

        # Admins et modérateurs voient tout
        if user.is_staff or user.is_superuser:
            return queryset.all()

        # Vérifier le rôle avec le nouveau système
        if hasattr(user, "nouveau_role") and user.nouveau_role:
            role_permissions = user.nouveau_role.permissions or {}

            if role_permissions.get("can_manage_all") or role_permissions.get(
                "can_moderate_news"
            ):
                # Modérateurs voient tout
                return queryset.all()
            elif role_permissions.get("can_create_content"):
                # Publiants voient leurs propres news et les news publiées
                return queryset.filter(Q(author=user) | Q(status="published"))

        # Ancien système de rôles
        if user.role == "moderator":
            return queryset.all()
        elif user.role == "publisher":
            return queryset.filter(Q(author=user) | Q(status="published"))

        # Étudiants : seulement les news publiées de leur programme
        user_program = user.program or getattr(user, "programme_ou_formation", None)
        if user_program:
            return queryset.filter(
                status="published", programme_ou_formation=user_program
            )

        # Par défaut : toutes les news publiées
        return queryset.filter(status="published")

    def create(self, request, *args, **kwargs):
        """Créer une news et retourner un objet complet"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        news = serializer.save(author=request.user)

        # Envoyer confirmation de soumission
        try:
            NotificationService.send_submission_confirmation(news)
        except Exception as e:
            print(f"Erreur notification: {e}")

        # Si la news est déjà publiée (admin/modérateur), envoyer les notifications
        if news.status == "published":
            try:
                notify_on_news_published_task.delay(news.id)
            except Exception as e:
                print(f"Erreur tâche Celery: {e}")

        # Retourner le serializer complet pour la réponse
        response_serializer = NewsSerializer(news)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """Créer une news en assignant l'auteur"""
        news = serializer.save(author=self.request.user)

        # Envoyer confirmation de soumission
        try:
            NotificationService.send_submission_confirmation(news)
        except Exception as e:
            print(f"Erreur notification: {e}")

        # Si la news est déjà publiée (admin/modérateur), envoyer les notifications
        if news.status == "published":
            try:
                notify_on_news_published_task.delay(news.id)
            except Exception as e:
                print(f"Erreur tâche Celery: {e}")

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAuthenticated, IsModeratorOrAdmin],
    )
    def pending(self, request):
        """
        Liste des news en attente de modération
        Accessible uniquement aux modérateurs et admins
        """
        pending_news = (
            News.objects.filter(status="pending")
            .select_related("author", "category")
            .order_by("-created_at")
        )

        serializer = self.get_serializer(pending_news, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_news(self, request):
        """
        Liste des news créées par l'utilisateur connecté
        """
        my_news = (
            News.objects.filter(author=request.user)
            .select_related("category", "moderator")
            .order_by("-created_at")
        )

        serializer = self.get_serializer(my_news, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated, IsModeratorOrAdmin],
    )
    def moderate(self, request, pk=None):
        """
        Modérer une news (approuver ou rejeter avec modifications)

        Body params:
        - final_title: Titre final après modération
        - final_content: Contenu final après modération
        - moderator_approved: true/false
        - moderation_comment: Commentaire du modérateur
        """
        news = self.get_object()

        if news.status not in ["pending", "draft"]:
            return Response(
                {"error": "Cette news a déjà été modérée"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = NewsModerationSerializer(
            news, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            updated_news = serializer.save()

            # Enregistrer dans l'historique de modération
            ModerationLog.objects.create(
                news=updated_news,
                moderator=request.user,
                action="approved" if updated_news.moderator_approved else "rejected",
                reason=updated_news.moderation_comment,
                previous_content=f"{news.draft_title}\n{news.draft_content}",
                new_content=f"{updated_news.final_title}\n{updated_news.final_content}",
            )

            # Envoyer notification à l'auteur
            NotificationService.send_moderation_notification(
                updated_news,
                "approved" if updated_news.moderator_approved else "rejected",
                request.user,
                reason=updated_news.moderation_comment,
            )

            # Si approuvé, notifier les utilisateurs concernés
            if updated_news.moderator_approved:
                notify_on_news_published_task.delay(updated_news.id)

            return Response(
                NewsDetailSerializer(updated_news).data, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated, IsModeratorOrAdmin],
    )
    def approve(self, request, pk=None):
        """
        Raccourci pour approuver rapidement une news sans modifications
        """
        news = self.get_object()

        if news.status not in ["pending", "draft"]:
            return Response(
                {"error": "Cette news a déjà été modérée"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Approuver avec le contenu original
        data = {
            "final_title": news.draft_title,
            "final_content": news.draft_content,
            "moderator_approved": True,
            "moderation_comment": request.data.get("comment", "Approuvé"),
        }

        print(f"DEBUG approve - News ID: {news.id}")
        print(f"DEBUG approve - draft_title: {news.draft_title}")
        print(f"DEBUG approve - draft_content: {news.draft_content}")
        print(f"DEBUG approve - data: {data}")

        serializer = NewsModerationSerializer(
            news, data=data, context={"request": request}
        )

        if serializer.is_valid():
            updated_news = serializer.save()

            # Enregistrer dans l'historique
            ModerationLog.objects.create(
                news=updated_news,
                moderator=request.user,
                action="approved",
                reason=data["moderation_comment"],
            )

            # Notifications
            NotificationService.send_moderation_notification(
                updated_news, "approved", request.user
            )
            notify_on_news_published_task.delay(updated_news.id)

            return Response(
                {"message": "News approuvée avec succès"}, status=status.HTTP_200_OK
            )

        print(f"DEBUG approve - Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated, IsModeratorOrAdmin],
    )
    def reject(self, request, pk=None):
        """
        Rejeter une news avec une raison

        Body params:
        - reason: Raison du rejet (obligatoire)
        """
        news = self.get_object()

        if news.status not in ["pending", "draft"]:
            return Response(
                {"error": "Cette news a déjà été modérée"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reason = request.data.get("reason", "")
        if not reason:
            return Response(
                {"error": "La raison du rejet est obligatoire"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Rejeter la news
        news.moderator = request.user
        news.moderated_at = timezone.now()
        news.moderator_approved = False
        news.moderation_comment = reason
        news.status = "rejected"
        news.save()

        # Enregistrer dans l'historique
        ModerationLog.objects.create(
            news=news, moderator=request.user, action="rejected", reason=reason
        )

        # Notifier l'auteur
        NotificationService.send_moderation_notification(
            news, "rejected", request.user, reason=reason
        )

        return Response({"message": "News rejetée"}, status=status.HTTP_200_OK)

    @action(
        detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsAdminUser]
    )
    def invalidate(self, request, pk=None):
        """
        Invalider une news publiée (administrateurs uniquement)

        Body params:
        - admin_invalidation_reason: Motivation de l'invalidation (obligatoire)
        """
        news = self.get_object()

        if news.status == "invalidated":
            return Response(
                {"error": "Cette news est déjà invalidée"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = NewsInvalidationSerializer(
            news, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            updated_news = serializer.save()

            # Enregistrer dans l'historique
            ModerationLog.objects.create(
                news=updated_news,
                moderator=request.user,
                action="deleted",
                reason=updated_news.admin_invalidation_reason,
            )

            # Notifier l'auteur
            NotificationService.send_moderation_notification(
                updated_news,
                "invalidated",
                request.user,
                reason=updated_news.admin_invalidation_reason,
            )

            return Response(
                {"message": "News invalidée avec succès"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def by_importance(self, request):
        """
        Filtrer les news par niveau d'importance

        Query params:
        - importance: low, medium, high, urgent
        """
        importance = request.query_params.get("importance")
        if not importance:
            return Response(
                {"error": "Le paramètre importance est requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_importance = ["low", "medium", "high", "urgent"]
        if importance not in valid_importance:
            return Response(
                {
                    "error": f'Importance invalide. Valeurs possibles : {", ".join(valid_importance)}'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        news = (
            self.get_queryset()
            .filter(importance=importance, status="published")
            .order_by("-publish_date")
        )

        serializer = self.get_serializer(news, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def by_program(self, request):
        """
        Filtrer les news par programme/formation

        Query params:
        - program: Nom du programme ou formation
        """
        program = request.query_params.get("program")
        if not program:
            return Response(
                {"error": "Le paramètre program est requis"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        news = (
            self.get_queryset()
            .filter(programme_ou_formation__icontains=program, status="published")
            .order_by("-publish_date")
        )

        serializer = self.get_serializer(news, many=True)
        return Response(serializer.data)
