from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_vector(text: str):
    if not text:
        return [0.0] * 384  
    return model.encode(text).tolist()