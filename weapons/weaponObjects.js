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
			{
				fire: "./sounds/weapons/10mmpistol/SINGLESHOT.ogg",
				reload: "./sounds/weapons/10mmpistol/RELOAD.ogg",
				empty: "./sounds/weapons/10mmpistol/EMPTY.ogg",
			},
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
			"./images/weapons/PISTOL_223.webp",
			{
				fire: "./sounds/weapons/223pistol/SINGLESHOT.ogg",
				reload: "./sounds/weapons/223pistol/RELOAD.ogg",
				empty: "./sounds/weapons/223pistol/EMPTY.ogg",
			},
			".223 FMJ",
			5,
			false
		),
	},
};
