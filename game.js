import { CharacterCreation } from "./characterCreation.js";
export class Game {
	constructor(logger) {
		this.logger = logger;
		this.mainScreen = document.querySelector(".main");
		this.mainScreen.style.display = "none";

		this.menuScreen = document.querySelector(".menu-screen");

		// game wide sounds
		this.uiSounds = {
			pipboy: {
				ambience: new Audio("./sounds/env/pipboy/ambience.wav"),
			},
			negative: new Audio("./sounds/env/negative.wav"),
		};

		// this.uiSounds.pipboy.ambience.volume = 0.2;
		// this.uiSounds.pipboy.ambience.loop = true;
		// this.uiSounds.pipboy.ambience.play();
		// main menu buttons
		document.querySelector("#new-game").addEventListener("click", () => {
			this.uiSounds.pipboy.ambience.loop = false;
			this.uiSounds.pipboy.ambience.pause();
			this.toggleMenuScreen();
			this.toggleCharacterCreationScreen();
		});
		document
			.querySelector("#continue-game")
			.addEventListener("click", () => {
				this.uiSounds.pipboy.ambience.loop = false;
				this.uiSounds.pipboy.ambience.pause();
				this.toggleMenuScreen();
				this.toggleMainScreen();
			});
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
		const cc = new CharacterCreation(this.logger, this.uiSounds);
	}
}
