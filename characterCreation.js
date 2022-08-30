import { Player } from "./character.js";
import { PlayerUI } from "./UI/playerUI.js";
import { EnemyUI } from "./UI/enemyUI.js";
import { LABELS, AP_COSTS } from "./constants.js";
import { WEAPONS } from "./weapons/weaponObjects.js";

const defInventory = {
	weapons: { [LABELS.GUN10MM]: 1 },
	ammo: { [LABELS.AMMO10MM]: 24, [LABELS.AMMO223]: 6 },
	armor: {},
	chems: { [LABELS.STIMPAK]: 3 },
};

export class CharacterCreation {
	constructor(logger, uiSounds) {
		// hide the fallout js logo
		document.querySelector("#logo").style.display = "none";
		this.logger = logger;
		this.uiSounds = uiSounds;

		// terminal sound
		this.backgroundNoise = new Audio("./sounds/env/terminal.wav");
		this.backgroundNoise.loop = true;
		this.backgroundNoise.volume = 0.2;
		this.backgroundNoise.play();

		this.terminalClose = new Audio("./sounds/env/terminalclose.wav");

		// hover sounds
		this.hoverSound = new Audio("./sounds/env/terminalhover.wav");
		this.hoverSound.volume = 0.6;

		// load clicking sounds
		this.clickSoundsCount = 6;
		this.clickSounds = [];
		for (let i = 1; i <= this.clickSoundsCount; i++) {
			let click = new Audio(
				`./sounds/env/clicks/ui_hacking_charsingle_0${i}.wav`
			);
			click.volume = 0.6;
			this.clickSounds.push(click);
		}
		console.log(this.clickSounds.length);

		// change background of wrapper
		this.toggleBackground(true);
		this.defSpecial = {
			strength: 5,
			perception: 5,
			endurance: 5,
			charisma: 5,
			intelligence: 5,
			agility: 5,
			luck: 5,
		};
		this.curSpecial = {
			strength: 5,
			perception: 5,
			endurance: 5,
			charisma: 5,
			intelligence: 5,
			agility: 5,
			luck: 5,
		};
		this.startingPoints = 5;
		this.pointsLeft = 5;

		this.pageElement = document.querySelector(".character-creation");
		// create ui
		this.specialElement = document.createElement("div");
		this.specialElement.className = "character-creation__special";
		this.pageElement.append(this.specialElement);

		this.statsUi = document.createElement("div");
		this.statsUi.className = "character-creation__stats";
		const statList = document.createElement("ul");
		const pointsLeft = document.createElement("p");
		pointsLeft.append(`Points Left: ${this.pointsLeft}`);
		this.statsUi.append(statList, pointsLeft);

		Object.keys(this.defSpecial).forEach((key) => {
			const display = document.createElement("li");
			display.append(`${key}: ${this.curSpecial[key]}`);
			statList.append(display);

			const item = document.createElement("div");
			item.className = "character-creation__item";
			const subtract = document.createElement("button");
			subtract.append("<<");
			// hover sound
			subtract.addEventListener("mouseover", () => {
				this.hoverSound.play();
			});
			subtract.addEventListener("click", () => {
				if (this.curSpecial[key] > 1) {
					// play random click
					this.playRandomClick();
					this.curSpecial[key]--;
					this.pointsLeft++;
					this.update();
				} else {
					this.uiSounds.negative.play();
				}
			});

			const add = document.createElement("button");
			add.append(">>");
			// hover sound
			add.addEventListener("mouseover", () => {
				this.hoverSound.play();
			});
			add.addEventListener("click", () => {
				if (this.curSpecial[key] === 10 || this.pointsLeft === 0) {
					this.uiSounds.negative.play();
				} else {
					// play random click
					this.playRandomClick();
					this.curSpecial[key]++;
					this.pointsLeft--;
					this.update();
				}
			});
			item.append(subtract, key, add);
			this.specialElement.append(item);
		});
		this.pageElement.append(this.statsUi);

		// CONFIRM - START GAME LOGIC
		this.confirmButton = document.createElement("button");
		this.confirmButton.append("Create Character");
		this.confirmButton.addEventListener("click", () => {
			this.terminalClose.play();
			this.backgroundNoise.pause();
			this.pageElement.style.display = "none";
			this.toggleBackground(false);

			document.querySelector("#logo").style.display = "initial";
			const mainScreen = document.querySelector(".main");
			mainScreen.style.display = "initial";
			const player = new Player(
				"Test",
				this.curSpecial,
				defInventory,
				this.logger
			);
			player.equipped.weapon = WEAPONS.pistols[LABELS.GUN10MM];
			const playerUI = new PlayerUI(player);
			const enemyUI = new EnemyUI(this.logger);
			playerUI.update();
			// remove character creation
			this.pageElement.remove();
		});
		this.confirmButton.disabled = true;
		this.statsUi.append(this.confirmButton);
		// ============================================= //
	}

	update() {
		this.statsUi.textContent = "";
		const statList = document.createElement("ul");
		const pointsLeft = document.createElement("p");
		pointsLeft.append(`Points Left: ${this.pointsLeft}`);
		this.statsUi.append(statList, pointsLeft, this.confirmButton);
		Object.keys(this.defSpecial).forEach((key) => {
			const display = document.createElement("li");
			display.append(`${key}: ${this.curSpecial[key]}`);
			statList.append(display);
		});
		this.pointsLeft === 0
			? (this.confirmButton.disabled = false)
			: (this.confirmButton.disabled = true);
	}

	toggleBackground(status) {
		this.pageWrapper = document.querySelector(".wrapper");
		if (status) {
			this.pageWrapper.style.backgroundImage =
				"url(./images/terminalscreen.jpg)";
			this.pageWrapper.style.backgroundSize = "cover";
			this.pageWrapper.style.backgroundPosition = "center";
		} else {
			this.pageWrapper.style.backgroundImage = "none";
		}
	}

	playRandomClick() {
		let num = Math.floor(Math.random() * this.clickSoundsCount);
		this.clickSounds[num].play();
	}
}
