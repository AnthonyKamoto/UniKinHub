#!/usr/bin/env python
"""
Script pour peupler la base de données avec les universités et facultés
"""
import os

import django

# Configuration Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "news_system.settings")
django.setup()

from news.models import Faculte, Role, Universite


def populate_database():
    """Peuple la base de données avec les universités et facultés"""

    print("🔄 Début du peuplement de la base de données...")

    # ===== CRÉATION DES RÔLES =====
    print("\n📋 Création des rôles...")
    roles_data = [
        {"nom": "Étudiant", "description": "Utilisateur étudiant"},
        {"nom": "Enseignant", "description": "Professeur ou enseignant"},
        {"nom": "Administrateur", "description": "Administrateur du système"},
        {"nom": "Modérateur", "description": "Modérateur de contenu"},
    ]

    for role_data in roles_data:
        role, created = Role.objects.get_or_create(
            nom=role_data["nom"], defaults={"description": role_data["description"]}
        )
        if created:
            print(f"   ✅ Rôle créé : {role.nom}")
        else:
            print(f"   ℹ️  Rôle existant : {role.nom}")

    # ===== CRÉATION DES UNIVERSITÉS =====
    print("\n🏛️  Création des universités...")
    universites_data = [
        {"nom": "Université de Kinshasa", "code": "UNIKIN", "ville": "Kinshasa"},
        {"nom": "Université Pédagogique Nationale", "code": "UPN", "ville": "Kinshasa"},
        {"nom": "Université Catholique au Congo", "code": "UCC", "ville": "Kinshasa"},
        {"nom": "Université Protestante du Congo", "code": "UPC", "ville": "Kinshasa"},
    ]

    universites = {}
    for uni_data in universites_data:
        universite, created = Universite.objects.get_or_create(
            code=uni_data["code"],
            defaults={"nom": uni_data["nom"], "ville": uni_data["ville"]},
        )
        universites[uni_data["code"]] = universite
        if created:
            print(f"   ✅ Université créée : {universite.nom} ({universite.code})")
        else:
            print(f"   ℹ️  Université existante : {universite.nom} ({universite.code})")

    # ===== CRÉATION DES FACULTÉS ET DÉPARTEMENTS =====
    print("\n🎓 Création des facultés et départements...")

    # Définition des facultés avec leurs départements
    facultes_departements = {
        "Informatique": {
            "code": "INF",
            "departements": ["Informatique de gestion", "Génie informatique"],
        },
        "Droit": {
            "code": "DRT",
            "departements": [
                "Droit public",
                "Droit Pénal",
                "Droit Économique et social",
            ],
        },
        "Économie": {
            "code": "ECO",
            "departements": ["Économie publique", "Économie monétaire"],
        },
        "Communication": {
            "code": "COM",
            "departements": ["Journalisme", "Communication des entreprises"],
        },
        "Médecine": {
            "code": "MED",
            "departements": [
                "Biologie Médicale",
                "Médecine Physique",
                "Bucco-dentaire",
            ],
        },
    }

    # Créer chaque faculté pour chaque université
    from news.models import Departement

    for uni_code, universite in universites.items():
        print(f"\n   📌 Facultés pour {universite.code}:")
        for faculte_nom, faculte_info in facultes_departements.items():
            faculte, created = Faculte.objects.get_or_create(
                nom=faculte_nom,
                universite=universite,
                defaults={"code": faculte_info["code"]},
            )
            if created:
                print(f"      ✅ Faculté créée : {faculte.nom}")
            else:
                print(f"      ℹ️  Faculté existante : {faculte.nom}")

            # Créer les départements pour cette faculté
            for dept_nom in faculte_info["departements"]:
                departement, dept_created = Departement.objects.get_or_create(
                    nom=dept_nom,
                    faculte=faculte,
                    defaults={"code": dept_nom[:3].upper()},
                )
                if dept_created:
                    print(f"         ✅ Département créé : {departement.nom}")
                else:
                    print(f"         ℹ️  Département existant : {departement.nom}")

    # ===== CRÉATION DES UTILISATEURS DE TEST =====
    from news.models import Departement, User

    print("\n👥 Création des utilisateurs de test...")

    # Récupérer les rôles
    role_admin = Role.objects.get(nom="Administrateur")
    role_moderateur = Role.objects.get(nom="Modérateur")
    role_etudiant = Role.objects.get(nom="Étudiant")
    role_enseignant = Role.objects.get(nom="Enseignant")

    # Récupérer une université et une faculté pour les tests
    unikin = universites.get("UNIKIN")
    faculte_info = Faculte.objects.filter(universite=unikin, nom="Informatique").first()
    dept_info = (
        Departement.objects.filter(faculte=faculte_info).first()
        if faculte_info
        else None
    )

    # Liste des utilisateurs à créer
    users_data = [
        {
            "username": "admin",
            "email": "admin@unikin.cd",
            "password": "admin123",
            "first_name": "Admin",
            "last_name": "System",
            "role": "admin",  # CharField value
            "nouveau_role": role_admin,  # ForeignKey
            "is_staff": True,
            "is_superuser": True,
        },
        {
            "username": "moderateur1",
            "email": "moderateur1@unikin.cd",
            "password": "modo123",
            "first_name": "Jean",
            "last_name": "Moderateur",
            "role": "moderator",  # CharField value
            "nouveau_role": role_moderateur,  # ForeignKey
            "is_staff": True,
        },
        {
            "username": "moderateur2",
            "email": "moderateur2@unikin.cd",
            "password": "modo123",
            "first_name": "Marie",
            "last_name": "Moderatrice",
            "role": "moderator",  # CharField value
            "nouveau_role": role_moderateur,  # ForeignKey
            "is_staff": True,
        },
        {
            "username": "enseignant1",
            "email": "enseignant1@unikin.cd",
            "password": "prof123",
            "first_name": "Pierre",
            "last_name": "Professeur",
            "role": "publisher",  # CharField value (Enseignant = publiant)
            "nouveau_role": role_enseignant,  # ForeignKey
            "universite": unikin,
            "faculte": faculte_info,
        },
        {
            "username": "etudiant1",
            "email": "etudiant1@unikin.cd",
            "password": "etud123",
            "first_name": "Paul",
            "last_name": "Étudiant",
            "role": "student",  # CharField value
            "nouveau_role": role_etudiant,  # ForeignKey
            "universite": unikin,
            "faculte": faculte_info,
            "departement": dept_info,
        },
        {
            "username": "etudiant2",
            "email": "etudiant2@unikin.cd",
            "password": "etud123",
            "first_name": "Sophie",
            "last_name": "Étudiante",
            "role": "student",  # CharField value
            "nouveau_role": role_etudiant,  # ForeignKey
            "universite": unikin,
            "faculte": faculte_info,
            "departement": dept_info,
        },
    ]

    for user_data in users_data:
        password = user_data.pop("password")
        username = user_data["username"]

        user, created = User.objects.get_or_create(
            username=username, defaults=user_data
        )

        if created:
            user.set_password(password)
            user.save()
            role_name = user.nouveau_role.nom if user.nouveau_role else user.role
            print(f"   ✅ Utilisateur créé : {username} ({role_name})")
        else:
            print(f"   ℹ️  Utilisateur existant : {username}")

    # ===== STATISTIQUES FINALES =====
    print("\n" + "=" * 60)
    print("📊 STATISTIQUES FINALES")
    print("=" * 60)
    print(f"   🏛️  Universités : {Universite.objects.count()}")
    print(f"   🎓 Facultés : {Faculte.objects.count()}")
    print(f"   📚 Départements : {Departement.objects.count()}")
    print(f"   📋 Rôles : {Role.objects.count()}")
    print(f"   👥 Utilisateurs : {User.objects.count()}")
    print("=" * 60)
    print("✅ Peuplement terminé avec succès !")
    print("\n📝 IDENTIFIANTS DE CONNEXION :")
    print("   • Admin : admin / admin123")
    print("   • Modérateur 1 : moderateur1 / modo123")
    print("   • Modérateur 2 : moderateur2 / modo123")
    print("   • Enseignant : enseignant1 / prof123")
    print("   • Étudiant 1 : etudiant1 / etud123")
    print("   • Étudiant 2 : etudiant2 / etud123")


if __name__ == "__main__":
    try:
        populate_database()
    except Exception as e:
        print(f"\n❌ Erreur lors du peuplement : {e}")
        import traceback

        traceback.print_exc()
