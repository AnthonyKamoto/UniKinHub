"""
Script de configuration SMTP pour les notifications email
"""

import os
import sys
from pathlib import Path


def main():
    print("🔧 Configuration SMTP pour les Notifications Email")
    print("=" * 50)

    # Options disponibles
    providers = {
        "1": {
            "name": "Gmail",
            "host": "smtp.gmail.com",
            "port": "587",
            "tls": "True",
            "ssl": "False",
            "help": "Nécessite un mot de passe d'application (2FA activé)",
        },
        "2": {
            "name": "Outlook/Hotmail",
            "host": "smtp-mail.outlook.com",
            "port": "587",
            "tls": "True",
            "ssl": "False",
            "help": "Utilisez votre mot de passe Outlook habituel",
        },
        "3": {
            "name": "Yahoo",
            "host": "smtp.mail.yahoo.com",
            "port": "587",
            "tls": "True",
            "ssl": "False",
            "help": "Nécessite un mot de passe d'application",
        },
        "4": {
            "name": "Serveur SMTP personnalisé",
            "host": "",
            "port": "587",
            "tls": "True",
            "ssl": "False",
            "help": "Configurez votre propre serveur SMTP",
        },
        "5": {
            "name": "MailHog (développement local)",
            "host": "localhost",
            "port": "1025",
            "tls": "False",
            "ssl": "False",
            "help": "Serveur SMTP de test local",
        },
    }

    # Afficher les options
    print("\nFournisseurs SMTP disponibles:")
    for key, provider in providers.items():
        print(f"{key}. {provider['name']} - {provider['help']}")

    # Choix de l'utilisateur
    choice = input("\nChoisissez un fournisseur (1-5): ").strip()

    if choice not in providers:
        print("❌ Choix invalide")
        return

    provider = providers[choice]
    print(f"\n✅ Configuration pour {provider['name']}")

    # Configuration spécifique
    if choice == "4":  # Serveur personnalisé
        host = input("Hôte SMTP: ").strip()
        port = input("Port (défaut 587): ").strip() or "587"
        tls = input("Utiliser TLS? (O/n): ").strip().lower()
        tls = "False" if tls == "n" else "True"
        ssl = input("Utiliser SSL? (o/N): ").strip().lower()
        ssl = "True" if ssl == "o" else "False"
    else:
        host = provider["host"]
        port = provider["port"]
        tls = provider["tls"]
        ssl = provider["ssl"]

    # Informations de connexion
    print(f"\n📧 Configuration pour {host}:{port}")
    email = input("Adresse email: ").strip()

    if not email:
        print("❌ Adresse email requise")
        return

    if choice == "1":  # Gmail
        print("\n🔐 Pour Gmail:")
        print("1. Activez l'authentification à 2 facteurs")
        print("2. Générez un mot de passe d'application:")
        print("   - Compte Google > Sécurité > Mots de passe des applications")
        print(
            "3. Utilisez ce mot de passe de 16 caractères (pas votre mot de passe habituel)"
        )

    password = input("Mot de passe/Mot de passe d'application: ").strip()

    if not password:
        print("❌ Mot de passe requis")
        return

    # Générer le fichier de configuration
    env_content = f"""# Configuration SMTP générée automatiquement
# Date: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST={host}
EMAIL_PORT={port}
EMAIL_USE_TLS={tls}
EMAIL_USE_SSL={ssl}
EMAIL_HOST_USER={email}
EMAIL_HOST_PASSWORD={password}
DEFAULT_FROM_EMAIL=Actualités Étudiantes Kinshasa <{email}>
"""

    # Sauvegarder la configuration
    backend_dir = Path(__file__).parent
    env_file = backend_dir / ".env"

    with open(env_file, "w", encoding="utf-8") as f:
        f.write(env_content)

    print(f"\n✅ Configuration sauvegardée dans {env_file}")

    # Test de la configuration
    test = input("\n🧪 Tester la configuration maintenant? (O/n): ").strip().lower()
    if test != "n":
        test_email_config(email)


def test_email_config(recipient_email):
    """Teste la configuration email"""
    print("\n🧪 Test de la configuration email...")

    try:
        # Charger les variables d'environnement
        env_file = Path(__file__).parent / ".env"
        if env_file.exists():
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    if "=" in line and not line.startswith("#"):
                        key, value = line.strip().split("=", 1)
                        os.environ[key] = value

        # Configuration Django temporaire
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "news_system.settings")

        import django

        django.setup()

        from django.conf import settings
        from django.core.mail import send_mail

        print(f"📡 Connexion à {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
        print(f"👤 Utilisateur: {settings.EMAIL_HOST_USER}")
        print(f"🔐 TLS: {settings.EMAIL_USE_TLS}, SSL: {settings.EMAIL_USE_SSL}")

        # Envoyer un email de test
        success = send_mail(
            subject="🧪 Test SMTP - Actualités Étudiantes Kinshasa",
            message="Ceci est un email de test pour vérifier la configuration SMTP.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=f"""
                <h2>🎉 Test SMTP Réussi !</h2>
                <p>Votre configuration SMTP fonctionne correctement.</p>
                <p><strong>Serveur:</strong> {settings.EMAIL_HOST}:{settings.EMAIL_PORT}</p>
                <p><strong>Sécurité:</strong> TLS={settings.EMAIL_USE_TLS}, SSL={settings.EMAIL_USE_SSL}</p>
                <p><strong>Date:</strong> {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <hr>
                <p><em>Actualités Étudiantes Kinshasa - Système de Notifications</em></p>
            """,
            fail_silently=False,
        )

        if success:
            print("✅ Email de test envoyé avec succès!")
            print(f"📬 Vérifiez votre boîte de réception: {recipient_email}")
        else:
            print("❌ Échec de l'envoi de l'email de test")

    except Exception as e:
        print(f"❌ Erreur lors du test: {str(e)}")

        # Conseils de dépannage
        print("\n🔧 Conseils de dépannage:")
        print("1. Vérifiez vos identifiants de connexion")
        print("2. Pour Gmail, assurez-vous d'utiliser un mot de passe d'application")
        print("3. Vérifiez que votre fournisseur autorise les connexions SMTP")
        print("4. Contrôlez votre pare-feu et votre antivirus")


if __name__ == "__main__":
    main()
