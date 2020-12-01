class Orbiter{
	static WIDTH = 150;
	static BLOOP_INTERVAL = 80;
	constructor(id, color, section, eventListeners, canvas, useBoundingRect){
		this.id = id;
		this.color = color;
		this.section = section;
		this.interval = null;
		this.domElem = null;
		this.startTime = null;
		this.eventListeners = eventListeners;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.canvasColor = window.getComputedStyle(canvas).getPropertyValue("background-color");
		this.beingDragged = false;
		this.paused = false;
		this.hidden = false;
		this.pauseTime = null;
		this.useBoundingRect = useBoundingRect;
	}

	startAnimation(rule){
		this.beingDragged = false;
		this.domElem = document.createElement("div");
		this.domElem.id = this.id;
		this.domElem.setAttribute("class", rule);
		this.eventListeners.forEach(el => this.domElem.addEventListener(el[0], el[1]));
		let mb = this.makeBloop.bind(this);
		this.interval = setInterval(mb, Orbiter.BLOOP_INTERVAL);
		this.section.appendChild(this.domElem);
		
		let pathText = window.getComputedStyle(this.domElem).getPropertyValue("offset-path").match(/\((.+)\)/g)[0].replaceAll(/\(|\)|\"/g, "");
		this.path =  document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.path.setAttribute("d", pathText);
		this.path.setAttribute("stroke", "orange");
		this.path.setAttribute("fill", "transparent");
		this.pathLength = this.path.getTotalLength();
		this.duration = window.getComputedStyle(this.domElem).getPropertyValue("animation-duration");
		this.duration = this.duration.substring(0, this.duration.length);
		this.duration = parseFloat(this.duration) * 1000;
		this.startTime = Date.now();
	}

	startDragging(theta){
		this.beingDragged = true;
		let ele = this.domElem;
		ele.setAttribute("class", "beingDragged");
		this.domElem.style.background = this.color;
		this.domElem.style.transform = "rotate(" + theta + "rad)";
	}

	moveTo(newPos, theta){
		if(!this.beingDragged){
			throw "Orbiter is not being dragged";
		}
		let ele = this.domElem;
		ele.style.left = newPos[0] + "px";
		ele.style.top = newPos[1] + "px";
		ele.style.transform = "rotate(" + theta + "rad)";
	}

	getRect(){
		return this.domElem.getBoundingClientRect();
	}

	getCenterPoint(){
		let elapsed = Date.now() - this.startTime;
		let dist = elapsed * this.pathLength / this.duration;
		let point = this.path.getPointAtLength(dist);
		return [point.x, point.y];
	}

	makeBloop(){
		if(document.visibilityState == "hidden"){
			this.hidden = true;
			this.pause();
			return;
		}
		if(this.paused && this.hidden){
			this.hidden = false;
			this.unpause();
			this.startTime += (Date.now() - this.pauseTime);
		}
		if(this.paused){
			return;
		}
		if(this.beingDragged || this.useBoundingRect){
			const rect = this.getRect();
			var center = [(rect.left + rect.right) >> 1, (rect.top + rect.bottom) >> 1];
		} else {
			var center = this.getCenterPoint();
		}
		let b = new Bloop(center[0], center[1], this.ctx, this.canvasColor);
		b.init();
	}

	stopBloops(){
		clearInterval(this.interval);
	}

	makeBloops(){
		let mb = this.makeBloop.bind(this);
		this.interval = setInterval(mb, Orbiter.BLOOP_INTERVAL);
	}

	vanish(){
		clearInterval(this.interval);
		this.domElem.remove();
		this.beingDragged = false;
	}

	pause(){
		this.pauseTime = Date.now();
		this.paused = true;
		this.domElem.style.animationPlayState = "paused";
	}

	unpause(){
		this.paused = false;
		this.domElem.style.animationPlayState = "running";
	}
	
}