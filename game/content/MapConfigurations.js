const defaultSwitchMessage = "This switch cannot be moved now.";

/* LOCAL FUNCTIONS */ {
function setPlayer(startX=null, startY=null, startDirection=null) {
	const obj = {
		type: "Actor",
		name: "Heroic",
		src: "./game/images/actors/Heroic.png",
		playerControlled: true,
		useShadow: true,
		talking: [{
			events: [{
				type: "textMessage",
				facePlayer: "player",
				text: "Let's go.\n(Press F to switch.)",
			}],
		}],
	}

	if (startX && startY) {
		obj.x = utils.grid(startX);
		obj.y = utils.grid(startY);
	}

	if (startDirection) {
		obj.direction = startDirection;
	}
	return obj;
}

function setPlayer2(sX,sY,sDir) {
	return {
		type: "Actor",
		name: "Daggerman",
		src: "./game/images/actors/Daggerman.png",
		playerControlled: false,
		useShadow: true,
		talking: [{
			events: [{
				type: "textMessage",
				facePlayer: "player2",
				text: "Keep moving.\n(Press F to switch.)",
			}],
		}],
		x: utils.grid(sX),
		y: utils.grid(sY),
		direction: sDir
	}
}
function setDoor(sX,sY,flag,opened=false,T=[]) {
	return {
		type: "Door",
		x: utils.grid(sX),
		y: utils.grid(sY),
		storyFlag: flag,
		passable: opened,
		talking: T
	};
}

function setBlock(sX,sY,_pushable=false,_target=null,E=[]) {
	return {
		type: "MovingBlock",
		x: utils.grid(sX),
		y: utils.grid(sY),
		pushable: _pushable,
		target: _target,
		eventsOnTarget: E
	}
}

function setTransferPlace(whoDis,newX,newY,dir=null) {
	return {
		type: "transfer",
		who: whoDis,
		x: utils.grid(newX),
		y: utils.grid(newY),
		direction: dir
	}
}

function setChangeMapPlace(mapId,newX,newY,dir="down") {
	return {
		type: "changeMap",
		map: mapId,
		x: utils.grid(newX),
		y: utils.grid(newY),
		direction: dir
	}
}

function setFloorSwitch(sX,sY,flag,_events=[]) {
	return {
		type: "FloorSwitch",
		x: utils.grid(sX),
		y: utils.grid(sY),
		storyFlag: flag,
		event: _events
	}
}

function setWallSwitch(sX,sY,flag,T=[]) {
	return {
		type: "WallSwitch",
		x: utils.grid(sX),
		y: utils.grid(sY),
		storyFlag: flag,
		talking: T,
	};
}

function setTreasureBox(sX,sY,flag,baseMoney=1,pCharSliceSize=1){
	return {
		type: "TreasureBox",
		x: utils.grid(sX),
		y: utils.grid(sY),
		storyFlag: flag,
		money: baseMoney,
		charSliceSize: pCharSliceSize
	}
}}

/**************** */
/* OVERWORLD MAPS */
/**************** */

