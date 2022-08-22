import { LABELS, AP_COSTS } from "./constants.js";
import { Character, Player } from "./character.js";
import { PlayerUI } from "./UI/playerUI.js";
import { WEAPONS } from "./weapons/weaponObjects.js";
import { MessageLogger } from "./messageLogger.js";
import { Game } from "./source.js";

const game = new Game();

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
	ammo: { [LABELS.AMMO10MM]: 24, [LABELS.AMMO223]: 6 },
	armor: {},
	chems: { [LABELS.STIMPAK]: 3 },
};

const testChar = new Player("TestGuy", defSpecial, defInventory);
testChar.equipped.weapon = WEAPONS.pistols[LABELS.GUN10MM];

const playerUI = new PlayerUI(testChar);
playerUI.update();

let b = document.createElement("button");
b.append("Change Weapon");
b.addEventListener(
	"click",
	() => (testChar.equipped.weapon = WEAPONS.pistols[LABELS.GUN223])
);
document.body.append(b);
