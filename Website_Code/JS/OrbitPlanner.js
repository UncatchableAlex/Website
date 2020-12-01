"use strict";
class OrbitPlanner{
	static BLOOP_REFRESH_INTERVAL = 80;
	static EVACUATE_TIME = 0.6;
	static CURVINESS = [300, 500]; 
	static CURVE_FACTOR = [0.50, 0.75];
	static SEGMENTS = [30, 50];
	static ALEX_SCREEN_WIDTH = 1707;
	static VEC_RAD_FLOOR = 500;
	static SPEED_COEFFICIENT = 6;

	constructor(canvas, orbiterSection, styleSheet = document.styleSheets[0]){
		this.secsPerSegment = (window.innerWidth / OrbitPlanner.ALEX_SCREEN_WIDTH) * OrbitPlanner.SPEED_COEFFICIENT;
		this.canvas = canvas;
		this.vecRad = Math.min(OrbitPlanner.VEC_RAD_FLOOR, window.innerWidth / 3);
		this.orbiterSection = orbiterSection;
		this.styleSheet = styleSheet;
		this.mouseTranslator = new MouseTranslator(this);
		this.orbiting = new Map();
	}
	setDefaultOrbiters(orbiters){
		this.orbiters = orbiters
	}

	animateOrbiters(orbiters = this.orbiters, dropInPoint = null){
		this.secsPerSegment = (window.innerWidth / OrbitPlanner.ALEX_SCREEN_WIDTH) * OrbitPlanner.SPEED_COEFFICIENT;
		this.vecRad = Math.min(OrbitPlanner.VEC_RAD_FLOOR, window.innerWidth / 3);
		var self = this;
		var h = window.innerHeight, w = window.innerWidth;
		try{
			dropInPoint = [dropInPoint[0], dropInPoint[1]];
		} catch(error){
			dropInPoint = Util.getOffScreenPoint();
		}
		orbiters.forEach(orbiter => {
				if(!Array.from(this.orbiting.keys()).includes(orbiter.id)){
					this.orbiting.set(orbiter.id, orbiter);
					orbiter.startAnimation(this.addAnimation(orbiter, dropInPoint));
				}
			}
		);
	}

	addAnimation(orbiter, dropInPoint){
		//delete the old rule:
		Util.deleteCssRule(this.styleSheet, "." + orbiter.id);
		// make a point to end at (don't be confused as to the name. It will make sense later):
		let startPoint = Util.getRandomPoint(dropInPoint, this.vecRad);
		// make a random first control point:
		let firstCtrl = this.getFirstCtrlPoint(Util.getRandomPoint(dropInPoint, this.vecRad), dropInPoint);
		// make a second control point (once again, the name will make sense later):
		let prevCtrl = this.getSecondCtrlPoint(dropInPoint, firstCtrl, startPoint); 
		// these guys will be used later. Keep them null for now though:
		let ctrlPoint2, ctrlPoint1, endPoint;
		// start making a new rule:
		let rule = "." + orbiter.id + "{cursor: pointer; background: " + orbiter.color + "; position: absolute; border-radius: 0%; height: " + Orbiter.WIDTH + "px; width: " + 
					Orbiter.WIDTH + "px;" + " top:0px; left: 0px; z-index: 20; offset-path: path('M " + dropInPoint[0] + " " + dropInPoint[1] + " C " + firstCtrl[0] + " " +
					firstCtrl[1] + " " + prevCtrl[0] + " " + prevCtrl[1] + " " + startPoint[0] + " " + startPoint[1];
		// get an acceptable number of bezier curve paths:
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
		// insert new rule to stylesheet:
		this.styleSheet.insertRule(rule);
		return orbiter.id;
	}

	remove(orbiter){
		this.orbiting.delete(orbiter.id);
	}
		
	// evacuate all orbiters from the screen:
	evacuateAll(){
		let self = this;
		for(let orbiter of this.orbiting.values()){
			try{
				let rect = orbiter.getRect();
				this.evacuate(orbiter, [rect.left, rect.top]);
			} catch(error){
				continue;
			}
		}
	}

		// make block with given ID run very far, very quickly.
	evacuate(orbiter, dropInPoint){
		orbiter.vanish();
		this.orbiting.delete(orbiter.id);
		let runner = document.createElement("div")
		runner.id = "runner";
		runner.style = this.getRunStyle(dropInPoint, orbiter.color);
		//setTimeout(() => {runner.style.animationPlayState = "paused"}, 100);
		setTimeout(() => {runner.remove();}, OrbitPlanner.EVACUATE_TIME * 1000);
		this.orbiterSection.appendChild(runner);
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

	// make a style string that will make the orbiter fly off screen
	getRunStyle(dropInPoint, color){
		let endPoint = Util.getFurthestOffScreenPoint(dropInPoint);
		let firstCtrl = this.getFirstCtrlPoint(Util.getRandomPoint(dropInPoint, this.vecRad), dropInPoint);
		let secondCtrl = this.getSecondCtrlPoint(dropInPoint, firstCtrl, endPoint);
		let cmd = "background: " + color + "; position: absolute; border-radius: 0%; height: " + Orbiter.WIDTH + "px; width: " + Orbiter.WIDTH + "px;" +
					"top:0px; left: 0px; z-index: 1; offset-path: path('M " + dropInPoint[0] + " " + dropInPoint[1] + " C " + firstCtrl[0] + " " +
					firstCtrl[1] + " " + secondCtrl[0] + " " + secondCtrl[1] + " " + endPoint[0] + " " + endPoint[1] + 
					"'); offset-distance: 0%; animation: orbit " + OrbitPlanner.EVACUATE_TIME + "s linear; animation-fill-mode: forwards;";
		return cmd;
	}
}