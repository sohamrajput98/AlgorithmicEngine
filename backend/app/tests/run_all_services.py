# backend/app/tests/run_all_services.py
from backend.app.services.auth_service import AuthService
from backend.app.services.user_service import UserService
from backend.app.services.problem_service import ProblemService
from backend.app.services.testcase_service import TestCaseService

print("Testing AuthService")
auth = AuthService()
print("AuthService loaded:", auth)

print("Testing UserService")
user = UserService()
print("UserService loaded:", user)

print("Testing ProblemService")
prob = ProblemService()
print("ProblemService loaded:", prob)

print("Testing TestCaseService")
tc = TestCaseService()
print("TestCaseService loaded:", tc)
