import { Player } from "./character.js";
import { PlayerUI } from "./UI/playerUI.js";
import { LABELS, AP_COSTS } from "./constants.js";
import { WEAPONS } from "./weapons/weaponObjects.js";

const defInventory = {
	weapons: { [LABELS.GUN10MM]: 1 },
	ammo: { [LABELS.AMMO10MM]: 24, [LABELS.AMMO223]: 6 },
	armor: {},
	chems: { [LABELS.STIMPAK]: 3 },
};

export class CharacterCreation {
	constructor(logger) {
		this.logger = logger;

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
		this.pageElement.style.display = "initial";
		// create ui
		const heading = document.createElement("h2");
		heading.append("Character Creator");
		this.pageElement.append(heading);

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
			subtract.addEventListener("click", () => {
				if (this.curSpecial[key] > 1) {
					this.curSpecial[key]--;
					this.pointsLeft++;
					this.update();
				}
				return;
			});

			const add = document.createElement("button");
			add.append(">>");
			add.addEventListener("click", () => {
				if (this.curSpecial[key] === 10 || this.pointsLeft === 0) {
					return;
				}
				this.curSpecial[key]++;
				this.pointsLeft--;
				this.update();
			});
			item.append(subtract, key, add);
			this.pageElement.append(item);
		});
		this.pageElement.append(this.statsUi);

		this.confirmButton = document.createElement("button");
		this.confirmButton.append("Create Character");
		this.confirmButton.addEventListener("click", () => {
			this.pageElement.style.display = "none";
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
			playerUI.update();
			// remove character creation
			this.pageElement.remove();
		});
		this.confirmButton.disabled = true;
		this.pageElement.append(this.confirmButton);
	}

	update() {
		this.statsUi.textContent = "";
		const statList = document.createElement("ul");
		const pointsLeft = document.createElement("p");
		pointsLeft.append(`Points Left: ${this.pointsLeft}`);
		this.statsUi.append(statList, pointsLeft);
		Object.keys(this.defSpecial).forEach((key) => {
			const display = document.createElement("li");
			display.append(`${key}: ${this.curSpecial[key]}`);
			statList.append(display);
		});
		this.pointsLeft === 0
			? (this.confirmButton.disabled = false)
			: (this.confirmButton.disabled = true);
	}
}
