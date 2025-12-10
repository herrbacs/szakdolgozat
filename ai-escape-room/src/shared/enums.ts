export enum MoveDirectionEnum {
  RIGHT,
  LEFT,
}

export enum SetAppSettingsActionEnum {
  LOAD_LEVEL,
  MOVE,
  PICK_UP_ITEM,
  EMPTY_FOUD_ITEMS,
  SELECT_ITEM,
  UNSELECT_ITEM,
  DESTROY_INVENTORY_ITEM,
  EXIT,
  TOGGLE_INVENTORY,
  TOGGLE_OBJECT_INSPECTING,
  REMOVE_COVER,
  SET_LOCK_MODAL,
  CONTAINER_SEARCH,
  CONTAINER_OPEN,
}

export enum GameObjectTypeEnum {
  PICKABLE = "PICKABLE",
  INSPECTABLE = "INSPECTABLE",
  CONTAINER = "CONTAINER",
  MOVALBE_COVER = "MOVALBE_COVER",
}

export enum LockTypeEnum {
  KEY = "KEY",
  PASSWORD = "PASSWORD",
}

export enum SizeEnum {
  S = "S",
  M = "M",
  L = "L",
}

export enum PositionEnum {
    WT1 = "WT1",
    WT2 = "WT2",
    WT3 = "WT3",

    W1 = "W1",
    W2 = "W2",
    W3 = "W3",

    WB1 = "WB1",
    WB2 = "WB2",
    WB3 = "WB3",

    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
}

export enum SpritePerspectiveEnum {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}
