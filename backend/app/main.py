from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

# Import local modules using relative imports
from . import database, auth, embeddings 

# Initialize database tables
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NeuralNotes API")

# Updated CORS to strictly allow your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Authentication Endpoints ---

@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(username: str, password: str, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = auth.get_password_hash(password)
    new_user = database.User(username=username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Note Endpoints ---

@app.post("/notes", status_code=201)
def create_note(
    title: str, 
    content: str, 
    db: Session = Depends(database.get_db), 
    current_user: database.User = Depends(auth.get_current_user)
):
    vector = embeddings.generate_vector(content) 
    new_note = database.Note(
        title=title, 
        content=content, 
        embedding=vector, 
        owner_id=current_user.id
    )
    db.add(new_note)
    db.commit()
    return {"message": "Note saved!"}

# NEW: Fetch notes belonging only to the current user
@app.get("/notes")
def get_notes(
    db: Session = Depends(database.get_db), 
    current_user: database.User = Depends(auth.get_current_user)
):
    notes = db.query(database.Note).filter(database.Note.owner_id == current_user.id).all()
    
    # Manually convert to a list of dicts to avoid the serialization error
    return [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "created_at": n.created_at.isoformat() if hasattr(n, 'created_at') else None
        } 
        for n in notes
    ]
# NEW: Delete a specific note
@app.delete("/notes/{note_id}")
def delete_note(
    note_id: int, 
    db: Session = Depends(database.get_db), 
    current_user: database.User = Depends(auth.get_current_user)
):
    note = db.query(database.Note).filter(
        database.Note.id == note_id, 
        database.Note.owner_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

@app.get("/")
async def root():
    return {"message": "NeuralNotes Backend is live and fast!"}

# --- NEW: Update an existing note ---
@app.put("/notes/{note_id}")
def update_note(
    note_id: int, 
    title: str, 
    content: str, 
    db: Session = Depends(database.get_db), 
    current_user: database.User = Depends(auth.get_current_user)
):
    note = db.query(database.Note).filter(
        database.Note.id == note_id, 
        database.Note.owner_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    note.title = title
    note.content = content
    db.commit()
    return {"message": "Updated!"}

# --- NEW: Semantic Search (AI Search) ---
@app.get("/search")
def search_notes(
    query: str, 
    db: Session = Depends(database.get_db), 
    current_user: database.User = Depends(auth.get_current_user)
):
    # Generate vector for the search query
    query_vector = embeddings.generate_vector(query)
    
    # Perform vector similarity search using pgvector
    results = db.query(database.Note).filter(
        database.Note.owner_id == current_user.id
    ).order_by(database.Note.embedding.l2_distance(query_vector)).limit(5).all()
    
    return [
        {"id": n.id, "title": n.title, "content": n.content} 
        for n in results
    ]