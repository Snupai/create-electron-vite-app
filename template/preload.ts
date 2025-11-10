import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  getVersion: async (): Promise<string> => {
    return await ipcRenderer.invoke("app:get-version");
  },
  getPlatform: async (): Promise<string> => {
    return await ipcRenderer.invoke("app:get-platform");
  },
});


