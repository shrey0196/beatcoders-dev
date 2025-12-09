from sqlalchemy import Column, Integer, String, Text
from config.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    difficulty = Column(String)
    topic = Column(String)
    acceptance = Column(String, nullable=True)
    
    # Storing large text/JSON content as Text fields
    description = Column(Text)  # HTML description
    hints = Column(Text)        # JSON string containing mermaid, text hints
    test_cases = Column(Text)   # JSON string containing list of inputs/outputs
    starter_code = Column(Text, nullable=True) # Python starter code template
    
    def __repr__(self):
        return f"<Problem(title={self.title}, difficulty={self.difficulty})>"
