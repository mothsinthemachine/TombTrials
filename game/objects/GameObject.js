class GameObject {
	constructor(config) {
		this.id = null;
		this.type = config.type; 
		this.mounted = false;
		this.passable = true;
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.z = config.z || 0; /* for making objects "jump" */
		this.direction = config.direction || "down";
		this.width = config.width || 16;
		this.height = config.height || 16;
		this.depth = config.depth || this.y; /* affects order in which objects are drawn */
		this.behaviorLoop = config.behaviorLoop || [];
		this.behaviorLoopIndex = 0;
		this.talking = config.talking || [];
		this.retryTimeout = null;
		this.sprite = null;
		this.memory = {
			x: this.x,
			y: this.y,
			z: this.z,
			direction: this.direction
		};
	}

	/* Each Game Object (derived classes) will have their own update functions to use. */
	update() { /* Remains empty like soul. */ }

	/* Mount objects to the specified map */
	mount(map) {
		this.mounted = true;
		setTimeout(() => {
			this.doBehaviorEvent(map);
		}, 10);
	}

	/* Asynchronous behavior */
	async doBehaviorEvent(map) {
		/* If there is no behavior loop, leave this function */
		if ((map.cutscenePlaying) || 
			(this.behaviorLoop.length === 0) || 
			(this.onStandBehavior)
		){
			return;
		}

		/* Retry if cutscene is playing */

		/* Set up an event with relevant information */
		let eventData = this.behaviorLoop[this.behaviorLoopIndex];
		eventData.who = this.id;

		/* Create an instance out of our next event config */
		const eventHandler = new OverworldEvent({map, event: eventData});
		await eventHandler.init(); /* Wait until event Resolves */

		/* Setting next event to fire */
		this.behaviorLoopIndex++;

		/* If index is longer than the loop array, start over from 0 */
		if (this.behaviorLoopIndex === this.behaviorLoop.length) {
			this.behaviorLoopIndex = 0;
		}

		/* Repeat again */
		this.doBehaviorEvent(map);
	}

	/* Find an Actor at the current object's location */
	/* @param {integer} [threshold] - How far the Actor needs to be to the current object's position to activate */
	findActor(threshold=16) {
		return Object.values(overworld.map.gameObjects).find(obj => {
			return (
				(obj instanceof Actor) &&
				(obj.x < this.x+threshold) &&
				(obj.x > this.x-threshold) &&
				(obj.y < this.y+threshold) &&
				(obj.y > this.y-threshold)
				// (obj.x === this.x) &&
				// (obj.y === this.y)
			) ? obj : null;
		});
	}

	setMapMemory() {
		this.mapMemory.x = this.x;
		this.mapMemory.y = this.y;
		this.mapMemory.direction = this.direction;
		this.mapMemory.behaviorLoopIndex = this.behaviorLoopIndex;
	}
}