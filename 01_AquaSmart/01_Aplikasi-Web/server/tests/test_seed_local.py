import json
from contextlib import closing
import sqlite3
import subprocess
import socket
import sys
import tempfile
from pathlib import Path
import unittest

APP = Path(__file__).resolve().parents[2]


class LocalSeedTests(unittest.TestCase):
    def test_launcher_starts_http_scheduler_and_stops(self):
        with tempfile.TemporaryDirectory() as directory:
            with socket.socket() as probe:
                probe.bind(('127.0.0.1', 0))
                port = probe.getsockname()[1]
            result = subprocess.run([sys.executable, 'server/run_local.py', '--port', str(port),
                                     '--data-dir', directory, '--check'], cwd=APP,
                                    capture_output=True, text=True, timeout=20)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn('LOCAL_SMOKE_OK', result.stdout)
            with socket.socket() as probe:
                probe.settimeout(1)
                self.assertNotEqual(probe.connect_ex(('127.0.0.1', port)), 0)

    def test_fresh_seed_is_complete_and_existing_database_is_preserved(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'demo.sqlite'
            command = ['php', 'server/seed_local.php', str(path)]
            run = subprocess.run(command, cwd=APP, capture_output=True, text=True)
            self.assertEqual(run.returncode, 0, run.stderr)
            seed = json.loads(run.stdout)
            self.assertNotEqual(seed['admin']['password'], seed['viewer']['password'])
            with closing(sqlite3.connect(path)) as db:
                self.assertEqual(db.execute('SELECT COUNT(*) FROM users').fetchone()[0], 2)
                self.assertEqual(db.execute('SELECT COUNT(*) FROM devices').fetchone()[0], 6)
                self.assertEqual({r[0] for r in db.execute('SELECT status FROM actuator_commands')},
                                 {'succeeded', 'failed', 'timeout'})
                self.assertEqual(db.execute('SELECT COUNT(*) FROM growth_observations').fetchone()[0], 1)
                self.assertEqual(db.execute('SELECT COUNT(*) FROM sensor_readings WHERE simulation=0').fetchone()[0], 0)
                for table in ('sensor_readings','alerts','actuator_commands','growth_observations','audit_logs'):
                    self.assertEqual(db.execute(f'SELECT DISTINCT provenance FROM {table}').fetchall(), [('seed',)])
            before = path.read_bytes()
            retry = subprocess.run(command, cwd=APP, capture_output=True, text=True)
            self.assertEqual(retry.returncode, 2)
            self.assertEqual(path.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
