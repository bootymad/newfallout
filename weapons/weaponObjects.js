import { Gun } from "./weapons.js";

export const WEAPONS = {
	pistols: {
		"10mm Pistol": new Gun(
			"10mm Pistol",
			5,
			12,
			3,
			5,
			"./images/weapons/PISTOL_10MM.webp",
			"10mm",
			12,
			false
		),
		".223 Pistol": new Gun(
			".223 Pistol",
			20,
			30,
			5,
			5,
			"./images/weapons/PISTOL_10MM.webp",
			".223 FMJ",
			5,
			false
		),
	},
};
