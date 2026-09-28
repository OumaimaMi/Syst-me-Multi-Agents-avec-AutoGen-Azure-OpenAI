#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Agent Universel - Répond à TOUTES les questions et propose des solutions.

Ce système multi-agents analyse n'importe quelle question et :
1. Comprend la question
2. Propose une ou plusieurs solutions
3. Développe la meilleure solution
4. Vérifie la solution
"""

import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from datetime import datetime

load_dotenv()

# ============ CONFIGURATION ============
def get_openai_client():
    return AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
    )

def get_model():
    return os.getenv("AZURE_OPENAI_DEPLOYMENT")


# ============ AGENT UNIVERSEL ============
class UniversalAgent:
    """
    Agent universel qui répond à toutes les questions.
    """
    
    def __init__(self):
        self.client = get_openai_client()
        self.model = get_model()
        self.history = []
        
        # Prompt système polyvalent
        self.system_prompt = """Tu es un assistant universel intelligent et polyvalent.
        
        Ta mission est de répondre à TOUTE question posée par l'utilisateur, quel que soit le domaine :
        - Informatique et programmation
        - Mathématiques et sciences
        - Cuisine et recettes
        - Santé et bien-être
        - Voyage et tourisme
        - Éducation et apprentissage
        - Business et entrepreneuriat
        - Art et culture
        - Sport et loisirs
        - Et bien plus encore...
        
        Pour chaque question, tu dois :
        1. **Comprendre** la question et son contexte
        2. **Analyser** les besoins de l'utilisateur
        3. **Proposer** 2-3 solutions ou approches différentes
        4. **Développer** la meilleure solution en détail
        5. **Vérifier** que la solution répond bien à la question
        
        Sois clair, précis, et pédagogique dans tes réponses.
        Utilise des exemples concrets quand c'est pertinent.
        Si la question est ambiguë, demande des précisions.
        """
    
    def ask(self, question):
        """
        Pose une question à l'agent universel.
        """
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": question}
        ]
        
        # Ajouter l'historique si disponible
        if self.history:
            messages = [messages[0]] + self.history[-4:] + [messages[-1]]
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_completion_tokens=1500,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        
        # Sauvegarder l'historique
        self.history.append({"role": "user", "content": question})
        self.history.append({"role": "assistant", "content": result})
        
        return result
    
    def propose_solutions(self, probleme):
        """
        Propose plusieurs solutions pour un problème donné.
        """
        prompt = f"""Pour le problème suivant, propose 3 solutions différentes :

Problème : {probleme}

Pour chaque solution, donne :
1. **Nom de la solution**
2. **Description**
3. **Avantages**
4. **Inconvénients**
5. **Coût estimé** (temps, argent, ressources)
6. **Difficulté** (facile, moyen, difficile)

Puis recommande la meilleure solution avec justification.
"""
        return self.ask(prompt)
    
    def expliquer(self, sujet):
        """
        Explique un sujet de manière simple.
        """
        prompt = f"""Explique le sujet suivant de manière simple et pédagogique :

Sujet : {sujet}

Structure ta réponse :
1. **Définition simple** (en 1-2 phrases)
2. **Explication détaillée** (avec des exemples)
3. **Applications pratiques**
4. **Points clés à retenir**
"""
        return self.ask(prompt)
    
    def resoudre(self, probleme):
        """
        Résout un problème étape par étape.
        """
        prompt = f"""Résous le problème suivant étape par étape :

Problème : {probleme}

Structure ta réponse :
1. **Compréhension du problème**
2. **Analyse des données**
3. **Méthode de résolution**
4. **Étapes détaillées**
5. **Solution finale**
6. **Vérification**
"""
        return self.ask(prompt)
    
    def creer(self, demande):
        """
        Crée quelque chose (code, texte, plan, etc.).
        """
        prompt = f"""Crée ce qui est demandé :

Demande : {demande}

Fournis une création complète, détaillée et prête à l'emploi.
"""
        return self.ask(prompt)
    
    def clear_history(self):
        """Efface l'historique."""
        self.history = []


# ============ INTERFACE CONSOLE ============
def afficher_menu():
    """Affiche le menu principal."""
    print("\n" + "="*60)
    print("🤖 AGENT UNIVERSEL - Répond à TOUTES vos questions")
    print("="*60)
    print("\n📋 Que voulez-vous faire ?")
    print("1. ❓ Poser une question")
    print("2. 💡 Demander des solutions à un problème")
    print("3. 📚 Expliquer un sujet")
    print("4. 🔧 Résoudre un problème")
    print("5. 🎨 Créer quelque chose")
    print("6. 🗑️ Effacer l'historique")
    print("7. 🚪 Quitter")
    print("-"*60)


def main():
    """Fonction principale."""
    agent = UniversalAgent()
    
    print("\n🎉 Bienvenue dans l'Agent Universel !")
    print("Je peux répondre à TOUTES vos questions.")
    
    while True:
        afficher_menu()
        
        try:
            choix = input("👉 Votre choix (1-7) : ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\n👋 Au revoir !")
            break
        
        if choix == "1":
            question = input("\n❓ Votre question : ").strip()
            if question:
                print("\n🤔 Réflexion en cours...\n")
                reponse = agent.ask(question)
                print("\n" + "="*60)
                print("📝 RÉPONSE :")
                print("="*60)
                print(reponse)
        
        elif choix == "2":
            probleme = input("\n💡 Décrivez votre problème : ").strip()
            if probleme:
                print("\n🤔 Analyse en cours...\n")
                solutions = agent.propose_solutions(probleme)
                print("\n" + "="*60)
                print("💡 SOLUTIONS PROPOSÉES :")
                print("="*60)
                print(solutions)
        
        elif choix == "3":
            sujet = input("\n📚 Sujet à expliquer : ").strip()
            if sujet:
                print("\n🤔 Explication en cours...\n")
                explication = agent.expliquer(sujet)
                print("\n" + "="*60)
                print("📚 EXPLICATION :")
                print("="*60)
                print(explication)
        
        elif choix == "4":
            probleme = input("\n🔧 Problème à résoudre : ").strip()
            if probleme:
                print("\n🤔 Résolution en cours...\n")
                solution = agent.resoudre(probleme)
                print("\n" + "="*60)
                print("🔧 SOLUTION :")
                print("="*60)
                print(solution)
        
        elif choix == "5":
            demande = input("\n🎨 Que voulez-vous créer ? : ").strip()
            if demande:
                print("\n🤔 Création en cours...\n")
                creation = agent.creer(demande)
                print("\n" + "="*60)
                print("🎨 CRÉATION :")
                print("="*60)
                print(creation)
        
        elif choix == "6":
            agent.clear_history()
            print("\n🗑️ Historique effacé !")
        
        elif choix == "7":
            print("\n👋 Merci d'avoir utilisé l'Agent Universel !")
            break
        
        else:
            print("\n❌ Choix invalide. Veuillez choisir 1-7.")
        
        if choix in ["1", "2", "3", "4", "5"]:
            input("\nAppuyez sur Entrée pour continuer...")


# ============ POINT D'ENTRÉE ============
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Arrêt demandé. Au revoir !")
    except EOFError:
        print("\n\n👋 Fin de l'entrée. Au revoir !")