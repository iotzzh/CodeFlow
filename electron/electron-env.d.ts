/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    /** /dist/ or /public/ */
    PUBLIC: string
  }
}

import { BrowserWindow } from 'electron'
import 'vite/client'

declare interface globalThis {
  mainWindow: BrowserWindow
  childWindow: BrowserWindow
}