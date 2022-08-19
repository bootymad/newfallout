export class PlayerUI {
	constructor(playerObject) {
		this.playerObject = playerObject;
		this.playerButtonBox = document.createElement("div");
		this.playerButtonBox.className = "player-box_buttons";
		this.playerStatsBox = document.createElement("div");
		this.playerStatsBox.className = "player-box_stats";
		this.pageBox = document.querySelector(".player-box");
		this.pageBox.append(this.playerButtonBox);
		this.pageBox.append(this.playerStatsBox);

		// inventory
		this.inventoryBox = document.querySelector(".player-inventory");
		this.inventoryBoxContent = document.querySelector(
			".player-inventory_content"
		);
		this.inventoryBox.style.display = "none";
		this.inventoryButton = document.querySelector("#close-all-btn-inv");
		this.inventoryButton.addEventListener("click", () =>
			this.showInventory()
		);

		for (const category of Object.keys(this.playerObject.curInventory)) {
			const heading = document.createElement("h3");
			heading.append(category);
			this.inventoryBoxContent.append(heading);
			this.inventoryBoxContent.append(heading);
			for (const [name, quantity] of Object.entries(
				this.playerObject.curInventory[category]
			)) {
				const entry = document.createElement("p");
				entry.append(`${name}: x${quantity}`);
				this.inventoryBoxContent.append(entry);
			}
		}

		const buttonMappings = {
			Status: () => this.playerObject.status(),
			"Inv.": () => this.showInventory(),
			Attack: () =>
				this.playerObject.attack(
					this.playerObject.equipped.weapon.isGun
				),
			Reload: () => this.playerObject.reload(),
			Heal: () => this.playerObject.heal(),
			"End Turn": () => this.playerObject.endTurn(),
		};
		for (const [label, func] of Object.entries(buttonMappings)) {
			const btn = document.createElement("button");
			btn.append(label);
			btn.addEventListener("click", func);
			btn.addEventListener("click", () => this.update());
			this.playerButtonBox.append(btn);
		}

		// player stats box
		this.statMappings = {
			HP: `HP: ${this.playerObject.curHp} / ${this.playerObject.maxHp}`,
			AP: `AP: ${this.playerObject.curAp} / ${this.playerObject.maxAp}`,
		};
		// this.playerStatsBox.append(statMappings.HP);
	}

	showInventory() {
		if (this.inventoryBox.style.display === "none") {
			// update to latest values;
			for (const category of Object.keys(
				this.playerObject.curInventory
			)) {
				const heading = document.createElement("h3");
				heading.append(category);
				this.inventoryBoxContent.append(heading);
				this.inventoryBoxContent.append(heading);
				for (const [name, quantity] of Object.entries(
					this.playerObject.curInventory[category]
				)) {
					const entry = document.createElement("p");
					entry.append(`${name}: x${quantity}`);
					this.inventoryBoxContent.append(entry);
				}
			}
			this.inventoryBox.style.display = "flex";
		} else {
			this.inventoryBox.style.display = "none";
			// empty content
			this.inventoryBoxContent.textContent = "";
		}
	}

	update() {
		this.playerStatsBox.textContent = "";
		this.statMappings = {
			HP: `HP: ${this.playerObject.curHp} / ${this.playerObject.maxHp}`,
			AP: `AP: ${this.playerObject.curAp} / ${this.playerObject.maxAp}`,
		};
		const hp = document.createElement("p");
		hp.append(this.statMappings.HP);
		const ap = document.createElement("p");
		ap.append(this.statMappings.AP);
		this.playerStatsBox.append(hp, ap);
	}
}
