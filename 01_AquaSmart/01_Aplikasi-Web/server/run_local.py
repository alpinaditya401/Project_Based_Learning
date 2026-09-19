"""Start an isolated persistent SIMULASI demo on Windows PowerShell."""
import argparse
import json
import os
from pathlib import Path
import secrets
import socket
import subprocess
import time
import urllib.request

APP = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8080)
    parser.add_argument('--data-dir', type=Path, default=APP / 'server/data')
    parser.add_argument('--check', action='store_true', help='Start, probe HTTP and scheduler, then stop')
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error('Port must be between 1024 and 65535')
    with socket.socket() as probe:
        probe.bind(('127.0.0.1', args.port))
    runtime = args.data_dir.resolve() / ('local-' + time.strftime('%Y%m%d-%H%M%S') + '-' + secrets.token_hex(3))
    runtime.mkdir(parents=True)
    database = runtime / 'demo.sqlite'
    seed = subprocess.run(['php', 'server/seed_local.php', str(database)], cwd=APP,
                          capture_output=True, text=True, check=True)
    accounts = json.loads(seed.stdout)
    env = {**os.environ, 'AQUASMART_DB_PATH': str(database), 'AQUASMART_APP_ENV': 'development',
           'AQUASMART_SIMULATOR_ENABLED': '1', 'AQUASMART_SESSION_SECURE': '0'}
    sessions = runtime / 'sessions'
    sessions.mkdir()
    print(f'SIMULASI / LOCAL PROTOTYPE: http://127.0.0.1:{args.port}', flush=True)
    for role in ('admin', 'viewer'):
        print(f"{role}: {accounts[role]['username']} / {accounts[role]['password']}", flush=True)
    print(f'Database: {database}\nLog error: {runtime / "php.log"}', flush=True)
    for device, key in accounts['device_keys'].items():
        print(f'Device key {device}: {key}', flush=True)
    print('Serial tersedia: AQS-AVAILABLE. Ctrl+C menghentikan server dan scheduler.', flush=True)
    with (runtime / 'php.log').open('a', encoding='utf-8') as log:
        server = subprocess.Popen(['php', '-d', f'session.save_path={sessions}', '-d', 'display_errors=0',
                                   '-S', f'127.0.0.1:{args.port}', '-t', 'web', 'server/router.php'],
                                  cwd=APP, env=env, stdout=log, stderr=log)
        try:
            probe = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            for attempt in range(30):
                try:
                    with probe.open(f'http://127.0.0.1:{args.port}/api/health', timeout=1) as response:
                        if response.status == 200:
                            break
                except OSError:
                    if server.poll() is not None:
                        raise RuntimeError('PHP server exited; inspect php.log')
                    time.sleep(0.1)
            else:
                raise RuntimeError('HTTP health timeout')
            while server.poll() is None:
                tick = subprocess.run(['php', 'server/operations_tick.php'], cwd=APP, env=env,
                                      stdout=subprocess.DEVNULL, stderr=log, timeout=15)
                if tick.returncode:
                    raise RuntimeError('Scheduler failed; inspect php.log')
                if args.check:
                    print('LOCAL_SMOKE_OK', flush=True)
                    break
                # ACK workers remain explicit CLI actions; unattended commands expire honestly.
                time.sleep(1)
        except KeyboardInterrupt:
            pass
        finally:
            server.terminate()
            server.wait(timeout=5)


if __name__ == '__main__':
    main()
