# NeuralNotes
AI-Powered Notes &amp; Search Web App

### 🛠️ Tech Stack
- **Frontend**: React (Vite)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL with `pgvector` extension
- **AI Model**: `all-MiniLM-L6-v2` (Local Sentence-Transformers)
- **DevOps**: Docker & Docker Compose

### Features
- User Authentication 
- Notes CRUD Management
- AI Search Bar

### 🌟 AI Search Feature
The core of this application is its ability to handle natural-language queries.
- **Semantic Mapping**: User queries are transformed into 384-dimensional vectors.
- **Balanced Filtering**: Uses an **L2 distance threshold of 1.3** to effectively filter unrelated noise while maintaining high recall for related concepts.
- **Example**: Searching for "airplane" will successfully identify a note about "aviation academy" because the AI understands the underlying context.

### 🚀 Setup & Installation (Full Manual)

#### Clone the Repository
Open your terminal and run:
```bash
git clone [https://github.com/your-username/neural-notes.git](https://github.com/your-username/neural-notes.git)
cd neural-notes
```

#### 🚀 Getting Started
1. Environment Configuration
Create a .env file in the root directory and add the following:
```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=notes_db
DATABASE_URL=postgresql://user:password@db:5432/notes_db
SECRET_KEY=your_secure_random_key
VITE_API_URL=http://localhost:8000
```
2. Launch the Application
`docker-compose up --build`

3. Access the Services
- Frontend UI: http://localhost:5173

- API Documentation (Swagger): http://localhost:8000/docs

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
`SELECT title, left(embedding::text, 50) as vector_preview FROM notes LIMIT 1;`


### Assumptions Made
- Local Inference: Assumed that running a local embedding model is preferred over cloud APIs for privacy and to showcase infrastructure handling.
- Vector Dimensions: Assumed a 384-dimension vector is sufficient for short-form notes, providing high speed without heavy RAM usage.

### Future Improvements
- *HNSW Indexing*: Implement HNSW (Hierarchical Navigable Small World) in pgvector to speed up search for large datasets.
- *Metadata Filtering*: Allow users to filter search results by date or tags alongside the semantic query.


