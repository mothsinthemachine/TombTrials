class ControlInput {
	constructor() {
		this.heldDirections = [];
		this.heldInteractions = [];
		this.directionalKeys = {
			"ArrowUp"	: "up",
			"KeyW"		: "up",
			"ArrowDown" : "down",
			"KeyS"		: "down",
			"ArrowLeft" : "left",
			"KeyA"		: "left",
			"ArrowRight": "right",
			"KeyD"		: "right"
		};
		this.interactionKeys = {
			"Space"		: "confirm",
			"KeyZ"		: "confirm",
			"Enter"		: "confirm",
			"Backspace" : "cancel",
			"KeyX"		: "cancel",
			"Escape"	: "menu",
			"KeyM"		: "menu"
		}
	}

	get direction() {
		return this.heldDirections[0];
	}

	get interaction() {
		return this.heldInteractions[0];
	}

	init() {

		/* Directional keys */

		document.addEventListener("keydown", e => {
			const dir = this.directionalKeys[e.code];
			if (dir  &&  this.heldDirections.indexOf(dir) === -1) {
				this.heldDirections.unshift(dir);
			}
		});

		document.addEventListener("keyup", e => {
			const dir = this.directionalKeys[e.code];
			const index = this.heldDirections.indexOf(dir);
			if (index > -1) {
				this.heldDirections.splice(index,1);
			}
		});

		/* Interaction keys */

		document.addEventListener("keydown", e => {
			const act = this.interactionKeys[e.code];
			if (act  && this.heldInteractions.indexOf(act) === -1) {
				this.heldInteractions.unshift(act);
			}
		});

		document.addEventListener("keyup", e => {
			const act = this.interactionKeys[e.code];
			const index = this.heldInteractions.indexOf(act);
			if (index > -1) {
				this.heldInteractions.splice(index,1);
			}
		});
	}
}
