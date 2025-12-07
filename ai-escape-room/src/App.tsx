import React, { useContext, useEffect, useRef, useState } from 'react';
import { BunnySprite } from './BunnySprite'
import { AppSettingsContextType } from './shared/types/frameworkTypes';
import { AppSettingsContext } from './context/AppSettingsContext';
import AppOverlay from './components/Application/AppOverlay';
import ToggleInventory from './components/Application/ToggleInventory';
import {
    Application,
    extend,
} from '@pixi/react';
import {
    Container,
    Graphics,
    Sprite,
    Text,
} from 'pixi.js';
import { SetAppSettingsActionEnum } from './shared/enums';

extend({
    Container,
    Graphics,
    Sprite,
    Text,
});

export default function App() {
  const { appSettings: { screenSettings: { dimension: { width, height } } }, setAppSettings }: AppSettingsContextType = useContext(AppSettingsContext)
  const parentRef = useRef(null);
  const [levelLoaded, setLevelLoaded] = useState<boolean>(false)

  useEffect(() => {
    async function generateLevel() {
      const response = await fetch('http://localhost:5000/generate-level', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if(!response.ok) {
        console.error(response)
        return
      }

      setAppSettings({ action: SetAppSettingsActionEnum.LOAD_LEVEL , payload: await response.json() });
      setLevelLoaded(true)
    }

    generateLevel()
    console.log('Level Generated')
  }, []);

  return levelLoaded
  ? (
     <div 
        ref={parentRef} 
        style={{position: 'relative', width: `${width}px`, overflow: 'hidden'}}
      >
      <Application resizeTo={parentRef}>
          <BunnySprite/>
          <ToggleInventory/>
      </Application>
      <AppOverlay/>
    </div>
  ) 
  : <h1>Loading Level</h1>
}
