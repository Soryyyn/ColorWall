declare const ipcRenderer: any, remote: any;
declare let win: any;
declare const pin: Element;
declare let pinSet: Boolean;
/**
 * disable window from closing on focus lost
 */
declare function pinWindow(): void;
/**
 *  get current loaded file for main html
 */
declare function getLoadedFile(): any;
