var diagonalLength = Math.sqrt(2) * blockWidth;
var orbiter;
var offsetLeft;
var offsetTop;
var origDist;
var origAngle;
var center;
var windowResize = -1;
var remakeOrbiters = -1;
function receiveMouseDown(e){
	center = [(window.innerWidth - blockWidth) / 2, (window.innerHeight - blockHeight) / 2];
	orbiter = e.path[0];
	var firstRect = orbiter.getBoundingClientRect();
	var firstPoint = [(firstRect.left + firstRect.right) / 2, (firstRect.top + firstRect.bottom)  / 2];
	offsetLeft = e.clientX - firstRect.left;
	offsetTop = e.clientY - firstRect.top;
	origDist = getDist(center, firstPoint);
	window.requestAnimationFrame(
		() => {
				window.requestAnimationFrame(
					() =>{
						var secondRect = orbiter.getBoundingClientRect()
						var secondPoint = [(secondRect.left + secondRect.right) / 2, (secondRect.top + secondRect.bottom) / 2];
						//console.log(secondRect);
						var vec = [secondPoint[0] - firstPoint[0], secondPoint[1] - firstPoint[1]];
						origAngle = Math.atan(vec[1]/vec[0]);
						orbiter.style.top = e.clientY - offsetTop;
						orbiter.style.left = e.clientX - offsetLeft;
						orbiter.setAttribute("class", "beingDragged");
						orbiter.style.background = ids.get(orbiter.id);
						orbiter.style.transform = "rotate(" + origAngle + "rad)";	
						receiveMouseMove(e);
						window.addEventListener("mousemove", receiveMouseMove);
						window.addEventListener("mouseup", receiveMouseUp);
						//console.log(orbiter.getBoundingClientRect())
					}
				);	
			}
		);
}

function receiveMouseMove(e){
	var newPos = [e.clientX - offsetLeft, e.clientY - offsetTop];
	orbiter.style.top = newPos[1] + "px";
	orbiter.style.left = newPos[0] + "px";
	var distToCenter = getDist(center, newPos);
	var newAngle = (origAngle / origDist) * distToCenter;
	//console.log(distToCenter);
	orbiter.style.transform = "rotate(" + newAngle + "rad)";
} 


function receiveMouseUp(e){
	window.removeEventListener("mousemove", receiveMouseMove);
	window.removeEventListener("mouseup", receiveMouseUp);
	receiveMouseMove(e);
	var RecepRect = document.getElementById("receptacle").getBoundingClientRect();
	var orbiterRect = orbiter.getBoundingClientRect(); 
	var orbiterCenter = [(orbiterRect.left + orbiterRect.right) / 2, (orbiterRect.top + orbiterRect.bottom) / 2];
	var remove = false;
	if(getDist(orbiterCenter, center) < blockWidth){
		orbiter.style.top = center[0] - (blockWidth / 2);
		orbiter.style.left = center[1] - (blockWidth / 2);
		makeConsole(orbiter.id);
		remove = true;
		orbiter.remove();
	}
	if(!remove){
		evacuate(orbiter.id, [e.clientX, e.clientY])
	}
	makeOrbiters([orbiter.id]);
}

function getBlockAngle(width, rad = true){
	 var rads = (Math.PI/4) - Math.acos(width / diagonalLength);
	 return rads * (180 / Math.PI)
}

function windowResizeDone(){
	clearTimeout(windowResize);
	windowResize = setTimeout( 
		()=> {
			evacuateAll();
			setTimeout(makeOrbiters, evacuateTime);
		}, 500);
}


