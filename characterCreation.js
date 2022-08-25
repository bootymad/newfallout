import { Player } from "./character.js";

export class CharacterCreation {
	constructor() {
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

		Object.keys(this.defSpecial).forEach((key) => {
			const item = document.createElement("div");
			item.className = "character-creation__item";
			const subtract = document.createElement("button");
			subtract.append("<<");
			subtract.addEventListener("click", () => {
				if (this.curSpecial[key] > 1) {
					this.curSpecial[key]--;
					this.pointsLeft++;
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
			});
			item.append(subtract, key, add);
			this.pageElement.append(item);
		});
	}

	update() {}
}
