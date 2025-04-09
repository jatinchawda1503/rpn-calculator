from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    calculations = relationship("Calculation", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id})>"

class Calculation(Base):
    __tablename__ = "calculations"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"))
    expression = Column(String, nullable=False)
    result = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    operations = Column(JSON, nullable=True)
    
    user = relationship("User", back_populates="calculations")
    
    def __repr__(self):
        return f"<Calculation(id={self.id}, expression='{self.expression}', result={self.result})>" 