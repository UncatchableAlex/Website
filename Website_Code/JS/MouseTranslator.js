"use strict";
class MouseTranslator{

	constructor(){
		this.move = this.receiveMouseMove.bind(this);
		this.up = this.receiveMouseUp.bind(this);
	}

	/* when a mousedown event is received on an orbiter, we check for its angle, remove its class, and add a transformation to make it appear
	 as it did while flying. Additional event listeners for mousemove and mouseup will also be added to the orbiter so that user can move it
	 around the screen at will. */
	receiveMouseDown(e, orbitPlanner){
		// for holding the orbiter element that the user has selected:
		this.orbiter = e.currentTarget;

		this.orbiterID = this.orbiter.id;

		// which orbit planner to use for orbit changes:
		this.orbitPlanner = orbitPlanner;

		// if the user resizes the screen, we will remember the timeout here 
		//(they will have .5 secs to make additional resizes before evacuateAll() is called and the blocks are repathed):
		this.windowResize = -1;

		// the center of the screen:
		this.center = [(window.innerWidth - OrbitPlanner.ORBITER_WIDTH) / 2, (window.innerHeight - OrbitPlanner.ORBITER_HEIGHT) / 2];
		// if the user clicked something that wasn't an orbiter but had a mousedown event listener that directed here (unlikely), return:
		if(!Array.from(this.orbitPlanner.ids.keys()).includes(this.orbiter.getAttribute("class"))){
			return;
		}
		// get the bounding rectangle of the orbiter as it is now:
		var firstRect = this.orbiter.getBoundingClientRect();
		// get the center of the bounding rectangle:
		var firstPoint = [(firstRect.left + firstRect.right) / 2, (firstRect.top + firstRect.bottom) / 2];

		// where on the bounding rectangle did they click?
		this.offsetLeft = e.clientX - firstRect.left;
		this.offsetTop = e.clientY - firstRect.top;
		//wait two frames:
		window.requestAnimationFrame(
			() => {
					window.requestAnimationFrame(
						() => {
							// get another bounding rectangle:
							let secondRect = this.orbiter.getBoundingClientRect()
							// get the second bounding rectangle's center:
							let secondPoint = [(secondRect.left + secondRect.right) / 2, (secondRect.top + secondRect.bottom) / 2];
							// find the vector between the first and second bounding rectangles' centers.
							let vec = [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
							// the angle of the orbiter when the user clicked on it:
							this.origAngle = Math.atan(vec[1]/vec[0]);
							// adjust the angle if it is more than 45 degrees or less than -45 degrees. 
							// There is no reason why we should have to rotate more than abs(45) degs:
							if(this.origAngle > (Math.PI / 4)){
								this.origAngle -= (Math.PI / 2);
							} else if(this.origAngle < (-1 * Math.PI / 4)){
								this.origAngle += (Math.PI / 2);
							}
							// set the orbiter's new style to match where it was when the user picked it up:
							this.orbiter.style.top = e.clientY - this.offsetTop;
							this.orbiter.style.left = e.clientX - this.offsetLeft;
							// switch its class to cancel its animation and allow dragging:
							this.orbiter.setAttribute("class", "beingDragged");
							this.orbiter.style.background = this.orbitPlanner.ids.get(this.orbiter.id);
							this.orbiter.style.transform = "rotate(" + this.origAngle + "rad)";	
							// adjust style to include rotation:
							this.receiveMouseMove(e, this);
							// add additional event listeners:
							let self = this;
							window.addEventListener("mousemove", self.move);
							window.addEventListener("mouseup", self.up);
						}
					);	
				}
			); 
		// find how far it is from the center of the screen:
		this.origDist = Util.getDist(this.center, [e.clientX - this.offsetLeft, e.clientY - this.offsetTop]);
	}

	// adjust the orbiter's style if it has been selected with a mousedown event and an additional mousemove event has been detected:
	receiveMouseMove(e){
		//this.orbiter = document.getELementById(this.orbiterID);
		let newPos = [e.clientX - this.offsetLeft, e.clientY - this.offsetTop];
		this.orbiter.style.top = newPos[1] + "px";
		this.orbiter.style.left = newPos[0] + "px";
		// use a simple proportion to adjust its rotation so that when it is 0 distance from center, it has 0 rotation:
		let distToCenter = Util.getDist(this.center, newPos);
		let newAngle = (this.origAngle / this.origDist) * distToCenter;
		this.orbiter.style.transform = "rotate(" + newAngle + "rad)";
	} 

	// when a mouseup event is detected, evacuate the selected orbiter from the screen for repathing:
	receiveMouseUp(e){
		// for referencing this instance from a different scope:

		// remove event listeners:
		let self = this;
		window.removeEventListener("mousemove", self.move);
		window.removeEventListener("mouseup", self.up);

		// adjust its angle one last time:
		this.receiveMouseMove(e);

		let orbiterRect = this.orbiter.getBoundingClientRect(); 

		// find the orbiter's center point:
		let orbiterCenter = [(orbiterRect.left + orbiterRect.right) / 2, (orbiterRect.top + orbiterRect.bottom) / 2];
		let remove = false;

		// if it is close to the center receptacle, make its corresponding console and remove it from the HTML:
		if(Util.getDist(orbiterCenter, this.center) < OrbitPlanner.ORBITER_WIDTH){
			this.orbitPlanner.orbiting.delete(this.orbiter.id);
			this.orbiter.remove();
			// remake the orbiter off-screen with a new path:
			this.orbitPlanner.makeOrbiters([this.orbiter.id]);
			this.orbitPlanner.consoleCreator.openConsole(this.orbiter.id);
			remove = true;
		}

		// if the orbiter wasn't placed in the receptacle, evacuate it from the screen:
		if(!remove){
			this.orbitPlanner.evacuate(this.orbiter, [e.clientX, e.clientY]);
			// remake the orbiter off-screen with a new path:
			this.orbitPlanner.makeOrbiters([this.orbiter.id]);
			this.orbiter = null;
		}

	}
}