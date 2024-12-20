class Overworld {
	constructor(config) {
		window.overworld = this;
		this.element = config.element;
		this.canvas = this.element.querySelector(".game-canvas");
		this.ctx = this.canvas.getContext("2d");
		this.startingMap = "OutsideTomb";
		this.map = null;
		this.camera = null;
		this.titleScreen = null;
		this.controlInput = null;
	}

	/* The Game Loop */
	gameLoop() {
		let prevMs; /* the previous millisecond */
		const step = 1/60; /* steps per millisecond */
		const stepFunc = (timestampMs) => {
			if (prevMs === undefined) {
				/* will always have a point of reference */
				prevMs = timestampMs;
			}
			/* calculate change in time per millisecond */
			let delta = (timestampMs - prevMs) / 1000;
			while (delta >= step) {
				this.gameStep(delta);
				delta -= step;
			}
			/* update previous millisecond to current one */
			prevMs = timestampMs - delta * 1000;
			/* business-as-usual tick */
			if (!this.map.paused) { requestAnimationFrame(stepFunc); }
		}
		requestAnimationFrame(stepFunc); /* the kickoff tick */
	}

	gameStep(delta) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		Object.values(this.map.gameObjects).forEach(obj => {
			obj.update({ delta, arrow: this.controlInput.direction, map: this.map });
		});
		this.map.camera.update(this.ctx);
	}

	startMap(mapConfig, playerInitialState) {
		this.map = new OverworldMap(mapConfig);
		this.map.init();
		this.map.overworld = this;

		if (playerInitialState) {
			this.map.gameObjects.player.x = playerInitialState.x;
			this.map.gameObjects.player.y = playerInitialState.y;
			this.map.gameObjects.player.direction = playerInitialState.direction;
		}

		this.progress.mapId = mapConfig.id;
		this.progress.startPlayerX = this.map.gameObjects.player.x;
		this.progress.startPlayerY = this.map.gameObjects.player.y;
		this.progress.startPlayerDirection = this.map.gameObjects.player.direction;

		this.map.camera = new Camera(this.map);
		this.map.camera.init();
	}

	bindActionInput() {
		const interactionKeys = ["Space","Enter","KeyZ"];
		interactionKeys.forEach(key => {
			new KeyPressListener(key, () => {
				this.map.checkForActionCutscene(this.map.camera.getFocusObject());
			});
		})
		new KeyPressListener("Escape", () => {
			if (!this.map.cutscenePlaying) {
				this.map.startCutscene([
					{ type: "pause" }
				]);
			}
		});
		new KeyPressListener("KeyF", () => {
			if (!this.map.cutscenePlaying) {
				this.map.startCutscene([{ type: "switchFocus" }]);
			}
		});
	}

	bindPlayerPositionCheck() {
		document.addEventListener("ActorWalkingComplete", e => {
			if (e.detail.whoId === "player" || e.detail.whoId === "player2") {
				this.map.checkForCutscenePlace(e.detail.whoId);
			}
		});
	}

	async init() {
		const container = document.querySelector(".game-container");

		/* Create a new progress object to store save data */
		this.progress = new Progress();

		/* Initialize ControlInput */
		this.controlInput = new ControlInput();
		this.controlInput.init();

		/* Show the title screen */
		this.titleScreen = new TitleScreen({
			progress: this.progress,
			controlInput: this.controlInput
		});
		const useSaveFile = await this.titleScreen.init();

		/* Potentially load saved data */
		let initialPlayerState = null;
		let map = this.startingMap; /* New games start here */

		if (!useSaveFile) {
			/* Set up the starting story flags for the game */
			const addStoryFlag = function (flag,value=false) {
				window.playerState.storyFlags[flag] = value;
			};

			/* Add the initial story flags below */
			addStoryFlag("MAP02_CUTSCENE_A_DONE");
			addStoryFlag("MAP03_DOOR_C_OPENED", true);
			addStoryFlag("MAP04_CUTSCENE_A_DONE");
			// addStoryFlag("MAP04_DOOR_A_OPENED",false);
			// addStoryFlag("MAP04_DOOR_B_OPENED",false);
		} else {
			/* Load the player's position in the room and the story flags */
			this.progress.load();
			initialPlayerState = {
				x: this.progress.startPlayerX,
				y: this.progress.startPlayerY,
				direction: this.progress.startPlayerDirection
			}
			map = this.progress.mapId;
		}

		/* This is where the HUD would go if I need one */

		/* Start the first map */
		this.startMap(window.OverworldMaps[map], initialPlayerState);

		/* Bind action input */
		this.bindActionInput();
		this.bindPlayerPositionCheck();

		/* Start the game loop */
		this.gameLoop();

		this.map.startCutscene([
			/* Insert game starting cutscene here */
		]);
	}
}
