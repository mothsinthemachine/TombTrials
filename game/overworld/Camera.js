class Camera {
	constructor(map) {
		this.map = map;
		// this.focus = this.map.gameObjects.player;
		this.focus = "player";
		this.centerX = 120;
		this.centerY = 112;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.toX = this.x;
		this.toY = this.y;
	}

	getFocusObject() {
		return this.map.gameObjects[this.focus];
	}

	update(ctx) {
		const speed = 0.1;
		if (this.focus) {
			this.toX = this.getFocusObject().x;
			this.toY = this.getFocusObject().y;
		}
		this.dx = Math.round((this.toX - this.x) * speed);
		this.dy = Math.round((this.toY - this.y) * speed);
		this.x += this.dx;
		this.y += this.dy;
		this.drawScene(ctx);
	}

	/* 
	Draw everything in the scene in this order:
		1. Lower map image
		2. Game Objects
		3. Upper map image 
	*/
	drawScene(ctx) {
		this.drawMapImage(ctx,this.map.lowerImage);
		this.drawObjects(ctx);
		this.drawMapImage(ctx,this.map.upperImage);
	}

	drawMapImage(ctx,img) {
		if (img) {
			ctx.drawImage(
				img, 
				this.centerX - this.x,
				this.centerX - this.y
			);
		}
	}

	drawObjects(ctx) {
		Object.values(this.map.gameObjects).sort((a,b) => {
			return (a.depth - b.depth);
		}).forEach(obj => {
			obj.sprite.draw(ctx,this);
		});
	}

	switchFocus(id) {
		if (id in this.map.gameObjects) {
			this.focus = id;
		}
	}

	init() {
		if (this.focus) {
			this.x = this.getFocusObject().x;
			this.y = this.getFocusObject().y;
		}
	}
}
