class PauseMenu {
	constructor({progress, onComplete},map) {
		this.progress = progress;
		this.onComplete = onComplete;
		this.map = map;
	}

	getOptions(pageKey) {
		if (pageKey === "root") {
			return [
				{
					label: "Close",
					description: "Close the pause menu.",
					handler: () => {
						this.close();
					}
				},
				{
					label: "Save",
					description: "Save your progress.",
					disabledmsg: "Local Storage is disabled on this browser!",
					check: () => this.progress.canSave(),
					handler: () => {
						this.progress.save();
						this.close();
					}
				},
				{
					label: "Reset room",
					description: "Reset the room to start the puzzle over.",
					//check: () => this.progress.canReset(),
					handler: () => {
						this.map.startCutscene([
							{
								type: "resetMap", 
								map: this.map.id,
								x: this.progress.startPlayerX,
								y: this.progress.startPlayerY,
								direction: this.progress.startPlayerDirection
							}
						]);
						this.close();
					}
				}
			];
		}
	}

	createElement() {
		this.element = document.createElement("div");
		this.element.classList.add("PauseMenu");
		this.element.innerHTML = (`<h2>Paused</h2>`);
	}

	close() {
		this.esc?.unbind();
		this.keyboardMenu.end();
		this.bg.remove();
		this.element.remove();
		this.onComplete();
	}

	async init(container) {
		/* Create a screen cast over game */
		this.bg = document.createElement("div");
		this.bg.classList.add("MenuBackground");
		container.appendChild(this.bg);

		/* Create the menu */
		this.createElement();
		this.keyboardMenu = new KeyboardMenu({
			descriptionContainer: container
		});
		this.keyboardMenu.init(this.element);
		this.keyboardMenu.setOptions(this.getOptions("root"));
		container.appendChild(this.element);

		utils.wait(200);
		this.esc = new KeyPressListener("Escape", () => {
			this.close();
		});
	}
}