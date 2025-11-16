import os
from pathlib import Path
from typing import Tuple


BASE = Path(__file__).parent
THUMB_DIR = BASE / "storage" / "thumbnails"
THUMB_DIR.mkdir(parents=True, exist_ok=True)


async def save_thumbnail(file, filename: str) -> Tuple[str, int]:
    """Save an UploadFile-like object to thumbnails directory.

    Returns (relative_path, size_bytes)
    """
    dest = THUMB_DIR / filename
    # file is an UploadFile (async) or SpooledTemporaryFile; handle both
    try:
        content = await file.read()
    except Exception:
        # fallback for sync file-like
        file.seek(0)
        content = file.read()

    with open(dest, "wb") as f:
        f.write(content)

    rel = os.path.relpath(dest, BASE)
    return rel.replace("\\", "/"), dest.stat().st_size
