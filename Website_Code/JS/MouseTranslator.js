
var node;
function receiveMouseDown(e){
	node = e.path[0];
	node.style.top = e.clientY;
	node.style.left = e.clientX;
	node.setAttribute("class", "beingDragged");
	receiveMouseMove(e);
	window.addEventListener("mousemove", receiveMouseMove);
	window.addEventListener("mouseup", receiveMouseUp);
}

function receiveMouseMove(e){
	node.style.top = e.clientY + "px";
	node.style.left = e.clientX + "px";
} 


function receiveMouseUp(e){
	window.removeEventListener("mousemove", receiveMouseMove);
	window.removeEventListener("mouseup", receiveMouseUp);
	receiveMouseMove(e);
	evacuate(node.id, [e.clientX, e.clientY])
}


