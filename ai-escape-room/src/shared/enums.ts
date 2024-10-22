
export enum MoveDirection {
  RIGHT,
  LEFT,
}

export enum SetAppSettingsAction {
  LOAD_LEVEL,
  MOVE,
  PICK_UP_ITEM,
  SELECT_ITEM,
  UNSELECT_ITEM,
  DESTROY_INVENTORY_ITEM,
  EXIT,
}

export enum GameDisplayAreas {
  C1,
  WT1,
  WT2,
  WT3,
  W1,
  W2,
  WT,
  WB1,
  WB2,
  WB3,
  FT1,
  FT2,
  FT3,
  F1,
  F2,
  F3
}

export enum ExitStates {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}