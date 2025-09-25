import subprocess, tempfile, os, time, shutil, resource
from typing import Dict

def _set_limits(time_limit_seconds: int, memory_limit_kb: int):
    try: resource.setrlimit(resource.RLIMIT_CPU, (time_limit_seconds, time_limit_seconds))
    except: pass
    try: resource.setrlimit(resource.RLIMIT_AS, (memory_limit_kb * 1024, memory_limit_kb * 1024))
    except: pass
    try: resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))
    except: pass

def run_java(code: str, stdin_data: str = "", time_limit_ms: int = 1000, memory_limit_kb: int = 65536) -> Dict[str, any]:
    time_limit_seconds = max(1, (time_limit_ms + 999) // 1000)
    tmpdir = tempfile.mkdtemp(prefix="sandbox_java_")
    java_file = os.path.join(tmpdir, "Main.java")

    try:
        with open(java_file, "w", encoding="utf-8") as f:
            f.write(code)

        compile_proc = subprocess.run(["javac", java_file], cwd=tmpdir, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if compile_proc.returncode != 0:
            return {
                "stdout": "",
                "stderr": compile_proc.stderr,
                "returncode": compile_proc.returncode,
                "runtime_ms": 0,
                "status": "compile_error"
            }

        start = time.time()
        try:
            proc = subprocess.Popen(
                ["java", "-cp", tmpdir, "Main"],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=tmpdir,
                preexec_fn=lambda: _set_limits(time_limit_seconds, memory_limit_kb),
                text=True
            )
            stdout, stderr = proc.communicate(input=stdin_data, timeout=time_limit_seconds + 1)
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

        runtime_ms = int((time.time() - start) * 1000)
        status = "ok" if proc.returncode == 0 else "runtime_error"
        return {
            "stdout": stdout,
            "stderr": stderr,
            "returncode": proc.returncode,
            "runtime_ms": runtime_ms,
            "status": status
        }

    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)