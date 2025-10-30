from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
import os
from pathlib import Path


class Command(BaseCommand):
    help = 'Configure et teste la connexion SMTP'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--test-email',
            type=str,
            help='Adresse email pour tester la configuration',
        )
        parser.add_argument(
            '--provider',
            type=str,
            choices=['gmail', 'outlook', 'yahoo', 'custom'],
            help='Fournisseur SMTP prédéfini',
        )
        parser.add_argument(
            '--host',
            type=str,
            help='Hôte SMTP personnalisé',
        )
        parser.add_argument(
            '--port',
            type=int,
            help='Port SMTP personnalisé',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🔧 Configuration SMTP - Actualités Étudiantes Kinshasa')
        )
        
        # Afficher la configuration actuelle
        self.show_current_config()
        
        # Tester l'email si demandé
        test_email = options.get('test_email')
        if test_email:
            self.test_smtp_config(test_email)
        else:
            self.stdout.write(
                self.style.WARNING('💡 Utilisez --test-email pour tester la configuration')
            )

    def show_current_config(self):
        """Affiche la configuration email actuelle"""
        self.stdout.write('\n📋 Configuration Email Actuelle:')
        self.stdout.write(f'   Backend: {settings.EMAIL_BACKEND}')
        
        if settings.EMAIL_BACKEND == 'django.core.mail.backends.smtp.EmailBackend':
            self.stdout.write(f'   Hôte: {getattr(settings, "EMAIL_HOST", "Non défini")}')
            self.stdout.write(f'   Port: {getattr(settings, "EMAIL_PORT", "Non défini")}')
            self.stdout.write(f'   TLS: {getattr(settings, "EMAIL_USE_TLS", False)}')
            self.stdout.write(f'   SSL: {getattr(settings, "EMAIL_USE_SSL", False)}')
            self.stdout.write(f'   Utilisateur: {getattr(settings, "EMAIL_HOST_USER", "Non défini")}')
            
            # Vérifier si le mot de passe est configuré
            password_status = "✅ Configuré" if getattr(settings, "EMAIL_HOST_PASSWORD", "") else "❌ Non défini"
            self.stdout.write(f'   Mot de passe: {password_status}')
        else:
            self.stdout.write('   📧 Mode console - les emails s\'affichent dans la console')
        
        self.stdout.write(f'   From: {settings.DEFAULT_FROM_EMAIL}')

    def test_smtp_config(self, test_email):
        """Teste la configuration SMTP en envoyant un email"""
        self.stdout.write(f'\n🧪 Test d\'envoi vers {test_email}...')
        
        backend = settings.EMAIL_BACKEND
        
        # Gestion des différents backends
        if backend == 'django.core.mail.backends.console.EmailBackend':
            self.stdout.write(
                self.style.WARNING('⚠️  Configuration en mode console - les emails s\'affichent dans la console')
            )
            return
        elif backend == 'django.core.mail.backends.filebased.EmailBackend':
            self.stdout.write(
                self.style.SUCCESS('📁 Configuration en mode fichier - les emails seront sauvegardés')
            )
        elif backend != 'django.core.mail.backends.smtp.EmailBackend':
            self.stdout.write(
                self.style.WARNING(f'⚠️  Backend non reconnu: {backend}')
            )
        
        # Pour SMTP, vérifier la configuration requise
        if backend == 'django.core.mail.backends.smtp.EmailBackend':
            required_settings = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_HOST_USER', 'EMAIL_HOST_PASSWORD']
            missing_settings = []
            
            for setting in required_settings:
                if not getattr(settings, setting, ''):
                    missing_settings.append(setting)
            
            if missing_settings:
                self.stdout.write(
                    self.style.ERROR(f'❌ Configuration incomplète. Manquant: {", ".join(missing_settings)}')
                )
                self.show_setup_instructions()
                return
        
        # Tenter l'envoi
        try:
            from datetime import datetime
            
            subject = '🧪 Test SMTP - Actualités Étudiantes Kinshasa'
            
            html_message = f'''
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                    .content {{ background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }}
                    .success {{ background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; }}
                    .info {{ background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 15px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Test SMTP Réussi !</h1>
                        <p>Configuration email opérationnelle</p>
                    </div>
                    <div class="content">
                        <div class="success">
                            <strong>Félicitations !</strong> Votre configuration SMTP fonctionne parfaitement.
                        </div>
                        
                        <h3>📊 Détails de la Configuration</h3>
                        <div class="info">
                            <strong>Serveur SMTP:</strong> {settings.EMAIL_HOST}:{settings.EMAIL_PORT}<br>
                            <strong>Sécurité:</strong> TLS={settings.EMAIL_USE_TLS}, SSL={settings.EMAIL_USE_SSL}<br>
                            <strong>Utilisateur:</strong> {settings.EMAIL_HOST_USER}<br>
                            <strong>Date du test:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                        </div>
                        
                        <h3>✅ Fonctionnalités Activées</h3>
                        <ul>
                            <li>📧 Notifications de soumission d'articles</li>
                            <li>✅ Notifications d'approbation</li>
                            <li>⚠️ Notifications de rejet avec commentaires</li>
                            <li>📰 Digest quotidien des actualités</li>
                            <li>📅 Digest hebdomadaire</li>
                        </ul>
                        
                        <p><strong>Votre système de notifications est maintenant opérationnel !</strong></p>
                    </div>
                </div>
            </body>
            </html>
            '''
            
            text_message = f'''
🎉 Test SMTP Réussi !

Votre configuration SMTP fonctionne parfaitement.

Détails de la Configuration:
- Serveur SMTP: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}
- Sécurité: TLS={settings.EMAIL_USE_TLS}, SSL={settings.EMAIL_USE_SSL}
- Utilisateur: {settings.EMAIL_HOST_USER}
- Date du test: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Fonctionnalités Activées:
✅ Notifications de soumission d'articles
✅ Notifications d'approbation  
✅ Notifications de rejet avec commentaires
✅ Digest quotidien des actualités
✅ Digest hebdomadaire

Votre système de notifications est maintenant opérationnel !

---
Actualités Étudiantes Kinshasa - Système de Notifications
            '''
            
            success = send_mail(
                subject=subject,
                message=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[test_email],
                html_message=html_message,
                fail_silently=False
            )
            
            if success:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Email de test envoyé avec succès à {test_email}!')
                )
                self.stdout.write('📬 Vérifiez votre boîte de réception et vos spams.')
                
                # Afficher les prochaines étapes
                self.stdout.write('\n🚀 Prochaines étapes:')
                self.stdout.write('   1. Testez les notifications avec les commandes de test')
                self.stdout.write('   2. Configurez la planification automatique des digest')
                self.stdout.write('   3. Informez vos utilisateurs du système de notifications')
                
            else:
                self.stdout.write(
                    self.style.ERROR('❌ Échec de l\'envoi - vérifiez votre configuration')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Erreur SMTP: {str(e)}')
            )
            self.show_troubleshooting_tips()

    def show_setup_instructions(self):
        """Affiche les instructions de configuration"""
        self.stdout.write('\n🔧 Instructions de Configuration:')
        self.stdout.write('\n1. Créez un fichier .env dans le répertoire backend avec:')
        self.stdout.write('   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend')
        self.stdout.write('   EMAIL_HOST=smtp.gmail.com')
        self.stdout.write('   EMAIL_PORT=587')
        self.stdout.write('   EMAIL_USE_TLS=True')
        self.stdout.write('   EMAIL_HOST_USER=votre-email@gmail.com')
        self.stdout.write('   EMAIL_HOST_PASSWORD=votre-mot-de-passe-app')
        self.stdout.write('\n2. Pour Gmail, utilisez un mot de passe d\'application:')
        self.stdout.write('   - Activez l\'authentification à 2 facteurs')
        self.stdout.write('   - Générez un mot de passe d\'application')
        self.stdout.write('\n3. Ou utilisez la commande: python setup_smtp.py')

    def show_troubleshooting_tips(self):
        """Affiche des conseils de dépannage"""
        self.stdout.write('\n🔧 Conseils de Dépannage:')
        self.stdout.write('   1. Vérifiez vos identifiants de connexion')
        self.stdout.write('   2. Pour Gmail, utilisez un mot de passe d\'application (16 caractères)')
        self.stdout.write('   3. Vérifiez que votre fournisseur autorise les connexions SMTP')
        self.stdout.write('   4. Contrôlez votre pare-feu et antivirus')
        self.stdout.write('   5. Essayez avec un autre port (25, 465, 587)')
        self.stdout.write('   6. Vérifiez les logs de votre serveur email')