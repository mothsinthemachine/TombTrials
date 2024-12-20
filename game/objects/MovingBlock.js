class MovingBlock extends Actor {
	constructor(config, map) {
		super(config);
		this.map = map;
		this.pushable = config.pushable || false;
		this.target = map.gameObjects[config.target] || null;
		this.eventsOnTarget = config.eventsOnTarget || [];
		this.eventsOnTargetDone = false;
		if (this.pushable) {
			const required = this.pushable.finalState?.required;
			if (required && required.every(prerequisite => playerState.storyFlags[prerequisite])) {
				this.target = this.map.configObjects[this.pushable.finalState.target];
				if (this.target) {
					this.x = target.x;
					this.y = target.y;
				}
			}
		}
		this.sprite = new Sprite({
			gameObject: this,
			src: config.src || "./game/images/objects/MovingBlock.png",
			frameWidth: 16,
			frameHeight: 16,
			frameOffsetY: -8,
			animations: { "static" : [[0,0]] },
			currentAnimation: "static",
		});
	}

	onTarget() {
		return (this.target && (this.x === this.target.x) && (this.y === this.target.y)) ? true : false;
	}

	updateSprite() {
		this.sprite.currentAnimation = "static";
	}
}