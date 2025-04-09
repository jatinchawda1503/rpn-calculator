import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from core.db.models import Base, User, Calculation
from core.db.db import init_db

# Use in-memory SQLite for testing
TEST_DB_URL = "sqlite:///:memory:"

@pytest.fixture
def db_session():
    """Create a clean database session for each test."""
    # Create engine connected to in-memory database
    engine = create_engine(TEST_DB_URL)
    
    # Create tables
    Base.metadata.create_all(engine)
    
    # Create session
    session = Session(engine)
    
    try:
        yield session
    finally:
        session.close()
        # Drop tables after test
        Base.metadata.drop_all(engine)

def test_user_creation(db_session):
    """Test creating a user in the database."""
    # Create a user
    user = User(id="test_user")
    db_session.add(user)
    db_session.commit()
    
    # Query to verify
    retrieved_user = db_session.query(User).filter(User.id == "test_user").first()
    assert retrieved_user is not None
    assert retrieved_user.id == "test_user"

def test_calculation_creation(db_session):
    """Test creating a calculation with a user."""
    # Create a user
    user = User(id="test_user")
    db_session.add(user)
    db_session.commit()
    
    # Create a calculation
    calculation = Calculation(
        user_id="test_user",
        expression="3 4 +",
        result=7,
        operations=[
            {"operator": "+", "operands": [3, 4], "result": 7}
        ]
    )
    db_session.add(calculation)
    db_session.commit()
    
    # Query to verify
    retrieved_calc = db_session.query(Calculation).first()
    assert retrieved_calc is not None
    assert retrieved_calc.expression == "3 4 +"
    assert retrieved_calc.result == 7
    assert retrieved_calc.user_id == "test_user"
    assert len(retrieved_calc.operations) == 1
    assert retrieved_calc.operations[0]["operator"] == "+" 