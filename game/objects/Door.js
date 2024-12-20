class Door extends GameObject {
	constructor(config) {
		super(config);

		this.passable = config.passable;
		this.storyFlag = config.storyFlag;

		/* Set up a new sprite for this object */
		this.sprite = new Sprite({
			gameObject: this,
			src: config.src || "./game/images/objects/Door.png",
			frameWidth:   24,
			frameHeight:  32,
			frameOffsetX: 4,
			frameOffsetY: 8,
			animations:  config.animations  || {
				"closed" : [[0,0]],
				"opened" : [[1,0]],
			},
			currentAnimaton: config.currentAnimation || "closed-down"
		});
	}

	update() {
		this.passable = window.playerState.storyFlags[this.storyFlag] || false;
		this.sprite.currentAnimation = (this.passable) ? "opened" : "closed";
	}
}