import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "news_system.settings")
django.setup()

from news.models import User

users = User.objects.all()

print("\n" + "=" * 80)
print("LISTE DES UTILISATEURS EXISTANTS")
print("=" * 80 + "\n")

for user in users:
    print(f"Username: {user.username}")

    # Déterminer le mot de passe probable
    if user.username == "admin":
        password = "admin123"
    elif user.username == "demo":
        password = "demo123"
    elif user.username.endswith("_test"):
        password = "test123"
    elif user.username in ["moderateur1", "publiant1", "etudiant1", "etudiant2"]:
        password = "password123"
    elif user.username in ["moderator", "publisher", "testuser"]:
        password = f"{user.username}123"
    elif user.username == "test":
        password = "test123"
    else:
        password = "password123 (par défaut)"

    print(f"Mot de passe: {password}")
    print(f"Email: {user.email}")
    print(f"Nom: {user.first_name} {user.last_name}")
    print(f"Rôle: {user.role_display}")

    # Gérer université (ancien ou nouveau système)
    univ = (
        user.universite.nom
        if user.universite
        else (user.university if user.university else "Aucune")
    )
    print(f"Université: {univ}")

    print(f"Faculté: {user.faculte.nom if user.faculte else 'Aucune'}")
    print(f"Département: {user.departement.nom if user.departement else 'Aucun'}")
    print(f"Programme: {user.program if user.program else 'Aucun'}")
    print(f"Superuser: {'Oui' if user.is_superuser else 'Non'}")
    print("-" * 80)

print(f"\nTotal: {users.count()} utilisateurs")
