/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  createWindow: (config: { [x:string]:any }) => void
  sendMessage: (message: string) => void
  minWindow: (id:string) => void
  maxWindow: (id:string) => void
  closeWindow: (id:string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
