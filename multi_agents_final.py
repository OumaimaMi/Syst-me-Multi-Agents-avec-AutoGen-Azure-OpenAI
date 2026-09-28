import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from dataclasses import dataclass, field
from typing import List, Dict, Optional
import unicodedata

load_dotenv()

# ============ CONFIGURATION ============
def get_openai_client():
    """Retourne le client Azure OpenAI configuré"""
    return AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

def get_model():
    """Retourne le nom du modèle déployé"""
    return os.getenv("AZURE_OPENAI_DEPLOYMENT")


# ============ AGENT DE BASE ============
class BaseAgent:
    """Classe de base pour tous les agents"""
    
    def __init__(self, name, system_prompt):
        self.name = name
        self.system_prompt = system_prompt
        self.client = get_openai_client()
        self.model = get_model()
        self.history = []
    
    def process(self, message):
        """Traite un message et retourne une réponse"""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": message}
        ]
        if self.history:
            messages = self.history + messages
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_completion_tokens=800,
            temperature=0.7
        )
        result = response.choices[0].message.content
        self.history.append({"role": "user", "content": message})
        self.history.append({"role": "assistant", "content": result})
        return result
    
    def clear_history(self):
        """Efface l'historique de l'agent"""
        self.history = []


# ============ AGENT PLANIFICATEUR ============
class PlannerAgent(BaseAgent):
    """Agent planificateur - décompose les tâches complexes"""
    
    def __init__(self):
        super().__init__(
            name="Planificateur",
            system_prompt="""Tu es un planificateur expert. Tu décomposes les tâches complexes 
            en étapes simples et claires. Tu organises le travail de manière logique.
            Réponds de manière structurée avec des étapes numérotées.
            Chaque étape doit être claire et actionable."""
        )
    
    def create_plan(self, task):
        """Crée un plan d'action pour une tâche donnée"""
        prompt = f"""Décompose cette tâche en étapes claires et structurées :
        
        Tâche : {task}
        
        Fournis un plan avec des étapes numérotées."""
        return self.process(prompt)


# ============ AGENT CODEUR ============
class CoderAgent(BaseAgent):
    """Agent codeur - génère du code"""
    
    def __init__(self):
        super().__init__(
            name="Codeur",
            system_prompt="""Tu es un développeur expert en Python. 
            Tu génères du code propre, documenté et fonctionnel.
            Tu utilises les bonnes pratiques de programmation.
            Tu inclus des commentaires pour expliquer ton code.
            Le code doit être complet et exécutable."""
        )
    
    def generate_code(self, requirements):
        """Génère du code à partir des exigences"""
        prompt = f"""Génère du code Python pour répondre à ces exigences :
        
        {requirements}
        
        Fournis uniquement le code avec des commentaires.
        Le code doit être complet et prêt à être exécuté."""
        return self.process(prompt)


# ============ AGENT RÉVISEUR ============
class ReviewerAgent(BaseAgent):
    """Agent réviseur - analyse et corrige le code"""
    
    def __init__(self):
        super().__init__(
            name="Réviseur",
            system_prompt="""Tu es un expert en revue de code. 
            Tu analyses le code pour identifier :
            - Les erreurs potentielles
            - Les problèmes de sécurité
            - Les améliorations possibles
            - Les problèmes de performance
            Tu proposes des corrections concrètes.
            Tu réponds toujours par YES ou NO avec une explication détaillée."""
        )
    
    def review_code(self, code):
        """Révise le code et propose des améliorations"""
        prompt = (
            "Analyse ce code et propose des améliorations :\n\n"
            "```python\n"
            f"{code}\n"
            "```\n\n"
            "Structure ta réponse avec :\n"
            "- ✅ Points positifs\n"
            "- ❌ Erreurs identifiées\n"
            "- ⚠️ Problèmes potentiels\n"
            "- 💡 Suggestions d'amélioration\n"
            "- ✅ Version corrigée"
        )
        return self.process(prompt)
    
    def validate_code(self, code):
        """Valide si le code est correct"""
        prompt = (
            "Est-ce que ce code est correct et prêt à être utilisé ?\n\n"
            "```python\n"
            f"{code}\n"
            "```\n\n"
            "Réponds par YES ou NO et explique pourquoi en 2-3 phrases."
        )
        return self.process(prompt)


