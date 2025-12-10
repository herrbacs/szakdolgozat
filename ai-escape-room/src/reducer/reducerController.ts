import { Container } from 'pixi.js'
import { GameObjectTypeEnum, MoveDirectionEnum } from '../shared/enums'
import { LevelInformation, LockModal } from '../shared/types/appTypes'
import { AppSettings } from '../shared/types/frameworkTypes'
import { ContainerObject, DynamicGameObject, InspectableObject, MovableCoverObject, PickableObject, Wall } from '../shared/types/gameObjectTypes'

export function loadLevel(state: AppSettings, { walls }: LevelInformation): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      currentWall: walls[0],
      indexes: {
        ...state.gameInformation.indexes,
        leftWall: walls.length - 1,
      },
      amountOfWalls: walls.length,
      walls,
    },
  }
}

export function handleMove(state: AppSettings, payload: MoveDirectionEnum): AppSettings {
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
  let { gameInformation: { walls, currentWall } } = state

  walls.forEach(wall => {
    if (wall.id !== currentWall.id) {
      return
    }
    wall.pickables = wall.pickables.filter(pickable => pickable.id !== payload.id)
  })

  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      walls,
      inventory: [
        ...state.gameInformation.inventory,
        payload
      ],
    }
  }
}

export function selectItemFromInventory(state: AppSettings, payload: PickableObject): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      selectedItem: payload
    }
  }
}

export function unselectItemFromInventory(state: AppSettings): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      selectedItem: null
    }
  }
}

export function destroyItemFromInventory(state: AppSettings, payload: PickableObject): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      inventory: state.gameInformation.inventory.filter(item => item.id !== payload.id)
    }
  }
}

export function exit(state: AppSettings): AppSettings {
  let { gameInformation: { walls, indexes: { currentWall } } } = state

  walls[currentWall].exit!.lock.open = true

  return {
    ...state
  }
}

export function toggleObjetInspecting(state: AppSettings, payload: InspectableObject | null): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      inspectingItem: payload
    }
  }
}

export function removeCover(state: AppSettings, { id }: MovableCoverObject): AppSettings {
  let { gameInformation: { walls } } = state
  let { currentWall } = state.gameInformation.indexes

  walls[currentWall].movableCovers =
    walls[currentWall].movableCovers.map(mc => mc.id === id ? { ...mc, used: true } : mc)

  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      ...walls
    }
  }
}

export function openContainer(state: AppSettings, { id }: MovableCoverObject): AppSettings {
  const { gameInformation: { walls, indexes: { currentWall } } } = state
  const wall = walls[currentWall]
  // TODO use findPath method
  function findContainerInWall(wall: Wall, containerId: string): null | { type: 'container' | 'movable', index: number } {

    const containerIndex = wall.containers?.findIndex(c => c.id === containerId)
    if (containerIndex !== -1) {
      return { type: 'container', index: containerIndex }
    }

    const movableIndex = wall.movableCovers?.findIndex(m => m.content.object.id === containerId)

    if (movableIndex !== -1) {
      return { type: 'movable', index: movableIndex }
    }

    return null
  }

  const result = findContainerInWall(wall, id)
  if (result === null) {
    throw new Error(`Container not found with id ${id}`)
  }

  const updatedWalls = [...walls]

  if (result.type === 'container') {
    updatedWalls[currentWall].containers[result.index].lock!.open = true
  }
  else if (result.type === 'movable') {
    const containerObj = updatedWalls[currentWall].movableCovers[result.index].content.object
    if ('lock' in containerObj && containerObj.lock) {
      containerObj.lock.open = true
    }
  }

  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      walls: updatedWalls
    }
  }
}

export function setLockModal(state: AppSettings, payload: null | LockModal): AppSettings {
  return {
    ...state,
    gameInformation: {
      ...state.gameInformation,
      lockModal: payload === null
        ? null
        : payload
    }
  }
}

export function emptyFoundItems(state: AppSettings): AppSettings {
  state.gameInformation.itemsFoundModal = null
  return { ...state }
}

export function searchContainer(state: AppSettings, payload: ContainerObject): AppSettings {
  state.gameInformation.itemsFoundModal = [...payload.content]

  const pickableItems = payload.content
    .filter(item => item.type === GameObjectTypeEnum.PICKABLE)
    .map(({ object }: DynamicGameObject) => object as PickableObject)
  state.gameInformation.inventory.push(...pickableItems)

  const containerLocation = findPath(state.gameInformation, payload.id)
  if (containerLocation === null) {
    throw new Error(`Find Path method has not found the element with id: ${payload.id}`)
  }

  applyOnPath(
    state.gameInformation,
    containerLocation,
    (container: ContainerObject) => {
      container.content = container.content.filter(content => content.type !== GameObjectTypeEnum.PICKABLE)
    }
  )

  return { ...state }
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

function applyOnPath(obj: any, path: (string|number)[], callback: (t: any) => void) {
    let current = obj
    for (const step of path) {
        current = current[step]
        if (current == null) throw new Error("Invalid path!")
    }
    callback(current)
}

