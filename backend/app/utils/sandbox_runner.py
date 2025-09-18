#  backend/app/utils/sandbox_runner.py
import subprocess
import tempfile
import os
import time
import shutil
import sys
import resource
from typing import Dict, Any, Optional, Tuple

# Safety note: this is a *development* runner only. Do not run untrusted code on public servers.

def _set_limits(time_limit_seconds: int, memory_limit_kb: int):
    """
    Called in child process (preexec_fn) to apply POSIX resource limits.
    time_limit_seconds: CPU time limit in seconds (soft/hard)
    memory_limit_kb: address space limit in kilobytes
    """
    # CPU time (seconds)
    try:
        resource.setrlimit(resource.RLIMIT_CPU, (time_limit_seconds, time_limit_seconds))
    except Exception:
        pass

    # Address space (virtual memory) in bytes
    try:
        mem_bytes = memory_limit_kb * 1024
        resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))
    except Exception:
        pass

    # file descriptor limit smaller
    try:
        resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))
    except Exception:
        pass

def run_python(code: str, stdin_data: str = "", time_limit_ms: int = 1000, memory_limit_kb: int = 65536) -> Dict[str, Any]:
    """
    Execute python code in a temporary directory with limits.
    Returns dict: { stdout, stderr, returncode, runtime_ms }
    """
    # translate ms -> seconds for CPU limit (round up)
    time_limit_seconds = max(1, int((time_limit_ms + 999) // 1000))

    tmpdir = tempfile.mkdtemp(prefix="sandbox_")
    try:
        # write code file
        script_path = os.path.join(tmpdir, "solution.py")
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(code)

        # build command
        python_exec = sys.executable or "python3"
        cmd = [python_exec, script_path]

        start = time.time()
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
                # wait with timeout (wall-clock) slightly larger than CPU limit
                timeout_seconds = time_limit_seconds + 1
                stdout, stderr = proc.communicate(input=stdin_data, timeout=timeout_seconds)
            except subprocess.TimeoutExpired:
                proc.kill()
                stdout, stderr = proc.communicate()
                return {
                    "stdout": stdout,
                    "stderr": stderr + "\n[error] TimeoutExpired",
                    "returncode": -1,
                    "runtime_ms": int((time.time() - start) * 1000),
                    "status": "timeout"
                }
        except Exception as e:
            return {
                "stdout": "",
                "stderr": f"[error launching process] {e}",
                "returncode": -1,
                "runtime_ms": int((time.time() - start) * 1000),
                "status": "error"
            }

        end = time.time()
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
        # cleanup temp dir
        try:
            shutil.rmtree(tmpdir)
        except Exception:
            pass
