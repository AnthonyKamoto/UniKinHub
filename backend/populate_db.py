#!/usr/bin/env python
"""
Script pour peupler la base de données avec les universités et facultés
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from news.models import Universite, Faculte, Role

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
            nom=role_data["nom"],
            defaults={"description": role_data["description"]}
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
            defaults={
                "nom": uni_data["nom"],
                "ville": uni_data["ville"]
            }
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
            "departements": [
                "Informatique de gestion",
                "Génie informatique"
            ]
        },
        "Droit": {
            "code": "DRT",
            "departements": [
                "Droit public",
                "Droit Pénal",
                "Droit Économique et social"
            ]
        },
        "Économie": {
            "code": "ECO",
            "departements": [
                "Économie publique",
                "Économie monétaire"
            ]
        },
        "Communication": {
            "code": "COM",
            "departements": [
                "Journalisme",
                "Communication des entreprises"
            ]
        },
        "Médecine": {
            "code": "MED",
            "departements": [
                "Biologie Médicale",
                "Médecine Physique",
                "Bucco-dentaire"
            ]
        }
    }
    
    # Créer chaque faculté pour chaque université
    from news.models import Departement
    
    for uni_code, universite in universites.items():
        print(f"\n   📌 Facultés pour {universite.code}:")
        for faculte_nom, faculte_info in facultes_departements.items():
            faculte, created = Faculte.objects.get_or_create(
                nom=faculte_nom,
                universite=universite,
                defaults={"code": faculte_info["code"]}
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
                    defaults={"code": dept_nom[:3].upper()}
                )
                if dept_created:
                    print(f"         ✅ Département créé : {departement.nom}")
                else:
                    print(f"         ℹ️  Département existant : {departement.nom}")
    
    # ===== STATISTIQUES FINALES =====
    from news.models import Departement
    
    print("\n" + "="*60)
    print("📊 STATISTIQUES FINALES")
    print("="*60)
    print(f"   🏛️  Universités : {Universite.objects.count()}")
    print(f"   🎓 Facultés : {Faculte.objects.count()}")
    print(f"   📚 Départements : {Departement.objects.count()}")
    print(f"   📋 Rôles : {Role.objects.count()}")
    print("="*60)
    print("✅ Peuplement terminé avec succès !")
    

if __name__ == "__main__":
    try:
        populate_database()
    except Exception as e:
        print(f"\n❌ Erreur lors du peuplement : {e}")
        import traceback
        traceback.print_exc()
