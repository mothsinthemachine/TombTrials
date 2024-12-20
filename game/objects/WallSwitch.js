class WallSwitch extends GameObject {
	constructor(config) {
		super(config);

		this.pulled = false;
		this.storyFlag = config.storyFlag;
		this.talking = config.talking || [];

		this.sprite = new Sprite({
			gameObject: this,
			src: "./game/images/objects/WallSwitch.png",
			animations: {
				"switch-up"   : [[0,0]],
				"switch-down" : [[1,0]],
			},
			currentAnimation: "switch-up",
			frameWidth: 24,
			frameHeight: 16,
			frameOffsetX: 4,
			frameOffsetY: -8,
		});
	}

	update() {
		this.pulled = window.playerState.storyFlags[this.storyFlag] || false;
		this.sprite.currentAnimation = (this.pulled) ? "switch-down" : "switch-up";
	}
}
