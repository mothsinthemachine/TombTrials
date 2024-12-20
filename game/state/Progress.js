class Progress {
	constructor() {
		this.startPlayerX = 0;
		this.startPlayerY = 0;
		this.startPlayerDirection = "down";
		// this.storyFlags = {};
		this.objectStates = {};
		this.saveFileKey = "TombTrials_SaveFile0";
	}

	/* Add an object to storage */
	// storeObjectState(obj) {
	// 	this.objectStates[obj.id] = {
	// 		id: obj.id,
	// 		initialX: obj.x,
	// 		initialY: obj.y,
	// 		initialDirection: obj.direction,
	// 	};
	// }

	canSave() { 
		return false;
		//return !!window.localStorage; /* added by Roh */
	} 

	save() {
		/* If localStorage is not available */
		if (!window.localStorage) {return;}

		const composedCopy = {
			mapId: this.mapId,
			startPlayerX: this.startPlayerX,
			startPlayerY: this.startPlayerY,
			startPlayerDirection: this.startPlayerDirection,
			startStoryFlags: {}
		};

		// Object.assign(composedCopy.startStoryFlags, this.storyFlags)

		window.localStorage.setItem(this.saveFileKey, JSON.stringify(composedCopy));
		return true;
	}

	getSaveFile() {
		const file = window.localStorage?.getItem(this.saveFileKey);
		return file ? JSON.parse(file) : null;
	}

	load() {
		const file = this.getSaveFile();
		if (file) {
			this.mapId = file.mapId;
			this.startPlayerX = file.startPlayerX;
			this.startPlayerY = file.startPlayerY;
			this.startPlayerDirection = file.startPlayerDirection;
			// Object.keys(file.playerState).forEach(key => {
			// 	playerState[key] = file.playerState[key];
			// });
			// Object.keys(file.playerState.storyFlags).forEach(flag => {
			// 	playerState.storyFlags[flag] = file.playerState.storyFlags[flag];
			// });
			return true;
		} else {
			console.log("Cannot load the save file!");
			return false;
		}
	}
}
