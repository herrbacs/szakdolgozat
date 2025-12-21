export enum MoveDirectionEnum {
  RIGHT,
  LEFT,
}

export enum SetAppSettingsActionEnum {
  LOAD_LEVEL,
  MOVE_AROUND,
  MOVE_TO,
  PICK_UP_ITEM,
  EMPTY_FOUD_ITEMS_MODAL,
  SELECT_ITEM,
  UNSELECT_ITEM,
  DESTROY_INVENTORY_ITEM,
  EXIT,
  TOGGLE_INVENTORY,
  TOGGLE_NOTEPAD,
  UPDATE_NOTEPAD,
  TOGGLE_OBJECT_INSPECTING,
  REMOVE_COVER,
  SET_LOCK_MODAL,
  CONTAINER_SEARCH,
  CONTAINER_OPEN,
  TAKE_FOUND_ITEMS,
  SET_CURSOR_ACTIONS,
}

export enum GameObjectTypeEnum {
  PICKABLE = 'PICKABLE',
  INSPECTABLE = 'INSPECTABLE',
  CONTAINER = 'CONTAINER',
  MOVALBE_COVER = 'MOVALBE_COVER',
}

export enum LockTypeEnum {
  KEY = 'KEY',
  PASSWORD = 'PASSWORD',
  CODE_ONLY_NUMBER = 'CODE_ONLY_NUMBER',
  CODE_ONLY_LETTER = 'CODE_ONLY_LETTER',
}

export enum SizeEnum {
  S = 'S',
  M = 'M',
  L = 'L',
}

export enum PositionEnum {
    WT1 = 'WT1',
    WT2 = 'WT2',
    WT3 = 'WT3',

    W1 = 'W1',
    W2 = 'W2',
    W3 = 'W3',

    WB1 = 'WB1',
    WB2 = 'WB2',
    WB3 = 'WB3',

    F1 = 'F1',
    F2 = 'F2',
    F3 = 'F3',
}

export enum SpritePerspectiveEnum {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}
