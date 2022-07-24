import React from 'react'
import { appWindow } from '@tauri-apps/api/window'
import './windowMenu.scss'

function WindowMenu(){
    const close = () => {
      appWindow.close();
    }

    const minimize = () => {
      appWindow.minimize();
    }

    return(
    <div data-tauri-drag-region className="titlebar">
      <div className="titlebar-button" id="titlebar-minimize">
        <object data="/images/minus-solid.svg" type="image/png" className="minimize-app-svg" onClick={() => minimize()} alt="minimize"></object>
      </div>
      <div className="titlebar-button" id="titlebar-close">
        <object data="/images/xmark-solid.svg" type="image/png" className="close-app-svg" onClick={() => close()} alt="close"></object>
      </div>
    </div>
    )
  }

export default WindowMenu;

  