var diagonalLength = Math.sqrt(2) * blockWidth;
var orbiter;
function receiveMouseDown(e){
	orbiter = e.path[0];
	var width = orbiter.getBoundingClientRect().width
	orbiter.style.top = e.clientY;
	orbiter.style.left = e.clientX;
	orbiter.setAttribute("class", "beingDragged");
	//orbiter.style.transform = "rotate(" + getBlockAngle(width) + "rad)";	
	receiveMouseMove(e);
	window.addEventListener("mousemove", receiveMouseMove);
	window.addEventListener("mouseup", receiveMouseUp);
}

function receiveMouseMove(e){
	orbiter.style.top = e.clientY + "px";
	orbiter.style.left = e.clientX + "px";
} 


function receiveMouseUp(e){
	window.removeEventListener("mousemove", receiveMouseMove);
	window.removeEventListener("mouseup", receiveMouseUp);
	receiveMouseMove(e);
	evacuate(orbiter.id, [e.clientX, e.clientY])
}

function getBlockAngle(width){
	var travelX = (width - blockWidth) / 2;
	var unitTravelX = travelX / (diagonalLength / 2);
	return Math.acos(unitTravelX);
}


