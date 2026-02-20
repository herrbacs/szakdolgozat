import { Assets, Texture } from 'pixi.js'
import { useEffect, useState } from 'react'
import { spriteUrl } from '../shared/urls'
import { UUID } from '../shared/types/frameworkTypes'

export const useSprite = (levelId: UUID | string, spriteId: string) => {
  const [sprite, setSprite] = useState<Texture>(Texture.EMPTY)
  const [spriteLoaded, setSpriteLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const sprite = await Assets.load({
        src: spriteUrl(levelId, spriteId),
        parser: 'loadTextures',
      })
      setSprite(sprite)
      setSpriteLoaded(true)
    }

    load()
  }, [levelId, spriteId])

  return { sprite, spriteLoaded }
}