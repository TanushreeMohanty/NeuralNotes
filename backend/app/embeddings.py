from sentence_transformers import SentenceTransformer

# Use a small, efficient local model suitable for a B.Tech project
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_vector(text: str):
    if not text:
        return [0.0] * 384  # Default dimension for this model
    # Convert natural language into a numerical vector
    return model.encode(text).tolist()