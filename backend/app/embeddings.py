# Try to import the heavy AI library
try:
    from sentence_transformers import SentenceTransformer
    # Only load the model if the library is actually installed
    model = SentenceTransformer('all-MiniLM-L6-v2')
    AI_AVAILABLE = True
except ImportError:
    # If not installed, we set a flag and skip the heavy loading
    model = None
    AI_AVAILABLE = False

def generate_vector(text: str):
    """
    Returns a real AI vector if the library is installed, 
    otherwise returns a list of zeros to keep the database happy.
    """
    if AI_AVAILABLE and model:
        return model.encode(text).tolist()
    
    # Fallback: A 384-dimension list of zeros
    # This matches your Vector(384) column in database.py
    return [0.0] * 384