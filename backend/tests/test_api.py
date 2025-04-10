from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.main import app
from core.db import Base, get_db


# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Setup test database
@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)  # Create tables for test
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override the get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create test client
@pytest.fixture(scope="module")
def client():
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


def test_calculate_endpoint(client):
    """Test the calculate endpoint with a simple expression."""
    response = client.post(
        "/api/calculate",
        json={"expression": "5 3 +", "user_id": "test_user"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert data["result"] == 8


def test_calculate_complex_expression(client):
    """Test the calculate endpoint with a more complex expression."""
    response = client.post(
        "/api/calculate",
        json={"expression": "5 3 * 2 - 4 /", "user_id": "test_user"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert data["result"] == 3.25


def test_history_endpoint(client, test_db):
    """Test the history endpoint."""
    # First, create some calculation records
    client.post("/api/calculate", json={"expression": "5 3 +", "user_id": "test_user"})
    client.post("/api/calculate", json={"expression": "7 2 -", "user_id": "test_user"})
    
    # Then fetch the history
    response = client.get("/api/history/test_user")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    
    # Check the calculations were saved correctly
    expressions = [calc["expression"] for calc in data]
    assert "5 3 +" in expressions
    assert "7 2 -" in expressions 