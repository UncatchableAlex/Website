"use strict";
class OrbitPlanner{
	static IDS_GENERIC = new Map([["expBuild", "red"], ["credits","aqua"], ["about", "gold"], ["amaze","deeppink"], ["gameOfLife", "darkviolet"]]);
	static BLOOP_REFRESH_INTERVAL = 80;
	static ORBITER_WIDTH = 150;
	static ORBITER_HEIGHT = 150;
	static EVACUATE_TIME = 0.6;
	static CURVINESS = [300, 500]; 
	static CURVE_FACTOR = [0.50, 0.75];
	static SEGMENTS = [30, 50];
	static ALEX_SCREEN_WIDTH = 1707;
	static VEC_RAD_FLOOR = 500;
	static SPEED_MULTIPLIER = 6;

	constructor(ids = OrbitPlanner.IDS_GENERIC, concurrentAllowed = false, consoleCreator = new ConsoleCreator(this), mouseTranslator = new MouseTranslator(), 
				styleSheet = document.styleSheets[0], canvas = document.querySelector("#background"), orbiterSection = document.getElementById("bodies")){
		this.concurrentAllowed = concurrentAllowed;
		this.bloopNum;
		this.secsPerSegment = (window.innerWidth / OrbitPlanner.ALEX_SCREEN_WIDTH) * OrbitPlanner.SPEED_MULTIPLIER;
		this.rules;
		this.intervals = new Map();
		this.orbiting = new Set();
		this.canvas = canvas;
		this.consoleCreator = consoleCreator;
		this.ids = ids;
		this.mouseTranslator = mouseTranslator;
		this.vecRad = Math.min(OrbitPlanner.VEC_RAD_FLOOR, window.innerWidth / 3);
		this.orbiterSection = orbiterSection;
		this.styleSheet = styleSheet;
	}

	makeOrbiters(keys = Array.from(this.ids.keys()), dropInPoint = null){
		this.secsPerSegment = (window.innerWidth / OrbitPlanner.ALEX_SCREEN_WIDTH) * OrbitPlanner.SPEED_MULTIPLIER;
		this.vecRad = Math.min(OrbitPlanner.VEC_RAD_FLOOR, window.innerWidth / 3);
		// get the document's stylesheet:
		// for each id:
		let self = this;
		for(let id of keys){
			if(!this.concurrentAllowed && this.orbiting.has(id)){
				continue;
			}
			this.orbiting.add(id);
			try{
				dropInPoint = [dropInPoint[0], dropInPoint[1]];
			} catch(error){
				dropInPoint = Util.getOffScreenPoint();
			}
			let h = window.innerHeight, w = window.innerWidth;
			// make new rule for the specific id and add it to the stylesheet:
			Util.deleteCssRule(this.styleSheet, "." + id);
			this.styleSheet.insertRule(this.makeRule(id, dropInPoint));
			// make a new div element:
			let orbiter = document.createElement("div");
			// set its class to the new rule in the stylesheet:
			orbiter.setAttribute("class", id);
			orbiter.setAttribute("id", id);
			let self = this;
			let md = function(e){self.mouseTranslator.receiveMouseDown(e, self);}
			orbiter.addEventListener("mousedown", md);
			this.orbiterSection.appendChild(orbiter);
			clearInterval(this.intervals.get(id));
			let makeBloop = this.makeBloop.bind(this);
			this.intervals.set(id, setInterval(makeBloop, OrbitPlanner.BLOOP_REFRESH_INTERVAL, orbiter));
		}
	}


	makeBloop(orbiter){
		const rect = orbiter.getBoundingClientRect();
		const x = (rect.left + rect.right) >> 1;
		const y = (rect.top + rect.bottom) >> 1;	
		let b = new Bloop(x, y, this.canvas);
		b.init();
	}

