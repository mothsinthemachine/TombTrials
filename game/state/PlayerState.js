class PlayerState {
	constructor() {
		this.money = 0;
		this.storyFlags = {};
		this.partyMembers = ["player","player2"];
	}

	addStoryFlag(event) {
		this.storyFlags[event.flag] = event.value;
	}
}
window.playerState = new PlayerState();