class TreasureBox extends Actor {
	constructor(config) {
		super(config);

		this.storyFlag = config.storyFlag;
		this.passable = false;
		this.opened = false;
		this.money = config.money || 1;

		this.sprite = new Sprite({
			gameObject: this,
			src: config.src || "./game/images/objects/TreasureBox.png",
			frameWidth:   16,
			frameHeight:  16,
			frameOffsetX: 0,
			frameOffsetY: -8,
			animations:  config.animations  || {
				"closed" : [[0,0]],
				"opened" : [[1,0]],
			},
			currentAnimaton: "closed"
		});

		this.init();
	}

	updateSprite() {
		this.sprite.currentAnimation = (this.opened) ? "opened" : "closed";
	}

	update() {
		if (window.playerState.storyFlags[this.storyFlag] && !this.opened) {
			this.opened = true;
		}
		this.updateSprite();
	}

	init() {
		/* Randomize values in the treasure box upon creation */
		if (!window.playerState.storyFlags[this.storyFlag]) {
			window.playerState.storyFlags[this.storyFlag] = false;
			this.money += Math.floor(Math.random() * this.money);
			this.talking = [
				{
					events: [
						{ type: "setStoryFlag", flag: this.storyFlag, value: true },
						{ type: "textMessage", text: `Found ${this.money}G inside!` }
					]
				},{
					required: [this.storyFlag],
					events: [
						{ type: "textMessage", text: "This has been thoroughly searched." }
					]
				}
			];
		} else if (window.playerState.storyFlags[this.storyFlag] === true) {
			this.money = 0;
			this.talking = [{
				events: [
					{ type: "textMessage", text: "This has been thoroughly searched." }
				]}
			];
		}
	}
}