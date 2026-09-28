import os
import asyncio
from dotenv import load_dotenv
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import SelectorGroupChat
from autogen_agentchat.conditions import TextMentionTermination, MaxMessageTermination
from autogen_agentchat.ui import Console
from autogen_core.models import ModelInfo
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient

# Charger les variables d'environnement
load_dotenv()

print("🤖 Lancement du système multi-agents...")

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
api_version = os.getenv("AZURE_OPENAI_API_VERSION")

if not all([endpoint, api_key, deployment, api_version]):
    print("❌ Des variables sont manquantes !")
    exit(1)

# Client Azure OpenAI (partagé par tous les agents)
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

# Agent 1 : Planificateur
planner = AssistantAgent(
    name="Planificateur",
    model_client=model_client,
    system_message="""Tu es un planificateur expert.
Tu décomposes les tâches complexes en étapes simples et claires.
Tu organises le travail de manière logique.
Tu interviens en premier pour proposer un plan, puis tu laisses
le Chercheur et le Redacteur travailler.""",
)

# Agent 2 : Chercheur
researcher = AssistantAgent(
    name="Chercheur",
    model_client=model_client,
    system_message="""Tu es un chercheur expert.
Tu trouves des informations pertinentes et des données fiables.
Tu présentes les faits de manière objective et structurée.""",
)

# Agent 3 : Rédacteur
writer = AssistantAgent(
    name="Redacteur",
    model_client=model_client,
    system_message="""Tu es un rédacteur expert.
Tu rédiges des textes clairs, structurés et engageants.
Tu adaptes ton style au public cible.
Une fois l'article final rédigé en entier, termine ta réponse par le mot TERMINATE.""",
)

# Condition d'arrêt : dès que "TERMINATE" apparaît, ou après 15 messages max
termination = TextMentionTermination("TERMINATE") | MaxMessageTermination(15)

# Équipe d'agents (le modèle choisit lui-même qui parle à chaque tour,
# équivalent du GroupChatManager de l'ancienne API)
team = SelectorGroupChat(
    participants=[planner, researcher, writer],
    model_client=model_client,
    termination_condition=termination,
)


async def main():
    task = """Je veux créer un article sur l'impact de l'intelligence artificielle
    sur l'éducation en Afrique. Peux-tu m'aider à structurer cet article avec
    une introduction, 3 sections principales et une conclusion ?"""

    print("\n💬 Conversation démarrée...\n")
    print("=" * 50)

    # Console affiche les échanges en temps réel dans le terminal
    await Console(team.run_stream(task=task))

    print("\n" + "=" * 50)
    print("✅ Conversation terminée !")

    await model_client.close()


if __name__ == "__main__":
    asyncio.run(main())