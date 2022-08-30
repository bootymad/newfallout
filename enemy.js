import { AP_COSTS } from "./constants.js";

export class Enemy {
	constructor(name, hp, ap, weapon, xpDrop, itemDrops) {
		this.name = name;
		this.hp = hp;
		this.startHp = hp;
		this.ap = ap;
		this.startAp = ap;
		this.weapon = weapon;
		this.xpDrop = xpDrop;
		this.itemDrops = itemDrops;
	}

	addLogger(logger) {
		this.logger = logger;
	}

	endTurn() {
		this.ap = this.startAp;
		this.logger.log(this.name, "ends their turn.");
	}

	dmgCalc() {
		// return raw dmg
		const { dmgLow, dmgHigh } = this.weapon;
		return Math.floor(Math.random() * (dmgHigh - dmgLow + 1) + dmgLow);
	}

	attack() {
		// decide to burst or not
		const willBurst = Math.random() > 0.5 ? true : false;
		// fire
		if (willBurst && this.ap >= this.weapon.apCostBurst) {
			for (let i = 0; i < this.weapon.fireBurst(); i++) {
				let totalDamage = 0;
				totalDamage += this.dmgCalc();
			}
			this.ap -= this.weapon.apCostBurst;
			this.logger.log(
				this.name,
				"burst fired their",
				this.weapon.name,
				"for",
				totalDamage,
				"damage!"
			);
			this.ap -= this.weapon.apCostBurst;
			return totalDamage;
		}
		let totalDamage = this.weapon.fireSingle() * this.dmgCalc();
		this.logger.log(
			this.name,
			"single fired their",
			this.weapon.name,
			"for",
			totalDamage,
			"damage!"
		);
		this.ap -= this.weapon.apCost;
		return totalDamage;
	}

	reload() {
		this.weapon.reload(this.weapon.magSize);
		this.logger.log(this.name, "reloads...");
		this.ap += AP_COSTS.reload;
	}
}
