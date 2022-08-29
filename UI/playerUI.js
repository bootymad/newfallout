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

		const testLvlButton = document.createElement("button");
		testLvlButton.append("Level Up");
		testLvlButton.addEventListener("click", () =>
			this.playerObject.levelUp()
		);
		document.body.append(testLvlButton);

		// inventory
		this.inventoryBox = document.querySelector(".player-inventory");
		this.inventoryBoxContent = document.querySelector(
			".player-inventory_content"
		);
		this.inventoryBox.style.display = "none";
		this.inventoryButtonClose =
			document.querySelector("#close-all-btn-inv");
		this.inventoryButtonClose.addEventListener("click", () =>
			this.showInventory()
		);

		// player status
		this.statusBoxClicked = false;
		this.statusBox = document.querySelector(".player-status");
		this.statusBox.style.display = "none";
		this.statusBoxContent = document.querySelector(
			".player-status_content"
		);
		this.statusBoxButton = document.querySelector("#close-all-btn-status");
		this.statusBoxButton.addEventListener("click", () => this.showStatus());

		// draw buttons
		const buttonMappings = {
			Status: () => this.showStatus(),
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
			label !== "Inv." &&
				btn.addEventListener("click", () => this.update());
			this.playerButtonBox.append(btn);
		}

		// player stats box
		this.statMappings = {
			HP: `HP: ${this.playerObject.curHp} / ${this.playerObject.maxHp}`,
			AP: `AP: ${this.playerObject.curAp} / ${this.playerObject.maxAp}`,
		};
		// this.playerStatsBox.append(statMappings.HP);

		// current weapon
		this.currentWeaponBox = document.createElement("div");
		this.weaponImageBox = document.createElement("img");
		this.weaponStatusBox = document.createElement("div");
		this.weaponImageBox.src = this.playerObject.equipped.weapon.image;
		this.currentWeaponBox.append(this.weaponImageBox);
		this.currentWeaponBox.append(this.weaponStatusBox);
		this.pageBox.append(this.currentWeaponBox);
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

	showStatus() {
		if (this.statusBoxClicked) {
			this.statusBox.style.display = "none";
			this.statusBoxContent.textContent = "";
			this.statusBoxClicked = false;
		} else {
			this.statusBoxClicked = true;
			// draw all latest values
			// name, lvl, xp
			const { name, lvl, xp, xpNeeded } = this.playerObject;
			this.statusBoxContent.innerHTML = `<p>${name.toUpperCase()}</p><p>LVL: ${lvl}</p><p>XP: ${xp}/${xpNeeded}</p>`;
			this.statusBox.style.display = "flex";
		}
	}

	update() {
		console.log("update called");
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
		// weapon
		this.weaponImageBox.src = this.playerObject.equipped.weapon.image;
		this.weaponStatusBox.textContent = "";
		const { name, isGun, curClip, magSize, ammoType } =
			this.playerObject.equipped.weapon;
		const wepName = document.createElement("p");
		wepName.append(name);
		if (isGun) {
			const wepAmmo = document.createElement("p");
			wepAmmo.append(`${curClip} / ${magSize} ${ammoType}`);
			this.weaponStatusBox.append(wepName, wepAmmo);
		} else {
			this.weaponStatusBox.append(wepName);
		}
	}
}
