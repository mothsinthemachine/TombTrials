class Battle {
	constructor(config) {
		this.map = config.map;
		this.actorsInBattle = config.actors || [];
		this.battlers = {};
		this.actionQueue = {};
		this.battleTurn = 0;
		this.hud = null;
	}

	end() {
		// end the battle
		this.hud.removeElements();
		utils.print("The battle has ended.");
	}

	/* Add a battler the battle */
	addBattler(actor) {
		/* Check to see if actor exists on the map */
		if (!this.map.gameObjects[actor]) {
			utils.print(`Cannot add ${actor} to this battle.`,"warn");
			return false;
		}

		this.battlers[actor] = this.map.gameObjects[actor].battler;
		return true;
	}

	delBattler() {
		// delete a battler from the battle (defeat)
	}

	updateBattle() {
		// update the battle events
	}

	dequeueAction() {
		// de-queue an action after it has taken place in battle
		// delete the instance?
	}

	queueAction() {
		// queue an action to take place in battle
	}

	battleTime() {
		// keep track of the time in battle because this might be interesting
	}

	drawBattle() {
		// draw the battle instead of using a camera like in overworld
	}

    /* Initialize the battle event */
	init() {
		// entering battle animation
		// transition to battle area (just a background)
		/* Add battlers based on actors in array */
		this.actorsInBattle.forEach(actor => {
			this.addBattler(actor);
		});
		// create the HUD for battle
		this.hud = new BattleHUD({
			battle: this,
		});
		this.hud.init();
		this.hud.setInfo("Fight time!");
		utils.print("The battle has begun..."); /* debugging tool */
    }
}
