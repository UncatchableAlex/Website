"use strict";
var orbitPlanner;
var mouseTranslator;
var bloopToggler;
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
	bloopToggler = document.querySelector("#bloopToggler");
	bloopToggler.addEventListener("click", toggleBloops);
	toggleBloops();
	let orbiters = new Set(
		[
			new Orbiter("expBuild", "red", bodies, el, bg, bloopToggler, true), 
			new Orbiter("credits", "aqua", bodies, el, bg, bloopToggler, true), 
			new Orbiter("about", "gold", bodies, el, bg, bloopToggler, true), 
			new Orbiter("amaze", "deeppink", bodies, el, bg, bloopToggler, true), 
			new Orbiter("gameOfLife", "darkviolet", bodies, el, bg, bloopToggler, true)
		]
	);
	orbitPlanner.setDefaultOrbiters(orbiters);
	bg.width = window.innerWidth;
	bg.height = window.innerHeight;
	orbitPlanner.animateOrbiters();
	bg.addEventListener("click", () => {
			try {
				orbitPlanner.consoleCreator.closeConsole();
			} catch (noPanelOpen) {
				//ignore
			}
		}
	);
	window.addEventListener("resize", windowResizeDone);
}

function toggleBloops() {
	let isX = document.querySelector("h3");
	if (isX == null) {
		let bigX = document.createElement("h3");
		bigX.innerHTML = "X";
		bloopToggler.appendChild(bigX);
		bloopToggler.setAttribute("toggled", "true");
	} else {
		isX.remove();
		bloopToggler.setAttribute("toggled", "false");
	}
}

// if the user resizes the window, repath all of the blocks. The repathing will go into effect after 
//delayOnResize milliseconds of no additional resize adjustments:
function windowResizeDone(){
	if(consoleCreator.evacuated == true) {
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

