declare const ipcRenderer: Electron.IpcRenderer, remote: Electron.Remote;
declare let win: Electron.BrowserWindow;
declare const pin: Element;
declare let pinSet: Boolean;
/**
 * disable window from closing on focus lost
 */
declare function pinWindow(): void;
/**
 * show / hide element on click
 * @param element
 */
declare function showElement(element: String): void;
/**
 * send link to main process to open in browser
 * @param link
 */
declare function openLink(link: String): void;
/**
 * clear frontend, get all colors from main process, and add to list
 */
declare function getLastColors(): void;
