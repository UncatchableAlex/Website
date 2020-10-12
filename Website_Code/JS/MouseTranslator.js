var checkinDue = false;
var checkinFreq = 50;
var node;
function receiveMouseDown(e){
	var node = e.path[0];
	node.setAttribute("class", "beingDragged");
	node.setAttribute("style", "top: " + e.pageY + "; left: " + e.pageY);
	node.addEventListener("mousemove", function(e){receiveMouseMove(e)});
	node.addEventListener("mouseup", function(e){receiveMouseup(e)});
	setTimeout(function(){checkinDue = true;}, checkinFreq);
}

function receiveMouseMove(e){
	if(!checkinDue){return;}

} 


function receiveMouseUp(){
	node.removeEventListener("mousemove", function(e){receiveMouseMove})
	node.removeEventListener("mouseup", function(e){receiveMouseup(e)})
}



/*
altKey: false
bubbles: true
button: 0
buttons: 1
cancelBubble: false
cancelable: true
clientX: 525
clientY: 705
composed: true
ctrlKey: false
currentTarget: null
defaultPrevented: false
detail: 1
eventPhase: 0
fromElement: null
isTrusted: true
layerX: 525
layerY: 790
metaKey: false
movementX: 0
movementY: 0
offsetX: 681
offsetY: 80
pageX: 525
pageY: 790
path: (6) [div#a.a, section#bodies.wholeScreen, body, html, document, Window]
relatedTarget: null
returnValue: true
screenX: 394
screenY: 632
shiftKey: false
sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
srcElement: div#a.a
target: div#a.a
timeStamp: 11023.92999996664
toElement: div#a.a
type: "mousedown"
view: Window {parent: Window, opener: null, top: Window, length: 0, frames: Window, …}
which: 1
x: 525
y: 705*/