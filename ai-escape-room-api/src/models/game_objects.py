from dataclasses import dataclass, field
from typing import List, Optional
from typing import Union
import uuid

from .enums import *
from .helpers import *

@dataclass
class GameObject:
    Type: GameObjectType
    Object: Union["Inspectable", "Pickable", "Container"]

@dataclass
class Pickable:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    Reusable: bool
    Data: Data

@dataclass
class Inspectable:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    Data: Data

@dataclass
class Container:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    Content: List[GameObject]
    Lock: Optional[Lock] = None

@dataclass
class MovableCover:
    Id: uuid.UUID
    Sprite: Sprite
    Content: GameObject

@dataclass
class Exit:
    Lock: Lock
    Sprite: SpriteSet

@dataclass
class Wall:
    Id: uuid.UUID
    Color: str
    Exit: Optional[Exit] = None
    Pickables: List[Pickable] = field(default_factory=list)
    Inspectables: List[Inspectable] = field(default_factory=list)
    Containers: List[Container] = field(default_factory=list)
    MovableCovers: List[MovableCover] = field(default_factory=list)

@dataclass
class Level:
    Walls: List[Wall]