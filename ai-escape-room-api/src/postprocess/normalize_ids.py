from typing import Any, Dict
import copy
import uuid

def normalize_level_id_structures(level: Dict[str, Any]) -> Dict[str, Any]:
    level_copy = copy.deepcopy(level)
    mapping: Dict[str, str] = {}

    def _is_uuid(s: Any) -> bool:
        if not isinstance(s, str):
            return False
        try:
            uuid.UUID(s)
            return True
        except Exception:
            return False

    def ensure_uuid(old: str) -> str:
        if _is_uuid(old):
            return old
        return mapping.setdefault(old, str(uuid.uuid4()))

    ID_KEYS = {"id", "targetId", "dependsOn"}

    def walk(node: Any) -> None:
        if isinstance(node, dict):
            for k, v in list(node.items()):
                if k in ID_KEYS:
                    if isinstance(v, str):
                        node[k] = ensure_uuid(v)
                    else:
                        node[k] = str(uuid.uuid4())
                walk(v)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    def replace_references(node: Any) -> Any:
        if isinstance(node, dict):
            return {k: replace_references(v) for k, v in node.items()}
        if isinstance(node, list):
            return [replace_references(v) for v in node]
        if isinstance(node, str):
            return mapping.get(node, node)
        return node

    walk(level_copy)
    level_copy = replace_references(level_copy)
    return level_copy
