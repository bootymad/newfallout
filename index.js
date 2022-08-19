import { LABELS, AP_COSTS } from "./constants.js";
import { Character, Player } from "./character.js";
import { PlayerUI } from "./UI/playerUI.js";
import { WEAPONS } from "./weapons/weaponObjects.js";
import { MessageLogger } from "./messageLogger.js";

const defSpecial = {
	strength: 5,
	perception: 5,
	endurance: 5,
	charisma: 5,
	intelligence: 5,
	agility: 5,
	luck: 5,
};

// ==================WEAPONS================== //

// instances

const defInventory = {
	weapons: [WEAPONS.pistols["10mm Pistol"]],
	ammo: { [LABELS.AMMO10MM]: 24 },
	armor: [],
	chems: { [LABELS.STIMPAK]: 3 },
};

const testChar = new Player("TestGuy", defSpecial, defInventory);
testChar.equipped.weapon = WEAPONS.pistols["10mm Pistol"];
const playerUI = new PlayerUI(testChar);
playerUI.update();
