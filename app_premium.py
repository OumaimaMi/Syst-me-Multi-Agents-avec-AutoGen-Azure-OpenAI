import streamlit as st
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from universal_agent import UniversalAgent

load_dotenv()

# ============ CONFIGURATION DE LA PAGE ============
st.set_page_config(
    page_title="Agent IA Universel",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'About': " Agent Universel IA — Propulsé par Azure OpenAI"
    }
)

# ============ CSS THÈME BLEU MARINE ============
st.markdown("""
<style>
    /* ====== POLICE ====== */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
    
    /* ====== FOND DE L'APPLICATION ====== */
    .stApp {
        background: linear-gradient(135deg, #0a1929 0%, #1e3a5f 50%, #2c5282 100%);
    }
    
    /* ====== CONTENEUR PRINCIPAL TRANSPARENT ====== */
    .main .block-container {
        background: transparent;
        padding: 2rem;
        margin-top: 1rem;
    }
    
    /* ====== HEADER BLANC ====== */
    .main-header {
        font-size: 2.8rem;
        font-weight: 700;
        color: #ffffff !important;
        text-align: center;
        margin-bottom: 0.5rem;
        text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }
    
    .sub-header {
        font-size: 1.1rem;
        color: #bee3f8 !important;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 400;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    /* ====== TITRES H2, H3 EN BLANC ====== */
    .main h2, .main h3 {
        color: #ffffff !important;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    /* ====== ANIMATIONS ====== */
    @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    /* ====== BOUTONS ====== */
    .stButton>button {
        width: 100%;
        border-radius: 12px;
        height: 3em;
        background: linear-gradient(135deg, #3182ce 0%, #4299e1 100%);
        color: white !important;
        font-weight: 600;
        border: none;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(49, 130, 206, 0.4);
    }
    
    .stButton>button:hover {
        background: linear-gradient(135deg, #4299e1 0%, #63b3ed 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(66, 153, 225, 0.6);
    }
    
    /* ====== CARTES DE MESSAGES BLANCHES ====== */
    [data-testid="stChatMessage"] {
        background: #ffffff !important;
        border-radius: 15px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    [data-testid="stChatMessage"]:has([data-testid="chatAvatarIcon-user"]) {
        background: linear-gradient(135deg, #ffffff 0%, #ebf8ff 100%) !important;
        border-left: 5px solid #3182ce;
    }
    
    [data-testid="stChatMessage"]:has([data-testid="chatAvatarIcon-assistant"]) {
        background: linear-gradient(135deg, #ffffff 0%, #e6f0fa 100%) !important;
        border-left: 5px solid #1e3a5f;
    }
    
    /* ====== TEXTE DANS LES MESSAGES ====== */
    [data-testid="stChatMessage"] p,
    [data-testid="stChatMessage"] li,
    [data-testid="stChatMessage"] span,
    [data-testid="stChatMessage"] h1,
    [data-testid="stChatMessage"] h2,
    [data-testid="stChatMessage"] h3 {
        color: #1a202c !important;
    }
    
    /* ====== BLOCS DE CODE ====== */
    [data-testid="stChatMessage"] pre,
    [data-testid="stChatMessage"] code,
    .main pre,
    .main code {
        background: #1e3a5f !important;
        color: #ffffff !important;
        border-radius: 10px !important;
        padding: 1rem !important;
        font-family: 'Courier New', monospace !important;
        font-size: 0.9rem !important;
        border-left: 4px solid #4299e1 !important;
    }
    
    /* ====== SIDEBAR BLEU MARINE ====== */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #0a1929 0%, #1e3a5f 100%);
    }
    
    [data-testid="stSidebar"] * {
        color: white !important;
    }
    
    [data-testid="stSidebar"] .stRadio label {
        color: white !important;
        font-weight: 500;
    }
    
    [data-testid="stSidebar"] .stRadio > div {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 10px;
    }
    
    /* ====== CORRECTION STATISTIQUES SIDEBAR ====== */
    [data-testid="stSidebar"] div[style*="background: #ffffff"] *,
    [data-testid="stSidebar"] div[style*="background:#ffffff"] * {
        color: #1e3a5f !important;
    }
    
    [data-testid="stSidebar"] div[style*="background: #ffffff"],
    [data-testid="stSidebar"] div[style*="background:#ffffff"] {
        color: #1e3a5f !important;
    }
    
    /* ====== INPUT DE CHAT ====== */
    [data-testid="stChatInput"] {
        border-radius: 15px;
        border: 2px solid #3182ce;
        background: white;
    }
    
    [data-testid="stChatInput"] textarea {
        color: #1a202c !important;
        background: white !important;
    }
    
    /* ====== SCROLLBAR ====== */
    ::-webkit-scrollbar {
        width: 10px;
    }
    
    ::-webkit-scrollbar-track {
        background: #1e3a5f;
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3182ce 0%, #4299e1 100%);
        border-radius: 10px;
    }
    
    /* ====== SPINNER ====== */
    .stSpinner > div {
        border-top-color: #4299e1 !important;
    }
    
    /* ====== MÉTRIQUES ====== */
    [data-testid="stMetricValue"] {
        color: #ffffff !important;
    }
    
    [data-testid="stMetricLabel"] {
        color: #bee3f8 !important;
    }
    
    /* ====== EXPANDER ====== */
    .streamlit-expanderHeader {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff !important;
        font-weight: 600;
        border-radius: 10px;
    }
    
    /* ====== TEXTE GÉNÉRAL DANS LE MAIN ====== */
    .main p, .main li, .main span {
        color: #ffffff;
    }
    
    /* ====== TEXTE DES BOUTONS ====== */
    .main .stButton > button {
        color: white !important;
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

if "total_questions" not in st.session_state:
    st.session_state.total_questions = 0

if "start_time" not in st.session_state:
    st.session_state.start_time = datetime.now()

if "show_stats" not in st.session_state:
    st.session_state.show_stats = False

# ============ SIDEBAR ============
with st.sidebar:
    st.markdown("""
        <div style='text-align: center; padding: 1rem 0;'>
            <div style='font-size: 4rem; animation: pulse 2s infinite;'></div>
            <h2 style='color: white; margin: 0;'>Agent IA</h2>
            <p style='color: #bee3f8; font-size: 0.9rem;'>Version Premium</p>
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Statut du système (avec métriques Streamlit natives pour visibilité garantie)
    st.markdown("###  Statut")
    col_a, col_b = st.columns(2)
    with col_a:
        st.metric("❓ Questions", st.session_state.total_questions)
    with col_b:
        duree = (datetime.now() - st.session_state.start_time).seconds // 60
        st.metric("⏱️ Minutes", duree)
    
    st.markdown("---")
    
    # Configuration
    st.markdown("###  Configuration")
    st.markdown(f"""
        <div style='background: rgba(49, 130, 206, 0.3); padding: 0.8rem; border-radius: 10px; border-left: 3px solid #4299e1;'>
            <p style='color: #bee3f8; margin: 0; font-weight: 600;'> Connecté</p>
            <p style='color: #e2e8f0; margin: 0.3rem 0 0 0; font-size: 0.85rem;'>
                Modèle : {os.getenv('AZURE_OPENAI_DEPLOYMENT', 'N/A')}
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Mode de réponse
    st.markdown("###  Mode de réponse")
    mode = st.radio(
        "Choisissez le type :",
        [
            " Question",
            " Solutions",
            " Explication",
            " Résolution",
            " Création"
        ],
        index=0,
        label_visibility="collapsed"
    )
    
    mode_map = {
        " Question": "question",
        " Solutions": "solutions",
        " Explication": "expliquer",
        "Résolution": "resoudre",
        " Création": "creer"
    }
    st.session_state.mode = mode_map[mode]
    
    st.markdown("---")
    
    # Actions
    st.markdown("###  Actions")
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button(" Reset", use_container_width=True):
            st.session_state.messages = []
            st.session_state.agent.clear_history()
            st.session_state.total_questions = 0
            st.rerun()
    
    with col2:
        if st.button(" Stats", use_container_width=True):
            st.session_state.show_stats = not st.session_state.show_stats
            st.rerun()
    
    # Export
    if st.session_state.messages:
        export_text = "\n\n".join([
            f"[{msg['role'].upper()}]\n{msg['content']}"
            for msg in st.session_state.messages
        ])
        st.download_button(
            label="💾 Exporter",
            data=export_text,
            file_name=f"conversation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
            mime="text/plain",
            use_container_width=True
        )
    
    st.markdown("---")
    st.markdown("""
        <div style='text-align: center; color: #bee3f8; font-size: 0.8rem;'>
            <p>💡 Posez n'importe quelle question</p>
            <p>Propulsé par Azure OpenAI</p>
        </div>
    """, unsafe_allow_html=True)

# ============ CONTENU PRINCIPAL ============
st.markdown('<h1 class="main-header"> Agent IA Universel</h1>', unsafe_allow_html=True)
st.markdown(
    '<p class="sub-header">Posez n\'importe quelle question — je vous réponds et propose des solutions</p>',
    unsafe_allow_html=True
)

# ============ STATISTIQUES (si activé) ============
if st.session_state.show_stats:
    st.markdown("---")
    st.markdown("###  Tableau de bord")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("📝 Messages", len(st.session_state.messages))
    with col2:
        st.metric("❓ Questions", st.session_state.total_questions)
    with col3:
        st.metric("⏱️ Durée", f"{(datetime.now() - st.session_state.start_time).seconds // 60} min")
    with col4:
        st.metric("🎯 Mode", mode)
    
    st.markdown("---")

# ============ EXEMPLES INTERACTIFS ============
if not st.session_state.messages:
    st.markdown("### 💡 Essayez ces exemples")
    
    col1, col2, col3 = st.columns(3)
    
    exemples = {
        "💻 Informatique": [
            "Comment créer une API REST en Python ?",
            "Explique-moi Docker simplement",
            "Comment apprendre le machine learning ?"
        ],
        "🍳 Cuisine": [
            "Recette de couscous tunisien",
            "Comment faire du pain maison ?",
            "Idées de repas rapides et sains"
        ],
        "✈️ Voyage": [
            "Que visiter à Paris en 3 jours ?",
            "Guide de voyage en Tunisie",
            "Comment préparer un road trip ?"
        ]
    }
    
    for col, (titre, questions) in zip([col1, col2, col3], exemples.items()):
        with col:
            st.markdown(f"**{titre}**")
            for q in questions:
                if st.button(q, key=f"ex_{q}", use_container_width=True):
                    st.session_state.messages.append({"role": "user", "content": q})
                    st.session_state.pending_prompt = q
                    st.rerun()

# ============ AFFICHAGE DE L'HISTORIQUE ============
for i, message in enumerate(st.session_state.messages):
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# ============ GESTION DU PROMPT EN ATTENTE ============
if "pending_prompt" in st.session_state and st.session_state.pending_prompt:
    prompt = st.session_state.pending_prompt
    st.session_state.pending_prompt = None
    
    with st.chat_message("assistant"):
        with st.spinner("🤔 L'agent réfléchit..."):
            try:
                agent = st.session_state.agent
                mode_actuel = st.session_state.mode
                
                if mode_actuel == "question":
                    response = agent.ask(prompt)
                elif mode_actuel == "solutions":
                    response = agent.propose_solutions(prompt)
                elif mode_actuel == "expliquer":
                    response = agent.expliquer(prompt)
                elif mode_actuel == "resoudre":
                    response = agent.resoudre(prompt)
                elif mode_actuel == "creer":
                    response = agent.creer(prompt)
                else:
                    response = agent.ask(prompt)
                
                st.markdown(response)
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": response
                })
                st.session_state.total_questions += 1
                st.rerun()
            except Exception as e:
                st.error(f"❌ Erreur : {e}")

# ============ INPUT UTILISATEUR ============
placeholders = {
    "question": " Posez votre question...",
    "solutions": " Décrivez votre problème...",
    "expliquer": " Quel sujet expliquer ?",
    "resoudre": " Quel problème résoudre ?",
    "creer": " Que voulez-vous créer ?"
}

if prompt := st.chat_input(placeholders.get(st.session_state.mode, "Posez votre question...")):
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    with st.chat_message("assistant"):
        with st.spinner(" L'agent réfléchit..."):
            try:
                agent = st.session_state.agent
                mode_actuel = st.session_state.mode
                
                if mode_actuel == "question":
                    response = agent.ask(prompt)
                elif mode_actuel == "solutions":
                    response = agent.propose_solutions(prompt)
                elif mode_actuel == "expliquer":
                    response = agent.expliquer(prompt)
                elif mode_actuel == "resoudre":
                    response = agent.resoudre(prompt)
                elif mode_actuel == "creer":
                    response = agent.creer(prompt)
                else:
                    response = agent.ask(prompt)
                
                st.markdown(response)
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": response
                })
                st.session_state.total_questions += 1
                
            except Exception as e:
                st.error(f"❌ Erreur : {e}")

# ============ PIED DE PAGE ============
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: #bee3f8; padding: 1rem;'>
        <p style='font-weight: 600; color: #ffffff;'> Agent IA Universel — Version Premium</p>
        <p style='font-size: 0.85rem; color: #bee3f8;'>Propulsé par Azure OpenAI | Développé par Oumaima Bouhani</p>
        <p style='font-size: 0.8rem; color: #90cdf4;'>© 2026 Smartovate Ltd</p>
    </div>
    """,
    unsafe_allow_html=True
)