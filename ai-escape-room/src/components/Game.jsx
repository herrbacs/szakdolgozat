import { useContext } from 'react';
import { Wall } from './Wall';
import { AppSettingsContext } from '../context/AppSettingsContext';
import { Text } from '@pixi/react';

const Game = () => {
  const { appSettings } = useContext(AppSettingsContext)

  return (
    <>
        <Wall 
          color={appSettings.levelInformation.walls[Math.abs(appSettings.game.currentWall)].color}
        />
        <Text
          x={appSettings.screen.width / 2}
          y={appSettings.screen.height / 2}
          text={`${Math.abs(appSettings.game.currentWall)} wall`}
          style={{ fontFamily: 'Arial', fontSize: 30 }}
        />
    </>
  )
}

export default Game