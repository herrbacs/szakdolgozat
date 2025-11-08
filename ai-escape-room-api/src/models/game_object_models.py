from dataclasses import dataclass, field
from typing import List, Optional
from typing import Union
import uuid

from .enums import *
from .base_models import *

@dataclass
class DynamicGameObject:
    Type: GameObjectTypeEnum
    Object: Union["Inspectable", "Pickable", "Container", "MovableCover"]

@dataclass
class Pickable:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    Reusable: bool
    InspectionData: InspectionData

@dataclass
class Inspectable:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    InspectionData: InspectionData

@dataclass
class Container:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    Content: List[DynamicGameObject]
    InspectionData: InspectionData
    Lock: Optional[Lock] = None

@dataclass
class MovableCover:
    Id: uuid.UUID
    Position: PositionEnum
    Sprite: Sprite
    Content: DynamicGameObject
    InspectionData: InspectionData

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