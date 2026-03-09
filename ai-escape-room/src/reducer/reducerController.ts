import { GameObjectTypeEnum, MoveDirectionEnum } from '../shared/enums'
import { CursorActions, InspectingModal, LevelInformation, LockModal } from '../shared/types/appTypes'
import { Dimension } from '../shared/types/gameBaseTypes'
import { AppSettings } from '../shared/types/frameworkTypes'
import { ContainerObject, DynamicGameObject, MovableCoverObject, PickableObject, Wall } from '../shared/types/gameObjectTypes'

export function setScreenDimension(state: AppSettings, payload: Dimension): AppSettings {
  return {
    ...state,
    screenSettings: {
      ...state.screenSettings,
      dimension: payload,
    },
  }
}

export function loadLevel(state: AppSettings, { walls, story, derivation, id }: LevelInformation): AppSettings {
  const amountOfWalls = walls.length
  const currentWall = 0
  const leftWall = walls.length - 1
  const rightWall = walls.length - 1

  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      levelId: id,
      walls,
      amountOfWalls,
      derivation,
      indexes: {
        currentWall,
        leftWall,
        rightWall
      },
      inventory: [],
      showGameMenu: false,
      showLevelCompleteModal: false,
      levelStartedAt: Date.now(),
    }
  }
}

export function moveAround(state: AppSettings, payload: MoveDirectionEnum): AppSettings {
  let { amountOfWalls, walls } = state.gameInformation
  let { currentWall } = state.gameInformation.indexes

  if (payload === MoveDirectionEnum.LEFT) {
    currentWall = (currentWall - 1 + amountOfWalls) % amountOfWalls
  }

  if (payload === MoveDirectionEnum.RIGHT) {
    currentWall = (currentWall + 1) % amountOfWalls
  }

  const rightWallIndex = (currentWall + 1) % amountOfWalls
  const leftWallIndex = (currentWall - 1 + amountOfWalls) % amountOfWalls

  const currentWallObject = walls[Math.abs(currentWall)]

  const result = {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      currentWall: currentWallObject,
      indexes: {
        currentWall,
        leftWall: leftWallIndex,
        rightWall: rightWallIndex
      },
    }
  }

  return result
}

export function moveTo(state: AppSettings, payload: number): AppSettings {
  let { amountOfWalls } = state.gameInformation

  const currentWall = payload
  const rightWall = (payload + 1) % amountOfWalls
  const leftWall = (payload - 1 + amountOfWalls) % amountOfWalls

  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      indexes: {
        currentWall,
        leftWall,
        rightWall,
      },
    }
  }
}

export function toggleInventory(state: AppSettings): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      showInventory: !state.gameInformation.showInventory
    }
  }
}

export function addItemToInventory(state: AppSettings, payload: PickableObject): AppSettings {
  findAndApply(getCurrentWall(state), payload.id, (item: PickableObject) => item.taken = true)

  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      inventory: [
        ...state.gameInformation.inventory,
        payload
      ],
    }
  }
}

export function selectItemFromInventory(state: AppSettings, payload: PickableObject): AppSettings {
  state.gameInformation.selectedItem = payload
  return { ...state }
}

export function unselectItemFromInventory(state: AppSettings): AppSettings {
  state.gameInformation.selectedItem = null
  return { ...state }
}

export function destroyItemFromInventory(state: AppSettings, payload: PickableObject): AppSettings {
  state.gameInformation.inventory = state.gameInformation.inventory.filter(item => item.id !== payload.id)
  return { ...state }
}

export function exit(state: AppSettings): AppSettings {
  getCurrentWall(state).exit!.lock.open = true
  state.gameInformation.showLevelCompleteModal = true
  state.gameInformation.showGameMenu = false
  return { ...state }
}

export function toggleObjetInspecting(state: AppSettings, payload: InspectingModal | null): AppSettings {
  state.gameInformation.InspectingModal = payload
  return { ...state }
}

export function removeCover(state: AppSettings, { id }: MovableCoverObject): AppSettings {
  findAndApply(getCurrentWall(state).movableCovers, id, (cover: MovableCoverObject) => cover.used = true)
  return { ...state }
}

