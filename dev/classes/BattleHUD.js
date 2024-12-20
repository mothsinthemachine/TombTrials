class BattleHUD {
	constructor(config) {
		this.battle = config.battle;
		this.display = null;
		this.info = null;
		this.infoMessage = "Fight time!";
	}

	createElement(className,type="div") {
		const newElement = document.createElement(type);
		newElement.classList.add(className);
		return newElement;
	}

	removeElements() {
		if (this.display) {this.display.remove();}
		if (this.info) {this.info.remove();}
	}

	setInfo(message="Info goes here.") {
		this.info.innerHTML = (`<p>${message}</p>`);
	}

	designHud() {
		let ally = this.battle.battlers["player"];
		const hpScale = (ally.hp / ally.maxHp);
		const mpScale = (ally.mp / ally.maxMp);
		const waitScale = (ally.wait / 100) ;
		let col = (hpScale > 0.5) ? "#222" : (hpScale > 0.25) ? "orange" : "red";
		let r = 255 * (1 - hpScale);
		let g = 255 * hpScale;
		let b = 0;
		this.display.innerHTML = (`
			<div class="hud-row">
				<div class="arrow">&gt;</div>
				<div class="name">${ally.name}</div>
				<div class="health">
					<p><span style="color:${col};">${ally.hp}</span>/${ally.maxHp}</p>
					<div class="hp-bar">
						<div style="
							z-index:1;
							position: relative;
							top:-4px;
							height:5px;
							width:${Math.round(hpScale*100)}%;
							background-color:rgb(${r},${g},${b});
						"></div>
					</div>
				</div>
				<div class="mana">
					<p><span>${ally.mp}</span>/${ally.maxMp}</p>
					<div class="mp-bar">
						<div style="
							z-index:1;
							position:relative;
							top:-4px;
							height:5px;
							width:${Math.round(mpScale*100)}%;
							background-color:rgb(0,0,255);
						"></div>
					</div>
				</div>
				<div class="time">
					<p>${(ally.wait === 0) ? "Ready!" : "..." }</p>
					<div class="time-bar">
						<div style="
							z-index:1;
							position:relative;
							top:-4px;
							height:5px;
							width:${100 - Math.round(waitScale*100)}%;
							background-color:rgb(255,255,0);
						"></div>
					</div>
			</div>
			
		`);
		// if (this.battle.actorsInBattle.length > 1) {
		// 	this.display.innerHTML += (`
		// 		<div class="hud-row">
		// 			<span class="name">${this.battle.battlers["player2"].name}</span>
		// 			<span class="health">1/1</span>
		// 			<span class="mana">1/1</span>
		// 			<span class="time">1/1</span>
		// 		</div>
		// 	`);
		// } 
	}

	init() {
		this.info = this.createElement("battle-info");
		document.querySelector(".game-container").appendChild(this.info);

		this.display = this.createElement("battle-hud");
		this.designHud();
		document.querySelector(".game-container").appendChild(this.display);
	}
}