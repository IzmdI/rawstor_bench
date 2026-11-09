import datetime as dt
import runpy
import unittest
from pathlib import Path

PROCESS = runpy.run_path(str(Path(__file__).resolve().parents[1] / 'tools/data-processor'))


class DataProcessorTests(unittest.TestCase):
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
