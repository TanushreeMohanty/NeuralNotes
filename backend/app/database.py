from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pgvector.sqlalchemy import Vector # This is the AI part!

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@db:5432/notes_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    # 384 is the dimension for the 'all-MiniLM-L6-v2' model
    embedding = Column(Vector(384)) 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()