	makeRule(id, dropInPoint){
		if(!this.ids.has(id)){
			throw "No corresponding ids found in the id map";
		}
		// make a point to end at (don't be confused as to the name. It will make sense later):
		let startPoint = Util.getRandomPoint(dropInPoint, this.vecRad);
		// make a random first control point:
		let firstCtrl = this.getFirstCtrlPoint(Util.getRandomPoint(dropInPoint, this.vecRad), dropInPoint);
		// make a second control point (once again, the name will make sense later):
		let prevCtrl = this.getSecondCtrlPoint(dropInPoint, firstCtrl, startPoint); 
		// these guys will be used later. Keep them null for now though:
		let ctrlPoint2, ctrlPoint1, endPoint;
		// start making a new rule:
		let rule = "." + id + "{cursor: pointer; background: " + this.ids.get(id) + "; position: absolute; border-radius: 0%; height: " + OrbitPlanner.ORBITER_HEIGHT + "px; width: " + 
					OrbitPlanner.ORBITER_WIDTH + "px;" + " top:0px; left: 0px; z-index: 20; offset-path: path('M " + dropInPoint[0] + " " + dropInPoint[1] + " C " + firstCtrl[0] + " " +
					firstCtrl[1] + " " + prevCtrl[0] + " " + prevCtrl[1] + " " + startPoint[0] + " " + startPoint[1];
		// make between 7 and 15 svg bezier curve paths:
		const iterations = Util.getRandomIntInRange(OrbitPlanner.SEGMENTS[0], OrbitPlanner.SEGMENTS[1]);
		for(let i = 0; i < iterations; i++){
			// get a control point that is colinear with the startpoint and the last control point:
			ctrlPoint1 = this.getFirstCtrlPoint(prevCtrl, startPoint);
			// generate a random end point that is at least this.vecRad px away from the starting point:
			endPoint = Util.getRandomPoint(startPoint, this.vecRad);
			ctrlPoint2 = this.getSecondCtrlPoint(startPoint, ctrlPoint1, endPoint);
			// append the curve to our rule:
			rule += (" C " + ctrlPoint1[0] + " " + ctrlPoint1[1] + " " + ctrlPoint2[0] + " " + ctrlPoint2[1] + " " + endPoint[0] + " " + endPoint[1]);
			// update prevCtrl and startPoint for next iteration:
			prevCtrl = ctrlPoint2;
			startPoint = endPoint;
		}
		// add a final destination offscreen:
		ctrlPoint1 = this.getFirstCtrlPoint(prevCtrl, startPoint);
		endPoint = Util.getOffScreenPoint();
		ctrlPoint2 = this.getSecondCtrlPoint(startPoint, ctrlPoint1, endPoint);
		rule += (" C " + ctrlPoint1[0] + " " + ctrlPoint1[1] + " " + ctrlPoint2[0] + " " + ctrlPoint2[1] + " " + endPoint[0] + " " + endPoint[1]);
		// append to complete a pretty pretty pretty animation rule:
		rule += "'); offset-distance: 0%; animation: orbit; animation: orbit " + (iterations * this.secsPerSegment) + "s linear infinite; animation-fill-mode: forwards;}";
		console.log(rule);
		return rule;
	}

	getFirstCtrlPoint(prevCtrl, startPoint){
		// make a unit vector pointing from the control point of the previous curve to the start point of this curve.
		let prevToStart = [startPoint[0] - prevCtrl[0], startPoint[1] - prevCtrl[1]];
		let magnitude = Util.getDist(prevCtrl, startPoint);
		prevToStart[0] /= magnitude
		prevToStart[1] /= magnitude;
		// make a new point specifying the cartesian coordinates of a random point in the direction of the previously calculated unit vector within 
		// this.vecRad px of the start point:
		let ctrlPoint = [];
		let newMag = Util.getRandomIntInRange(OrbitPlanner.CURVINESS[0], OrbitPlanner.CURVINESS[1]);
		ctrlPoint.push(((prevToStart[0] * newMag) + startPoint[0]) << 0);
		ctrlPoint.push(((prevToStart[1] * newMag) + startPoint[1]) << 0);
		return ctrlPoint;
	}

