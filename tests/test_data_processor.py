import datetime as dt
import json
import runpy
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / 'tools/data-processor'
PROCESS = runpy.run_path(str(SCRIPT))


class DataProcessorTests(unittest.TestCase):
    def test_days_filter_excludes_undated_runs_and_keeps_empty_windows(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            script = root / 'tools/data-processor'
            script.parent.mkdir()
            script.write_bytes(SCRIPT.read_bytes())
            source = root / 'data/fio/librawstor/test/ab'
            source.mkdir(parents=True)
            now = dt.datetime.now(dt.timezone.utc)
            for commit, age in [('abc001', 2), ('abc002', 40), ('abc003', None)]:
                (source / f'{commit}.json').write_text(json.dumps({
                    'jobs': [{'read': {'io_bytes': 4096, 'iops': 100}}],
                }))
                meta = {'date': (now - dt.timedelta(days=age)).isoformat()} if age is not None else {}
                (source / f'{commit}.meta').write_text(json.dumps(meta))

            output = root / 'docs/fio/librawstor/dashboard/data.json'
            for days, commits in [(0, {'abc001', 'abc002', 'abc003'}), (7, {'abc001'}), (1, set())]:
                with self.subTest(days=days):
                    subprocess.run([sys.executable, str(script), str(days)], check=True, capture_output=True)
                    data = json.loads(output.read_text(encoding='utf-8'))
                    self.assertEqual(data['filter']['days'], days)
                    self.assertEqual(data['filter']['applied'], days > 0)
                    self.assertEqual(data['filter']['cutoff_date'] is not None, days > 0)
                    self.assertEqual(data['summary']['total_tests'], len(commits))
                    self.assertEqual(
                        {p['commit_sha'] for p in data['charts']['iops_read_by_config']},
                        commits,
                    )
                    if not commits:
                        self.assertTrue(all(not points for points in data['charts'].values()))

    def test_timezone_offsets_are_normalized_to_utc(self):
        self.assertEqual(PROCESS['parse_timestamp']('2026-01-02T01:30:00+03:00'),
                         dt.datetime(2026, 1, 1, 22, 30))

    def test_invalid_date_is_not_fabricated(self):
        self.assertIsNone(PROCESS['parse_timestamp']('not a date'))

    def test_daily_sampling_keeps_both_branches_and_latest_run(self):
        points = [dict(timestamp='2026-01-01T10:00:00Z', branch='main', value=1),
                  dict(timestamp='2026-01-01T09:00:00Z', branch='feature', value=2),
                  dict(timestamp='2026-01-01T11:00:00Z', branch='main', value=3)]
        actual = PROCESS['downsample_daily'](points)
        self.assertEqual([(p['branch'], p['value']) for p in actual], [('feature', 2), ('main', 3)])

    def test_undated_runs_do_not_overwrite_dated_runs(self):
        points = [dict(timestamp='Unknown date', branch='main', value=1),
                  dict(timestamp='2026-01-01T10:00:00Z', branch='main', value=2)]
        self.assertEqual(len(PROCESS['downsample_daily'](points)), 2)

    def test_separate_jobs_preserve_both_operations_and_units(self):
        actual = PROCESS['extract_fio_metrics']({'jobs': [
            {'read': {'io_bytes': 4096, 'iops': 100, 'lat_ns': {'mean': 2000000}},
             'write': {'io_bytes': 0, 'iops': 0}},
            {'write': {'io_bytes': 4096, 'iops': 50, 'lat': {'mean': 3000}}},
        ]})
        self.assertEqual(actual, {'iops_read': 100.0, 'latency_read': 2.0,
                                  'iops_write': 50.0, 'latency_write': 3.0})

    def test_empty_jobs_emit_no_fake_zero_measurements(self):
        self.assertEqual(PROCESS['extract_fio_metrics']({'jobs': []}), {})
