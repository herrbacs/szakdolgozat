# ---------------GAME OBJECTS---------------
## Wall
- **Id:** `Guid`
- **Color:** `string`
- **Exit:** `null` | [Exit](#exit)
- **Pickables:** array\<[Pickable](#pickable)>
- **Inspectables:** array\<[Inspectable](#inspectable)>
- **Interactables:** array\<[Interactable](#interactable)>

## Exit
- **Lock:** [LockTypeEnum](#locktypeenum)
- **Activator:** `Guid` | `string`
- **Sprite:** [SpriteSet](#spriteset)

#### Activator
- Ha egy inventory-ban tárolt elem nyitja akkon annak az elemnek az Id-je
- Ha egy jelszó/kód akkor annak a szöveges értéke

## Pickable
- **Id:** `Guid`
- **Position:** [PositionEnum](#positionenum)
- **Sprite:** [Sprite](#sprite)
- **Reusable:** `bool`

## Inspectable
- Id: `Guid`
- Position: [PositionEnum](#positionenum)
- Data:
    - Appellation: `string`
    - Information: `string`
- Sprite: [Sprite](#sprite)

## Interactable
- **Id:** `Guid`
- **Lock:** `null` | [LockTypeEnum](#locktypeenum)
- **Activator:** `null` | `string` | `Guid`
- **Content:** `Guid`

# --------------HELPER OBJECTS--------------
## SpriteSet:
- **Idle:** [Sprite](#sprite)
- **Active:** [Sprite](#sprite)

## Sprite:
- **Default:** [SpriteData](#spritedata)
- **Perspective:** `null` | [SpriteData](#spritedata)

## SpriteData:
- **FileName:** `string`
- **Dimension:** [Dimension](#dimension)

## Dimension:
- **Width:** `int`
- **Height:** `int`

# ------------------ENUMS-------------------
## LockTypeEnum
- **KEY**
- **PASSWORD**

## PositionEnum:
- Ceiling
    - **C1**
- Wall
    - Top Areas:
        - **WT1** 
        - **WT2**
        - **WT3**
    - Middle Areas:
        - **W1** 
        - **W2** 
        - **W3**
    - Bottom Areas:
        - **WB1**
        - **WB2**
        - **WB3**
- Floor
    - Top Areas:
        - **FT1**
        - **FT2**
        - **FT3**
    - Middle Areas:
        - **F1**
        - **F2**
        - **F3**

# ----------------EXCALIDRAW----------------
https://excalidraw.com/#room=8a07987b74f747d4840c,GJjou97EQhK7gODYV_WJWA