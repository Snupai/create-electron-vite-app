import { app, BrowserWindow, Menu } from "electron";
import { ipcMain } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const resolveFromMain = (relativePath: string) => {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return join(currentDir, relativePath);
};

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      preload: resolveFromMain("preload.cjs"),
    },
  });

  // Hide the default application menu
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  mainWindow.loadFile(resolveFromMain("index.html"));
};

app.whenReady().then(() => {
  setupIPC();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Simple IPC handlers for demonstration
const setupIPC = () => {
  ipcMain.handle("app:get-version", async () => {
    return app.getVersion();
  });

  ipcMain.handle("app:get-platform", async () => {
    return process.platform;
  });
};



