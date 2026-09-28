import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from dataclasses import dataclass, field
from typing import List, Dict, Optional
import json
from datetime import datetime

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


# ============ MODÈLES DE DONNÉES ============

@dataclass
class SecurityIssue:
    """Représente un problème de sécurité"""
    id: str
    category: str          # "réseau", "logiciel", "matériel", "utilisateur", "données"
    severity: str          # "critique", "élevée", "moyenne", "faible"
    description: str
    impact: str
    solution: str
    preventive_measures: List[str]
    detected_at: str

@dataclass
class Device:
    """Représente un appareil à analyser"""
    name: str
    type: str              # "smartphone", "ordinateur", "serveur", "IoT", "routeur"
    os: str
    ip_address: str
    connected_devices: List[str]
    issues: List[SecurityIssue] = field(default_factory=list)
    security_score: int = 100

@dataclass
class SecurityReport:
    """Rapport de sécurité complet"""
    device: Device
    total_issues: int
    critical_issues: int
    high_issues: int
    medium_issues: int
    low_issues: int
    recommendations: List[str]
    generated_at: str
    summary: str


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
            max_completion_tokens=1000,
            temperature=0.7
        )
        result = response.choices[0].message.content
        self.history.append({"role": "user", "content": message})
        self.history.append({"role": "assistant", "content": result})
        return result
    
    def clear_history(self):
        self.history = []


# ============ AGENT PLANIFICATEUR ============
class SecurityPlannerAgent(BaseAgent):
    """Agent planificateur pour l'analyse de sécurité"""
    
    def __init__(self):
        super().__init__(
            name="Planificateur Sécurité",
            system_prompt="""Tu es un expert en planification de sécurité des appareils.
            Tu analyses les problèmes de sécurité et proposes un plan d'action structuré.
            
            Ta mission est de :
            1. Identifier les catégories de risques (réseau, logiciel, matériel, utilisateur, données)
            2. Évaluer la criticité des problèmes
            3. Définir des priorités d'intervention
            4. Proposer un plan d'action par étapes
            
            Réponds de manière structurée avec :
            - Une analyse des risques
            - Des priorités définies
            - Un plan d'action clair
            """
        )
    
    def create_security_plan(self, device_info, issues):
        """Crée un plan de sécurité pour un appareil"""
        prompt = f"""
        Analyse de sécurité pour l'appareil suivant :
        
        Appareil : {device_info}
        Problèmes identifiés : {issues}
        
        Fournis un plan d'action de sécurité structuré avec :
        1. Analyse des risques
        2. Priorités d'intervention
        3. Étapes de correction
        4. Mesures préventives
        """
        return self.process(prompt)


# ============ AGENT ANALYSTE ============
class SecurityAnalystAgent(BaseAgent):
    """Agent analyste - détecte les problèmes de sécurité"""
    
    def __init__(self):
        super().__init__(
            name="Analyste Sécurité",
            system_prompt="""Tu es un expert en cybersécurité et analyse des appareils.
            
            Tu dois analyser les appareils et identifier les problèmes de sécurité.
            
            Catégories à vérifier :
            - 🔒 Sécurité réseau (ports ouverts, pare-feu, Wi-Fi)
            - 📱 Sécurité logicielle (OS, applications, mises à jour)
            - 💻 Sécurité matérielle (physique, accès)
            - 👤 Sécurité utilisateur (mots de passe, authentification)
            - 📊 Sécurité des données (chiffrement, sauvegardes)
            
            Pour chaque problème identifié, donne :
            - La catégorie
            - La sévérité (critique, élevée, moyenne, faible)
            - La description
            - L'impact potentiel
            - La solution recommandée
            """
        )
    
    def analyze_device(self, device_info):
        """Analyse un appareil pour détecter les problèmes de sécurité"""
        prompt = f"""
        Analyse complète de sécurité pour l'appareil suivant :
        
        {device_info}
        
        Identifie tous les problèmes de sécurité potentiels.
        Structure ta réponse par catégorie.
        """
        return self.process(prompt)
    
    def analyze_network(self, network_info):
        """Analyse la sécurité réseau"""
        prompt = f"""
        Analyse de sécurité réseau pour :
        
        {network_info}
        
        Vérifie :
        - Ports ouverts
        - Pare-feu
        - Connexions Wi-Fi
        - Appareils connectés
        - Vulnérabilités réseau
        """
        return self.process(prompt)
    
    def analyze_software(self, software_info):
        """Analyse la sécurité logicielle"""
        prompt = f"""
        Analyse de sécurité logicielle pour :
        
        {software_info}
        
        Vérifie :
        - Version du système d'exploitation
        - Mises à jour de sécurité
        - Applications installées
        - Autorisations
        - Malware potentiel
        """
        return self.process(prompt)


