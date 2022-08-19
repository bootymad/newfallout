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
		const buttonMappings = {
			Status: () => this.playerObject.status(),
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