# ============ GROUPE DE CHAT ============
class GroupChat:
    """Gestionnaire de conversation en groupe"""
    
    def __init__(self):
        self.planner = PlannerAgent()
        self.coder = CoderAgent()
        self.reviewer = ReviewerAgent()
        self.history = []
        self.max_iterations = 5
    
    def solve_task(self, task):
        """Résout une tâche avec tous les agents"""
        self.clear_history()
        
        print("\n" + "="*60)
        print(f"📋 TÂCHE : {task}")
        print("="*60)
        
        print("\n🗂️ ÉTAPE 1 - PLANIFICATION")
        print("-"*40)
        plan = self.planner.create_plan(task)
        print(f"📝 Plan :\n{plan}")
        self.history.append({"agent": "Planificateur", "message": plan})
        
        print("\n💻 ÉTAPE 2 - GÉNÉRATION DU CODE")
        print("-"*40)
        code = self.coder.generate_code(plan)
        print(f"📄 Code généré :\n{code}")
        self.history.append({"agent": "Codeur", "message": code})
        
        print("\n🔍 ÉTAPE 3 - RÉVISION DU CODE")
        print("-"*40)
        review = self.reviewer.review_code(code)
        print(f"📝 Revue :\n{review}")
        self.history.append({"agent": "Réviseur", "message": review})
        
        print("\n✅ ÉTAPE 4 - VALIDATION")
        print("-"*40)
        validation = self.reviewer.validate_code(code)
        print(f"🔒 Validation : {validation}")
        self.history.append({"agent": "Réviseur", "message": f"Validation : {validation}"})
        
        return {
            "plan": plan,
            "code": code,
            "review": review,
            "validation": validation,
            "history": self.history
        }
    
    def clear_history(self):
        """Efface l'historique de tous les agents"""
        self.history = []
        self.planner.clear_history()
        self.coder.clear_history()
        self.reviewer.clear_history()


# ============ UTILITAIRES ============

def normalize_text(text: str) -> str:
    """
    Normalise une chaîne :
    - minuscules
    - suppression des accents
    - suppression des espaces superflus (internes et externes)
    """
    if not isinstance(text, str):
        return ""
    text = " ".join(text.strip().lower().split())
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return text


def safe_int_input(
    prompt: str,
    default: Optional[int] = None,
    min_value: Optional[int] = None,
    max_value: Optional[int] = None
) -> Optional[int]:
    """
    Demande une valeur entière avec validation optionnelle des bornes.
    """
    while True:
        raw = input(prompt).strip()
        if not raw:
            return default
        try:
            value = int(raw)
        except ValueError:
            print("Veuillez entrer un nombre entier valide.")
            continue

        if min_value is not None and value < min_value:
            print(f"La valeur doit être >= {min_value}.")
            continue
        if max_value is not None and value > max_value:
            print(f"La valeur doit être <= {max_value}.")
            continue
        return value


def yes_no_input(prompt: str, default: Optional[bool] = None) -> Optional[bool]:
    """
    Demande une réponse oui/non avec possibilité de sortie.
    """
    while True:
        raw = normalize_text(input(prompt).strip())
        if not raw and default is not None:
            return default
        if raw in {"oui", "o", "yes", "y"}:
            return True
        if raw in {"non", "n", "no"}:
            return False
        if raw in {"q", "quit", "exit"}:
            return None
        print("Répondez par 'oui' ou 'non'. Tapez 'q' pour quitter.")


# ============ MODÈLES DE DONNÉES ============

@dataclass
class NameCandidate:
    """Représente un nom candidat avec ses métadonnées"""
    name: str
    style: str
    origin: str
    meaning: str
    easy_to_pronounce: bool
    contexts: List[str]
    score: float = 0.0
    evaluation_details: Dict[str, float] = field(default_factory=dict)


@dataclass
class NamingCriteria:
    """Regroupe les critères définis par l'utilisateur"""
    objective: str
    context: str
    desired_styles: List[str]
    min_length: int
    max_length: int
    origin: str
    easy_to_pronounce: Optional[bool]
    meaning_required: Optional[bool]
    desired_meaning_keyword: str = ""


# ============ BASE DE DONNÉES DE NOMS ============

