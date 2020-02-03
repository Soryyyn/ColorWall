declare const ipcRenderer: any, remote: any;
declare let win: any;
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
