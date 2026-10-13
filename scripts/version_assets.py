"""Refresh static asset URLs when CSS or JavaScript contents change."""
from pathlib import Path
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
ASSET = re.compile(r'((?:href|src)=\")(assets/(?:css|js)/[^\"?]+\.(?:css|js))(?:\?[^\"]*)?(\")')


def refresh() -> None:
    for page in (ROOT/'index.html', ROOT/'v1/index.html', ROOT/'technical.html', ROOT/'technical_v1.html'):
        # All four pages resolve assets relative to the site root (v1 uses base).
        def replace(match: re.Match[str]) -> str:
            asset = ROOT/match[2]
            digest = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
            return f'{match[1]}{match[2]}?v={digest}{match[3]}'
        old = page.read_text()
        new = ASSET.sub(replace, old)
        if new != old:
            page.write_text(new)
            print(page.relative_to(ROOT))


if __name__ == '__main__':
    refresh()
