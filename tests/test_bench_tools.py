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
                (source / f'{sha}.json').write_text('{"jobs": []}')
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

    def test_compile_skips_metadata_without_data_filenames(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / 'data/fio/librawstor/test/ab'
            source.mkdir(parents=True)
            (source / 'abcdef.meta').write_text(json.dumps({
                'date': '2026-01-01', 'data': {},
            }))
            log = io.StringIO()
            with contextlib.redirect_stdout(log):
                COMPILE['compile_fio'](prefix=root)
            self.assertIn('Skipping', log.getvalue())
            self.assertTrue((root / 'docs/fio/README.md').is_file())


if __name__ == '__main__':
    unittest.main()