# ============ AGENT RÉVISEUR ============
class SecurityReviewerAgent(BaseAgent):
    """Agent réviseur - vérifie les solutions de sécurité"""
    
    def __init__(self):
        super().__init__(
            name="Réviseur Sécurité",
            system_prompt="""Tu es un expert en validation de sécurité.
            
            Tu vérifies les solutions proposées et t'assures qu'elles sont :
            - Complètes
            - Applicables
            - Conformes aux bonnes pratiques
            - Efficientes
            
            Pour chaque solution, tu donnes un verdict :
            - ✅ VALIDE : solution complète et applicable
            - ⚠️ PARTIEL : solution incomplète, des améliorations sont nécessaires
            - ❌ INVALIDE : solution inappropriée ou dangereuse
            """
        )
    
    def review_security_plan(self, plan):
        """Révise un plan de sécurité"""
        prompt = f"""
        Vérifie ce plan de sécurité :
        
        {plan}
        
        Analyse :
        1. La couverture des risques
        2. La faisabilité des solutions
        3. Les éventuelles lacunes
        4. Les améliorations possibles
        
        Donne un verdict détaillé.
        """
        return self.process(prompt)
    
    def validate_solution(self, issue, solution):
        """Valide une solution pour un problème spécifique"""
        prompt = f"""
        Problème de sécurité : {issue}
        Solution proposée : {solution}
        
        Vérifie si la solution est :
        - Adaptée au problème
        - Techniquement faisable
        - Conforme aux bonnes pratiques
        - Rentable
        
        Réponds par VALIDE, PARTIEL ou INVALIDE avec explication.
        """
        return self.process(prompt)


# ============ GROUPE DE CHAT SÉCURITÉ ============
class SecurityGroupChat:
    """Système multi-agents pour la sécurité des appareils"""
    
    def __init__(self):
        self.planner = SecurityPlannerAgent()
        self.analyst = SecurityAnalystAgent()
        self.reviewer = SecurityReviewerAgent()
        self.history = []
        self.issues = []
    
    def analyze_device_security(self, device_info):
        """
        Analyse complète de sécurité d'un appareil
        """
        self.clear_history()
        
        print("\n" + "="*70)
        print("🔐 ANALYSE DE SÉCURITÉ DE L'APPAREIL")
        print("="*70)
        print(f"📱 Appareil : {device_info}")
        print("="*70)
        
        # Étape 1 : Analyse par l'analyste
        print("\n🔍 ÉTAPE 1 - ANALYSE DE SÉCURITÉ")
        print("-"*50)
        analysis = self.analyst.analyze_device(device_info)
        print(f"📊 Résultat de l'analyse :\n{analysis}")
        self.history.append({"agent": "Analyste", "message": analysis})
        
        # Étape 2 : Planification
        print("\n📋 ÉTAPE 2 - PLANIFICATION")
        print("-"*50)
        plan = self.planner.create_security_plan(device_info, analysis)
        print(f"📝 Plan d'action :\n{plan}")
        self.history.append({"agent": "Planificateur", "message": plan})
        
        # Étape 3 : Révision
        print("\n✅ ÉTAPE 3 - RÉVISION ET VALIDATION")
        print("-"*50)
        review = self.reviewer.review_security_plan(plan)
        print(f"🔒 Révision :\n{review}")
        self.history.append({"agent": "Réviseur", "message": review})
        
        return {
            "analysis": analysis,
            "plan": plan,
            "review": review,
            "history": self.history
        }
    
    def clear_history(self):
        """Efface l'historique de tous les agents"""
        self.history = []
        self.planner.clear_history()
        self.analyst.clear_history()
        self.reviewer.clear_history()


# ============ BASE DE DONNÉES DES PROBLÈMES DE SÉCURITÉ ============

SECURITY_ISSUES_DATABASE = {
    "network": [
        {
            "name": "Ports ouverts non sécurisés",
            "description": "Des ports réseau sont ouverts sans protection adéquate",
            "severity": "élevée",
            "solution": "Fermer les ports inutiles, utiliser un pare-feu"
        },
        {
            "name": "Wi-Fi non sécurisé",
            "description": "Le réseau Wi-Fi utilise un protocole de sécurité obsolète",
            "severity": "critique",
            "solution": "Utiliser WPA3, changer le mot de passe"
        },
        {
            "name": "Pare-feu désactivé",
            "description": "Le pare-feu de l'appareil est désactivé",
            "severity": "critique",
            "solution": "Activer et configurer le pare-feu"
        },
        {
            "name": "Appareils non autorisés sur le réseau",
            "description": "Des appareils inconnus sont connectés au réseau",
            "severity": "élevée",
            "solution": "Filtrer les appareils, utiliser le contrôle d'accès"
        }
    ],
    "software": [
        {
            "name": "Système d'exploitation obsolète",
            "description": "L'OS n'est plus mis à jour, vulnérabilités connues",
            "severity": "critique",
            "solution": "Mettre à jour le système d'exploitation"
        },
        {
            "name": "Applications non mises à jour",
            "description": "Des applications ont des mises à jour de sécurité non installées",
            "severity": "élevée",
            "solution": "Mettre à jour toutes les applications"
        },
        {
            "name": "Autorisations excessives",
            "description": "Des applications ont trop d'autorisations",
            "severity": "moyenne",
            "solution": "Révoquer les autorisations inutiles"
        }
    ],
    "user": [
        {
            "name": "Mot de passe faible",
            "description": "Le mot de passe ne respecte pas les critères de sécurité",
            "severity": "critique",
            "solution": "Changer pour un mot de passe fort"
        },
        {
            "name": "Authentification sans double facteur",
            "description": "La double authentification n'est pas activée",
            "severity": "élevée",
            "solution": "Activer la double authentification"
        },
        {
            "name": "Partage d'informations sensibles",
            "description": "Des informations sensibles sont partagées publiquement",
            "severity": "moyenne",
            "solution": "Sensibiliser aux bonnes pratiques"
        }
    ],
    "data": [
        {
            "name": "Données non chiffrées",
            "description": "Les données sensibles ne sont pas chiffrées",
            "severity": "critique",
            "solution": "Activer le chiffrement des données"
        },
        {
            "name": "Absence de sauvegarde",
            "description": "Aucune sauvegarde des données importantes",
            "severity": "élevée",
            "solution": "Mettre en place des sauvegardes régulières"
        }
    ]
}


