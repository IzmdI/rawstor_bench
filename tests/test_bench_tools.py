import datetime
import json
import os
from pathlib import Path
import runpy
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
IMPORT = runpy.run_path(str(ROOT / 'tools/rawstor-bench-import'))
COMPILE = runpy.run_path(str(ROOT / 'tools/rawstor-bench-compile'))


class BenchToolsTests(unittest.TestCase):
    def test_import_accepts_different_source_filenames_and_preserves_branch_refs(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'fio.json'
            source.write_text('{"jobs": []}', encoding='utf-8')
            txt = root / 'fio.txt'
            txt.write_text('fio output', encoding='utf-8')
            for branch in ['main', 'fix/timeout', 'refs/heads/main', 'topic with spaces']:
                with self.subTest(branch=branch):
                    IMPORT['import_fio'](
                        prefix=root, repo='storage suite', name='test run', branch=branch,
                        commit='ABC', date=datetime.datetime(2026, 1, 1),
                        txt_file=txt, json_file=source)
                    dest = root / 'data/fio/storage suite/test run/AB'
                    meta = json.loads((dest / 'ABC.meta').read_text())
                    self.assertEqual(meta['branch'], branch)
                    self.assertEqual(meta['commit'], 'ABC')
                    self.assertEqual(meta['data'], {'txt': 'ABC.txt', 'json': 'ABC.json'})
                    self.assertEqual((dest / 'ABC.txt').read_bytes(), txt.read_bytes())
                    self.assertEqual((dest / 'ABC.json').read_bytes(), source.read_bytes())

    def test_import_rejects_destinations_outside_fio(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for repo, commit in [('../..', 'abcdef'), ('librawstor', 'aa/../../../../../../outside')]:
                with self.subTest(repo=repo, commit=commit):
                    with self.assertRaisesRegex(ValueError, 'escapes data/fio'):
                        IMPORT['import_fio'](prefix=root, repo=repo, name='test', commit=commit)
            self.assertEqual(list(root.iterdir()), [])

    def test_import_cli_reports_filesystem_errors(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            txt = root / 'fio.txt'
            txt.write_text('fio output')
            source = root / 'fio.json'
            source.write_text('{"jobs": []}')
            dest = root / 'data/fio/librawstor/test/ab'
            dest.parent.mkdir(parents=True)
            dest.write_text('blocks the destination directory')
            result = subprocess.run([
                sys.executable, str(ROOT / 'tools/rawstor-bench-import'),
                '--prefix', str(root), '--repo', 'librawstor', '--name', 'test',
                '--branch', 'main', '--commit', 'abcdef', '--date', '2026-01-01',
                'fio', str(txt), str(source),
            ], capture_output=True, text=True)
            self.assertEqual(result.returncode, 1)
            self.assertIn('Import failed:', result.stderr)
            self.assertNotIn('Traceback', result.stderr)

    def test_compile_limits_details_and_dashboard_links_to_originals(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'data/fio/librawstor/test/00'
            source.mkdir(parents=True)
            for i in range(12):
                sha = f'{i:040x}'
                txt_name = f'{sha}.txt' if i else 'original report.txt'
                (source / f'{sha}.json').write_text(json.dumps({'jobs': [{'read': {
                    'io_bytes': 4096, 'iops': 100, 'lat_ns': {'mean': 1000000},
                }}]}))
                if i != 1:
                    (source / txt_name).write_text('fio output')
                (source / f'{sha}.meta').write_text(json.dumps({
                    'repo': 'librawstor', 'name': 'test', 'branch': 'main',
                    'date': f'2026-01-{i + 1:02d}T00:00:00',
                    'data': {'json': f'{sha}.json', 'txt': txt_name},
                }))
            COMPILE['compile_fio'](prefix=root)
            output = root / 'docs/fio/librawstor'
            self.assertEqual(
                {path.stem for path in (output / 'test').glob('*.md')},
                {f'{i:040x}' for i in range(2, 12)},
            )
            summary = (output / 'README.md').read_text()
            self.assertEqual(sum(line.startswith('| [') for line in summary.splitlines()), 10)
            self.assertNotIn(f'test/{0:040x}.md', summary)
            processor = runpy.run_path(str(ROOT / 'tools/data-processor'))
            with patch.dict(os.environ, {'GITHUB_REPOSITORY': 'owner/rawstor_bench', 'GITHUB_SHA': 'abc123'}):
                raw = processor['collect_raw_data'](root / 'data/fio/librawstor', reports_path=output)
            charts = processor['prepare_charts_data'](raw)
            links = {point['commit_sha']: point['test_url'] for point in charts['iops_read_by_config']}
            github = 'https://github.com/owner/rawstor_bench/blob/abc123/data/fio/librawstor/test/00'
            expected = {
                f'{0:040x}': f'{github}/original%20report.txt',
                f'{1:040x}': f'{github}/{1:040x}.json',
                **{f'{i:040x}': f'../test/{i:040x}.html' for i in range(2, 12)},
            }
            self.assertEqual(links, expected)


    def test_metadata_commit_controls_report_and_dashboard_links(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            data = root / 'data/fio/librawstor'
            source = data / 'test/ab'
            source.mkdir(parents=True)
            for stem, commit, date in [
                ('abcdef', '1234567890abcdef', '2026-01-01'),
                ('abc123', '', '2026-01-02'),
            ]:
                (source / f'{stem}.txt').write_text('fio output')
                (source / f'{stem}.json').write_text(json.dumps({
                    'jobs': [{'read': {'io_bytes': 4096, 'iops': 100}}],
                }))
                (source / f'{stem}.meta').write_text(json.dumps({
                    'repo': 'librawstor', 'name': 'test', 'branch': 'main',
                    'commit': commit, 'date': date,
                    'data': {'txt': f'{stem}.txt', 'json': f'{stem}.json'},
                }))

            COMPILE['compile_fio'](prefix=root)
            output = root / 'docs/fio/librawstor'
            commit = '1234567890abcdef'
            commit_url = f'https://github.com/rawstor/librawstor/commit/{commit}'
            self.assertEqual(
                {path.stem for path in (output / 'test').glob('*.md')},
                {commit, 'abc123'},
            )
            summary = (output / 'README.md').read_text()
            self.assertIn(f'(test/{commit}.md)', summary)
            self.assertIn(commit_url, summary)
            self.assertIn(commit_url, (output / f'test/{commit}.md').read_text())

            processor = runpy.run_path(str(ROOT / 'tools/data-processor'))
            raw = processor['collect_raw_data'](data, reports_path=output)
            charts = processor['prepare_charts_data'](raw)
            links = {point['commit_sha']: point['test_url'] for point in charts['iops_read_by_config']}
            self.assertEqual(links, {commit: f'../test/{commit}.html', 'abc123': '../test/abc123.html'})

    def test_compile_rejects_metadata_without_data_filenames(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'data/fio/librawstor/test/ab'
            source.mkdir(parents=True)
            (source / 'abcdef.meta').write_text(json.dumps({
                'repo': 'librawstor', 'name': 'test', 'date': '2026-01-01', 'data': {},
            }))
            with self.assertRaisesRegex(ValueError, 'data.txt'):
                COMPILE['compile_fio'](prefix=root)
            self.assertFalse((root / 'docs/fio').exists())


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

    def test_compile_replaces_entire_fio_output_tree(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = root / 'docs/fio'
            dashboard = docs / 'librawstor/dashboard'
            dashboard.mkdir(parents=True)
            (docs / 'index.md').write_text('handwritten index')
            (docs / 'librawstor/index.md').write_text('repository index')
            (dashboard / 'data.json').write_text('{"sentinel": true}')
            COMPILE['compile_fio'](prefix=root)
            self.assertTrue((docs / 'README.md').is_file())
            self.assertFalse((docs / 'index.md').exists())
            self.assertFalse((docs / 'librawstor').exists())

    def test_compile_rejects_malformed_metadata_and_missing_identity(self):
        for content in [[], {'repo': 'librawstor', 'name': 'test', 'date': '2026-01-01', 'data': 'invalid'},
                        {'date': '2026-01-01', 'data': {'txt': 'a.txt', 'json': 'a.json'}}]:
            with self.subTest(content=content), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                source = root / 'data/fio/librawstor/test/ab'
                source.mkdir(parents=True)
                (source / 'abcdef.meta').write_text(json.dumps(content))
                with self.assertRaises(ValueError):
                    COMPILE['compile_fio'](prefix=root)
                self.assertFalse((root / 'docs/fio').exists())

    def test_compile_cli_fails_on_corrupt_metadata_or_report(self):
        for broken in ('meta', 'json', 'missing_json', 'missing_txt'):
            with self.subTest(broken=broken), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                source = root / 'data/fio/librawstor/test/ab'
                source.mkdir(parents=True)
                for sha, date in [('abcdef', '2026-01-02'), ('abc123', '2026-01-01')]:
                    (source / f'{sha}.txt').write_text('fio output')
                    (source / f'{sha}.json').write_text('{"jobs": []}')
                    (source / f'{sha}.meta').write_text(json.dumps({
                        'repo': 'librawstor', 'name': 'test', 'branch': 'main',
                        'commit': sha, 'date': date,
                        'data': {'txt': f'{sha}.txt', 'json': f'{sha}.json'},
                    }))
                if broken.startswith('missing_'):
                    (source / f'abcdef.{broken.removeprefix("missing_")}').unlink()
                else:
                    (source / f'abcdef.{broken}').write_text('{broken json')
                result = subprocess.run([
                    sys.executable, str(ROOT / 'tools/rawstor-bench-compile'),
                    '--prefix', str(root), 'fio',
                ], capture_output=True, text=True)
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn('Compiled successfully', result.stdout)
                self.assertFalse((root / 'docs/fio/librawstor/test/abc123.md').exists())


if __name__ == '__main__':
    unittest.main()
