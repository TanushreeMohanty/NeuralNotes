# NeuralNotes
AI-Powered Notes &amp; Search Web App

### 🚀 Getting Started
**Run the entire stack:**  `docker-compose up --build`

### Features
- User Authentication 
- Notes CRUD Management

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
