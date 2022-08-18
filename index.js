const AP_COSTS = {
	reload: -2,
	inventory: -2,
	heal: -2,
};

class Character {
	// def = default or starting values, cur = current values (power ups, bonuses, etc.)
	constructor(name, defSpecial) {
		this.name = name;

		this.defSpecial = { ...defSpecial };
		this.curSpecial = { ...this.defSpecial };

		this.defHp =
			15 + this.defSpecial.strength + 2 * this.defSpecial.endurance;
		this.maxHp = this.defHp;
		this.curHp = this.defHp;

		this.defAp = 5 + Math.floor(this.defSpecial.agility / 2);
		this.maxAp = this.defAp;
		this.curAp = this.defAp;

		this.equipped = { weapon: {}, armor: {} };

		this.isTurn = false;
	}

	// stat methods

	editHp(amount) {
		this.curHp += amount;
	}

	resetHp() {
		this.curHp = this.maxHp;
	}

	editAp(amount) {
		if (this.curAp + amount < 0) {
			return -1;
		}
		this.curAp += amount;
		return 1;
	}

	resetAp() {
		this.curAp = this.maxAp;
	}

	specialChange(keyValues) {
		this.curSpecial = { ...this.curSpecial, ...keyValues };
		// recalc max hp and ap values
		this.maxHp =
			15 + this.curSpecial.strength + 2 * this.curSpecial.endurance;
		this.maxAp = 5 + Math.floor(this.curSpecial.agility / 2);
	}

	resetSpecial() {
		this.specialChange({ ...this.defSpecial });
	}

	status() {
		messager.log("HP", this.curHp, "/", this.maxHp);
		messager.log("AP", this.curAp, "/", this.maxAp);
	}

	startTurn() {
		this.isTurn = true;
	}

	endTurn() {
		this.resetAp();
		this.isTurn = false;
	}

	// combat methods
	dmgCalc() {
		const { dmgLow, dmgHigh } = this.equipped.weapon;
		return Math.floor(Math.random() * (dmgHigh - dmgLow + 1) + dmgLow);
	}

	attack(isGun, isBurst = false) {
		// returns a positive int if an attack was made

		// deduct ap or cancel if not enough
		if (isBurst) {
			if (this.equipped.weapon.apCostBurst <= this.curAp) {
				this.curAp -= this.equipped.weapon.apCostBurst;
			} else {
				messager.log(
					"Not enough AP! Need " + this.equipped.weapon.apCostBurst
				);
				return -1;
			}
		} else {
			if (this.equipped.weapon.apCost <= this.curAp) {
				this.curAp -= this.equipped.weapon.apCost;
			} else {
				messager.log(
					"Not enough AP! Need " + this.equipped.weapon.apCost
				);
				return -1;
			}
		}

		// melee weapon
		if (!isGun) {
			return this.dmgCalc();
		}
		if (this.equipped.weapon.curClip > 0) {
			// burst firing
			if (isBurst) {
				let totalDamage = 0;
				for (let i = 0; i < this.equipped.weapon.fireBurst(); i++) {
					totalDamage += this.dmgCalc();
				}
				return totalDamage;
			}
			// single firing
			return this.equipped.weapon.fireSingle() * this.dmgCalc();
		}
		// no bullets in clip
		messager.log("Out of ammo! Did not fire.");
		return -1;
	}

	takeDmg(rawDmg) {
		const afterDt = rawDmg - this.equipped.armor.dt;
		const inflicted =
			afterDt - Math.floor((this.equipped.armor.dr / 100) * afterDt);
		return inflicted;
	}
}

const defSpecial = {
	strength: 5,
	perception: 5,
	endurance: 5,
	charisma: 5,
	intelligence: 5,
	agility: 5,
	luck: 5,
};

class Player extends Character {
	constructor(name, defSpecial, defInventory) {
		super(name, defSpecial);
		this.defInventory = { ...defInventory };
		this.curInventory = { ...this.defInventory };
	}

	reload() {
		// deduct ap
		if (this.equipped.weapon.isGun) {
			if (this.editAp(AP_COSTS.reload) < 0) {
				// not enough ap
				messager.log(
					"Not enough AP to reload! Need " + AP_COSTS.reload * -1
				);
				return -1;
			}
		} else {
			// melee weapon, no reload feature
			return -1;
		}
		const { ammoType, magSize } = this.equipped.weapon;
		const invAmmo = this.curInventory.ammo;
		if (invAmmo[ammoType]) {
			// enough ammo for a full clip
			if (invAmmo[ammoType] >= magSize) {
				invAmmo[ammoType] -= magSize;
				this.equipped.weapon.reload(magSize);
				messager.log(
					this.name,
					"reloads their",
					this.equipped.weapon.name,
					"..."
				);
				return 1;
			}
			// some ammo, not a full clip
			if (invAmmo[ammoType] < magSize && invAmmo[ammoType] !== 0) {
				this.equipped.weapon.reload(invAmmo[ammoType]);
				invAmmo[ammoType] = 0;
				return 1;
			}
			// not enough ammo
			messager.log(
				`Not enough ${ammoType} in inventory! You wasted your AP...`
			);
			return -1;
		}
		// no ammo of that type
		messager.log(`No ${ammoType} in inventory! You wasted your AP...`);
		return -1;
	}
}

