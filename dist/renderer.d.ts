declare const ipcRenderer: Electron.IpcRenderer, remote: Electron.Remote;
declare let win: Electron.BrowserWindow;
declare const pin: Element;
declare let pinSet: Boolean;
/**
 *  set defaults (close window on focus lost, hide main divs)
 */
declare function setDefaults(): void;
/**
 * disable window from closing on focus lost
 */
declare function pinWindow(): void;
/**
 *  show / hide element on click
 * @param element
 */
declare function showElement(element: String): void;
/**
 * send link to main process to open in browser
 * @param link
 */
declare function openLink(link: String): void;
