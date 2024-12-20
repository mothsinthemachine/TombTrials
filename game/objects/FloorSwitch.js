class FloorSwitch extends GameObject {
	constructor(config,map) {
		super(config);

		this.map = map;
		this.depth = -1;
		this.passable = true;
		this.pressed = false;
		this.storyFlag = config.storyFlag;
		this.permanent = config.permanent || false;
		this.door = config.door || null;
		this.event = config.event || null;
		this.eventDone = false;

		this.sprite = new Sprite({
			gameObject: this,
			src: "./game/images/objects/FloorSwitch.png",
			animations: {
				"switch-up"   : [[0,0]],
				"switch-down" : [[1,0]],
			},
			currentAnimaton: "switch-up",
			frameWidth: 24,
			frameHeight: 16,
			frameOffsetX: 4,
			frameOffsetY: -8,
		});
	}
	
	update() {
		if (this.permanent && this.pressed) {
			/* Do not update the state of the flag or change the sprite */
			return;
		}

		if (this.findActor(8)) {
			window.playerState.storyFlags[this.storyFlag] = true;
			this.pressed = true;
			/* Execute events if defined */
			if (this.event && !this.eventDone) {
				this.eventDone = true;
				this.map.startCutscene(this.event);
			}
		} else {
			window.playerState.storyFlags[this.storyFlag] = false;
			this.pressed = false;
			this.eventDone = false;
		}
		this.updateSprite();
	}

	updateSprite() {
		this.sprite.currentAnimation = (this.pressed) ? "switch-down" : "switch-up";
	}
}