from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import requests

from config import SOCKET_SERVER_URL

EMIT_ENDPOINT = f"{SOCKET_SERVER_URL.rstrip('/')}/events/level-generation"


def emit_level_generation_update(
    *,
    level_id: str,
    step: str,
    status: str,
    message: str,
    meta: dict[str, Any] | None = None,
) -> None:
    payload = {
        "roomId": level_id,
        "step": step,
        "status": status,
        "message": message,
        "meta": meta or {},
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    try:
        requests.post(EMIT_ENDPOINT, json=payload, timeout=2)
    except Exception:
        # Socket status updates are best-effort; generation must continue even if unavailable.
        return


def emit_generation_started(level_id: str, difficulty: int, sprite_style: str) -> None:
    emit_level_generation_update(
        level_id=level_id,
        step="generation-started",
        status="in_progress",
        message="Level generation started.",
        meta={"difficulty": difficulty, "sprite_style": sprite_style},
    )


def emit_generation_failed(level_id: str, message: str) -> None:
    emit_level_generation_update(
        level_id=level_id,
        step="generation-failed",
        status="failed",
        message=message,
    )


def emit_generation_completed(level_id: str) -> None:
    emit_level_generation_update(
        level_id=level_id,
        step="generation-completed",
        status="completed",
        message="Level generation completed.",
    )
