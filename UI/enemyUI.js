import { ENEMIES } from "../enemies.js";
import { Enemy } from "../enemy.js";
export class EnemyUI {
	constructor(logger) {
		this.logger = logger;
		this.pageElement = document.querySelector(".enemy-box");
		this.createNextEnemyButton();

		//logic
		this.battleStarted = false;
	}

	createNextEnemyButton() {
		const battleButton = document.createElement("button");
		battleButton.append("Next Enemy");
		battleButton.addEventListener("click", () => {
			this.battleStarted = true;
			const enemy = new Enemy(...ENEMIES["Super Mutant"]);
			enemy.addLogger(this.logger);
			console.log(enemy);
		});
		this.pageElement.append(battleButton);
	}
}