class PlayerUI {
	constructor(playerObject) {
		this.playerObject = playerObject;
		this.pageBox = document.querySelector(".player-box");
		const mappings = {
			Status: () => this.playerObject.status(),
			Attack: () =>
				this.playerObject.attack(
					this.playerObject.equipped.weapon.isGun
				),
			Reload: () => this.playerObject.reload(),
			"End Turn": () => this.playerObject.endTurn(),
		};
		for (const [label, func] of Object.entries(mappings)) {
			const btn = document.createElement("button");
			btn.append(label);
			btn.addEventListener("click", func);
			this.pageBox.append(btn);
		}
	}
}

// ==================WEAPONS================== //
class Weapon {
	constructor(name, dmgLow, dmgHigh, strReq, apCost) {
		this.name = name;
		this.dmgLow = dmgLow;
		this.dmgHigh = dmgHigh;
		this.strReq = strReq;
		this.apCost = apCost;
		this.isGun = false;
	}
}

class Gun extends Weapon {
	constructor(
		name,
		dmgLow,
		dmgHigh,
		strReq,
		apCost,
		ammoType,
		magSize,
		canBurst,
		burstAmmoUse = 0
	) {
		super(name, dmgLow, dmgHigh, strReq, apCost);
		this.ammoType = ammoType;
		this.magSize = magSize;
		this.curClip = this.magSize;
		this.canBurst = canBurst;
		this.apCostBurst = this.apCost + 1;
		this.burstAmmoUse = burstAmmoUse;
		this.isGun = true;
	}

	// usage methods
	fireSingle() {
		// returns shots fired
		this.curClip -= 1;
		return 1;
	}

	fireBurst() {
		// returns shots fired
		this.curClip -= this.burstAmmoUse;
		if (this.curClip < 0) {
			const shotsFired = this.burstAmmoUse + this.curClip;
			this.curClip = 0;
			return shotsFired;
		}
		return this.burstAmmoUse;
	}

	reload(amount) {
		if (amount > this.magSize) {
			console.log("Amount larger than magazine capacity... Error");
			return -1;
		}
		this.curClip = amount;
	}
}

// instances
const WEAPONS = {
	pistols: {
		"10mm Pistol": new Gun("10mm Pistol", 5, 12, 3, 5, "10mm", 12, false),
		".223 Pistol": new Gun(
			".223 Pistol",
			20,
			30,
			5,
			5,
			".223 FMJ",
			5,
			false
		),
	},
};

const defInventory = {
	weapons: [WEAPONS.pistols["10mm Pistol"]],
	ammo: { "10mm": 24 },
	armor: [],
	chems: [],
};

const testChar = new Player("TestGuy", defSpecial, defInventory);
testChar.equipped.weapon = WEAPONS.pistols["10mm Pistol"];

// ==================MESSAGES================== //

class MessageLogger {
	constructor() {
		this.messages = [];
		this.pageElement = document.querySelector(".messages");

		this.showAllBtn = document.querySelector("#show-all-btn");
		this.closeAllBtn = document.querySelector("#close-all-btn");
		this.showAllBtn.addEventListener("click", () =>
			this.showAllMessages("show")
		);
		this.closeAllBtn.addEventListener("click", () =>
			this.showAllMessages("close")
		);

		this.allMessageBox = document.querySelector(".all-messages");
		this.allMessageBox.style.display = "none";

		this.allMessageBoxMessages = document.querySelector(
			".all-messages_messages"
		);
	}

	showAllMessages(event) {
		console.log("clicked " + event + " all messages button");
		this.allMessageBox.style.display === "none"
			? (this.allMessageBox.style.display = "flex")
			: (this.allMessageBox.style.display = "none");
	}

	log(...args) {
		let message = args.join(" ");
		message = message.trimEnd();
		this.messages.push(message);
		// add to the all message log
		const msg = document.createElement("p");
		msg.append(message);
		this.allMessageBoxMessages.append(msg);
		// never show more than 5 messages on main screen
		if (this.pageElement.childElementCount >= 5) {
			this.pageElement.removeChild(this.pageElement.firstChild);
		}
		this.pageElement.append(msg.cloneNode(true)); // can't append same element twice
	}

	render() {
		// clear exisiting messages from page
		this.pageElement.textContent = "";
		// render last 5 messages
		for (let i = this.messages.length - 5; i < this.messages.length; i++) {
			const msg = document.createElement("p");
			msg.append(this.messages[i] || "-");
			this.pageElement.append(msg);
		}
	}
}

const messager = new MessageLogger();
