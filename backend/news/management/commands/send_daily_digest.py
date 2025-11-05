from django.core.management.base import BaseCommand

from news.notification_service import NotificationService


class Command(BaseCommand):
    help = "Envoie le résumé quotidien des actualités aux utilisateurs abonnés"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Simule l'envoi sans envoyer réellement les emails",
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Début de l'envoi du résumé quotidien..."))

        if options["dry_run"]:
            self.stdout.write(
                self.style.WARNING(
                    "Mode simulation activé - aucun email ne sera envoyé"
                )
            )
            # Ici on pourrait ajouter une simulation
            self.stdout.write(self.style.SUCCESS("Simulation terminée"))
            return

        try:
            notifications_sent = NotificationService.send_daily_digest()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Résumé quotidien envoyé avec succès à {notifications_sent} utilisateurs"
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f"Erreur lors de l'envoi du résumé quotidien: {str(e)}"
                )
            )
