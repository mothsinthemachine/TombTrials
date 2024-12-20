class OverworldMap {
	constructor(config) {
		this.id = config.id;
		this.index = config.index;
		this.overworld = null;
		this.camera = null;
		this.battle = null;
		this.menu = null;
		this.configObjects = config.configObjects;
		this.gameObjects = {};
		this.floorSwitches = {};
		this.mapLayout = config.mapLayout || [];
		this.walls = config.walls || {};
		this.sand = config.sand || {};
		this.cutscenePlaces = config.cutscenePlaces || {};
		this.cutscenePlaying = false;
		this.paused = false;
		this.lowerImage = null;
		this.upperImage = null;
		this.rightEdge = 3200;
		this.bottomEdge = 3200;
		if (config.upperSrc) {
			this.upperImage = new Image();
			this.upperImage.src = config.upperSrc;
		}
		if (config.lowerSrc) {
			this.lowerImage = new Image();
			this.lowerImage.src = config.lowerSrc;
			this.rightEdge = this.lowerImage.width-16;
			this.bottomEdge = this.lowerImage.height-16;
		}
		// this.time = { steps: 0, seconds: 0, minutes: 0, hours: 0 };
	}

	init() {
		this.generateWalls();
		this.mountObjects();
	}

	terminate() {
		this.unmountObjects();
		// Object.assign(this.overworld.progress.storyFlags, window.playerState.storyFlags);
	}

	// update() {
	// 	/* Update map time */
	// 	this.time.steps++;

	// 	if (this.time.steps === 60) {
	// 		this.time.seconds++;
	// 		this.time.steps = 0;
	// 	}

	// 	if (this.time.seconds === 60) {
	// 		this.time.minutes++;
	// 		this.time.seconds = 0;
	// 	}

	// 	if (this.time.seconds === 60) {
	// 		this.time.hours++;
	// 		this.time.minutes = 0;
	// 	}
	// }

	generateWalls() {
		const wallChar = 'x';
		const sandChar = 'y';
		for (let i = 0; i < this.mapLayout.length; i++) {
			for (let j = 0; j < this.mapLayout[i].length; j++) {
				switch (this.mapLayout[i][j]) {
					case wallChar:
						this.walls[utils.coords(j,i)] = true;
						break;
					case sandChar:
						this.sand[utils.coords(j,i)] = true;
						break;
				}
			}
		}
	}

	mountObjects() {
		Object.keys(this.configObjects).forEach(key => {
			var inst,obj;
			obj = this.configObjects[key];
			//obj.id
			switch (obj.type) {
				case "Actor":		{ inst = new Actor(obj); break; }
				case "Door":		{ inst = new Door(obj); break; }
				case "WallSwitch":	{ inst = new WallSwitch(obj); break; }				
				case "TreasureBox":	{ inst = new TreasureBox(obj); break; }
				case "FloorSwitch":	{ inst = new FloorSwitch(obj,this); break; }
				case "MovingBlock":	{ inst = new MovingBlock(obj, this); break; }
			}
			this.gameObjects[key] = inst;
			this.gameObjects[key].id = key;
			inst.mount(this);
		});
	}

	unmountObjects() {
		Object.values(this.gameObjects).forEach( obj => { obj.mounted = false; } );
	}

	async startCutscene(events) {
		/* Signal that a cutscene is playing */
		this.cutscenePlaying = true;

		/* Loop async events, await each one */
		for (let i = 0; i < events.length; i++) {
			const eventHandler = new OverworldEvent({
				event: events[i],
				map: this
			});

			if (events[i].noAwait) { /* Execute event immediately */
				eventHandler.init();
			} else { /* Await for event to finish */
				await eventHandler.init();
			}
		}

		/* Reset signal to false for cutscene playing */
		this.cutscenePlaying = false;

		/* Reset NPCs to do their default behaviors */
		Object.values(this.gameObjects).forEach(obj => obj.doBehaviorEvent(this));
	}

	/* Check for action cutscene */
	checkForActionCutscene(focusedObj) {
		// const player = this.gameObjects["player"];
		const searchCoords = utils.nextPosition(focusedObj.x, focusedObj.y, focusedObj.direction);
		const match = Object.values(this.gameObjects).find(obj => {
			return (`${obj.x},${obj.y}` === `${searchCoords.x},${searchCoords.y}`);
		});

		/*  Play scenario, but check for these things:
			1. No cutscene is playing
			2. There is a match of a game object
			3. The match has a talking array */
		if ((!this.cutscenePlaying) &&
			(match) &&
			(match.talking.length > 0)
		){
			/*  This is what's making my scenarios default to the first one
				Idea for remedy: reverse the array of scenarios. */
			//const relevantScenario = match.talking.toReversed().find(scenario => { /* Compatibility issue with this line */
			const relevantScenario = [...match.talking].reverse().find(scenario => {
				/* Need to read up on the every() array method! */
				return (scenario.required || []).every(prerequisite => {
					return playerState.storyFlags[prerequisite];
				});
			});

			if (relevantScenario) {
				this.startCutscene(relevantScenario.events);
			}
		}
	}

	/* Check for cutscene place */
	checkForCutscenePlace(id) {
		const player = this.gameObjects[id];
		let cutscenePlace = this.cutscenePlaces[`${player.x},${player.y}`];

		if (!this.cutscenePlaying) {
			if (cutscenePlace) {
				/* If cutscene place is a duplicate of another, use the original's events */
				if (cutscenePlace.duplicate) {
					cutscenePlace = this.cutscenePlaces[cutscenePlace.duplicate];
				}

				/* check if conditions are met for the event to happen */
				const relevantScenario = cutscenePlace[
					cutscenePlace.findIndex(scenario => {
					return (scenario.required || []).every(prerequisite => {
						return playerState.storyFlags[prerequisite];
					});
				})];

				if (relevantScenario) {
					relevantScenario.events.who = id;
					this.startCutscene(relevantScenario.events);
				}
			}
		}
	}

	/* Check if space is reserved */
	isSpaceTaken(currentX, currentY, direction,type=null) {
		const {x,y} = utils.nextPosition(currentX,currentY,direction);

		/* Check for walls */
		if (this.walls[`${x},${y}`]) {return true;}

		if (type && (type === "MovingBlock")) {
			if (this.sand[`${x},${y}`]) {return true;}
		}

		/* Check for game objects at this position */
		let found = Object.values(this.gameObjects).find(obj => {

			/* If the object is passable */
			if (obj.passable) {return false;}

			/* If there is an object there */
			if (obj.x === x && obj.y === y) {return true;}

			/* If the position is reserved for an object moving there */
			if (obj.intentPosition && (obj.intentPosition[0] === x) && (obj.intentPosition[1] === y) ) {
				return true;
			}
			/* Otherwise, the space is free */
			return false;
		});
		return found;
	}

	/* Check if at map's edge */
	isMapEdge(currentX, currentY, direction) {
		const {x,y}    = utils.nextPosition(currentX,currentY,direction);
		let rightEdge  = this.lowerImage.width-16;
		let bottomEdge = this.lowerImage.height-16;

		if (x < 0 || y < 0 || x > rightEdge || y > bottomEdge) {return true;}
		return false;
	}

	/* Check for a MovingBlock at position */
	pushBlock(currentX, currentY, direction, state) {
		const {x,y} = utils.nextPosition(currentX,currentY,direction);
		let found = Object.values(this.gameObjects).find(obj => {
			return ((obj.x === x) && (obj.y === y) && (obj.type === "MovingBlock"));
		});

		if (!found || !found.pushable) { return; }

		if (found.onTarget()) {
			if (!found.eventsOnTargetDone) {
				found.eventsOnTargetDone = true;
				this.startCutscene(found.eventsOnTarget);
			}
			return;
		}

		if (!this.isSpaceTaken(found.x, found.y, direction, found.type)) {
			found.startBehavior(state, {type: "walk", direction: direction });
		}
	}

	/* Add a moving block to the map */
	addBlock(px,py,isPushable=false,hasTarget=null,instName=null,hasTalking=[]) {
		let count = 0;
		Object.values(this.gameObjects).forEach(obj => {
			if (obj instanceof MovingBlock) {
				count++;
			}
		});
		const prefix = (isPushable) ? "movingBlock" : "staticBlock";
		const key = (instName) ? instName : prefix + String.fromCharCode(65 + count);
		this.gameObjects[key] = new MovingBlock(this,{
			type: "MovingBlock",
			x: px,
			y: py,
			pushable: isPushable,
			target: hasTarget,
			talking: hasTalking
		});
		this.gameObjects[key].id = key;
		this.gameObjects[key].mount(this);
	}

	/* Delete a moving block from the map */
	delBlock(who) {
		try {
			this.gameObjects[who].unmount();
			delete this.gameObjects[who];
		}
		catch (err) {
			console.log(err);
		}
	}

	/* Get an Actor from the map based on a position */
	getActor(atX,atY) {
		let found = Object.values(this.gameObjects).find(obj => (
			(obj.x === atX) && (obj.y === atY)
		));
		return found;
	}

	updateTime() {
		
	}

	getMapTime() {
		return `${
			(this.time.hours < 10) ? "0" + this.time.hours : this.time.hours
		}:${
			(this.time.minutes < 10) ? "0" + this.time.minutes : this.time.minutes
		}:${
			(this.time.seconds < 10) ? "0" + this.time.seconds : this.time.seconds
		}:${
			(this.time.steps < 10) ? "0" + this.time.steps : this.mapTime.steps
		}`;
	}
}