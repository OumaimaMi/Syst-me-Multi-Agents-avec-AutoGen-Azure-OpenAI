from src.agents.planner_agent import PlannerAgent
from src.agents.coder_agent import CoderAgent
from src.agents.reviewer_agent import ReviewerAgent

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
        
        validation = self.reviewer.validate_code(code)
        print(f"\n✅ Validation : {validation}")
        
        return {
            "plan": plan,
            "code": code,
            "review": review,
            "validation": validation,
            "history": self.history
        }
    
    def clear_history(self):
        self.history = []
        self.planner.clear_history()
        self.coder.clear_history()
        self.reviewer.clear_history()