# ============ FONCTIONS D'ANALYSE SPÉCIFIQUES ============

def analyze_network_security():
    """Analyse la sécurité réseau"""
    print("\n🌐 ANALYSE RÉSEAU")
    print("-"*40)
    
    network_info = """
    Appareils connectés : PC, Smartphone, Imprimante
    Type de réseau : Wi-Fi
    Protocole : WPA2
    Ports ouverts : 22 (SSH), 80 (HTTP), 443 (HTTPS)
    """
    
    chat = SecurityGroupChat()
    result = chat.analyze_device_security(network_info)
    
    return result

def analyze_mobile_security():
    """Analyse la sécurité d'un smartphone"""
    print("\n📱 ANALYSE SMARTPHONE")
    print("-"*40)
    
    device_info = """
    Type : Smartphone
    OS : Android 13
    Applications : 45 installées
    Mode : Réseau mobile + Wi-Fi
    Stockage : 64 Go
    """
    
    chat = SecurityGroupChat()
    result = chat.analyze_device_security(device_info)
    
    return result

def analyze_computer_security():
    """Analyse la sécurité d'un ordinateur"""
    print("\n💻 ANALYSE ORDINATEUR")
    print("-"*40)
    
    device_info = """
    Type : Ordinateur portable
    OS : Windows 11
    Applications : 80 installées
    Connexion : Wi-Fi + Ethernet
    Pare-feu : Actif partiellement
    """
    
    chat = SecurityGroupChat()
    result = chat.analyze_device_security(device_info)
    
    return result


# ============ MENU PRINCIPAL ============

def main():
    """
    Fonction principale du système de sécurité
    """
    print("\n" + "="*70)
    print("🔐 SYSTÈME MULTI-AGENTS DE SÉCURITÉ DES APPAREILS")
    print("="*70)
    print("Ce système analyse les problèmes de sécurité des appareils")
    print("et propose des solutions concrètes.")
    print("="*70)
    
    while True:
        print("\n" + "-"*50)
        print("📋 Choisissez une option :")
        print("1. Analyser la sécurité réseau")
        print("2. Analyser la sécurité d'un smartphone")
        print("3. Analyser la sécurité d'un ordinateur")
        print("4. Analyse personnalisée")
        print("5. Afficher les problèmes connus")
        print("6. Quitter")
        print("-"*50)
        
        choice = input("\n👉 Votre choix (1-6) : ").strip()
        
        if choice == "1":
            analyze_network_security()
            
        elif choice == "2":
            analyze_mobile_security()
            
        elif choice == "3":
            analyze_computer_security()
            
        elif choice == "4":
            device_info = input("\n📱 Décrivez votre appareil : ")
            chat = SecurityGroupChat()
            result = chat.analyze_device_security(device_info)
            
        elif choice == "5":
            print("\n📋 PROBLÈMES DE SÉCURITÉ CONNUS")
            print("="*50)
            for category, issues in SECURITY_ISSUES_DATABASE.items():
                print(f"\n🔹 {category.upper()}")
                for issue in issues:
                    print(f"   - {issue['name']}")
                    print(f"     Sévérité : {issue['severity']}")
                    print(f"     Solution : {issue['solution']}")
            
        elif choice == "6":
            print("\n👋 Au revoir ! Restez en sécurité !")
            break
            
        else:
            print("\n❌ Option invalide. Veuillez choisir 1-6.")
        
        if choice in ["1", "2", "3", "4"]:
            input("\nAppuyez sur Entrée pour continuer...")


# ============ POINT D'ENTRÉE ============

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Arrêt demandé par l'utilisateur. Au revoir !")
    except EOFError:
        print("\n\n👋 Fin de l'entrée. Au revoir !")