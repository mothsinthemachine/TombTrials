class KeyboardMenu {
	constructor(config={}) {
		this.options = []; /* set by updater method */
		this.up = null;
		this.down = null;
		this.prevFocus = null;
		this.descriptionContainer = config.descriptionContainer || null;
	}

	/* Set options for the Keyboard Menu */
	setOptions(options) {
		this.options = options;
		/* Set innerHTML of the element, including any disabled messages */
		this.element.innerHTML = this.options.map((option,index) => {
			const disabled = option.disabled || (option.check && !option.check());
			const disabledAttr = disabled ? `disabled${option.disabledmsg ? ' data-disabledmsg="' + option.disabledmsg + '"' : ''}` : '';
			return (`
				<div class="option">
					<button ${disabledAttr} data-button="${index}" data-description="${option.description}">
						${/*(option.index || option.index === 0) ? option.index+". " :*/ ""}${option.label}
					</button>
					<span class="right">${option.right ? option.right() : ""}</span>
				</div>
			`);
		}).join("");
		/* Add event listeners */
		this.element.querySelectorAll("button").forEach(button => {
			/* Mouse click */
			button.addEventListener("click", () => {
				const chosenOption = this.options[Number(button.dataset.button)];
				chosenOption.handler();
			});
			/* Mouse hovers over option */
			button.addEventListener("mouseenter", () => {
				this.prevFocus = button;
				this.descriptionElementText.innerText = button.dataset.description;
				if (button.disabled && button.dataset.disabledmsg) {
					this.descriptionElementText.innerHTML += (
						'<br /><span class="warning">' + button.dataset.disabledmsg + '</span>'
					);
				}
			});
			/* Mouse is not hovering over option */
			button.addEventListener("mouseleave", () => {
				this.prevFocus = null;
				this.descriptionElementText.innerText = "Select an option.";
			});
		});

		setTimeout(() => {
			this.element.querySelector("button[data-button]:not([disabled])").focus();
		}, 10);
	}

	createElement() {
		this.element = document.createElement("div");
		this.element.classList.add("KeyboardMenu");

		/* Description box element */
		this.descriptionElement = document.createElement("div");
		this.descriptionElement.classList.add("DescriptionBox");
		this.descriptionElement.innerHTML = (`<p>Select an option.</p>`);
		this.descriptionElementText = this.descriptionElement.querySelector("p");
	}

	end() {
		/* Remove menu element and description element */
		this.element.remove();
		this.descriptionElement.remove();

		/* Clean up bindings */
		this.up.unbind();
		this.down.unbind();
	}

	init(container) {
		this.createElement();

		/* Append Description to a container */

		/* Tutorial uses this, which is OK but might obscure what this is meant for */
		//(this.descriptionContainer || container).appendChild(this.descriptionElement)

		/* Here's a clearer version of that code */
		if (this.descriptionContainer) {
			this.descriptionContainer.appendChild(this.descriptionElement);
		} else {
			container.appendChild(this.descriptionElement);
		}
		
		container.appendChild(this.element);

		this.up = new KeyPressListener("ArrowUp", () => {
			const current = Number(this.prevFocus.getAttribute("data-button"));
			const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => {
				return el.dataset.button < current && !el.disabled;
			});
			prevButton?.focus();
		});
		
		this.down = new KeyPressListener("ArrowDown", () => {
			const current = Number(this.prevFocus.getAttribute("data-button"));
			const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => {
				return el.dataset.button > current && !el.disabled;
			});
			nextButton?.focus();
		});
	}
}