	getSecondCtrlPoint(startPoint, firstCtrl, endPoint){
		// find the vector going from the first control point to the end point:
		let firstToEnd = [endPoint[0] - firstCtrl[0], endPoint[1] - firstCtrl[1]];
		// find the length of that vector:
		let lengthFTE = Util.getDist([0,0], firstToEnd);
		// find both unit vectors perpendicular to first to end:
		let perp = Util.normalizeVector(firstToEnd);
		let perp1 = Util.rotateVector(perp, Math.PI / 2);
		let perp2 = Util.flipVector(perp1);
		// find the midpoint between the first control point and the end point:
		let midPoint = [(firstCtrl[0] + endPoint[0]) / 2, (firstCtrl[1] + endPoint[1]) / 2]
		// find the vector going from the start point to the mid point:
		let midToStart = [startPoint[0] - midPoint[0], startPoint[1] - midPoint[1]];
		// we want to select the vector perpendicular to firstToEnd that has the shallowest angle with startToMid
		perp = Util.getAngle(perp1, midToStart) > Util.getAngle(perp2, midToStart) ? perp1 : perp2;
		// choose some random length for our final vector
		let mag = Util.getRandomIntInRange(lengthFTE * OrbitPlanner.CURVE_FACTOR[0], lengthFTE * OrbitPlanner.CURVE_FACTOR[1]);
		// choose a point along t * perp, mag away form the mid point between the first control point and the end point
		let secondCtrl = [midPoint[0] + (perp[0] * mag) << 0, midPoint[1] + (perp[1] * mag) << 0];
		return secondCtrl;
	}

		
	// evacuate all orbiters from the screen:
	evacuateAll(){
		let self = this;
		for(let id of this.ids.keys()){
			try{
				var orbiter = document.getElementById(id);
				let rect = orbiter.getBoundingClientRect();
				this.evacuate(orbiter, [rect.left, rect.top]);
			} catch(error){
				continue;
			}
		}
	}

	// make block with given ID run very far, very quickly.
	evacuate(orbiter, dropInPoint){
		this.orbiting.delete(orbiter.id);
		orbiter.remove();
		let runner = document.createElement("div")
		runner.id = "runner";
		runner.style = this.getRunStyle(dropInPoint, this.ids.get(orbiter.id));
		setInterval(() => {runner.remove();}, OrbitPlanner.EVACUATE_TIME * 1000);

		clearInterval(this.intervals.get(orbiter.id));
		document.body.appendChild(runner);
	}

	// make a style string that will make the orbiter fly off screen
	getRunStyle(dropInPoint, color){
		let endPoint = Util.getFurthestOffScreenPoint(dropInPoint);
		let firstCtrl = this.getFirstCtrlPoint(Util.getRandomPoint(dropInPoint, this.vecRad), dropInPoint);
		let secondCtrl = this.getSecondCtrlPoint(dropInPoint, firstCtrl, endPoint);
		let cmd = "background: " + color + "; position: absolute; border-radius: 0%; height: " + OrbitPlanner.ORBITER_HEIGHT + "px; width: " + OrbitPlanner.ORBITER_WIDTH + "px;" +
					"top:0px; left: 0px; z-index: 1; offset-path: path('M " + dropInPoint[0] + " " + dropInPoint[1] + " C " + firstCtrl[0] + " " +
					firstCtrl[1] + " " + secondCtrl[0] + " " + secondCtrl[1] + " " + endPoint[0] + " " + endPoint[1] + 
					"'); offset-distance: 0%; animation: orbit " + OrbitPlanner.EVACUATE_TIME + "s linear; animation-fill-mode: forwards;";
		return cmd;
	}
}

class Bloop{

	static DURATION = 2.5;
	static SIZE = 7;
	static COLOR = "lime";

	constructor(x, y, canvas){
		this.x = x;
		this.y = y;
		this.age = 1;
		this.ctx = canvas.getContext("2d");
		this.canvasColor = window.getComputedStyle(canvas).getPropertyValue("background-color")
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

	getSize(secsElapsed){
		secsElapsed += 0.01;
		let a = (Bloop.SIZE * secsElapsed * 2 / Bloop.DURATION);
		a = isNaN(a) ? 0 : a;
		let ans = (-1 * Math.abs(a - Bloop.SIZE)) + Bloop.SIZE;
		return ans;
	}
}