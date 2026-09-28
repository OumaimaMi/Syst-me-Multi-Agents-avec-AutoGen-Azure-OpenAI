import os
import asyncio
from dotenv import load_dotenv
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.messages import TextMessage
from autogen_core import CancellationToken
from autogen_core.models import ModelInfo
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient

# Charger les variables d'environnement
load_dotenv()

print("🔧 Test d'AutoGen avec Azure OpenAI...")

# Récupérer les variables
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
api_version = os.getenv("AZURE_OPENAI_API_VERSION")

if not all([endpoint, api_key, deployment, api_version]):
    print("❌ Des variables sont manquantes !")
    exit(1)

print(f"📡 Endpoint : {endpoint}")
print(f"🤖 Modèle : {deployment}")

# (Optionnel) Nom exact du modèle résolu par Azure, ex: "gpt-5.4-2026-03-05"
# Défini via AZURE_OPENAI_MODEL_NAME dans le .env pour supprimer le warning
# "Resolved model mismatch". Si absent, on retombe sur `deployment`.

# Créer le client Azure OpenAI
model_client = AzureOpenAIChatCompletionClient(
    azure_deployment=deployment,
    model=os.getenv("AZURE_OPENAI_MODEL_NAME", deployment),
    api_key=api_key,
    api_version=api_version,
    azure_endpoint=endpoint,
    model_info=ModelInfo(
        vision=False,
        function_calling=True,
        json_output=True,
        family="unknown",
        structured_output=True,
    ),
)


async def main():
    # Créer un assistant
    agent = AssistantAgent(
        name="Assistant",
        model_client=model_client,
        system_message="Je suis un assistant IA utile qui répond aux questions.",
    )

    print("\n💬 Lancement de la conversation...\n")

    # Envoyer un message
    response = await agent.on_messages(
        [
            TextMessage(
                content="Bonjour ! Dis-moi en quelques mots quel modèle tu utilises.",
                source="User",
            )
        ],
        CancellationToken(),
    )

    print(f"📝 Réponse : {response.chat_message.content}")

    # Fermer proprement le client
    await model_client.close()


if __name__ == "__main__":
    asyncio.run(main())