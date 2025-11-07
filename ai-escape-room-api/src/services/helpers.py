import uuid
from dataclasses import asdict, is_dataclass

def dataclass_to_dict(obj):
    if is_dataclass(obj):
        return {k[:1].lower() + k[1:]: dataclass_to_dict(v) for k, v in asdict(obj).items()}
    elif isinstance(obj, uuid.UUID):
        return str(obj)
    elif isinstance(obj, list):
        return [dataclass_to_dict(i) for i in obj]
    elif isinstance(obj, dict):
        return {str(k)[:1].lower() + str(k)[1:]: dataclass_to_dict(v) for k, v in obj.items()}
    else:
        return obj