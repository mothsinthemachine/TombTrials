class MenuObject {
/*	The Menu to rule them all!
Written by JS (foxykissus)

The purpose of this class is to rework the KeyboardMenu class since it is a bit 
janky. My idea is to create this parent class for both the Title menu and the 
Pause menu objects.

Features I want to enable with this class:
- Navigate the menu with ArrowUp/KeyW or ArrowDown/KeyS
- Also hover over options using the mouse
- Select an option with Spacebar or Left Mouse Click

Some operations to consider:
- If the Player goes up through the list, it should go to the last option in the
  list if the player presses Up on the first item in the list.
- If the Player goes down through the list, it shoudl go to the first option in
  the list if the player presses Down on the last item in the list.

*/
	constructor(_config={}) {
		this.type = _config.type || "pause"; /* default to simple pause menu */

		this.options 	= []; 		/* set with updater method */
		this.optionUp 	= null;		/* go to upper option */
		this.optionsDown = null;	/* go to lower option */
		this.inFocus 	= null;		/* option currently in focus */
		this.prevFocus 	= null;		/* option previously in focus */

		this.descriptionContainer = _config.descriptionContainer || null;
	}

	/* set options for the Menu */
	setOptions(_options) {
		this.options = _options;
		// more code to go here...
	}

	/* create an element for the options */
	createElement() {
		/* create an element to hold the different options */
		this.element = document.createElement("div");
		this.element.classList.add("PauseMenu");

		/* create an element to display each option's description */
		// this.descriptionElement = document.createElement("div");
		// this.descriptionElement.classList.add("DescriptionBox");
		// this.descriptionElement.innerHTML = (`<p></p>`); /* empty description at first */
		// this.descriptionElementText = this.descriptionElement.querySelector("p");
	}

	/* remove menu element and description element */
	end() {
		this.element.remove();
		this.descriptionElement.remove();

		/* remove bindings */
		if (this.type === "pause") {return;}

		this.optionUp.unbind();
		this.optionDown.unbind();
	}

	/* initialize the menu object */
	init(_container) {
		this.createElement(); /* create the element first */

		/* Append Description to a container */
		/* Tutorial uses this, which is OK but might obscure what this is meant for */
		//(this.descriptionContainer || container).appendChild(this.descriptionElement)
		/* Here's a clearer version of that previous code */
		// if (this.descriptionContainer) {
		// 	this.descriptionContainer.appendChild(this.descriptionElement);
		// } else {
		// 	_container.appendChild(this.descriptionElement);
		// }

		_container.appendChild(this.element); /* append the menu element */

		/* add event listeners if there are options to navigate */

		if (this.type === "pause") {return;}

		this.up = new KeyPressListener("ArrowUp", () => {
			const current = Number(this.prevFocus.getAttribute("data-button"));
			const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
				return el.dataset.button < current && !el.disabled;
			});
			prevButton?.focus(); // what does the '?' do?
		});

		this.down = new KeyPressListener("ArrowDown", () => {
			const current = Number(this.prevFocus.getAttribute("data-button"));
			const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
				return el.dataset.button > current && !el.disabled;
			});
			nextButton?.focus(); // what does the '?' do?
		});
	}
}