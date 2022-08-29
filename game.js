import { CharacterCreation } from "./characterCreation.js";
export class Game {
	constructor(logger) {
		this.logger = logger;
		this.mainScreen = document.querySelector(".main");
		this.mainScreen.style.display = "none";

		this.menuScreen = document.querySelector(".menu-screen");

		// game wide sounds
		this.uiSounds = {
			negative: new Audio("./sounds/env/negative.wav"),
		};
		// main menu buttons
		document.querySelector("#new-game").addEventListener("click", () => {
			this.toggleMenuScreen();
			this.toggleCharacterCreationScreen();
		});
		document
			.querySelector("#continue-game")
			.addEventListener("click", () => {
				this.toggleMenuScreen();
				this.toggleMainScreen();
			});

		// this.characterCreationScreen = document.querySelector(
		// 	".character-creation"
		// );
	}

	toggleMainScreen() {
		this.mainScreen.style.display === "none"
			? (this.mainScreen.style.display = "initial")
			: (this.mainScreen.style.display = "none");
	}

	toggleMenuScreen() {
		this.menuScreen.style.display === "none"
			? (this.menuScreen.style.display = "initial")
			: (this.menuScreen.style.display = "none");
	}

	toggleCharacterCreationScreen() {
		// if (this.characterCreationScreen.style.display === "none") {
		// 	this.characterCreationScreen.style.display = "initial";
		// 	const cc = new CharacterCreation();
		// } else {
		// 	this.characterCreationScreen.style.display = "none";
		// }
		const cc = new CharacterCreation(this.logger, this.uiSounds);
	}
}
