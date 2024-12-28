
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
  TOGGLE_INVENTORY,
  TOGGLE_OBJECT_INSPECTING,
  DESTROY_PAINTING,
}

export enum GameDisplayAreas {
  C1 = 'C1',
  WT1 = 'WT1',
  WT2 = 'WT2',
  WT3 = 'WT3',
  W1 = 'W1',
  W2 = 'W2',
  W3 = 'W3',
  WT = 'WT',
  WB1 = 'WB1',
  WB2 = 'WB2',
  WB3 = 'WB3',
  FT1 = 'FT1',
  FT2 = 'FT2',
  FT3 = 'FT3',
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3'
}

export enum ExitStates {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export enum InspectableObjectTypes {
  CLOCK = 'CLOCK',
}

export enum InteractableObjectTypes {
  PAINTING = 'PAINTING',
}

export enum InspectableObjectSpriteStates {
  DEFAULT = 'DEFAULT',
}
export enum InteractableObjectSpriteStates {
  DEFAULT = 'DEFAULT',
}

export enum SpritePerspective {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export enum TypeName {
  PICKABLE = 'PickableObject',
  INSPECTABLE = 'InspectableObject',
  INTERACTABLE = 'InteractableObject',
}
