class Sprite {
	constructor(config) {
		// this.gameObject = null; /* Sprite MUST have a game object */
		this.gameObject = config.gameObject; /* Make a self-reference as a game object */

		/* Set frame variables (default values) */
		this.frameWidth  = config.frameWidth != null ? config.frameWidth : 16;
		this.frameHeight = config.frameHeight != null ? config.frameHeight : 16;
		this.frameOffsetX = config.frameOffsetX != null ? config.frameOffsetX : 0;
		this.frameOffsetY = config.frameOffsetY != null ? config.frameOffsetY : 0;

		this.shadowX = config.shadowX != null ? config.shadowX : 0;
		this.shadowY = config.shadowY != null ? config.shadowY : 0;

		/* Set the current animation and frame limit */
		this.currentAnimation = config.currentAnimation || "walk-down";
		this.currentAnimationFrame = 0;
		this.animationFrameLimit = config.animationFrameLimit != null ? config.animationFrameLimit : 8;
		this.animationFrameTimer = this.animationFrameLimit;
		
		/* Set up the image */
		this.image = new Image();
		this.image.src = config.src;
		this.image.onload = () => {
			this.isLoaded = true;
		}

		/* Set up a shadow for the sprite */
		this.shadow = null;
		if (config.useShadow) {
			this.shadow = new Image();
			this.shadow.src = "./game/images/actors/ActorShadow.png";
			this.shadow.onload = () => {this.isShadowLoaded = true;}
		}

		this.animations = config.animations || {};
	}

	/* THIS CAUSES ME SO MUCH GRIEF */
	get frame() {
		return this.animations[this.currentAnimation][this.currentAnimationFrame];
	}

	setAnimation(key) {
		if (this.currentAnimation !== key) {
			this.currentAnimation = key;
			this.currentAnimationFrame = 0;
			this.animationFrameTimer = this.animationFrameLimit;
		}
	}

	updateAnimationProgress() {
		/* Downtick frame progress */
		if (this.animationFrameTimer > 0) {
			this.animationFrameTimer--;
			return;
		}

		/* Reset the counter for the frame progress */
		this.animationFrameTimer = this.animationFrameLimit;
		this.currentAnimationFrame++;

		/* In case the frame is undefined */
		if (this.frame === undefined) {
			this.currentAnimationFrame = 0;
		}
	}

	draw(ctx, camera) {
		/* Set coordinates for drawing sprite on map */
		const [a,b] = [camera.centerX, camera.centerY];
		
		const [x,y] = (camera.getFocusObject() === this.gameObject) ? [
			camera.toX - camera.x + a,
			camera.toY - camera.y + b
		] : [
			this.gameObject.x - camera.x + a, 
			this.gameObject.y - camera.y + b
		];

		const z = 0; /* For making actors jump */

		if (this.shadow && this.isShadowLoaded) {
			ctx.drawImage(this.shadow, x + this.shadowX, y + this.shadowY);
		}

		let frameX,frameY;
		// [frameX,frameY] = undefined; /* AVOID THIS LIKE A PLAGUE */
		try {
			[frameX,frameY] = this.frame; // THIS IS SO IRRITATING!!
		} catch (e) {
			utils.print(e);
			return;
		}

		/* Finally, draw the sprite */
		if (this.isLoaded) {
			
			ctx.drawImage(this.image,		/* image index */
				frameX * this.frameWidth,	/* top-left  crop */
				frameY * this.frameHeight,	/* bottom-right crop */
				this.frameWidth,			/* width crop */
				this.frameHeight,			/* height crop */
				x - this.frameOffsetX, 		/* x-coordinate with frame offset */
				y - this.frameOffsetY - z,	/* y-coordinate with frmae offset and z-coordinate*/
				this.frameWidth,			/* frame width */
				this.frameHeight			/* frame height */
			);
		}

		/* check if sprite can animate */
		if (this.animations !== undefined) {
			this.updateAnimationProgress();
		}
	}
}