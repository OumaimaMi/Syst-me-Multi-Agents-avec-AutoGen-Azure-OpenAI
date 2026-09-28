from src.agents.base_agent import BaseAgent

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
