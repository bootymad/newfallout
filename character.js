import { LABELS, AP_COSTS } from "./constants.js";

export class Character {
	// def = default or starting values, cur = current values (power ups, bonuses, etc.)
	constructor(name, defSpecial, logger) {
		this.messager = logger;
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
		// returns the amount that was healed
		this.curHp += amount;
		// went over max
		if (this.curHp > this.maxHp) {
			let overage = this.curHp - this.maxHp;
			this.curHp = this.maxHp;
			return amount - overage; // amount that was healed
		}
		return amount;
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
		this.messager.log("HP", this.curHp, "/", this.maxHp);
		this.messager.log("AP", this.curAp, "/", this.maxAp);
	}

	startTurn() {
		this.isTurn = true;
		this.messager.log(this.name, "turn started.");
	}

	endTurn() {
		this.resetAp();
		this.isTurn = false;
		this.messager.log(this.name, "ended their turn.");
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
				this.messager.log(
					"Not enough AP! Need " + this.equipped.weapon.apCostBurst
				);
				return -1;
			}
		} else {
			if (this.equipped.weapon.apCost <= this.curAp) {
				this.curAp -= this.equipped.weapon.apCost;
			} else {
				this.messager.log(
					"Not enough AP! Need " + this.equipped.weapon.apCost
				);
				return -1;
			}
		}

		// melee weapon
		if (!isGun) {
			const dmg = this.dmgCalc();
			this.messager.log(
				this.name,
				"attacked with",
				this.equipped.weapon.name,
				"for",
				dmg,
				"damage!"
			);
			return dmg;
		}
		if (this.equipped.weapon.curClip > 0) {
			// burst firing
			if (isBurst) {
				let totalDamage = 0;
				for (let i = 0; i < this.equipped.weapon.fireBurst(); i++) {
					totalDamage += this.dmgCalc();
				}
				this.messager.log(
					this.name,
					"burst fired with",
					this.equipped.weapon.name,
					"for",
					totalDamage,
					"damage!"
				);
				return totalDamage;
			}
			// single firing
			const dmg = this.equipped.weapon.fireSingle() * this.dmgCalc();
			this.messager.log(
				this.name,
				"fired with",
				this.equipped.weapon.name,
				"for",
				dmg,
				"damage!"
			);
			return dmg;
		}
		// no bullets in clip
		this.equipped.weapon.fireNoAmmo();
		this.messager.log("Out of ammo! Did not fire.");
		return -1;
	}

	takeDmg(rawDmg) {
		const afterDt = rawDmg - this.equipped.armor.dt;
		const inflicted =
			afterDt - Math.floor((this.equipped.armor.dr / 100) * afterDt);
		return inflicted;
	}
}

// ==================PLAYER================== //

export class Player extends Character {
	constructor(name, defSpecial, defInventory, logger) {
		super(name, defSpecial, logger);
		this.defInventory = { ...defInventory };
		this.curInventory = { ...this.defInventory };
		this.healAmount = 12; // needs to be based on some skill

		// leveling
		this.lvl = 1;
		this.xp = 0;
		this.xpNeeded = ((this.lvl * (this.lvl - 1)) / 2) * 1000;

		//level up sound
		this.levelUpSound = new Audio("./sounds/env/ui_levelup.wav");
		this.levelUpSound.volume = 0.5;
	}

	reload() {
		// deduct ap
		if (this.equipped.weapon.isGun) {
			if (this.editAp(AP_COSTS.reload) < 0) {
				// not enough ap
				this.messager.log(
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
				this.messager.log(
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
			this.messager.log(
				`Not enough ${ammoType} in inventory! You wasted your AP...`
			);
			return -1;
		}
		// no ammo of that type
		this.messager.log(`No ${ammoType} in inventory! You wasted your AP...`);
		return -1;
	}

	heal() {
		// inventory check
		if (!this.curInventory.chems[LABELS.STIMPAK]) {
			this.messager.log("No stimpaks in inventory!");
			return -1;
		}
		// ap check
		if (this.editAp(AP_COSTS.heal) < 0) {
			this.messager.log(
				"Not enough AP to use stimpak! Need " + AP_COSTS.heal * -1
			);
			return -1;
		}
		this.curInventory.chems[LABELS.STIMPAK] -= 1;
		const healed = this.editHp(this.healAmount);
		this.messager.log("Used a stimpak...");
		this.messager.log("Healed", healed, "HP");
		return 1;
	}

	inventory() {
		// costs 2 ap in og fallout, free in this game
	}

	levelUp() {
		this.levelUpSound.play();
		this.lvl++;
		this.xpNeeded = ((this.lvl * (this.lvl - 1)) / 2) * 1000;
		// max hp increase
		this.maxHp += Math.floor(this.curSpecial.endurance / 2 + 2);
		// fully heal
		this.curHp = this.maxHp;
		this.messager.log("Level Up! You are now level", this.lvl);
	}
}
