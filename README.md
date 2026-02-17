# NeuralNotes
AI-Powered Notes &amp; Search Web App

### 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL with `pgvector` extension
- **AI Model**: `all-MiniLM-L6-v2` (Local Sentence-Transformers)
- **DevOps**: Docker & Docker Compose

### 🚀 Getting Started
**Run the project:**  `docker-compose up`

### Features
- User Authentication 
- Notes CRUD Management
- AI Search Bar

### 🌟 AI Search Feature
The core of this application is its ability to handle natural-language queries.
- **Semantic Mapping**: User queries are transformed into 384-dimensional vectors.
- **Balanced Filtering**: Uses an **L2 distance threshold of 1.3** to effectively filter unrelated noise while maintaining high recall for related concepts.
- **Example**: Searching for "airplane" will successfully identify a note about "aviation academy" because the AI understands the underlying context.

### Database
- Connect to PostgreSQL:
`docker-compose exec db psql -U user -d notes_db`
- List the Tables:
`\dt` 
- Check User Authentication Table:
`SELECT id, username FROM users;`
- Check Note Management Table:
`SELECT id, title, content, owner_id FROM notes;`
- Verify AI Search & Embeddings
<!-- -- This verifies if the AI vector data is being stored for semantic search -->
`SELECT title, left(embedding::text, 50) as vector_preview FROM notes LIMIT 1;`
<!-- quit= \q -->

### Assumptions Made
- Local Inference: Assumed that running a local embedding model is preferred over cloud APIs for privacy and to showcase infrastructure handling.
- Vector Dimensions: Assumed a 384-dimension vector is sufficient for short-form notes, providing high speed without heavy RAM usage.




