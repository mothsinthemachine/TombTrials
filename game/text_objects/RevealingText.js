class RevealingText {
	constructor(config) {
		this.element = config.element;
		this.text = config.text;
		this.speed = config.speed || 50;

		this.timeout = null;
		this.done = false;
	}

	revealOneCharacter(list) {
		const next = list.splice(0,1)[0]; /* Splice away a character from the list */
		next.span.classList.add("revealed");

		if (list.length > 0) {
			this.timeout = setTimeout( () => {
				/* Modified list gets passed in again until len=0 */
				this.revealOneCharacter(list); 
			}, next.delayAfter);
		} else {
			this.done = true;
		}
	}

	/* Not implemented yet... */
	warpToDone() {
		clearTimeout(this.timeout);
		this.done = true;
		this.element.querySelectorAll("span").forEach(s => {
			s.classList.add("revealed");
		});
	}

	init() {
		let characters = [];
		this.text.split("").forEach(ch => {
			/* Create a span for each character in text, add to DOM */
			let span = document.createElement("span");
			span.textContent = ch;
			this.element.appendChild(span);

			/* Add this span to our internal state Array (?) */
			characters.push({
				span,
				delayAfter: (ch === " ") ? 0 : this.speed,
			});
		});

		this.revealOneCharacter(characters);
	}
}