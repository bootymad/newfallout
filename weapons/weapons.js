export class Weapon {
	constructor(name, dmgLow, dmgHigh, strReq, apCost, image) {
		this.name = name;
		this.dmgLow = dmgLow;
		this.dmgHigh = dmgHigh;
		this.strReq = strReq;
		this.apCost = apCost;
		this.isGun = false;
		this.image = image;
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
		ammoType,
		magSize,
		canBurst,
		burstAmmoUse = 0
	) {
		super(name, dmgLow, dmgHigh, strReq, apCost, image);
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
