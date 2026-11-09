"""Serve the bundled app locally. Python 3.10+, standard library only."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port',type=int,default=8000)
args=parser.parse_args()
try:
 server=ThreadingHTTPServer(('127.0.0.1',args.port),partial(SimpleHTTPRequestHandler,directory=str(Path(__file__).resolve().parent/'app')))
except OSError as exc:
 parser.exit(1,f'Cannot use port {args.port}: {exc}\nTry: python3 serve.py --port 8001\n')
print(f'Open http://127.0.0.1:{server.server_port} in your browser. Press Ctrl+C to stop.',flush=True)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
