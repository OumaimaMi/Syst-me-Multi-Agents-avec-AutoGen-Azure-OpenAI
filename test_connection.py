import os
import sys
from dotenv import load_dotenv
from openai import AzureOpenAI

# Obtenir le chemin absolu du dossier courant
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')

print(f"📁 Dossier courant : {current_dir}")
print(f"📄 Recherche du fichier .env : {env_path}")
print(f"✅ Fichier existe : {os.path.exists(env_path)}")

# Forcer le chargement du fichier .env
load_dotenv(dotenv_path=env_path, override=True)

# Récupérer les informations
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
api_version = os.getenv("AZURE_OPENAI_API_VERSION")

print("\n🔧 Test de connexion à Azure OpenAI...")
print(f"📡 Endpoint : {endpoint}")
print(f"🤖 Modèle : {deployment}")
print(f"📚 Version API : {api_version}")

# Vérifier que les variables sont chargées
if not all([endpoint, api_key, deployment, api_version]):
    print("\n❌ Des variables sont manquantes !")
    print("\n📋 Contenu du fichier .env :")
    try:
        with open(env_path, 'r') as f:
            print(f.read())
    except:
        print("Impossible de lire le fichier .env")
    exit(1)

try:
    # Créer le client
    client = AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=endpoint
    )

    # Faire une requête
    response = client.chat.completions.create(
        model=deployment,
        messages=[
            {"role": "system", "content": "Tu es un assistant utile."},
            {"role": "user", "content": "Bonjour ! Dis-moi quel modèle tu es et en quelques mots, présente-toi."}
        ],
        max_completion_tokens=200
    )

    print("\n✅ Connexion réussie !")
    print(f"📝 Réponse du modèle : {response.choices[0].message.content}")

except Exception as e:
    print(f"❌ Erreur : {e}")