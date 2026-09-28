from src.agents.base_agent import BaseAgent

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
            Tu proposes des corrections concrètes."""
        )
    
    def review_code(self, code):
        """Révise le code et propose des améliorations"""
        prompt = (
            "Analyse ce code et propose des améliorations :\n\n"
            "```python\n"
            f"{code}\n"
            "```\n\n"
            "Identifie les problèmes et propose des corrections.\n"
            "Structure ta réponse avec :\n"
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