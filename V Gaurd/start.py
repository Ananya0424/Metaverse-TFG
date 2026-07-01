"""
V-Guard Assistant — Startup Script

  python start.py               → starts server, opens main app
  python start.py --dashboard   → starts server, opens knowledge dashboard
"""

import subprocess
import sys
import time
import webbrowser
import urllib.request
import os

BASE_URL      = "http://localhost:8000"
DASHBOARD_URL = "http://localhost:8000/dashboard"
TIMEOUT       = 30  # seconds to wait for server


def wait_for_server(url: str, timeout: int) -> bool:
    print("  Waiting for server to be ready", end="", flush=True)
    start = time.time()
    while time.time() - start < timeout:
        try:
            urllib.request.urlopen(url, timeout=1)
            print(" ✓")
            return True
        except Exception:
            print(".", end="", flush=True)
            time.sleep(0.5)
    print(" ✗ timed out")
    return False


def main():
    dashboard_mode = "--dashboard" in sys.argv

    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)

    if dashboard_mode:
        print("=" * 45)
        print("  V-Guard Knowledge Dashboard")
        print("=" * 45)
        open_url = DASHBOARD_URL
        label    = "Knowledge Dashboard"
    else:
        print("=" * 45)
        print("  V-Guard Assistant")
        print("=" * 45)
        open_url = BASE_URL
        label    = "Main App"

    print(f"  Project: {project_root}")
    print(f"  URL:     {open_url}\n")

    print("  Starting backend server...")
    proc = subprocess.Popen(
        [sys.executable, "-m", "backend.app"],
        cwd=project_root,
    )

    if wait_for_server(BASE_URL, TIMEOUT):
        print(f"\n  Opening browser → {label}: {open_url}")
        webbrowser.open(open_url)
        print("\n  Press Ctrl+C to stop the server.\n")
    else:
        print(f"\n  Server did not start in {TIMEOUT}s.")
        print(f"  Open manually: {open_url}\n")

    try:
        proc.wait()
    except KeyboardInterrupt:
        print("\n  Shutting down...")
        proc.terminate()
        proc.wait()
        print("  Done.")


if __name__ == "__main__":
    main()
