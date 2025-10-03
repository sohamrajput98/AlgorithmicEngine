import subprocess
import tempfile
import os
import time
import shutil
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

def run_cpp(code: str, stdin_data: str = "", time_limit_ms: int = 1000, memory_limit_kb: int = 65536) -> Dict[str, Any]:
    time_limit_seconds = max(1, int((time_limit_ms + 999) // 1000))
    tmpdir = tempfile.mkdtemp(prefix="sandbox_cpp_")

    try:
        source_path = os.path.join(tmpdir, "solution.cpp")
        with open(source_path, "w", encoding="utf-8") as f:
            f.write(code)

        binary_path = os.path.join(tmpdir, "solution.out")
        compile_cmd = ["g++", "-std=c++17", "-O2", source_path, "-o", binary_path]

        compile_start = time.perf_counter()
        compile_proc = subprocess.Popen(
            compile_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=tmpdir,
            text=True
        )
        try:
            compile_stdout, compile_stderr = compile_proc.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            compile_proc.kill()
            compile_stdout, compile_stderr = compile_proc.communicate()
            return {
                "stdout": compile_stdout,
                "stderr": compile_stderr + "\n[error] Compilation Timeout",
                "returncode": -1,
                "runtime_ms": int((time.perf_counter() - compile_start) * 1000),
                "status": "compilation_timeout"
            }

        if compile_proc.returncode != 0:
            return {
                "stdout": compile_stdout,
                "stderr": compile_stderr,
                "returncode": compile_proc.returncode,
                "runtime_ms": int((time.perf_counter() - compile_start) * 1000),
                "status": "compilation_error"
            }

        run_start = time.perf_counter()
        try:
            run_proc = subprocess.Popen(
                [binary_path],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=tmpdir,
                preexec_fn=lambda: _set_limits(time_limit_seconds, memory_limit_kb),
                text=True
            )
            try:
                timeout_seconds = time_limit_seconds + 1
                stdout, stderr = run_proc.communicate(input=stdin_data, timeout=timeout_seconds)
            except subprocess.TimeoutExpired:
                run_proc.kill()
                stdout, stderr = run_proc.communicate()
                return {
                    "stdout": stdout,
                    "stderr": stderr + "\n[error] TimeoutExpired",
                    "returncode": -1,
                    "runtime_ms": int((time.perf_counter() - run_start) * 1000),
                    "status": "timeout"
                }
        except Exception as e:
            return {
                "stdout": "",
                "stderr": f"[error launching process] {e}",
                "returncode": -1,
                "runtime_ms": int((time.perf_counter() - run_start) * 1000),
                "status": "error"
            }

        runtime_ms = int((time.perf_counter() - run_start) * 1000)
        status = "ok" if run_proc.returncode == 0 else "runtime_error"

        return {
            "stdout": stdout,
            "stderr": stderr,
            "returncode": run_proc.returncode,
            "runtime_ms": runtime_ms,
            "status": status
        }

    finally:
        try:
            shutil.rmtree(tmpdir)
        except Exception:
            pass