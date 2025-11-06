#!/usr/bin/env python
"""Requête SQL directe sur la base de données SQLite"""

import sqlite3
import os

db_path = 'db.sqlite3'

if not os.path.exists(db_path):
    print(f"❌ Fichier {db_path} introuvable")
    exit(1)

# Connexion à la base de données
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("\n" + "="*80)
print("🔍 REQUÊTES SQL DIRECTES SUR LA BASE DE DONNÉES SQLite")
print("="*80 + "\n")

print(f"📁 Fichier: {os.path.abspath(db_path)}")
print(f"💾 Taille: {os.path.getsize(db_path) / 1024:.2f} KB\n")

# Liste des tables
print("📋 TABLES DANS LA BASE:")
print("-" * 80)
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = cursor.fetchall()
for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
    count = cursor.fetchone()[0]
    print(f"   • {table[0]:40} : {count:5} enregistrements")

print("\n" + "="*80)
print("🔎 DÉTAILS DES DONNÉES")
print("="*80 + "\n")

# Utilisateurs
print("👥 UTILISATEURS:")
cursor.execute("""
    SELECT username, first_name, last_name, role, email 
    FROM news_user 
    ORDER BY role, username 
    LIMIT 10
""")
users = cursor.fetchall()
for user in users:
    print(f"   • {user[0]:20} | {user[1]} {user[2]:20} | {user[3]:10} | {user[4]}")
cursor.execute("SELECT COUNT(*) FROM news_user")
total_users = cursor.fetchone()[0]
if total_users > 10:
    print(f"   ... et {total_users - 10} autres utilisateurs\n")

# Catégories
print("\n🏷️  CATÉGORIES:")
cursor.execute("SELECT name, color FROM news_category ORDER BY name")
categories = cursor.fetchall()
for cat in categories:
    cursor.execute("SELECT COUNT(*) FROM news_news WHERE category_id IN (SELECT id FROM news_category WHERE name=?)", (cat[0],))
    count = cursor.fetchone()[0]
    print(f"   • {cat[0]:20} ({cat[1]}) - {count} actualités")

# Actualités par statut
print("\n📰 ACTUALITÉS PAR STATUT:")
for status in ['published', 'pending', 'draft']:
    cursor.execute("SELECT COUNT(*) FROM news_news WHERE status=?", (status,))
    count = cursor.fetchone()[0]
    status_label = {'published': 'Publiées', 'pending': 'En attente', 'draft': 'Brouillons'}
    print(f"   • {status_label[status]:15} : {count}")

# Commentaires
cursor.execute("SELECT COUNT(*) FROM news_comment")
comments_count = cursor.fetchone()[0]
print(f"\n💬 COMMENTAIRES: {comments_count}")

# Likes
cursor.execute("SELECT COUNT(*) FROM news_newslike")
likes_count = cursor.fetchone()[0]
print(f"❤️  LIKES: {likes_count}")

# Top 5 actualités avec le plus de likes
print(f"\n⭐ TOP 5 ACTUALITÉS LES PLUS LIKÉES:")
cursor.execute("""
    SELECT n.final_title, COUNT(l.id) as likes_count
    FROM news_news n
    LEFT JOIN news_newslike l ON n.id = l.news_id
    GROUP BY n.id
    HAVING likes_count > 0
    ORDER BY likes_count DESC
    LIMIT 5
""")
top_news = cursor.fetchall()
for i, (title, likes) in enumerate(top_news, 1):
    title_display = title[:50] if title else "[Sans titre]"
    print(f"   {i}. {title_display} - {likes} likes")

# Actualités récentes publiées
print(f"\n📅 DERNIÈRES ACTUALITÉS PUBLIÉES:")
cursor.execute("""
    SELECT n.final_title, u.first_name, u.last_name, c.name, n.created_at
    FROM news_news n
    JOIN news_user u ON n.author_id = u.id
    LEFT JOIN news_category c ON n.category_id = c.id
    WHERE n.status = 'published'
    ORDER BY n.created_at DESC
    LIMIT 5
""")
recent_news = cursor.fetchall()
for i, (title, fname, lname, cat, date) in enumerate(recent_news, 1):
    title_display = title[:40] if title else "[Sans titre]"
    cat_display = cat if cat else "Sans catégorie"
    print(f"   {i}. {title_display}")
    print(f"      Par {fname} {lname} | {cat_display} | {date}")

print("\n" + "="*80)
print("✅ TOUTES LES DONNÉES SONT BIEN STOCKÉES PHYSIQUEMENT DANS db.sqlite3")
print("="*80)
print("\n💾 Persistance confirmée:")
print(f"   • Fichier: {os.path.abspath(db_path)}")
print(f"   • Taille: {os.path.getsize(db_path) / (1024*1024):.2f} MB")
print(f"   • Dernière modification: {os.path.getmtime(db_path)}")
print(f"   • {total_users} utilisateurs")
print(f"   • {comments_count} commentaires")
print(f"   • {likes_count} likes")
print("\n🌐 Accessible via:")
print("   • Django ORM (Python)")
print("   • API REST Django (http://localhost:8000/api/)")
print("   • Application Web React (http://localhost:3001/)")
print("   • Application Mobile Flutter")
print("\n")

conn.close()
