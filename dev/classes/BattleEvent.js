class BattleAction {
	constructor(config) {
		this.initiator = config.initiator || null;
		this.target = config.target || null;
		this.elementType = config.elementType || null;
		this.statusEffect = config.statusEffect || null;
		this.baseDamage = 0; /* (+) damage reduces HP, (-) damage increases HP */
		this.animation = config.animation || null;
	}
}