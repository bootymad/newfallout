export class Weapon {
	constructor(name, dmgLow, dmgHigh, strReq, apCost, image, sounds) {
		this.name = name;
		this.dmgLow = dmgLow;
		this.dmgHigh = dmgHigh;
		this.strReq = strReq;
		this.apCost = apCost;
		this.isGun = false;
		this.image = image;
		this.sounds = {
			fire: new Audio(sounds.fire),
			fireBust: new Audio(sounds.fireBurst),
			reload: new Audio(sounds.reload),
			empty: new Audio(sounds.empty),
		};
	}
}

export class Gun extends Weapon {
	constructor(
		name,
		dmgLow,
		dmgHigh,
		strReq,
		apCost,
		image,
		sounds,
		ammoType,
		magSize,
		canBurst,
		burstAmmoUse = 0
	) {
		super(name, dmgLow, dmgHigh, strReq, apCost, image, sounds);
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
		this.sounds.fire.play();
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
		this.sounds.fireBust.play();
		return this.burstAmmoUse;
	}

	fireNoAmmo() {
		// returns shots fired, plays sounds
		this.sounds.empty.play();
		return 0;
	}

	reload(amount) {
		if (amount > this.magSize) {
			console.log("Amount larger than magazine capacity... Error");
			return -1;
		}
		this.sounds.reload.play();
		this.curClip = amount;
	}
}
