const utils = {

	/* Convert grid coordinates to pixel coordss */
	grid(n) {
		return (n * 16);
	},

	/* Return grid coordinates as pixel coordinates */
	coords(x,y) {
		return `${x * 16},${y * 16}`;
	},

	/* Return pixel coordinates as grid coordinates */
	tile(u,v) {
		return `${u/16},${v/16}`;
	},

	/* check next position in direction */
	nextPosition(initialX, initialY, direction) {
		/* Get initial position and set size */
		let x = initialX;
		let y = initialY;
		const size = 16;

		switch (direction) {
			case "left" : x -= size; break;
			case "right": x += size; break;
			case "up"   : y -= size; break;
			case "down" : y += size; 
		}
		return {x,y};
	},

	/* Make NPCs face opposite direction of player */
	oppositeDirection(direction) {
		switch (direction) {
			case "left" : return "right"; break;
			case "right": return "left" ; break;
			case "down" : return "up"   ; break;
			default: return "down";
		}
	},

	/* Wait for a specified number of millisecs */
	wait(ms) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	},

	/* Emit an event once it completes */
	/* Custom events: 
		ActorStandComplete,
		ActorWalkingComplete,
	*/
	emitEvent(name, detail) {
		const event = new CustomEvent(name,{detail});
		document.dispatchEvent(event);
	},

	/* Print messages to console (debugging) */
	print(text,type="log") {
		switch (type) {
			case "warn":
				console.warn(text);
				break;
			default:
				console.log(text);
		}
	},

	/* DEBUGGING: Display story flags */
	displayStoryFlag(flag) {
		const state = window.playerState;
		const str = flag + " := " + state.storyFlags[flag];
		console.log(str)
	},

	displayAllStoryFlags() {
		const state = window.playerState;
		let str = "All flags:\n";
		for (const flag in state.storyFlags) {
			str += flag + " := " + state.storyFlags[flag];
			str += "\n";
		}
		console.log(str.trimEnd());
	},
}