from dataclasses import dataclass
from typing import Optional, Union
import uuid

from .enums import *
    
@dataclass
class Dimension:
    Width: int
    Height: int

@dataclass
class SpriteData:
    FileName: str
    Dimension: Dimension
    Size: Optional[SizeEnum] = None

@dataclass
class Sprite:
    Default: SpriteData
    Perspective: Optional[SpriteData] = None

@dataclass
class SpriteSet:
    Idle: Sprite
    Active: Sprite

@dataclass
class Data:
    Appellation: str
    Information: str

@dataclass
class Lock:
    Type: LockTypeEnum
    Activator: Union[str, uuid.UUID]
