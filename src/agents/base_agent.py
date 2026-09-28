from openai import AzureOpenAI
from src.utils.config import get_openai_client, get_model

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
            max_completion_tokens=500
        )
        
        result = response.choices[0].message.content
        self.history.append({"role": "user", "content": message})
        self.history.append({"role": "assistant", "content": result})
        
        return result
    
    def clear_history(self):
        self.history = []
