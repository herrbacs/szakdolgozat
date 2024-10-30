import React, { useContext, useEffect, useState } from 'react'
import { AppSettingsContextType } from '../../../shared/types'
import { AppSettingsContext } from '../../../context/AppSettingsContext'
import { base64ToBlob } from '../../../shared/helper'
import { InspectableObjectSpriteStates, SetAppSettingsAction } from '../../../shared/enums'

const InspectModal = () => {
	const { appSettings: { gameInformation: { inspectingItem } }, setAppSettings } : AppSettingsContextType = useContext(AppSettingsContext)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [longText, setLongText] = useState<boolean>(false)
  const [pages, setPages] = useState<string[]>([])

  const sprite = inspectingItem?.sprites.find(sprite => sprite.state === InspectableObjectSpriteStates.DEFAULT)
  function splitTextToPages(text: string, maxCharacters = 1000) {
    const pages = [];
    
    for (let i = 0; i < text.length; i += maxCharacters) {
        pages.push(text.slice(i, i + maxCharacters));
    }

    return pages;
  }
  useEffect(() => {
    if (!inspectingItem) {
      return;
    }

    setLongText(inspectingItem.text.length >= 120)
    setPages(splitTextToPages(inspectingItem.text))
  }, [inspectingItem])

  return (
    inspectingItem && sprite &&
    <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0 }}>
      <div style={{ backgroundColor: '#8f8f8f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%', height: '80%', borderRadius: '2rem'}}>
          <div style={{position: 'relative', padding: '.5rem 0', display: 'flex', width: '100%', textTransform: 'uppercase', color: '#FFFF', fontWeight: 'bold'}}>
            <div style={{width: '100%', fontSize: '1.5rem', textAlign: 'center'}}>{inspectingItem?.type}</div>
            <div 
              onClick={() => setAppSettings({ action: SetAppSettingsAction.TOGGLE_OBJECT_INSPECTING , payload: null })}
              style={{position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem', textAlign: 'center', cursor: 'pointer'}}
            >
              X
            </div>
          </div>
          { 
            longText && (
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%',}}>
                <div style={{width: '30%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img style={{width: '90%'}} src={URL.createObjectURL(base64ToBlob(sprite.blob, 'image/png'))} alt={sprite.name}></img>
                </div>
                <div style={{width: '70%', height: '100%', display: 'flex', fontSize: '1.2rem', textTransform: 'uppercase', color: '#ffec99', textAlign: 'justify', alignItems: 'center'}}>
                  <p style={{padding: '1rem', wordBreak: 'break-word'}}>{pages[currentPage]}...</p>
                </div>
              </div>
            )
          }
          { 
            !longText && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img src={URL.createObjectURL(base64ToBlob(sprite.blob, 'image/png'))} alt={sprite.name}></img>
                </div>
                <div style={{width: '90%', display: 'flex', fontSize: '1.2rem', textTransform: 'uppercase', color: '#ffec99',justifyContent: 'center'}}>
                  <p style={{wordBreak: 'break-word', textAlign: 'center'}}>{inspectingItem.text}</p>
                </div>
              </div>
            )
          }
          { pages.length > 1 && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 0 2rem 0'}}>
              <div onClick={() => {setCurrentPage(currentPage - 1)}} style={{display: 'flex', width: '1rem', cursor: 'pointer'}}>
                { currentPage !== 0 &&
                  <svg style={{ height: '1rem'}} viewBox="3.433 4.327 101.769 99.833" width="101.769" height="99.833" xmlns="http://www.w3.org/2000/svg">
                    <path style={{stroke: 'rgb(0, 0, 0)', strokeWidth: '2px', paintOrder: 'stroke', strokeOpacity: 0, fill: 'rgb(255, 255, 255)'}} d="M 104.539 4.769 L 3.433 48.993 L 105.201 104.16 C 74.502 67.268 73.668 34.506 105.202 4.327 L 104.539 4.769 Z" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -1.4210854715202004e-14, 0)"/>
                  </svg>
                }
              </div>
              <div style={{padding: '0 2rem'}}>{currentPage + 1} / {pages.length}</div>
              <div onClick={() => {setCurrentPage(currentPage + 1)}} style={{display: 'flex', width: '1rem', cursor: 'pointer'}}>
                { currentPage !== pages.length - 1 &&
                  <svg style={{ height: '1rem', rotate: '180deg'}} viewBox="3.433 4.327 101.769 99.833" width="101.769" height="99.833" xmlns="http://www.w3.org/2000/svg">
                    <path style={{stroke: 'rgb(0, 0, 0)', strokeWidth: '2px', paintOrder: 'stroke', strokeOpacity: 0, fill: 'rgb(255, 255, 255)'}} d="M 104.539 4.769 L 3.433 48.993 L 105.201 104.16 C 74.502 67.268 73.668 34.506 105.202 4.327 L 104.539 4.769 Z" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -1.4210854715202004e-14, 0)"/>
                  </svg>
                }
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default InspectModal