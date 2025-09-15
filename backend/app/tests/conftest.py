import pytest
from fastapi.testclient import TestClient
from app.main import app  # matches your main.py path

@pytest.fixture
def client():
    return TestClient(app)
