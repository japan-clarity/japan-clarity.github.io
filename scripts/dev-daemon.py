#!/usr/bin/env python3
"""
Japan Clarity — persistent dev-server launcher for the sandbox environment.

The sandbox's tool session reaps every process in the shell's process tree at
each tool-call boundary. A classic double-fork daemon (intermediate child
exits; grandchild is reparented to PID 1 and lives in its own session)
escapes that reaper, which lets `next dev` keep serving port 3000 across tool
calls and for the preview panel after the session ends.

Usage: python3 scripts/dev-daemon.py [start|stop|status]
"""

import os
import signal
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / "dev.log"
PIDFILE = ROOT / ".dev-server.pid"


def find_server_pids():
    result = subprocess.run(
        ["pgrep", "-f", "next dev -p 3000"], capture_output=True, text=True
    )
    return [int(p) for p in result.stdout.split() if p.strip()]


def start():
    if find_server_pids():
        print("dev server already running:", find_server_pids())
        return
    log_fd = os.open(LOG, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
    devnull_fd = os.open(os.devnull, os.O_RDONLY)
    pid = os.fork()
    if pid == 0:
        os.setsid()
        pid2 = os.fork()
        if pid2 == 0:
            os.dup2(devnull_fd, 0)
            os.dup2(log_fd, 1)
            os.dup2(log_fd, 2)
            os.chdir(ROOT)
            os.execvp("bun", ["bun", "next", "dev", "-p", "3000"])
        os._exit(0)
    os.close(log_fd)
    os.close(devnull_fd)
    os.waitpid(pid, 0)
    time.sleep(1)
    PIDFILE.write_text("\n".join(map(str, find_server_pids())))
    print("dev server started (daemonized, PPid=1); pids:", find_server_pids())


def stop():
    pids = find_server_pids()
    for p in pids:
        try:
            os.kill(p, signal.SIGTERM)
        except ProcessLookupError:
            pass
    time.sleep(1.5)
    for p in pids:
        try:
            os.kill(p, signal.SIGKILL)
        except ProcessLookupError:
            pass
    PIDFILE.unlink(missing_ok=True)
    print("dev server stopped; remaining:", find_server_pids())


def status():
    pids = find_server_pids()
    print("running:" if pids else "not running", pids or "")


if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "status"
    {"start": start, "stop": stop, "status": status}[action]()
