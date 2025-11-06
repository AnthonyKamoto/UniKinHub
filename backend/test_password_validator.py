"""
Script pour tester le validateur de mot de passe personnalisé.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news_system.settings')
django.setup()

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

def test_password(password):
    """Teste un mot de passe et affiche les résultats."""
    print(f"\nTest du mot de passe: '{password}'")
    try:
        validate_password(password)
        print("✅ Mot de passe valide!")
    except ValidationError as e:
        print("❌ Mot de passe invalide:")
        for error in e.messages:
            print(f"   - {error}")

if __name__ == "__main__":
    print("=" * 60)
    print("TEST DU VALIDATEUR DE MOT DE PASSE")
    print("=" * 60)
    
    # Mots de passe invalides
    test_password("short")  # Trop court
    test_password("lowercase123!")  # Pas de majuscule
    test_password("UPPERCASE!")  # Pas de chiffre
    test_password("NoSpecial123")  # Pas de caractère spécial
    test_password("password")  # Trop commun
    
    # Mots de passe valides
    test_password("Password123!")  # Valide
    test_password("SecureP@ss2024")  # Valide
    test_password("MyP@ssw0rd")  # Valide
    
    print("\n" + "=" * 60)
    print("Tests terminés!")
    print("=" * 60)
