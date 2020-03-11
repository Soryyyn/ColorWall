// npm modules
const { ipcRenderer, remote } = require("electron");

// classes / self made modules
const { IpcChannelLibrary } = remote.require("../common/IpcChannels");
const { Settings } = remote.require("../common/models/Settings");

let remoteWindow = remote.getCurrentWindow();
const elementLib = new ElementLibrary();


/**
 * defaults that are being set on app start
 */
function defaultsIfShown() {
	elementLib.aboutContentDiv.setAttribute("style", "display: block")
	elementLib.lastcolorsContentDiv.setAttribute("style", "display: none")
	elementLib.favoritesContentDiv.setAttribute("style", "display: none")
	elementLib.settingsContentDiv.setAttribute("style", "display: none")

	elementLib.aboutNavigationLink.setAttribute("style", "color: white")
}

/**
 * getting used when pressing close button
 */
function closeWindow() {
	remoteWindow.hide();
}

/**
 * shows the differnt content & styles nav text
 * @param {String} element
 */
function showElement(element: String) {
	if (element === "about") {
		elementLib.aboutContentDiv.setAttribute("style", "display: block");
		elementLib.aboutNavigationLink.setAttribute("style", "color: white");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: none");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.favoritesContentDiv.setAttribute("style", "display: none");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.settingsContentDiv.setAttribute("style", "display: none");
		elementLib.settingsNavigationLink.setAttribute("style", "color: #9e9e9e");

	} else if (element === "lastcolors") {
		elementLib.aboutContentDiv.setAttribute("style", "display: none");
		elementLib.aboutNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: block");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: white");

		elementLib.favoritesContentDiv.setAttribute("style", "display: none");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.settingsContentDiv.setAttribute("style", "display: none");
		elementLib.settingsNavigationLink.setAttribute("style", "color: #9e9e9e");

	} else if (element === "favorites") {
		elementLib.aboutContentDiv.setAttribute("style", "display: none");
		elementLib.aboutNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: none");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.favoritesContentDiv.setAttribute("style", "display: block");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: white");

		elementLib.settingsContentDiv.setAttribute("style", "display: none");
		elementLib.settingsNavigationLink.setAttribute("style", "color: #9e9e9e");
	} else if (element === "settings") {
		elementLib.aboutContentDiv.setAttribute("style", "display: none");
		elementLib.aboutNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: none");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: #9e9e9e");

		elementLib.favoritesContentDiv.setAttribute("style", "display: none");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: 9e9e9e");

		elementLib.settingsContentDiv.setAttribute("style", "display: block");
		elementLib.settingsNavigationLink.setAttribute("style", "color: white");
	}
}

/**
 * clears the specified grid
 * @param {string} grid
 */
function clearGrid(grid: string): void {
	while (document.getElementById(grid).firstChild) {
		document
			.getElementById(grid)
			.removeChild(document.getElementById(grid).firstChild);
	}
}

/**
 * styles the specified color field
 * @param {*} color
 * @param {number} index
 * @param {string} type
 */
function styleColorField(color: any, index: number, type: string) {
	let colorField = document.getElementById(`${type}_${index}`);
	colorField.style.backgroundColor = color.mainColor;
	colorField.style.borderRadius = "5px";
}

/**
 * handle the click of the last colors field
 * @param {Number} button
 * @param {*} color
 */
function handleColorClickOfLastColors(button: Number, color: any): void {
	switch (button) {
		case 0: {
			ipcRenderer.sendSync(IpcChannelLibrary.setToSelectedColor, color); // left
			break;
		}
		case 2: {
			ipcRenderer.sendSync(IpcChannelLibrary.addToFavorites, color); // right
			break;
		}
	}
}

/**
 * handle the click of the favorite colors field
 * @param {Number} button
 * @param {*} color
 */
function handleColorClickOfFavoriteColors(button: Number, color: any): void {
	switch (button) {
		case 0: {
			ipcRenderer.sendSync(IpcChannelLibrary.setToSelectedColor, color); // left
			break;
		}
		case 2: {
			ipcRenderer.sendSync(IpcChannelLibrary.removeFromFavorites, color); // right
			requestFavoriteColors();
			break;
		}
	}
}

