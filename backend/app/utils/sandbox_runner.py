import subprocess
import tempfile
import os
import time
import shutil
import sys
import resource
from typing import Dict, Any

def _set_limits(time_limit_seconds: int, memory_limit_kb: int):
    try:
        resource.setrlimit(resource.RLIMIT_CPU, (time_limit_seconds, time_limit_seconds))
    except Exception:
        pass
    try:
        mem_bytes = memory_limit_kb * 1024
        resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))
    except Exception:
        pass
    try:
        resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))
    except Exception:
        pass

def run_python(code: str, stdin_data: str = "", time_limit_ms: int = 1000, memory_limit_kb: int = 65536) -> Dict[str, Any]:
    time_limit_seconds = max(1, int((time_limit_ms + 999) // 1000))
    tmpdir = tempfile.mkdtemp(prefix="sandbox_")

    try:
        script_path = os.path.join(tmpdir, "solution.py")
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        python_exec = sys.executable or "python3"
        cmd = [python_exec, "-u", script_path]
        start = time.perf_counter()
        try:
            proc = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=tmpdir,
                preexec_fn=lambda: _set_limits(time_limit_seconds, memory_limit_kb),
                text=True
            )
            try:
                timeout_seconds = time_limit_seconds + 1
                stdout, stderr = proc.communicate(input=stdin_data, timeout=timeout_seconds)
            except subprocess.TimeoutExpired:
                proc.kill()
                stdout, stderr = proc.communicate()
                return {
                    "stdout": stdout,
                    "stderr": stderr + "\n[error] TimeoutExpired",
                    "returncode": -1,
                    "runtime_ms": int((time.perf_counter() - start) * 1000),
                    "status": "timeout"
                }
        except Exception as e:
            return {
                "stdout": "",
                "stderr": f"[error launching process] {e}",
                "returncode": -1,
                "runtime_ms": int((time.perf_counter() - start) * 1000),
                "status": "error"
            }

        end = time.perf_counter()
        runtime_ms = int((end - start) * 1000)
        status = "ok" if proc.returncode == 0 else "runtime_error"

        return {
            "stdout": stdout,
            "stderr": stderr,
            "returncode": proc.returncode,
            "runtime_ms": runtime_ms,
            "status": status
        }

    finally:
        try:
            shutil.rmtree(tmpdir)
        except Exception:
            pass