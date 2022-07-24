import React, { useState, useEffect } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import './windowMenu.scss'

/*document
  .getElementById('titlebar-close')
  .addEventListener('click', () => appWindow.close())

document
  .getElementById("titlebar-minimize")
  .addEventListener('click', () => appWindow.minimize())*/


function WindowMenu(){
    const close = () => {
      appWindow.close();
    }

    const minimize = () => {
      appWindow.minimize();
    }

    return(
      <div data-tauri-drag-region class="titlebar">
      <div class="titlebar-button" id="titlebar-minimize">
        <object data="/images/minus-solid.svg" type="image/png" class="minimize-app-svg" onClick={() => close()}></object>
      </div>
      <div class="titlebar-button" id="titlebar-close">
        <object data="/images/xmark-solid.svg" type="image/png" class="close-app-svg" onClick={() => minimize()}></object>
      </div>
    </div>
    )
  }

export default WindowMenu;

  