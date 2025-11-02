import uuid

from ..models.helpers import *
from ..models.enums import *
from ..models.game_objects import *

EXIT_KEY_ID = uuid.UUID("00c713fa-eb02-474d-a392-324e65bb3069")
NOTE_ID = uuid.UUID("1c17a287-07a6-4476-bdfd-a9e30fead56d")
SAFE_ID = uuid.UUID("9a9d8c1f-0845-4e00-af6a-3564e01ab082")
PAINTING_ID = uuid.UUID("a1a4df66-b3f9-4e47-9829-2f2ec46d8313")
ENVELOPE_KNIFE_ID = uuid.UUID("085bc822-8c13-4e45-83e6-81fc7eb928a8")
CONTAINER_ID = uuid.UUID("6a204901-2934-4923-b1a7-3a3aa732080b")

def level_0():
    return Level(Walls=[
        wall_1(),
        wall_2(),
        wall_3(),
        wall_4()
    ])

def wall_1():
    door_sprite = SpriteSet(
        Sprite(
            SpriteData("exit_idle.png", Dimension(256, 512), SizeEnum.L)
        ),
        Sprite(
            SpriteData("exit_active.png", Dimension(256, 512), SizeEnum.L)
        ),
    )

    return Wall(
        uuid.uuid4(),
        "#aa7100",
        Exit(Lock(LockTypeEnum.KEY, EXIT_KEY_ID), door_sprite)
    )

def wall_2():
    SAFE_POSITION = PositionEnum.W2

    safe = Container(
        SAFE_ID,
        SAFE_POSITION,
        Sprite(SpriteData(f"{SAFE_ID}.png", Dimension(128, 64), SizeEnum.M)),
        [
            GameObject(
                GameObjectType.INSPECTABLE,
                Inspectable(
                    NOTE_ID,
                    SAFE_POSITION,
                    Sprite(SpriteData(f"{NOTE_ID}.png", Dimension(128, 128))),
                    Data("Note", "4863")
                )
            ),
            GameObject(
                GameObjectType.PICKABLE,
                Pickable(
                    NOTE_ID,
                    ENVELOPE_KNIFE_ID,
                    Sprite(SpriteData(f"{NOTE_ID}.png", Dimension(128, 256))),
                    True,
                    Data("Envelope Knife", "An odd rusty envelope knife. Why was it locked in a safe?")
                )
            )
        ],
        Lock(LockTypeEnum.PASSWORD, "1111")
    )

    painting = MovableCover(
        PAINTING_ID,
        Sprite(SpriteData(f"{PAINTING_ID}.png", Dimension(128, 256), SizeEnum.L)),
        GameObject(GameObjectType.CONTAINER, safe)
    )

    return Wall(
        Id=uuid.uuid4(),
        Color="#5cad00ff",
        MovableCovers=[
            painting
        ]
    )

def wall_3():
    desktop=Container(
        CONTAINER_ID,
        PositionEnum.F2,
        Sprite(SpriteData(f"{CONTAINER_ID}.png", Dimension(256, 128), SizeEnum.L)),
        Lock=Lock(LockTypeEnum.PASSWORD, "4863"),
        Content=[
            GameObject(GameObjectType.PICKABLE, Pickable(
                EXIT_KEY_ID,
                PositionEnum.F2,
                Sprite(SpriteData(f"{CONTAINER_ID}.png", Dimension(100, 100))),
                False,
                Data("Big Rusty Key", "This might opens the door")
            ))
        ]
    )

    return Wall(
        Id=uuid.uuid4(),
        Color="#00ffdd",
        Containers=[desktop]
    )

def wall_4():
    return Wall(
        Id=uuid.uuid4(),
        Color="#9100b6",
    )