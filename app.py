import streamlit as st
import os
import sys
from dotenv import load_dotenv

# Ajouter le chemin du projet
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Importer le système multi-agents
from multi_agents_final import GroupChat

load_dotenv()

st.set_page_config(
    page_title="Système Multi-Agents",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 Système Multi-Agents avec AutoGen + Azure OpenAI")
st.markdown("---")

# Sidebar
with st.sidebar:
    st.header("⚙️ Configuration")
    st.info(f"🔑 Modèle : {os.getenv('AZURE_OPENAI_DEPLOYMENT', 'Non configuré')}")
    
    if st.button("🔄 Réinitialiser la conversation"):
        st.session_state.messages = []
        st.session_state.history = []
        st.rerun()

# Initialiser l'historique
if "messages" not in st.session_state:
    st.session_state.messages = []
    st.session_state.history = []

# Afficher les messages
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Input utilisateur
if prompt := st.chat_input("Entrez votre requête..."):
    # Ajouter le message utilisateur
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Traiter avec le système multi-agents
    with st.chat_message("assistant"):
        with st.spinner("🤔 Les agents réfléchissent..."):
            try:
                chat = GroupChat()
                result = chat.solve_task(prompt)
                
                # Afficher le résultat
                st.markdown("### 📋 Plan")
                st.markdown(result["plan"])
                
                st.markdown("### 💻 Code généré")
                st.code(result["code"], language="python")
                
                st.markdown("### 🔍 Revue")
                st.markdown(result["review"])
                
                st.markdown("### ✅ Validation")
                st.markdown(result["validation"])
                
                # Sauvegarder
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": f"✅ Validation : {result['validation']}"
                })
                
            except Exception as e:
                st.error(f"❌ Erreur : {e}")