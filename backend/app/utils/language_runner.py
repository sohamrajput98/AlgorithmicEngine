from app.utils.sandbox_runner import run_python
from app.utils.sandbox_runner_cpp import run_cpp
from app.utils.sandbox_runner_java import run_java
from app.utils.sandbox_runner_js import run_javascript

RUNNER_MAP = {
    "python": run_python,
    "cpp": run_cpp,
    "java": run_java,
    "javascript": run_javascript
}