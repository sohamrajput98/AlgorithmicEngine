import uuid
from fastapi.testclient import TestClient

def test_register_login_and_access_me(client: TestClient):
    # 🔒 Generate a unique email to avoid collisions
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"

    # Register
    register_payload = {
        "email": unique_email,
        "display_name": "Test User",
        "password": "testpass123"
    }
    res = client.post("/auth/register", json=register_payload)
    print("Register response JSON:", res.json())
    assert res.status_code == 200
    assert res.json()["email"] == unique_email

    # Login
    login_payload = {
        "email": unique_email,
        "password": "testpass123"
    }
    res = client.post("/auth/login", json=login_payload)
    print("Login response JSON:", res.json())
    assert res.status_code == 200
    token = res.json()["access_token"]

    # Access protected route
    res = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    print("Me response JSON:", res.json())
    assert res.status_code == 200
    assert res.json()["email"] == unique_email