NAME_DATABASE: List[NameCandidate] = [
    NameCandidate(
        name="Gabriel",
        style="classique",
        origin="hébreu",
        meaning="force de Dieu",
        easy_to_pronounce=True,
        contexts=["prenom", "personnage"],
    ),
    NameCandidate(
        name="Léo",
        style="moderne",
        origin="latin",
        meaning="lion",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
    NameCandidate(
        name="Arthur",
        style="classique",
        origin="celtique",
        meaning="ours",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
    NameCandidate(
        name="Ethan",
        style="moderne",
        origin="hébreu",
        meaning="fort, ferme",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
    NameCandidate(
        name="Naël",
        style="moderne",
        origin="arabe",
        meaning="lumière",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
    NameCandidate(
        name="Raphaël",
        style="classique",
        origin="hébreu",
        meaning="Dieu guérit",
        easy_to_pronounce=True,
        contexts=["prenom", "personnage"],
    ),
    NameCandidate(
        name="Sasha",
        style="moderne",
        origin="russe",
        meaning="défenseur de l'humanité",
        easy_to_pronounce=True,
        contexts=["prenom", "personnage"],
    ),
    NameCandidate(
        name="Killian",
        style="moderne",
        origin="celtique",
        meaning="guerrier",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
    NameCandidate(
        name="Malo",
        style="moderne",
        origin="breton",
        meaning="lumière",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
    NameCandidate(
        name="Timéo",
        style="moderne",
        origin="grec",
        meaning="honorer Dieu",
        easy_to_pronounce=True,
        contexts=["prenom"],
    ),
]


# ============ FONCTION PRINCIPALE ============

def main():
    """
    Fonction principale du programme.
    Elle guide l'utilisateur pour choisir un nom masculin.
    """
    print("\n" + "="*60)
    print("👤 ASSISTANT DE CHOIX DE NOM MASCULIN")
    print("="*60)
    
    print("\n📋 Objectif : trouver un nom masculin adapté à votre besoin.")
    
    # 1. Demander le contexte
    context = input("\n📌 Pour quel contexte cherchez-vous un nom ?\n(personne, personnage, marque, animal, projet...) : ")
    
    if not context:
        context = "personne"
        print("   → Contexte par défaut : personne")
    
    # 2. Demander le style
    styles_input = input("\n🎨 Styles souhaités (classique, moderne, rare, élégant, fort)\n(laisser vide pour tous) : ")
    desired_styles = [s.strip() for s in styles_input.split(",")] if styles_input else []
    
    # 3. Demander l'origine
    origin = input("\n🌍 Origine du nom (hébreu, latin, arabe, celtique, etc.)\n(laisser vide pour toutes) : ")
    
    # 4. Afficher les noms disponibles
    print("\n" + "-"*60)
    print("🔍 RECHERCHE DE NOMS...")
    print("-"*60)
    
    matching_names = []
    
    for candidate in NAME_DATABASE:
        # Filtrer par contexte
        if context.lower() not in [c.lower() for c in candidate.contexts] and candidate.contexts:
            continue
        
        # Filtrer par style
        if desired_styles:
            if not any(style.lower() in candidate.style.lower() for style in desired_styles):
                continue
        
        # Filtrer par origine
        if origin and origin.lower() not in candidate.origin.lower():
            continue
        
        matching_names.append(candidate)
    
    # 5. Afficher les résultats
    if matching_names:
        print(f"\n✅ {len(matching_names)} noms trouvés :")
        print("-"*40)
        for i, name in enumerate(matching_names, 1):
            print(f"{i}. {name.name} ({name.style})")
            print(f"   → Origine : {name.origin}")
            print(f"   → Signification : {name.meaning}")
            print(f"   → Contexte : {', '.join(name.contexts)}")
            print()
    else:
        print("\n❌ Aucun nom ne correspond à vos critères.")
        print("💡 Essayez d'élargir vos filtres.")
    
    # 6. Proposer une sauvegarde
    save = yes_no_input("\n💾 Voulez-vous sauvegarder cette recherche ? (o/n) : ")
    if save:
        filename = f"resultats_nom_{context}.txt"
        try:
            with open(filename, "w", encoding="utf-8") as f:
                f.write(f"=== Recherche de nom pour : {context} ===\n\n")
                for name in matching_names:
                    f.write(f"- {name.name} ({name.style}) : {name.meaning}\n")
            print(f"✅ Résultats sauvegardés dans '{filename}'")
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde : {e}")
    
    print("\n" + "="*60)
    print("👋 Merci d'avoir utilisé l'Assistant de choix de nom !")
    print("="*60)


# ============ POINT D'ENTRÉE ============

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Arrêt demandé par l'utilisateur. Au revoir !")
    except EOFError:
        print("\n\n👋 Fin de l'entrée. Au revoir !")