export function openContainer(state: AppSettings, { id }: MovableCoverObject): AppSettings {
  findAndApply(getCurrentWall(state), id, (container: ContainerObject) => container.lock!.open = true)
  return { ...state }
}

export function setLockModal(state: AppSettings, payload: null | LockModal): AppSettings {
  if (payload === null) {
    return { 
      ...state,
      gameInformation: {
        ...state.gameInformation,
        lockModal: null
      }
    }
  }

  const derivation = state.gameInformation.derivation
    .find(element => element.targetId === payload?.parentObjectId)
  
  if (!derivation) {
    throw new Error('Failed to find lock parent object id and its hints')
  }

  payload.hints = derivation.playerHints

  return { 
    ...state,
    gameInformation: {
      ...state.gameInformation,
      lockModal: payload
    }
  }
}

export function emptyFoundItems(state: AppSettings): AppSettings {
  state.gameInformation.itemsFoundModal = null
  return { ...state }
}

export function searchContainer(state: AppSettings, payload: ContainerObject): AppSettings {
  state.gameInformation.itemsFoundModal = [...payload.content]
  return { ...state }
}

export function takeFoundItems(state: AppSettings): AppSettings {
  const { gameInformation: { itemsFoundModal } } = state
  if (itemsFoundModal === null) {
    return { ...state }
  }

  itemsFoundModal
    .filter(item => item.type === GameObjectTypeEnum.PICKABLE)
    .map(({ object }: DynamicGameObject) => object as PickableObject)
    .forEach((pickableItem: PickableObject) => {
      state.gameInformation.inventory.push(pickableItem)

      const path = findPath(state.gameInformation, pickableItem.id)
      if (path === null) {
        throw new Error(`Find Path method has not found the element with id: ${pickableItem.id}`)
      }

      applyOnPathRef(state.gameInformation, path.slice(0, -2), (parent, key) => {
        if (Array.isArray(parent[key])) {
          parent[key] = parent[key].filter((el: DynamicGameObject) => el.object.id !== pickableItem.id)
        } else {
          parent[key] = null
        }
      })

      state.gameInformation.itemsFoundModal = itemsFoundModal.filter(foundItem => foundItem.object.id !== pickableItem.id)
    })

  return { ...state }
}

export function setCursorActions(state: AppSettings, payload: CursorActions): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      cursorActions: payload
    }
  }
}

export function toggleGameMenu(state: AppSettings): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      showGameMenu: !state.gameInformation.showGameMenu,
    }
  }
}

export function setLevelCompleteModal(state: AppSettings, payload: boolean): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      showLevelCompleteModal: payload,
    }
  }
}

export function toggleNotepad(state: AppSettings): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      notepad: {
        ...state.gameInformation.notepad,
        visible: !state.gameInformation.notepad.visible
      },
    }
  }
}

export function updateNotepad(state: AppSettings, payload: string): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      notepad: {
        ...state.gameInformation.notepad,
        content: payload
      },
    }
  }
}

function getCurrentWall(state: AppSettings): Wall {
  const { gameInformation: { walls, indexes: { currentWall } } } = state
  return walls[currentWall]
}

function findAndApply<T>(obj: any, id: string, callback: (t: T) => void) {
  const path = findPath(obj, id)
  if (path === null) {
    throw new Error(`Find Path method has not found the element with id: ${id}`)
  }

  applyOnPath(obj, path, callback)
}

// Lazy way, TODO: catch path to each id
function findPath(obj: any, id: string, path: (string | number)[] = []): (string | number)[] | null {
  if (obj === null || typeof obj !== "object") return null

  if (obj.id === id) {
    return path
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const res = findPath(obj[i], id, [...path, i])
      if (res) return res
    }
  } else {
    for (const key in obj) {
      const res = findPath(obj[key], id, [...path, key])
      if (res) return res
    }
  }

  return null
}

function applyOnPath(obj: any, path: (string | number)[], callback: (t: any) => void) {
  let current = obj
  for (const step of path) {
    current = current[step]
    if (current == null) throw new Error("Invalid path!")
  }
  callback(current)
}

function applyOnPathRef(obj: any, path: (string | number)[], callback: (parent: any, key: string | number) => void) {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]]
    if (current == null) throw new Error("Invalid path!")
  }
  const lastKey = path[path.length - 1]
  callback(current, lastKey)
}
