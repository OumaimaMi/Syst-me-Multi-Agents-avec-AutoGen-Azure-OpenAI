from src.agents.base_agent import BaseAgent

class CoderAgent(BaseAgent):
    """Agent codeur - génère du code"""
    
    def __init__(self):
        super().__init__(
            name="Codeur",
            system_prompt="""Tu es un développeur expert en Python. 
            Tu génères du code propre, documenté et fonctionnel.
            Tu utilises les bonnes pratiques de programmation.
            Tu inclus des commentaires pour expliquer ton code."""
        )
    
    def generate_code(self, requirements):
        """Génère du code à partir des exigences"""
        prompt = f"""Génère du code Python pour répondre à ces exigences :
        
        {requirements}
        
        Fournis uniquement le code avec des commentaires."""
        return self.process(prompt)
