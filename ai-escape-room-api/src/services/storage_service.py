from __future__ import annotations

import io
import json
from urllib.parse import quote

from fastapi import HTTPException
from minio import Minio
from minio.error import S3Error

from config import (
    STORAGE_ACCESS_KEY,
    STORAGE_BUCKET,
    STORAGE_ENDPOINT,
    STORAGE_SECRET_KEY,
    STORAGE_SECURE,
    STORAGE_PUBLIC_BASE_URL,
)

_client = Minio(
    endpoint=STORAGE_ENDPOINT,
    access_key=STORAGE_ACCESS_KEY,
    secret_key=STORAGE_SECRET_KEY,
    secure=STORAGE_SECURE,
)
_bucket_ready = False


def _ensure_bucket() -> None:
    global _bucket_ready
    if _bucket_ready:
        return
    if not _client.bucket_exists(STORAGE_BUCKET):
        _client.make_bucket(STORAGE_BUCKET)
    _bucket_ready = True


def level_object_key(level_id: str, relative_path: str) -> str:
    return f"{level_id}/{relative_path.lstrip('/')}"


def upload_bytes(level_id: str, relative_path: str, content: bytes, content_type: str) -> str:
    _ensure_bucket()
    object_key = level_object_key(level_id, relative_path)
    _client.put_object(
        STORAGE_BUCKET,
        object_key,
        io.BytesIO(content),
        length=len(content),
        content_type=content_type,
    )
    return object_key


def upload_text(level_id: str, relative_path: str, text: str, content_type: str = "text/plain; charset=utf-8") -> str:
    return upload_bytes(level_id, relative_path, text.encode("utf-8"), content_type)


def upload_json(level_id: str, relative_path: str, data: dict) -> str:
    payload = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
    return upload_bytes(level_id, relative_path, payload, "application/json; charset=utf-8")


def read_bytes(level_id: str, relative_path: str) -> bytes:
    _ensure_bucket()
    object_key = level_object_key(level_id, relative_path)
    try:
        response = _client.get_object(STORAGE_BUCKET, object_key)
        try:
            return response.read()
        finally:
            response.close()
            response.release_conn()
    except S3Error:
        raise HTTPException(status_code=404, detail="Object not found")


def read_json(level_id: str, relative_path: str) -> dict:
    content = read_bytes(level_id, relative_path)
    try:
        return json.loads(content.decode("utf-8"))
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Stored JSON is invalid")


def delete_level_prefix(level_id: str) -> None:
    _ensure_bucket()
    objects = _client.list_objects(STORAGE_BUCKET, prefix=f"{level_id}/", recursive=True)
    for _ in _client.remove_objects(STORAGE_BUCKET, (obj.object_name for obj in objects)):
        pass


def public_object_url(level_id: str, relative_path: str) -> str:
    base = STORAGE_PUBLIC_BASE_URL.rstrip("/")
    bucket = quote(STORAGE_BUCKET, safe="")
    key = quote(level_object_key(level_id, relative_path), safe="/")
    return f"{base}/{bucket}/{key}"
