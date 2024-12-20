class Actor extends GameObject {
	constructor(config) {
		super(config);
		this.passable = false;
		this.intentPosition = null;
		this.speed = 1;
		this.currentDirection = "";
		this.movementTimer = 0;
		this.onStandBehavior = false;
		this.intentPosition = null;
		this.name = config.name || "";
		this.playerControlled = config.playerControlled || false;
		this.direction = config.direction || "down";
		this.directionUpdate = {
			"up"   : ["y", -this.speed],
			"down" : ["y",  this.speed],
			"left" : ["x", -this.speed],
			"right": ["x",  this.speed]
		}
		this.sprite = new Sprite({
			gameObject: this,
			src: config.src || "./game/images/actors/Heroic.png",
			useShadow: config.useShadow,
			frameWidth:   24,
			frameHeight:  32,
			frameOffsetX:  4,
			frameOffsetY:  9,
			shadowX: 0,
			shadowY: 16,
			animations: config.animations || {
				"idle-up"    : [[0,0]],
				"idle-right" : [[0,1]],
				"idle-down"  : [[0,2]],
				"idle-left"  : [[0,3]],
				"walk-up"    : [[1,0], [2,0], [3,0], [2,0]],
				"walk-right" : [[1,1], [2,1], [3,1], [2,1]],
				"walk-down"  : [[1,2], [2,2], [3,2], [2,2]],
				"walk-left"  : [[1,3], [2,3], [3,3], [2,3]]
			}
		});
	}

	updateSprite() {
		if (!this.sprite) {return;}
		const prefix = (this.movementTimer > 0) ? "walk-" : "idle-";
		this.sprite.setAnimation(prefix + this.direction);
	}

	update(state) {
		/* Update the depth value of the object if it is not negative */
		if (this.depth >= 0) {this.depth = this.y;}
		/* If actor is in motion... */
		if (this.movementTimer > 0) {
			this.updatePosition();
		} else {
			/* Keyboard ready and arrow pressed */
			if (this.playerControlled && state.arrow && !state.map.cutscenePlaying) {
				this.startBehavior(state,{ type: "walk", direction: state.arrow });
			}
			this.updateSprite();
		}
	}

	setIntentPosition(moving=true) {
		if (!moving) {
			this.intentPosition = null;
			return;
		}
		const pos = utils.nextPosition(this.x, this.y, this.direction);
		this.intentPosition = [pos.x, pos.y];
	}

	realignToGrid() {
		this.x = utils.grid(Math.round(Math.trunc(this.x)/16));
		this.y = utils.grid(Math.round(Math.trunc(this.y)/16));
	}

	updatePosition() {
		const [value, change] = this.directionUpdate[this.direction];
		this[value] += change;
		this.movementTimer--;
		if (this.movementTimer === 0) {
			this.setIntentPosition(null);
			utils.emitEvent("ActorWalkingComplete", { whoId: this.id });
			this.realignToGrid();
		}
	}
	
	startBehavior(state, behavior) {
		if (!this.mounted) {return;}
		let retryTime = (behavior.time) ? behavior.time : 10;
		let movementSpeed	= this.speed;
		this.direction = behavior.direction;
		switch (behavior.type) {
			case "walk":
				/* Check for a space taken or the map's edge */
				const cond1 = state.map.isSpaceTaken(this.x, this.y, this.direction);
				const cond2 = state.map.isMapEdge(this.x, this.y, this.direction);
				if (cond1 || cond2){
					if (cond1 && this.playerControlled) {
						state.map.pushBlock(this.x, this.y, this.direction, state);
					}
					if (behavior.retry) { setTimeout(() => { 
						this.startBehavior(state,behavior); 
					}, retryTime)};
					return; /* Actor cannot move */
				}
				/* Actor can move */
				this.movementTimer = 16 / movementSpeed;
				this.setIntentPosition();
				this.updateSprite();
				break;
			case "stand":
				this.onStandBehavior = true;
				setTimeout(() => {
					utils.emitEvent("ActorStandComplete", {whoId: this.id});
					this.onStandBehavior = false;
				}, behavior.time);
				break;
			case "follow":
				this.movementTimer = 16 / behavior.speed;
				this.setIntentPosition();
				this.updateSprite();
		}
	}
}