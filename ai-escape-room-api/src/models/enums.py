from enum import Enum

class GameObjectType(str, Enum):
    PICKABLE = "PICKABLE"
    INSPECTABLE = "INSPECTABLE"
    CONTAINER = "CONTAINER"

class LockTypeEnum(str, Enum):
    KEY = "KEY"
    PASSWORD = "PASSWORD"

class SizeEnum(str, Enum):
    S = "S"
    M = "M"
    L = "L"

class PositionEnum(str, Enum):
    # Wall - Top
    WT1 = "WT1"
    WT2 = "WT2"
    WT3 = "WT3"
    # Wall - Middle
    W1 = "W1"
    W2 = "W2"
    W3 = "W3"
    # Wall - Bottom
    WB1 = "WB1"
    WB2 = "WB2"
    WB3 = "WB3"
    # Floor
    F1 = "F1"
    F2 = "F2"
    F3 = "F3"
