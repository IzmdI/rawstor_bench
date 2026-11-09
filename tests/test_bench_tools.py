import contextlib
import datetime
import io
import json
from pathlib import Path
import runpy
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
IMPORT = runpy.run_path(str(ROOT / 'tools/rawstor-bench-import'))
COMPILE = runpy.run_path(str(ROOT / 'tools/rawstor-bench-compile'))


class BenchToolsTests(unittest.TestCase):
    def test_import_preserves_branch_refs(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'abcdef.json'
            source.write_text('{"jobs": []}', encoding='utf-8')
            txt = root / 'fio.txt'
            txt.write_text('fio output', encoding='utf-8')
            for branch in ['main', 'fix/timeout', 'refs/heads/main']:
                with self.subTest(branch=branch):
                    IMPORT['import_fio'](
                        prefix=root, repo='librawstor', name='test', branch=branch,
                        commit='abcdef', date=datetime.datetime(2026, 1, 1),
                        txt_file=txt, json_file=source)
                    meta = root / 'data/fio/librawstor/test/ab/abcdef.meta'
                    self.assertEqual(json.loads(meta.read_text())['branch'], branch)

    def test_invalid_branch_is_rejected(self):
        for branch in ['', 'main\nother', 'main\x00']:
            with self.subTest(branch=branch), self.assertRaises(ValueError):
                IMPORT['_validate_inputs']('.', 'librawstor', 'test', branch, 'abcdef')

    def test_compile_keeps_all_details_but_limits_summary(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'data/fio/librawstor/test/00'
            source.mkdir(parents=True)
            for i in range(11):
                sha = f'{i:040x}'
                (source / f'{sha}.json').write_text(json.dumps({'jobs': [{'read': {
                    'io_bytes': 4096, 'iops': 100, 'lat_ns': {'mean': 1000000},
                }}]}))
                (source / f'{sha}.txt').write_text('fio output')
                (source / f'{sha}.meta').write_text(json.dumps({
                    'repo': 'librawstor', 'name': 'test', 'branch': 'main',
                    'date': f'2026-01-{i + 1:02d}T00:00:00',
                    'data': {'json': f'{sha}.json', 'txt': f'{sha}.txt'},
                }))
            COMPILE['compile_fio'](prefix=root)
            output = root / 'docs/fio/librawstor'
            self.assertEqual(len(list((output / 'test').glob('*.md'))), 11)
            summary = (output / 'README.md').read_text()
            self.assertEqual(sum(line.startswith('| [') for line in summary.splitlines()), 10)
            self.assertNotIn(f'test/{0:040x}.md', summary)
            processor = runpy.run_path(str(ROOT / 'tools/data-processor'))
            raw = processor['collect_raw_data'](root / 'data/fio/librawstor')
            charts = processor['prepare_charts_data'](raw)
            self.assertEqual(len(charts['iops_read_by_config']), 11)
            for points in charts.values():
                for point in points:
                    detail = (output / 'dashboard' / point['test_url']).resolve()
                    self.assertTrue(detail.is_file(), point['test_url'])


    def test_compile_skips_metadata_without_data_filenames(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'data/fio/librawstor/test/ab'
            source.mkdir(parents=True)
            (source / 'abcdef.meta').write_text(json.dumps({
                'repo': 'librawstor', 'name': 'test', 'date': '2026-01-01', 'data': {},
            }))
            log = io.StringIO()
            with contextlib.redirect_stdout(log):
                COMPILE['compile_fio'](prefix=root)
            self.assertIn('Skipping', log.getvalue())
            self.assertTrue((root / 'docs/fio/README.md').is_file())


    def test_compile_accepts_mixed_timezone_dates(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'data/fio/librawstor/test/ab'
            source.mkdir(parents=True)
            for sha, date in [('abcdef', '2026-01-01T10:00:00'),
                              ('abcdff', '2026-01-01T14:00:00+03:00')]:
                (source / f'{sha}.txt').write_text('fio output')
                (source / f'{sha}.json').write_text('{"jobs": []}')
                (source / f'{sha}.meta').write_text(json.dumps({
                    'repo': 'librawstor', 'name': 'test', 'branch': 'main', 'date': date,
                    'data': {'txt': f'{sha}.txt', 'json': f'{sha}.json'},
                }))
            COMPILE['compile_fio'](prefix=root)
            summary = (root / 'docs/fio/librawstor/README.md').read_text()
            self.assertLess(summary.index('abcdff.md'), summary.index('abcdef.md'))

    def test_cleanup_preserves_handwritten_index_and_dashboard(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = root / 'docs/fio'
            dashboard = docs / 'librawstor/dashboard'
            dashboard.mkdir(parents=True)
            (docs / 'index.md').write_text('handwritten index')
            (docs / 'librawstor/index.md').write_text('repository index')
            (dashboard / 'data.json').write_text('{"sentinel": true}')
            COMPILE['compile_fio'](prefix=root)
            self.assertEqual((docs / 'index.md').read_text(), 'handwritten index')
            self.assertEqual((docs / 'librawstor/index.md').read_text(), 'repository index')
            self.assertEqual((dashboard / 'data.json').read_text(), '{"sentinel": true}')

    def test_compile_skips_malformed_metadata_and_missing_identity(self):
        for content in [[], {'repo': 'librawstor', 'name': 'test', 'date': '2026-01-01', 'data': 'invalid'},
                        {'date': '2026-01-01', 'data': {'txt': 'a.txt', 'json': 'a.json'}}]:
            with self.subTest(content=content), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                source = root / 'data/fio/librawstor/test/ab'
                source.mkdir(parents=True)
                (source / 'abcdef.meta').write_text(json.dumps(content))
                with contextlib.redirect_stdout(io.StringIO()):
                    COMPILE['compile_fio'](prefix=root)
                self.assertTrue((root / 'docs/fio/README.md').is_file())


if __name__ == '__main__':
    unittest.main()
