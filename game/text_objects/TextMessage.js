class TextMessage {
	constructor({text, onComplete}) {
		this.text = text;
		this.onComplete = onComplete;
		this.element = null;
	}

	createElement() {
		this.element = document.createElement("div");
		this.element.classList.add("TextMessage");

		/* Default the TextMessage to contain no characters */
		this.element.innerHTML = (`
			<p class="TextMessage_p"></p>
			<button class="TextMessage_button">&#9660;</button>
		`);

		/* Init typewriter effect */
		this.revealingText = new RevealingText({
			element: this.element.querySelector(".TextMessage_p"),
			text: this.text
		});

		/* Add a continue button */
		this.element.querySelector("button").addEventListener("click", () => {
			/* Close the message */
			this.done();
		});

		/* Listen for Spacebar event to close TextMessage */
		const interactionKeys = ["Space","Enter","KeyZ"];
		interactionKeys.forEach(key => {
			this.actionListener = new KeyPressListener(key, () => {
				this.done();
			});
		});
	}

	done() {
		if (this.revealingText.done) {
			this.element.remove();
			this.actionListener.unbind();
			this.onComplete();
		} else {
			this.revealingText.warpToDone();
		}
		
	}

	init(container) {
		this.createElement();
		container.appendChild(this.element);
		this.revealingText.init();
	}
}