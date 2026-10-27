#!/usr/bin/env python3
"""fetch.py — logged fetcher for Japan Clarity Ch05 domestic education research.

Usage: python3 fetch.py <outfile> <url> [--max-time N] [--xhr]
Appends one TSV line per fetch to notes/fetchlog.tsv:
  utc_time<TAB>http_status<TAB>bytes<TAB>sha256-16<TAB>url<TAB>outfile
Always uses a browser User-Agent (Chrome/131) per workspace rule.
"""
import hashlib
import subprocess
import sys
import time
import os

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "notes", "fetchlog.tsv")


def main():
    if len(sys.argv) < 3:
        sys.exit("usage: fetch.py <outfile> <url> [--max-time N]")
    out, url = sys.argv[1], sys.argv[2]
    maxtime = "60"
    xhr = False
    args = sys.argv[3:]
    if "--max-time" in args:
        i = args.index("--max-time")
        maxtime = args[i + 1]
    if "--xhr" in args:
        xhr = True
    hdrs = []
    if xhr:
        hdrs += ["-H", "X-Requested-With: XMLHttpRequest",
                 "-H", "Accept: application/json, text/javascript, */*; q=0.01"]
    tmp = out + ".part"
    start = time.time()
    code = subprocess.run(
        ["curl", "-sS", "--max-time", maxtime, "-A", UA, "-L", *hdrs,
         "-o", tmp, "-w", "%{http_code}", url],
        capture_output=True, text=True).stdout.strip()
    utc = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    if code == "200" and os.path.exists(tmp) and os.path.getsize(tmp) > 0:
        with open(tmp, "rb") as f:
            data = f.read()
        sha = hashlib.sha256(data).hexdigest()[:16]
        os.replace(tmp, out)
        status = code
    else:
        if os.path.exists(tmp) and os.path.getsize(tmp) > 0:
            os.replace(tmp, out + ".http" + (code or "000"))
        else:
            try:
                os.remove(tmp)
            except OSError:
                pass
        sha = "-"
        status = code or "000"
    os.makedirs(os.path.dirname(LOG), exist_ok=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"{utc}\t{status}\t{os.path.getsize(out) if status=='200' else 0}\t{sha}\t{url}\t{out}\n")
    print(f"{status} {os.path.getsize(out) if status=='200' else 0}B sha16={sha} {out} ({time.time()-start:.1f}s)")


if __name__ == "__main__":
    main()
