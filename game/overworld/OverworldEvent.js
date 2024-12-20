class OverworldEvent {
	constructor({map, event}) {
		this.map = map;
		this.event = event;
	}

	/********************************** */
	/* Internal functions for event use */
	/********************************** */

	/* Need to explain how this works... */
	init() {
		return new Promise(resolve => {
			this[this.event.type](resolve);
		});
	}

	getEventActor() {
		/* If event actor is specified */
		if (this.event.who) {
			return this.event.who;
		}
		/* Otherwise, use the position of the event to determine the actor */
		if (this.event.place) {
			const [x,y] =  this.event.place.split(",");
			const found = this.map.getActor(parseInt(x),parseInt(y)).id;
			return found;
		}
		/* Does the same as above. This was added for backwards-compatibility */
		if (this.event.x && this.event.y) {
			const found = this.map.getActor(this.event.x,this.event.y).id;
			return found;
		}
		/* Return null if event actor is not found */
		return null;
	}

	/* ************************************** */
	/* Manipulate story flags in Map State */
	/* ************************************** */

	/* Add flag to Player State. Add and Set are the same function */
	addStoryFlag(resolve) {
		window.playerState.storyFlags[this.event.flag] = this.event.value || false;
		resolve();
	}

	setStoryFlag(resolve) {
		window.playerState.storyFlags[this.event.flag] = this.event.value;
		resolve();
	}

	/************** */
	/* Actor events */
	/************** */

	stand(resolve) {
		const who = this.getEventActor();

		/* Set up a handler to complete when correct person is done walking, then resolve the event */
		const completeHandler = e => {
			if (e.detail.whoId === who) {
				document.removeEventListener("ActorStandComplete", completeHandler);
				resolve();
			}
		}

		/* Add the event listener for the next event */
		document.addEventListener("ActorStandComplete", completeHandler);

		this.map.gameObjects[who].startBehavior({
			map: this.map
		},{
			type: "stand",
			direction: this.event.direction,
			time: this.event.time,
			retry: true
		});
	}

	walk(resolve) {
		const who = this.getEventActor();

		/* Set up a handler to complete when correct person is done walking,
			then resolve the event */
		const completeHandler = e => {
			if (e.detail.whoId === who) {
				document.removeEventListener("ActorWalkingComplete", completeHandler);
				resolve();
			}
		}

		/* Add the event listener for the next event */
		document.addEventListener("ActorWalkingComplete", completeHandler);

		this.map.gameObjects[who].startBehavior({
			map: this.map
		},{
			type: "walk",
			direction: this.event.direction,
			retry: true
		});
	}

	/* Show text messages on screen */
	textMessage(resolve) {
		if (this.event.facePlayer) {
			const obj = this.map.gameObjects[this.event.facePlayer];
			let focus = "player";
			if (obj === this.map.gameObjects[focus]) {focus = "player2"}
			obj.direction = utils.oppositeDirection(this.map.gameObjects[focus].direction);
		}

		const message = new TextMessage({
			text: this.event.text,
			onComplete: () => resolve()
		});
		message.init(document.querySelector(".game-container"));
	}

	/* Transition to new map */
	changeMap(resolve) {
		this.map.terminate();

		/* Transition into new map */
		const sceneTransition = new SceneTransition();
		sceneTransition.init(document.querySelector(".game-container"), () => {
			this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
				/* pass these variables from event to map to apply to Player */
				x: this.event.x,
				y: this.event.y,
				direction: this.event.direction,
			});

			resolve(); /* changeMap has completed */
			sceneTransition.fadeOut();
		});
	}

	/* Reset the current map. Works similar to changeMap() except does not save mapime. */
	resetMap(resolve) {
		this.map.unmountObjects();
		const sceneTransition = new SceneTransition();
		sceneTransition.init(document.querySelector(".game-container"), () => {
			this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
				x: this.event.x,
				y: this.event.y,
				direction: this.event.direction,
			});

			resolve();
			sceneTransition.fadeOut();
		});
	}

	/* Transfer objects on the same map to different locations */
	transfer(resolve) {
		const sceneTransition = new SceneTransition();
		sceneTransition.init(document.querySelector(".game-container"), () => {
			const target = this.map.gameObjects[this.event.who];
			if (target) {
				target.x = this.event.x;
				target.y = this.event.y;
				target.direction = this.event.direction;
			}
			this.map.camera.x = this.event.x;
			this.map.camera.y = this.event.y;
			sceneTransition.fadeOut();
			resolve();
		});
	}

	/* Pause the game */
	pause(resolve) {
		this.map.paused = true;
		this.map.menu = new PauseMenu({
			progress: this.map.overworld.progress,
			onComplete: () => {
				resolve();
				this.map.overworld.gameLoop();
				this.map.paused = false;
			}
		},this.map);
		this.map.menu.init(document.querySelector(".game-container"));
	}

	switchFocus(resolve) {
		const partyList = window.playerState.partyMembers;
		let target = partyList[0]; /* Default to first member in party list */

		if (this.event.who) {
			/* If defined, change focus to who */
			target = who;

		} else if (partyList.length > 1) {
			/*
			There has to be more than one party member in order to switch camera focus.
			Cycle through party member list if this is so.
			*/
			let i = partyList.findIndex(member => (member === this.map.camera.focus));
			i++;
			if (i === partyList.length) {i = 0;}
			target = partyList[i];
		}

		if (target !== this.map.camera.focus) {
			this.map.camera.getFocusObject().playerControlled = false;
			this.map.camera.switchFocus(target);
			this.map.camera.getFocusObject().playerControlled = true;
		}

		resolve();
	}

	/* Add an Actor to the map */
	addActor(resolve) {
		switch (this.event.object) {
			case "MovingBlock": {
				this.map.addBlock(this.event.x,this.event.y,this.event.name,this.event.talking);
				break;
			}
		}
		resolve();
	}

	removeActor(resolve) {
		const target = this.getEventActor();
		this.map.gameObjects[target].mounted = false;
		delete this.map.gameObjects[target];
		resolve();
	}

	endGame(resolve) {
		this.map.terminate();
		const sceneTransition = new SceneTransition();
		sceneTransition.init(document.querySelector(".game-container"), () => {
			this.map.startCutscene([
				{ type: "textMessage", text: "Congratualatons. This is the end of the demo." },
				{ type: "textMessage", text: "Thank you for playing." },
				{ type: "textMessage", text: "You can refresh the browser tab or close it to exit completely." }
			]);
			resolve();
		});
	}

	/********* */
	/* BATTLES */
	/********* */

	startBattle(resolve) {
		this.map.cutscenePlaying = true;
		this.map.battle = new Battle({
			map: this.map,
			actors: [
				"player",
				"player2"
			]
		});
		this.map.battle.init();
		resolve();
	}

	endBattle(resolve) {
		this.map.cutscenePlaying = false;
		this.map.battle.end();
		delete this.map.battle;
		resolve();
	}

} 