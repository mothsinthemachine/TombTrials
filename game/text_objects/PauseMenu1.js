/* Retain this for reference later. */

class PauseMenu {
	constructor({progress, onComplete},map) {
		this.progress = progress;
		this.onComplete = onComplete;
		this.map = map;
		this.optKey = [];

		this.options = [
			"Save",
			"Reset",
			// "Music Volume",
			// "Text Volume",
			// "Sound Effects Volume",
			"Close"
		];
	}

	callOption(optionName) {
		switch (optionName) {
			case "Close": /* Close the menu, save as Escape key */
				this.close();
				break;
			case "Save": /* Save the game */
				this.progress.save();
				this.close();
				break;
			case "Reset": /* Reset the current map */
				// do nothing...
				console.log("Resetting the map...");
				this.close();
				this.map.startCutscene([
					{ type: "changeMap", map: this.map.id }
				]);
				break;
			// more options here?
		}
	}

	// getOptions(pageKey) {
	// 	if (pageKey === "root") {

	// 		/********************************** */
	// 		/* Deviating from the tutorial here */
	// 		/********************************** */

	// 		return [
	// 			{
	// 				label: "Save",
	// 				description: "Save your progress.",
	// 				disabledmsg: "Local Storage is disabled on this browser!",
	// 				check: () => this.progress.canSave(),
	// 				handler: () => {
	// 					this.progress.save();
	// 					this.close();
	// 				}
	// 			},
	// 			{
	// 				label: "Close",
	// 				description: "Close the pause menu.",
	// 				handler: () => {
	// 					this.close();
	// 				}
	// 			}
	// 		];
	// 	}
	// }

	createElement() {
		this.element = document.createElement("div");
		this.element.classList.add("PauseMenu");
		this.element.innerHTML = "<h2>Paused</h2>";
	}

	close() {
		this.esc?.unbind();
		for (let i = 0; i < this.options.length; i++) {
			this.optKey[i]?.unbind();
		}
		// this.opt0?.unbind();
		// this.opt1?.unbind();
		// this.opt2?.unbind();
		// this.keyboardMenu.end();
		this.bg.remove();
		this.element.remove();
		this.menu.remove();
		this.desc.remove();
		this.onComplete();
	}

	async init(container) {
		// this.createElement();
		// this.keyboardMenu = new KeyboardMenu({
		// 	descriptionContainer: container
		// });
		// this.keyboardMenu.init(this.element);
		// this.keyboardMenu.setOptions(this.getOptions("root"));

		this.bg = document.createElement("div");
		this.bg.classList.add("MenuBackground");

		this.element = document.createElement("div");
		this.element.classList.add("PauseMenu");
		this.element.innerHTML = "Paused";

		this.menu = document.createElement("div");
		this.menu.classList.add("PauseMenuOptions");
		let optionList = "";
		for (let i = 0; i < this.options.length; i++) {
			let n = i+1;
			if (i === this.options.length-1) {
				n = 0;
			}
			optionList += "<p>" + n + ". " + this.options[i] + "</p>";
			// if (i < this.options.length-1) optionList += "<br>";
		}
		this.menu.innerHTML = optionList;

		this.desc = document.createElement("div");
		this.desc.classList.add("DescriptionBox");
		this.desc.innerHTML = (`
			<p>Use Keys 1-9 and 0 to select an option.</p>
			<p>Press [Escape] to resume adventure.</p>
		`);

		container.appendChild(this.bg);
		container.appendChild(this.element);
		container.appendChild(this.menu);
		container.appendChild(this.desc);

		utils.wait(200);
		this.esc = new KeyPressListener("Escape", () => {
			this.close();
		});

		for (let i = 1; i < this.options.length; i++) {
			this.optKey[i] = new KeyPressListener("Digit"+i.toString(), () => {
				this.callOption(this.options[i-1]);
			});
		}

		/* Set the last option to be '0' */
		this.optKey[0] = new KeyPressListener("Digit0", () => {
			this.callOption(this.options[this.options.length-1]);
		});
	}
}