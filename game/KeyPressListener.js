class KeyPressListener {
	constructor(keyCode, callback) {

		let keySafe = true;

		/* Listen for keydown events */
		this.keydownFunction = function(event) {
			if (event.code === keyCode) {
				if (keySafe) {
					keySafe = false;
					callback();
				} 
			}
		}

		/* Listen for key release events */
		this.keyupFunction = function(event) {
			if (event.code === keyCode) {
				keySafe = true;
			}
		};

		/* Add listeners */
		document.addEventListener("keydown", this.keydownFunction);
		document.addEventListener("keyup", this.keyupFunction);
	}

	/* Remember to unbind key event listeners so they stop listening */
	unbind() {
		document.removeEventListener("keydown", this.keydownFunction);
		document.removeEventListener("keyup", this.keyupFunction);
	}
}