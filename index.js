import { LABELS, AP_COSTS } from "./constants.js";
import { Character, Player } from "./character.js";
import { PlayerUI } from "./UI/playerUI.js";
import { WEAPONS } from "./weapons/weaponObjects.js";
import { MessageLogger } from "./messageLogger.js";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

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
	weapons: { [LABELS.GUN10MM]: 1 },
	ammo: { [LABELS.AMMO10MM]: 24 },
	armor: {},
	chems: { [LABELS.STIMPAK]: 3 },
};

const testChar = new Player("TestGuy", defSpecial, defInventory);
testChar.equipped.weapon = WEAPONS.pistols[LABELS.GUN10MM];
const playerUI = new PlayerUI(testChar);
playerUI.update();
