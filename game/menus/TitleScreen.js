class TitleScreen {
	constructor({progress,controlInput}) {
		this.progress = progress;
		this.element = null;
		this.gameTitle = "Tomb Trials";
		this.gameLogoPath = "./game/images/game-logo.png";
		this.gameLogoWidth = "128px";
		this.gameLogoHeight = "auto";
		this.description = null;
		this.prevFocus = null;
		this.saveFile = null;
		this.index = 0;
		this.controlInput = controlInput;
		this.timer = null;
		this.delay = 900/4;//milliseconds
	}

	getOptions(resolve) {
		const saveFile = this.progress.getSaveFile();
		let msg = (!saveFile) ? "No previous game data found." : "Continuing game not allowed.";
		return [
			/* Start new game */
			{
				label: "New Game",
				description: "Start a new adventure.",
				disabled: false,
				handler: () => {
					this.close();
					resolve();
				}
			},
			/* Continue: Use a ternary to find a save file or not */
			{
				label: "Continue",
				description: "Resume your adventure.",
				disabled: true,
				disabledMessage: msg,
				handler: () => {
					this.close();
					resolve(saveFile);
				}
			},
			/* Settings */
			{
				label: "Controls",
				description: "View game controls.",
				disabled: true,
				disabledMessage: "Viewing game controls is disabled.",
				handler: () => {
					// Create something to help with game settings
				},
			},
			/* Quit the game by closing browser tab/window */
			// {
			// 	label: "Quit",
			// 	description: "Quit the game.",
			// 	disabled: true,
			// 	handler: () => {
			// 		this.gameQuit = true;
			// 		this.close();
			// 	}
			// },
		].filter(v => v); /* This line removes nulls from array */
		/* Must read about filter() method. */
	}

	close() {
		this.element.classList.add("fade-out");
		this.element.addEventListener("animationend", () => {
			this.element.remove();
		});
		// this.keyboardMenu.end();
		if (this.gameQuit) {
			window.close();
		}
	}

	init() {
		return new Promise(resolve => {

			/* Create the element */
			this.element = document.createElement("div");
			this.element.classList.add("title-screen");
			this.element.classList.add("fade-in");

			/* Add game logo */
			this.element.innerHTML = (this.gameLogoPath) ? (`<img src=${this.gameLogoPath} alt=${this.gameTitle} />`) : this.gameTitle;

			/* Create the menu and make it functional */

			let buttonContainer = document.createElement("div");
			buttonContainer.classList.add("button-container");
			this.element.appendChild(buttonContainer);

			let descriptor = document.createElement("div");
			descriptor.classList.add("descriptor");
			this.element.appendChild(descriptor);
			descriptor.innerHTML = "<p>Select an option.</p>";
			this.description = descriptor.querySelector("p");

			this.getOptions(resolve).forEach(option => {
				let button = document.createElement("button");
				button.classList.add("fade-in");
				buttonContainer.appendChild(button);
				button.innerHTML = option.label;
				button.disabled = option.disabled;
				button.addEventListener("mouseleave",() => {
					this.prevFocus = null;
					this.description.innerHTML = "Select an option.";
				});
				button.addEventListener("mouseenter", () => {
					this.prevFocus = button;
					this.description.innerHTML = option.description;
					if (option.disabled && option.disabledMessage) {
						this.description.innerHTML = option.disabledMessage;
					}
				});
				button.addEventListener("click",option.handler);
			});

			this.element.addEventListener("mousemove", () => {
				if (this.prevFocus) {
					this.prevFocus.classList.remove("selected");
					this.prevFocus = null;
				}
			});

			document.addEventListener("keydown", e => {
				if (this.timer) {return;}
				switch (this.controlInput.direction)
				{
					case "right":
					case "down": {
						if (!this.prevFocus) {
							this.prevFocus = buttonContainer.querySelectorAll("button")[0];
						} else {
							this.prevFocus.classList.remove("selected");
							this.index++;
							if (this.index >= buttonContainer.querySelectorAll("button").length) {
								this.index = 0;
							}
							this.prevFocus.classList.remove("selected");
							this.prevFocus = buttonContainer.querySelectorAll("button")[this.index];
						}
						this.prevFocus.classList.add("selected");
						this.timer = setTimeout(() => {this.timer = null;},this.delay);
						break;
					}
					case "left":
					case "up": {
						if (!this.prevFocus) {
							this.prevFocus = buttonContainer.querySelectorAll("button")[0];
						} else {
							this.prevFocus.classList.remove("selected");
							this.index--;
							if (this.index < 0) {
								this.index = buttonContainer.querySelectorAll("button").length - 1;
							}
							this.prevFocus.classList.remove("selected");
							this.prevFocus = buttonContainer.querySelectorAll("button")[this.index];
						}
						this.prevFocus.classList.add("selected");
						this.timer = setTimeout(() => {this.timer = null;},this.delay);
						break;
					}
				}
				const option = this.getOptions(resolve)[this.index];
				this.description.innerHTML = option.description;
				if (option.disabled && option.disabledMessage) {
					this.description.innerHTML = option.disabledMessage;
				}
			});

			/* Append the element */
			gameContainer.appendChild(this.element);
		});
	}
}