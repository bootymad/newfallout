export class Game {
	constructor() {
		this.mainScreen = document.querySelector(".main");
		this.mainScreen.style.display = "none";

		this.menuScreen = document.querySelector(".menu-screen");

		this.characterCreationScreen = document.querySelector(
			".character-creation"
		);
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
		this.characterCreationScreen.style.display === "none"
			? (this.characterCreationScreen.style.display = "initial")
			: (this.characterCreationScreen.style.display = "none");
	}
}
