"use strict";
var orbitPlanner;
var mouseTranslator;
var consoleCreator;
var windowResize = -1;
var delayOnResize = 500;
function onloadSeq(){
	let bg = document.getElementById("background");
	let bodies = document.getElementById("bodies");
	orbitPlanner = new OrbitPlanner(bg, bodies);
	consoleCreator = new ConsoleCreator(orbitPlanner);
	mouseTranslator = new MouseTranslator(orbitPlanner, consoleCreator);
	let md = mouseTranslator.receiveMouseDown.bind(mouseTranslator);
	let el = [["mousedown", md]];
	let orbiters = new Set(
		[
			new Orbiter("expBuild", "red", bodies, el, bg, true), 
			new Orbiter("credits", "aqua", bodies, el, bg, true), 
			new Orbiter("about", "gold", bodies, el, bg, true), 
			new Orbiter("amaze", "deeppink", bodies, el, bg, true), 
			new Orbiter("gameOfLife", "darkviolet", bodies, el, bg, true)
		]
	);
	orbitPlanner.setDefaultOrbiters(orbiters);
	bg.width = window.innerWidth;
	bg.height = window.innerHeight;
	orbitPlanner.animateOrbiters();
	bg.addEventListener("click", () => {
			try{
				orbitPlanner.consoleCreator.closeConsole();
			} catch(noPanelOpen){
				//ignore
			}
		}
	);
	window.addEventListener("resize", windowResizeDone);
}

// if the user resizes the window, repath all of the blocks. The repathing will go into effect after 
//delayOnResize milliseconds of no additional resize adjustments:
function windowResizeDone(){
	if(consoleCreator.evacuated == true){
		return;
	}
	let can = document.getElementById("background");
	can.width = window.innerWidth;
	can.height = window.innerHeight;
	clearTimeout(windowResize);
	windowResize = setTimeout( () => {
		orbitPlanner.evacuateAll();
		orbitPlanner.animateOrbiters();
	}, 500);
}

