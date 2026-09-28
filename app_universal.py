import streamlit as st
import os
import sys
from dotenv import load_dotenv

# Ajouter le chemin du projet
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importer l'agent universel
from universal_agent import UniversalAgent

load_dotenv()

# ============ CONFIGURATION DE LA PAGE ============
st.set_page_config(
    page_title="Agent Universel IA",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ============ STYLE CSS PERSONNALISÉ ============
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #4A90E2;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }
    .stButton>button {
        width: 100%;
        border-radius: 10px;
        height: 3em;
        background-color: #4A90E2;
        color: white;
    }
    .stButton>button:hover {
        background-color: #357ABD;
    }
</style>
""", unsafe_allow_html=True)

# ============ INITIALISATION ============
if "messages" not in st.session_state:
    st.session_state.messages = []

if "agent" not in st.session_state:
    st.session_state.agent = UniversalAgent()

if "mode" not in st.session_state:
    st.session_state.mode = "question"

# ============ SIDEBAR ============
with st.sidebar:
    st.image("https://img.icons8.com/color/96/000000/robot-2.png", width=80)
    st.title("🤖 Agent Universel")
    st.markdown("---")
    
    st.subheader("⚙️ Configuration")
    st.info(f"🔑 Modèle : {os.getenv('AZURE_OPENAI_DEPLOYMENT', 'Non configuré')}")
    
    st.markdown("---")
    st.subheader("🎯 Mode de réponse")
    
    mode = st.radio(
        "Choisissez le type de réponse :",
        [
            "❓ Poser une question",
            "💡 Proposer des solutions",
            "📚 Expliquer un sujet",
            "🔧 Résoudre un problème",
            "🎨 Créer quelque chose"
        ],
        index=0
    )
    
    # Mapper le choix au mode
    mode_map = {
        "❓ Poser une question": "question",
        "💡 Proposer des solutions": "solutions",
        "📚 Expliquer un sujet": "expliquer",
        "🔧 Résoudre un problème": "resoudre",
        "🎨 Créer quelque chose": "creer"
    }
    st.session_state.mode = mode_map[mode]
    
    st.markdown("---")
    
    # Bouton de réinitialisation
    if st.button("🔄 Réinitialiser la conversation"):
        st.session_state.messages = []
        st.session_state.agent.clear_history()
        st.rerun()
    
    # Bouton d'export
    if st.button("💾 Exporter la conversation"):
        if st.session_state.messages:
            export_text = "\n\n".join([
                f"[{msg['role'].upper()}]\n{msg['content']}"
                for msg in st.session_state.messages
            ])
            st.download_button(
                label="📥 Télécharger",
                data=export_text,
                file_name="conversation_agent.txt",
                mime="text/plain"
            )
    
    st.markdown("---")
    st.caption("💡 Posez n'importe quelle question !")
    st.caption("L'agent est polyvalent et peut vous aider dans tous les domaines.")

# ============ CONTENU PRINCIPAL ============
st.markdown('<h1 class="main-header">🤖 Agent Universel IA</h1>', unsafe_allow_html=True)
st.markdown(
    '<p class="sub-header">Posez n\'importe quelle question — l\'agent vous répond et propose des solutions</p>',
    unsafe_allow_html=True
)

# ============ EXEMPLES DE QUESTIONS ============
with st.expander("💡 Exemples de questions à poser", expanded=False):
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("**💻 Informatique**")
        st.markdown("- Comment créer une API REST ?")
        st.markdown("- Explique-moi Docker")
        st.markdown("- Comment apprendre Python ?")
    
    with col2:
        st.markdown("**🍳 Cuisine**")
        st.markdown("- Recette de couscous tunisien")
        st.markdown("- Comment faire du pain ?")
        st.markdown("- Idées de repas rapides")
    
    with col3:
        st.markdown("**✈️ Voyage**")
        st.markdown("- Que visiter à Paris ?")
        st.markdown("- Voyage en Tunisie")
        st.markdown("- Comment préparer un voyage ?")

st.markdown("---")

# ============ AFFICHAGE DE L'HISTORIQUE ============
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ============ INPUT UTILISATEUR ============
placeholder = {
    "question": "Posez votre question...",
    "solutions": "Décrivez votre problème pour obtenir des solutions...",
    "expliquer": "Quel sujet voulez-vous expliquer ?",
    "resoudre": "Quel problème voulez-vous résoudre ?",
    "creer": "Que voulez-vous créer ?"
}

if prompt := st.chat_input(placeholder.get(st.session_state.mode, "Posez votre question...")):
    # Ajouter le message utilisateur
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Traiter selon le mode
    with st.chat_message("assistant"):
        with st.spinner("🤔 L'agent réfléchit..."):
            try:
                agent = st.session_state.agent
                
                if st.session_state.mode == "question":
                    response = agent.ask(prompt)
                elif st.session_state.mode == "solutions":
                    response = agent.propose_solutions(prompt)
                elif st.session_state.mode == "expliquer":
                    response = agent.expliquer(prompt)
                elif st.session_state.mode == "resoudre":
                    response = agent.resoudre(prompt)
                elif st.session_state.mode == "creer":
                    response = agent.creer(prompt)
                else:
                    response = agent.ask(prompt)
                
                # Afficher la réponse
                st.markdown(response)
                
                # Sauvegarder dans l'historique
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": response
                })
                
            except Exception as e:
                st.error(f"❌ Erreur : {e}")
                st.info("Vérifiez que votre fichier .env est bien configuré.")

# ============ PIED DE PAGE ============
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: #666; padding: 1rem;'>
        <p>🤖 <strong>Agent Universel IA</strong> — Propulsé par Azure OpenAI</p>
        <p>Développé par Oumaima Bouhani — Smartovate Ltd © 2026</p>
    </div>
    """,
    unsafe_allow_html=True
)