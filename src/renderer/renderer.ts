const { ipcRenderer, remote } = require("electron");
const { ipcChannel } = remote.require("../common/ipcChannels");

const elementLib = new ElementLibrary();
let remoteWindow = remote.getCurrentWindow();

function defaultsIfShown() {
	elementLib.aboutContentDiv.setAttribute("style", "display: block")
	elementLib.lastcolorsContentDiv.setAttribute("style", "display: none")
	elementLib.favoritesContentDiv.setAttribute("style", "display: none")
	elementLib.settingsContentDiv.setAttribute("style", "display: none")

	elementLib.aboutNavigationLink.setAttribute("style", "color: white")
}

function closeWindow() {
	remoteWindow.hide();
}

function showElement(element: String) {
	if (element === "about") {
		elementLib.aboutContentDiv.setAttribute("style", "display: block");
		elementLib.aboutNavigationLink.setAttribute("style", "color: white");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: none");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: white");

		elementLib.favoritesContentDiv.setAttribute("style", "display: none");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: white");

		elementLib.settingsContentDiv.setAttribute("style", "display: none");
		elementLib.settingsNavigationLink.setAttribute("style", "color: white");

	} else if (element === "lastcolors") {
		elementLib.aboutContentDiv.setAttribute("style", "display: none");
		elementLib.aboutNavigationLink.setAttribute("style", "color: white");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: block");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: white");

		elementLib.favoritesContentDiv.setAttribute("style", "display: none");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: white");

		elementLib.settingsContentDiv.setAttribute("style", "display: none");
		elementLib.settingsNavigationLink.setAttribute("style", "color: white");

	} else if (element === "favorites") {
		elementLib.aboutContentDiv.setAttribute("style", "display: none");
		elementLib.aboutNavigationLink.setAttribute("style", "color: white");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: none");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: white");

		elementLib.favoritesContentDiv.setAttribute("style", "display: block");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: white");

		elementLib.settingsContentDiv.setAttribute("style", "display: none");
		elementLib.settingsNavigationLink.setAttribute("style", "color: white");
	} else if (element === "settings") {
		elementLib.aboutContentDiv.setAttribute("style", "display: none");
		elementLib.aboutNavigationLink.setAttribute("style", "color: white");

		elementLib.lastcolorsContentDiv.setAttribute("style", "display: none");
		elementLib.lastColorsNavigationLink.setAttribute("style", "color: white");

		elementLib.favoritesContentDiv.setAttribute("style", "display: none");
		elementLib.favoritesNavigationLink.setAttribute("style", "color: white");

		elementLib.settingsContentDiv.setAttribute("style", "display: block");
		elementLib.settingsNavigationLink.setAttribute("style", "color: white");
	}
}

function clearGrid(grid: string): void {
	while (document.getElementById(grid).firstChild) {
		document
			.getElementById(grid)
			.removeChild(document.getElementById(grid).firstChild);
	}
}

function styleColorField(color: any, index: number, type: string) {
	let colorField = document.getElementById(`${type}_${index}`);
	colorField.style.backgroundColor = color.mainColor;
	colorField.style.borderRadius = "5px";
}

function handleColorClickOfLastColors(button: Number, color: any): void {
	switch (button) {
		// left click / set color
		case 0: {
			ipcRenderer.sendSync(ipcChannel.setToSelectedColor, color);
			break;
		}
		// right click / add to favorite
		case 2: {
			ipcRenderer.sendSync(ipcChannel.addToFavorites, color);
			break;
		}
	}
}

function handleColorClickOfFavoriteColors(button: Number, color: any): void {
	switch (button) {
		// left click / set color
		case 0: {
			ipcRenderer.sendSync(ipcChannel.setToSelectedColor, color);
			break;
		}
		// right click / remove from favorite
		case 2: {
			ipcRenderer.sendSync(ipcChannel.removeFromFavorites, color);
			requestFavoriteColors();
			break;
		}
	}
}

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

function requestLastColors() {
	ipcRenderer
		.invoke(ipcChannel.requestLastColors, "requesting all last colors")
		.then((colors: any) => {
			clearGrid("grid_last");
			for (let i = 0; i < colors.length; i++) {
				addColorToGrid("grid_last", colors[i], i, "fieldLast", "last");
			}
		});
}

function requestFavoriteColors(): void {
	ipcRenderer
		.invoke(ipcChannel.requestFavoriteColors, "requesting all favorite colors")
		.then((colors: any) => {
			clearGrid("grid_fav");
			for (let i = 0; i < colors.length; i++) {
				addColorToGrid("grid_fav", colors[i], i, "fieldFav", "fav");
			}
		});
}

function openLink(link: String): void {
	ipcRenderer.sendSync(ipcChannel.linkPressed, link);
}

function requestConfig() {
	let options = document.getElementsByTagName("input");
	let autoLaunch = options[0];
	let dithering = options[1];
	let fontEnabled = options[2];
	let fontSize = options[3];
	ipcRenderer
		.invoke(ipcChannel.requestConfig, "requesting settings from config")
		.then((config: any) => {
			autoLaunch.checked = config.autoLaunch;
			dithering.checked = config.dithering;
			fontEnabled.checked = config.fontEnabled;
			fontSize.value = config.wallpaperFontSize;
		});
}

// events
ipcRenderer.on(ipcChannel.refreshedLastColors, (event: any, arg: any) => {
	clearGrid("grid_last");
	for (let i = 0; i < arg.length; i++) {
		addColorToGrid("grid_last", arg[i], i, "fieldLast", "last");
	}
});

// nav eventlisteners
elementLib.lastColorsNavigationLink.addEventListener("click", requestLastColors);
elementLib.favoritesNavigationLink.addEventListener("click", requestFavoriteColors);
elementLib.settingsNavigationLink.addEventListener("click", requestConfig);

// settings form
function validateSettings(): any {
	let options = document.getElementsByTagName("input");

	const newOptions = {
		autoLaunch: options[0].checked,
		dithering: options[1].checked,
		fontEnabled: options[2].checked,
		fontSize: options[3].value.toString().trim(),
		chooseFromFavorites: options[2].checked,
	};

	return newOptions;
}

(<HTMLFormElement>document.getElementById("settingsForm")).addEventListener("submit", (event: Event) => {
	event.preventDefault();
	const newOptions = validateSettings();

	ipcRenderer.sendSync(
		ipcChannel.refreshedConfig,
		JSON.stringify(newOptions)
	);
});
