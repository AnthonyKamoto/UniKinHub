from django.contrib.auth import get_user_model

from news.models import News

User = get_user_model()

# Vérifier l'utilisateur
u = User.objects.get(username="enseignant1")
print(f"Username: {u.username}")
print(f"Role: {u.role}")
print(f"Is Staff: {u.is_staff}")
print(f"Is Superuser: {u.is_superuser}")

# Vérifier le nouveau_role
if hasattr(u, "nouveau_role"):
    print(f"Has nouveau_role: {u.nouveau_role is not None}")
    if u.nouveau_role:
        print(f"Nouveau role: {u.nouveau_role}")
        print(f"Permissions: {u.nouveau_role.permissions}")
else:
    print("No nouveau_role attribute")

# Vérifier les news
news_list = News.objects.filter(author=u).order_by("-id")[:5]
print(f"\nNews de {u.username}: {news_list.count()}")
for n in news_list:
    print(f"  ID={n.id}, Status={n.status}, Draft Title={n.draft_title}")