window.OverworldMaps = {

	OutsideTomb: {
		id: "OutsideTomb",
		index: 0,
		lowerSrc: "./game/images/maps/map01-OutsideTomb-lower.png",
		mapLayout: [
			"         x                                                x ",
			"         x                                                x ",
			"          x                                              x  ",
			"          x                                              x  ",
			"           x                                            x   ",
			"           x          x     x                           x   ",
			"            x       xx xxxxx x                         x    ",
			"            x    xxx         xx             xxx        x    ",
			"             x  x              xx          x   x      x     ",
			"    x  x    xx x                 xxxxx    x     xx    x     ",
			"   x x     x  x                       xxxx        xxxx      ",
			"  x   x    x  xx                                     x      ",
			"  x   x   xx   x          xxx                       xx      ",
			"  x   x x x    xxx     xxx x x                x  xxxx       ",
			"  x   x   x  x  x x  xx   x x xxxx          xx xx   x       ",
			"  x   x  x      xx xx  xxx   x    xxxx  xxxx  x  xxx        ",
			"   x x   x        x  xx       xxxx    xx    xx xx x  x      ",
			"    x    x         xx   x         xxxx  xxxx      x         ",
			"         x                      x     xx          x         ",
			"         x                       x         x   x  x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         x                                        x         ",
			"         xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx         "
		],
		cutscenePlaces: {
			[utils.coords(27,14)]: [{ /* Goto Cave */
				events: [setChangeMapPlace("Cave",17,18,"up")]
			}],
			[utils.coords(10,16)] : [{
				events: [
					{ type: "textMessage", text: "Why am I walking this way? I'm so close to the cave." },
					{ type: "walk", who: "player", direction: "right" },
				]
			}],
			[utils.coords(10,17)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,18)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,19)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,20)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,21)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,22)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,23)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,24)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,25)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,26)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,27)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,28)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(10,29)] : { duplicate: [utils.coords(10,16)] },
			[utils.coords(49,17)] : [{
				events: [
					{ type: "textMessage", text: "Why am I walking this way? I'm so close to the cave." },
					{ type: "walk", who: "player", direction: "left" },
				]
			}],
			[utils.coords(49,18)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,19)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,20)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,21)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,22)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,23)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,24)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,25)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,26)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,27)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,28)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(49,29)] : { duplicate: [utils.coords(49,17)] },
			[utils.coords(11,30)] : [{
				events: [
					{ type: "textMessage", text: "Why am I walking this way? I'm so close to the cave." },
					{ type: "walk", who: "player", direction: "up" },
				]
			}],
			[utils.coords(12,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(13,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(14,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(15,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(16,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(17,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(18,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(19,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(20,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(21,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(22,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(23,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(24,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(25,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(26,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(27,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(28,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(29,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(30,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(31,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(32,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(33,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(34,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(35,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(36,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(37,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(38,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(39,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(40,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(41,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(42,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(43,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(44,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(45,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(46,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(47,30)] : { duplicate: [utils.coords(11,30)] },
			[utils.coords(48,30)] : { duplicate: [utils.coords(11,30)] },
		},
		configObjects: {
			player: setPlayer(27,29,"up"),
		}
	},

	Cave: {
		id: "Cave",
		index: 1,
		lowerSrc: "./game/images/maps/map02-Cave-lower.png",
		mapLayout: [
			"                    ",
			" x x xxxxx  xxxx    ",
			"x x x     xx    xx  ",
			"x       x         x ",
			" x         xxxx    x",
			"  xxxxxx  x    xx   ",
			"x  x    xx       x x",
			" xx xx      xxx  x x",
			"      x    x   x x x",
			"xxx    xxxx     xx x",
			"  x   x     xxx  x  ",
			"  x      x x   x   x",
			" x   xxxx x     xxx ",
			"x  xx       x       ",
			"x  x   x   x xxx    ",
			"x  x  x xxx     xx  ",
			" x  xx      x     x ",
			" x   x     x xx    x",
			"  x     xxx    xx x ",
			"   xxxxx        x x "
		],
		startingEvents: [
			{ type: "addStoryFlag", flag: "MAP02_CUTSCENE_A_DONE" }
		],
		cutscenePlaces: {
			[utils.coords(17,19)]: [{ /* goto OutsideTomb */
				events: [ setChangeMapPlace("OutsideTomb",27,15,"down") ]
			}],
			[utils.coords(3,2)]: [{ /* goto Tomb Entrance */
				events: [ setChangeMapPlace("TombEntrance",5,11,"up") ]
			}],
			[utils.coords(3,7)]: [
				{
					required: ["MAP02_CUTSCENE_A_DONE"],
					events: []
				},{ /* way is blocked off */
					events: [
						{ type: "textMessage", text: "This way is blocked off." },
						{ type: "stand", who: "player", direction: "down", time: 100 },
						{ type: "textMessage", text: "I'll need to go around through the cave." },
						{ type: "setStoryFlag", flag: "MAP02_CUTSCENE_A_DONE", value: true }
					]
				}
			]
		},
		configObjects: {
			player: setPlayer(),
			treasureBoxA: setTreasureBox(0,7,"MAP02_TREASUREBOX_A_OPENED",1000),
		},
	},

	TombEntrance: {
		id: "TombEntrance",
		lowerSrc: "./game/images/maps/map03-TombEntrance-lower.png",
		mapLayout: [
			"                          ",
			"   x   x                  ",
			"xxx xxx xxx               ",
			"x         x               ",
			"x         x               ",
			"x x     x x          x    ",
			"x x     x x       xxx xxxx",
			"x x     x x       x    y x",
			"x         x       x   yy x",
			"x         x       x   y  x",
			"x         x       x   yy x",
			"xxxxx xxxxx       x    y x",
			"    x x           xxxxxxxx"
		],
		cutscenePlaces: {
			[utils.coords(5,12)]: [{ /* goto Cave */
				events: [ setChangeMapPlace("Cave",3,3,"down") ]
			}],
			[utils.coords(3,2)]: [{ /* goto Room A */
				events: [ setChangeMapPlace("TombRoomA",6,21,"up") ]
			}],
			[utils.coords(7,2)]: [{ /* transfer to basement */
				events: [ setTransferPlace("player",21,7,"down") ]
			}],
			[utils.coords(21,6)]: [{ /* transfer to entrance */
				events: [ setTransferPlace("player",7,3,"down") ]
			}]
		},
		configObjects: {
			player: setPlayer(),
			wallSwitchA: setWallSwitch(5,2,"MAP03_DOOR_B_OPENED",[
				{
					events: [
						{ type: "addStoryFlag", flag: "MAP03_DOOR_B_OPENED", value: true },
						{ type: "textMessage", text: "The switch activated an ancient mechanism, opening the door." }
					]
				},{
					required: ["MAP03_DOOR_B_OPENED"],
					events: [
						{ type: "textMessage", text: "The switch is stuck firmly in place." }
					]
				}
			]),
			floorSwitchA: setFloorSwitch(24,9,"MAP03_FLOORSWITCH_A_PRESSED", [
				{ type: "stand", who: "player", direction: "right", time:  800 },
				{ type: "textMessage", text: "A door opened somewhere..." },
				{ type: "addStoryFlag", flag: "MAP03_DOOR_A_OPENED", value: true },
				{ type: "setStoryFlag", flag: "MAP03_DOOR_C_OPENED", value: false }
			]),
			doorA: setDoor(3,2,"MAP03_DOOR_A_OPENED"),
			doorB: setDoor(7,2,"MAP03_DOOR_B_OPENED"),
			doorC: setDoor(5,12,"MAP03_DOOR_C_OPENED",true,[
				{
					events: [
						{ type: "textMessage", text: "There is no leaving this way now." }
					]
				},{
					required: ["MAP03_DOOR_C_OPENED"],
					events: []
				}
			]),
			staticBlockA: setBlock(24,7),
			staticBlockB: setBlock(24,8),
			staticBlockC: setBlock(24,10),
			staticBlockD: setBlock(24,11),
			movingBlockA: setBlock(23,9,true,"floorSwitchA")
		}
	},

	TombRoomA: {
		id: "TombRoomA",
		index: 4,
		lowerSrc: "./game/images/maps/map04-TombRoomA-lower.png",
		upperSrc: "./game/images/maps/map04-TombRoomA-upper.png",
		mapLayout: [
			"                                    ",
			"                       x       x    ",
			"                     xx xx   xx xx  ",
			"                    x     x x     x ",
			" xxxxx xxxxx        x     x x     x ",
			"xyyyyyxyyyyyx  xxx  x     x x     x ",
			"xy   yxy   yxxxyyyx  x xxx   xxx x  ",
			"xy         yyyyyyyx  x x       x x  ",
			"xy   yxy   yxxxyyyx  x x       x x  ",
			"xyyyyyxyyyyyx xy yx  x x       x x  ",
			" xxyxx xxyxx   x yx xx xxxxxxxxx xx ",
			"  x x   x x    x yxx               x",
			" xx xx xx xx   x yxx               x",
			"x     x     x x  yxx  xxxxxxxxxxxxx ",
			"x     x     x  x yxx  xxxxxxxxxxxxx ",
			"x           x xy yxx yyyyyyyyyyyyyyx",
			"x x       x x xy yxxyyyxyy       yyx",
			"x x       x x xy yxxyyyyyyyyyyyyyyyx",
			"x x       x x xy       yy yyyyyxyyyx",
			"x x       x x xy yxxyy yy         yx",
			"x           x xyyyxxyy yy yyyyyyy yx",
			" xxxxx xxxxx   xxx xyy    yy      yx",
			"     x x           xyy  y yyy     yx",
			"      x            xyyyyxyyyyyyyyyxx",
			"                    xxxx xxxxxxxxxx "
		],
		cutscenePlaces: {
			[utils.coords(6,22)] : [{ /* goto Tomb Entrance */
				events: [ setChangeMapPlace("TombEntrance",3,3,"down") ]
			}],
			[utils.coords(3,13)]: [{ /* Advance players through doors */
				required: ["MAP04_FLOORSWITCH_A_PRESSED","MAP04_FLOORSWITCH_B_PRESSED"],
				events:[
					{ type: "addStoryFlag", flag: "MAP04_DOOR_A_OPENED", value: true },
					{ type: "addStoryFlag", flag: "MAP04_DOOR_B_OPENED", value: true },
					{ type: "walk", who: "player", direction: "up", noAwait: true },
					{ type: "walk", who: "player2", direction: "up" },
					{ type: "walk", who: "player", direction: "up", noAwait: true },
					{ type: "walk", who: "player2", direction: "up" },
					{ type: "addStoryFlag", flag: "MAP04_DOOR_A_OPENED", value: false },
					{ type: "addStoryFlag", flag: "MAP04_DOOR_B_OPENED", value: false },
					{ type: "addStoryFlag", flag: "MAP04_OTHER_ONE_TRAPPED", value: true }
				]
			}],
			[utils.coords(9,13)]: {duplicate: [utils.coords(3,13)]},
			[utils.coords(18,18)] : [
				{
					required: ["MAP04_CUTSCENE_A_DONE"],
					events: [ /* nothing to do */]
				},{
					required: ["MAP04_OTHER_ONE_TRAPPED"],
					events: [
						{ type: "textMessage", text: "The other one is trapped." },
						{ type: "walk", x: utils.grid(18), y: utils.grid(18), direction: "left" },
					]
				},{ /* Shut door behind one of the actors and trap the other one */
					required: ["MAP04_DOOR_E_OPENED"],
					events: [
						{ type: "walk", x: utils.grid(18), y: utils.grid(18), direction: "right" },
						{ type: "walk", x: utils.grid(19), y: utils.grid(18), direction: "right" },
						{ type: "walk", who: "movingBlockB", direction: "left" },
						{ type: "addStoryFlag", flag: "MAP04_DOOR_E_OPENED", value: false },
						{ type: "stand", x: utils.grid(20), y: utils.grid(18), direction: "left", time: 100 },
						{ type: "textMessage", text: "What heck!" },
						{ type: "switchFocus" },
						{ type: "textMessage", text: "Looks like it moved to a place I can't move it from." },
						{ type: "textMessage", text: "Is there another block we can use?" },
						{ type: "switchFocus" },
						{ type: "addStoryFlag", flag: "MAP04_CUTSCENE_A_DONE", value: true },
					]
				}
			],
			[utils.coords(22,10)] : [{ /* Advance players through another puzzle */
				required: ["MAP04_FLOORSWITCH_E_PRESSED","MAP04_FLOORSWITCH_F_PRESSED"],
				events:[
					{ type: "addStoryFlag", flag: "MAP04_DOOR_F_OPENED", value: true },
					{ type: "addStoryFlag", flag: "MAP04_DOOR_G_OPENED", value: true },
					{ type: "walk", who: "player",  direction: "up", noAwait: true },
					{ type: "walk", who: "player2", direction: "up" },
					{ type: "walk", who: "player",  direction: "up", noAwait: true },
					{ type: "walk", who: "player2", direction: "up" },
					{ type: "addStoryFlag", flag: "MAP04_DOOR_F_OPENED", value: false },
					{ type: "addStoryFlag", flag: "MAP04_DOOR_G_OPENED", value: false }
				]
			}],
			[utils.coords(32,10)]: { duplicate: [utils.coords(22,10)]},
			[utils.coords(23,2)]: [{ /* Remove one of the players from the map if the other is still present */
				required: ["MAP04_OTHER_PLAYER_GONE"],
				events: [{ type: "endGame" }]},{
				events: [
					{ type: "walk", x: utils.grid(23), y: utils.grid(2), direction: "down" },
					{ type: "textMessage", text: "I'll wait until he goes through first." }
				]
			}],
			[utils.coords(31,2)]: [{ /* Remove this player from the map */
				events: [
					{ type: "switchFocus" },
					{ type: "removeActor", x: utils.grid(31), y: utils.grid(2) },
					{ type: "addStoryFlag", flag: "MAP04_OTHER_PLAYER_GONE", value: true }
				]
			}]
		},
		configObjects: {
			player: setPlayer(),
			player2: setPlayer2(7,20,"up"),
			floorSwitchA: setFloorSwitch(3,13,"MAP04_FLOORSWITCH_A_PRESSED"),
			floorSwitchB: setFloorSwitch(9,13,"MAP04_FLOORSWITCH_B_PRESSED"),
			doorA: setDoor(3,12,"MAP04_DOOR_A_OPENED"),
			doorB: setDoor(9,12,"MAP04_DOOR_B_OPENED"),
			floorSwitchC: setFloorSwitch(3,7,"MAP04_DOOR_C_OPENED"),
			doorC: setDoor(12,7,"MAP04_DOOR_C_OPENED"),
			doorD: setDoor(6,7,"MAP04_DOOR_D_OPENED"),
			movingBlockA: setBlock(9,7,true,"floorSwitchC",[
				{ type: "addStoryFlag", flag: "MAP04_MOVINGBLOCK_A_ON_FLOORSWITCH_C", value: true },
				
			]),
			wallSwitchA: setWallSwitch(16,5,"MAP04_DOOR_D_OPENED",[
				{
					events: [
						{ type: "addStoryFlag", flag: "MAP04_DOOR_D_OPENED", value: true },
						{ type: "addStoryFlag", flag: "MAP04_OTHER_ONE_TRAPPED", value: false }
					]
				},{
					required: ["MAP04_DOOR_D_OPENED"],
					events: [{ type: "textMessage", text: "This switch is stuck now and cannot be moved." }]
				}
			]),
			floorSwitchD: setFloorSwitch(16,13,"MAP04_DOOR_E_OPENED"),
			doorE: setDoor(19,18,"MAP04_DOOR_E_OPENED"),
			movingBlockB: setBlock(16,10,true,"floorSwitchD"),
			movingBlockC: setBlock(22,22,true,"floorSwitchD"),
			floorSwitchE: setFloorSwitch(22,10,"MAP04_FLOORSWITCH_E_PRESSED"),
			floorSwitchF: setFloorSwitch(32,10,"MAP04_FLOORSWITCH_F_PRESSED"),
			doorF: setDoor(22,9,"MAP04_DOOR_F_OPENED"),
			doorG: setDoor(32,9,"MAP04_DOOR_G_OPENED"),
		}
	},

	EndRoom: {
		id: "EndRoom",
		index: 5
	},

	TombRoomB: {
		id: "TombRoomB",
		lowerSrc: "./game/images/maps/map05-TombRoomB-lower.png",
		upperSrc: "./game/images/maps/map05-TombRoomB-upper.png",
		mapLayout: [
			"                                    ",
			"                               x    ",
			" xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xx  ",
			"x                                 x ",
			"x        xxxxxxxxx xxx            x ",
			"x        x    x    x x            x ",
			"x        x    x xxx  x            x ",
			"x        x    x x     xxxxxxxxxxxx  ",
			"x        x     x                    ",
			"x        x                          ",
			" xxx  xxx   xx              x  xxx  ",
			"   x  x    x  xxxxxx  xxxxxx xx   x ",
			"   x  x    x  x     xx            x ",
			" xxx  xxx  x  x xx x  x xxxx xxxxx  ",
			"x  x  x  x x    xx xxxx        x    ",
			"x        x x  x         xx xxx xxx  ",
			"x        x x  x xxxxx x xx xxx    x ",
			"x        x x  xx    x             x ",
			"x        xxx  x     x xxxxxxxx    x ",
			"x        x    x xxxx x xxxxx x    x ",
			"x        x x  xx    xxx     xx    x ",
			"x        x x                xx    x ",
			"x        x x  xx    xxx     x xx x  ",
			"x          x  x xxxx   x xxx   x x  ",
			" xxxxxxxxxx xx         x x     x x  "
		],
		cutscenePlaces: {
			// [utils.coords(23,2)]: [{
			// 	events: [{
			// 		type: "changeMap",
			// 		map: "",
			// 		x: utils.grid(),
			// 		y: utils.grid(),
			// 		direction: "up"
			// 	}]
			// }],
			// [utils.coords(32,29)] : {
			// 	duplicate: [utils.coords(22,29)]
			// },
			// /* Advance players into the boss room */
			// [utils.coords(8,15)] : [{
			// 	required: ["FLOORSWITCH_L_PRESSED", "FLOORSWITCH_M_PRESSED"],
			// 	events:[
			// 		{ type: "addStoryFlag", flag: "DOOR_M_OPENED" },
			// 		/* Move one player through door */
			// 		{ type: "walk", x: utils.grid(8), y: utils.grid(13), direction: "down" },
			// 		{ type: "walk", x: utils.grid(8), y: utils.grid(14), direction: "left" },
			// 		{ type: "walk", x: utils.grid(7), y: utils.grid(14), direction: "left" },
			// 		{ type: "walk", x: utils.grid(6), y: utils.grid(14), direction: "up" },
			// 		{ type: "stand", x: utils.grid(6), y: utils.grid(13), direction: "down", time: 10 },
			// 		/* Move other player through door */
			// 		{ type: "walk", x: utils.grid(8), y: utils.grid(15), direction: "up" },
			// 		{ type: "walk", x: utils.grid(8), y: utils.grid(14), direction: "left" },
			// 		{ type: "walk", x: utils.grid(7), y: utils.grid(14), direction: "left" },
			// 		{ type: "stand", x: utils.grid(6), y: utils.grid(14), direction: "up", time: 10 },
			// 		{ type: "delStoryFlag", flag: "DOOR_M_OPENED" }
			// 		/* Let's add some talking here */
			// 	]
			// }],
			// [utils.coords(8,13)] : {duplicate: [utils.coords(8,15)]},
			// /* End of map level */
			// [utils.coords(35,1)] : [{
			// 	events: [
			// 		{ type: "walk",  x: utils.grid(35), y: utils.grid(1), direction: "down" },
			// 		{ type: "textMessage", text: "I made it to the end of the game!" },
			// 	]
			// }],
		},
		configObjects: {

		}
	}
} /* end of window.OverworldMaps */