/**
 * add a color to the specified grid
 * @param {string} grid
 * @param {*} color
 * @param {number} index
 * @param {string} type
 * @param {string} page
 */
function addColorToGrid(grid: string, color: any, index: number, type: string, page: string): void {
	let colorField = document.createElement("div");
	colorField.setAttribute("class", "field");
	colorField.setAttribute("id", `${type}_${index}`);

	let hash = document.createElement("span");
	hash.appendChild(document.createTextNode("#"));
	hash.setAttribute("style", "color: " + color.fontColor);
	hash.setAttribute("id", "hash");
	colorField.appendChild(hash);

	document.getElementById(grid).appendChild(colorField);

	styleColorField(color, index, type);

	if (page == "last") {
		colorField.addEventListener("mousedown", (event: any) => {
			handleColorClickOfLastColors(event.button, color);
		});
	} else {
		colorField.addEventListener("mousedown", (event: any) => {
			handleColorClickOfFavoriteColors(event.button, color);
		});
	}
}

/**
 * request the last colors from the main process
 */
function requestLastColors() {
	ipcRenderer
		.invoke(IpcChannelLibrary.requestLastColors, "requesting all last colors")
		.then((colors: any) => {
			clearGrid("grid_last");
			for (let i = 0; i < colors.length; i++) {
				addColorToGrid("grid_last", colors[i], i, "fieldLast", "last");
			}
		});
}

/**
 * request favorite colors from main process
 */
function requestFavoriteColors(): void {
	ipcRenderer
		.invoke(IpcChannelLibrary.requestFavoriteColors, "requesting all favorite colors")
		.then((colors: any) => {
			clearGrid("grid_fav");
			for (let i = 0; i < colors.length; i++) {
				addColorToGrid("grid_fav", colors[i], i, "fieldFav", "fav");
			}
		});
}

/**
 * open the link which is pressed by the user
 * @param {String} link
 */
function openLink(link: String): void {
	ipcRenderer.sendSync(IpcChannelLibrary.linkPressed, link);
}

/**
 * request the config from the main process
 */
function requestConfig() {
	let options = document.getElementsByTagName("input");
	let autoLaunch = options[0];
	let dithering = options[1];
	let fontEnabled = options[2];
	let fontSize = options[3];
	let chooseFromFavorites = options[4];

	ipcRenderer
		.invoke(IpcChannelLibrary.requestConfig, "requesting settings from config")
		.then((config: any) => {
			autoLaunch.checked = config.autoLaunch;
			dithering.checked = config.dithering;
			fontEnabled.checked = config.fontEnabled;
			fontSize.value = config.wallpaperFontSize;
			chooseFromFavorites.checked = config.chooseFromFavorites;
		});
}


defaultsIfShown();


// settings form
function validateSettings(): any {
	let options = document.getElementsByTagName("input");

	const newOptions = {
		autoLaunch: options[0].checked,
		dithering: options[1].checked,
		fontEnabled: options[2].checked,
		wallpaperFontSize: parseInt(options[3].value.toString().trim()),
		chooseFromFavorites: options[4].checked,
	};

	return newOptions;
}

(<HTMLFormElement>document.getElementById("settingsForm")).addEventListener("submit", (event: Event) => {
	event.preventDefault();
	const newOptions = validateSettings();

	ipcRenderer.sendSync(
		IpcChannelLibrary.refreshedConfig,
		JSON.stringify(newOptions)
	);
});



// events
elementLib.lastColorsNavigationLink.addEventListener("click", requestLastColors);
elementLib.favoritesNavigationLink.addEventListener("click", requestFavoriteColors);
elementLib.settingsNavigationLink.addEventListener("click", requestConfig);

ipcRenderer.on(IpcChannelLibrary.refreshedLastColors, (event: Event, arg: any) => {
	clearGrid("grid_last");
	for (let i = 0; i < arg.length; i++) {
		addColorToGrid("grid_last", arg[i], i, "fieldLast", "last");
	}

	event.returnValue = true;
});
