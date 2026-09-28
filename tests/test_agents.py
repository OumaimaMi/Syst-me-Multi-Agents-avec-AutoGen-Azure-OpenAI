import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.core.group_chat import GroupChat

def test_group_chat():
    """Test du système multi-agents"""
    print("🧪 TEST DU SYSTÈME MULTI-AGENTS")
    print("="*60)
    
    chat = GroupChat()
    
    task = """Crée une fonction Python qui calcule la factorielle d'un nombre 
    de manière récursive et itérative."""
    
    result = chat.solve_task(task)
    
    print("\n" + "="*60)
    print("📊 RÉSULTAT FINAL")
    print("="*60)
    print(f"✅ Code validé : {result['validation']}")
    
    return result

if __name__ == "__main__":
    test_group_chat()
