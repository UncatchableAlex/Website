"use strict";

// a bloop animation is a small circle that grows and shrinks in the wake of an orbiter
class Bloop{

	static DURATION = 2.5;
	static SIZE = 7;
	static COLOR = "lime";

	constructor(x, y, ctx, canvasColor){
		this.x = x;
		this.y = y;
		this.age = 1;
		this.ctx = ctx;
		this.canvasColor = canvasColor;
		this.keepDrawing = true;
		this.secsElapsed = 0;
		this.prevTime;
	}

	init(){
		let drawBloop = this.drawBloop.bind(this);
		requestAnimationFrame(drawBloop);
	}

	drawBloop(currentTime){
		let size = this.getSize(this.secsElapsed);
		if(!this.keepDrawing || size <= 0){
			return;
		}

		// draw a canvasColored circle to cover up the old bloop frame:
		this.ctx.beginPath();
		this.ctx.fillStyle = this.canvasColor;
		this.ctx.arc(this.x, this.y, size + 1, 0, Math.PI * 2, true);
		this.ctx.fill();

		this.secsElapsed += (this.prevTime == null ? 0 : ((currentTime - this.prevTime) / 1000));
		this.prevTime = currentTime;
		size = this.getSize(this.secsElapsed);

		if(size <= 0){
			return;
		}

		// draw a new bloop frame in place of the old one:
		this.ctx.beginPath();	
		this.ctx.fillStyle = Bloop.COLOR;
		this.ctx.arc(this.x, this.y, this.getSize(this.secsElapsed), 0, Math.PI * 2);
		this.ctx.fill();

		let drawBloop = this.drawBloop.bind(this);
		requestAnimationFrame(drawBloop);
	}

	stopDrawing(){
		this.keepDrawing = false;
	}

	// get how big the bloop should be after x seconds of animation:
	getSize(secsElapsed){
		secsElapsed += 0.01;
		let a = (Bloop.SIZE * secsElapsed * 2 / Bloop.DURATION);
		a = isNaN(a) ? 0 : a;
		let ans = (-1 * Math.abs(a - Bloop.SIZE)) + Bloop.SIZE;
		return ans;
	}
}