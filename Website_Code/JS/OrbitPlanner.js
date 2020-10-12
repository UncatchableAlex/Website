var bloopNum;
var ids = new Array("a", "b", "c", "d", "e");
//var ids = new Array("a");
var bloopTimeout = 2000;
var bloopRefresh = 80;
var blockWidth = 150;
var blockHeight = 150;
//how smooth the curves transitions are guarenteed to be. Higher number is smoother. Choose number between 0 and pi/2:
var smoothness = Math.PI/6;

function makeOrbiters(){
	// get the document's stylesheet:
	var ss = document.styleSheets[0];
	// for each id:
	for(var i = 0; i < ids.length; i++){
			var h = window.innerHeight, w = window.innerWidth;
			var id = ids[i];
			// make new rule for the specific id and add it to the stylesheet:
			ss.insertRule(makeRule(id));
			// make a new div element:
			var orbiter = document.createElement("div");
			// set its class to the stylesheet that was just created:
			orbiter.setAttribute("class", id);
			orbiter.setAttribute("id", id);
			orbiter.addEventListener("mousedown", function(e){trackMovements(e)})
			document.getElementById("bodies").appendChild(orbiter);
			make = setInterval("makeBloop('" + id + "')", bloopRefresh);

		}
}


function killBloop(id){
	document.getElementById(id).remove();
}


function makeBloop(id){
	bloopNum = (bloopNum < 2000000) ? ++bloopNum : 0;

	var node = document.getElementById(id);
	var rect = node.getBoundingClientRect();
	var left = (rect.left + rect.right) >> 1;
	var top = (rect.top + rect.bottom) >> 1;
	var bloop = document.createElement("div");
	bloop.setAttribute("class", "bloop");
	bloop.setAttribute("id", "bloop" + bloopNum);
	bloop.setAttribute("style", "top: " + top + "px; left: " + left + "px;");
	document.getElementById("bloops").appendChild(bloop);
	setTimeout("killBloop('" + bloop.id + "')", bloopTimeout);
}

function makeRule(id){
	var origin = getOffScreenPoint();
	// make a point to end at (don't be confused as to the name. It will make sense later):
	var startPoint = getRandomPoint(origin);
	// make a random first control point:
	var firstCtrl = getRandomPoint(origin);
	// make a second control point (once again, the name will make sense later):
	var prevCtrl = getSecondCtrlPoint(origin, firstCtrl, startPoint); 
	// these guys will be used later. Keep them null for now though:
	var ctrlPoint2, ctrolPoint1, endPoint;
	// start making a new rule:
	var rule = "." + id + "{background: red; position: absolute; border-radius: 0%; height: 150px; width: 150px;" +
				"top:0px; left: 0px; z: 200000; offset-path: path('M " + origin[0] + " " + origin[1] + " C " + firstCtrl[0] + " " +
				firstCtrl[1] + " " + prevCtrl[0] + " " + prevCtrl[1] + " " + startPoint[0] + " " + startPoint[1];
	// make between 7 and 15 svg bezier curve paths:
	var iterations = getRandomIntInRange(7, 15);
	for(var i = 0; i < iterations; i++){
		// get a control point that is colinear with the startpoint and the last control point:
		ctrlPoint1 = getFirstCtrlPoint(prevCtrl, startPoint);
		// generate a random end point that is at least 500 px away from the starting point:
		endPoint = getRandomPoint(startPoint);
		// get a random second control point that is at least 500 px away from the starting point:
		ctrlPoint2 = getSecondCtrlPoint(startPoint, ctrlPoint1, endPoint);
		//ctrlPoint2 = getRandomPoint(startPoint);
		// append the curve to our rule:
		rule += (" C " + ctrlPoint1[0] + " " + ctrlPoint1[1] + " " + ctrlPoint2[0] + " " + ctrlPoint2[1] + " " + endPoint[0] + " " + endPoint[1]);
		// update prevCtrl and startPoint for next iteration:
		prevCtrl = ctrlPoint2;
		startPoint = endPoint;
	}
	// add a final destination offscreen:
	ctrlPoint1 = getFirstCtrlPoint(prevCtrl, startPoint);
	endPoint = getOffScreenPoint();
	ctrlPoint2 = getSecondCtrlPoint(startPoint, ctrlPoint1, endPoint);
	rule += (" C " + ctrlPoint1[0] + " " + ctrlPoint1[1] + " " + ctrlPoint2[0] + " " + ctrlPoint2[1] + " " + endPoint[0] + " " + endPoint[1]);
	// append all this gibberish to complete a pretty pretty pretty animation rule:
	rule += "'); offset-distance: 0%; animation: orbit; animation: orbit " + iterations * 5 + "s linear infinite; animation-fill-mode: forwards;}";
	console.log(rule);
	return rule;
}

function getFirstCtrlPoint(prevCtrl, startPoint){
	// make a unit vector pointing from the control point of the previous curve to the start point of this curve.
	var prevToStart = new Array(startPoint[0] - prevCtrl[0], startPoint[1] - prevCtrl[1]);
	var magnitude = getDist(prevCtrl, startPoint);
	prevToStart[0] /= magnitude
	prevToStart[1] /= magnitude;
	// make a new point specifying the cartesian coordinates of a random point in the direction of the previously calculated unit vector within 
	// 500 px of the start point:
	var ctrlPoint = new Array();
	var newMag = getRandomIntInRange(300, 500);
	ctrlPoint.push(((prevToStart[0] * newMag) + startPoint[0]) << 0);
	ctrlPoint.push(((prevToStart[1] * newMag) + startPoint[1]) << 0);
	return ctrlPoint;
}

function getSecondCtrlPoint(startPoint, firstCtrl, endPoint){
	// find the vector going from the first control point to the end point:
	var firstToEnd = [endPoint[0] - firstCtrl[0], endPoint[1] - firstCtrl[1]];
	// find the length of that vector:
	var lengthFTE = getDist([0,0], firstToEnd);
	// find both unit vectors perpendicular to first to end:
	var perp = normalizeVector(firstToEnd);
	var perp1 = rotateVector(perp, Math.PI / 2);
	var perp2 = flipVector(perp1);
	// find the midpoint between the first control point and the end point:
	var midPoint = [(firstCtrl[0] + endPoint[0]) / 2, (firstCtrl[1] + endPoint[1]) / 2]
	// find the vector going from the start point to the mid point:
	var midToStart = [startPoint[0] - midPoint[0], startPoint[1] - midPoint[1]];
	// we want to select the vector perpendicular to firstToEnd that has the shallowest angle with startToMid
	perp = getAngle(perp1, midToStart) > getAngle(perp2, midToStart) ? perp1 : perp2;
	// choose some random length for our final vector
	var mag = getRandomIntInRange(lengthFTE * 0.5, lengthFTE * 0.75);
	// choose a point along t * perp, mag away form the mid point between the first control point and the end point
	var secondCtrl = [midPoint[0] + (perp[0] * mag) << 0, midPoint[1] + (perp[1] * mag) << 0];
	return secondCtrl;
}

function getEndPoint(startPoint, firstCtrl){
	var givenVec = [firstCtrl[0] - startPoint[0], firstCtrl[1] - startPoint[1]];
	var perp = rotateVector(givenVec, Math.PI / 2);
	perp = normalizeVector(perp);
	var minMax = getMinMaxScalar(startPoint, perp);
	var mag = Math.abs(minMax[0]) > Math.abs(minMax[1]) ? getRandomIntInRange((minMax[0] * 0.75) << 0, minMax[0]) : getRandomIntInRange((minMax[1] * 0.75) << 0, minMax[1]);
	var midPoint = [(startPoint[0] + firstCtrl[0]) / 2, (startPoint[1] + firstCtrl[1]) / 2];
	var endPoint = new Array();
	endPoint.push((perp[0] * mag << 0) + midPoint[0]);
	endPoint.push((perp[1] * mag << 0) + midPoint[1]);
	return endPoint;
}

// returns an array with two elements: the largest and smallest a scalar can be and still point at a coordinate pair on screen.
function getMinMaxScalar(startPoint, unitVec){
	// evaluate left bound:
	var leftBound = unitVec[0] == 0 ? Number.MAX_VALUE : (-1 * startPoint[0]) / unitVec[0];
	var rightBound = unitVec[0] == 0 ? Number.MAX_VALUE :(window.innerWidth - blockWidth - startPoint[0]) / unitVec[0];
	var topBound = unitVec[1] == 0 ? Number.MAX_VALUE : (-1 * startPoint[1]) / unitVec[1];
	var bottomBound = unitVec[1] == 0 ? Number.MAX_VALUE : (window.innerHeight - blockHeight - startPoint[1]) / unitVec[1];
	var directions = [[leftBound, topBound], [rightBound, topBound], [bottomBound, leftBound], [bottomBound, rightBound]];
	directions.sort(function(a,b){return Math.min(a[0], a[1]) - Math.min(b[0], b[1])})
	var min = Math.min(directions[0][0], directions[0][1]);
	var max = Math.min(directions[directions.length - 1][0], directions[directions.length - 1][1]);
	return [min << 0, max << 0];
}


// use the dot product cosine rule to get the angle between two vectors: dot(a,b) = magnitude(a) * magnitude(b) * cos(theta). Solve for theta.
function getAngle(vecA, vecB){
	var dot = (vecA[0] * vecB[0]) + (vecA[1] * vecB[1]);
	var magA = getDist([0,0], vecA);
	var magB = getDist([0,0], vecB);
	return Math.acos(dot / (magA * magB));
}

function rotateVector(vec, theta){
	var xcomponent = (vec[0] * Math.cos(theta)) - (vec[1] * Math.sin(theta));
	var ycomponent = (vec[0] * Math.sin(theta)) + (vec[1] * Math.cos(theta));
	return new Array(xcomponent, ycomponent);
}

function normalizeVector(vec){
	var mag = getDist(new Array(0,0), vec);
	return new Array(vec[0] / mag, vec[1] / mag);
}

function flipVector(vec){
	return new Array(vec[0] * -1, vec[1] * -1);
}

function getVectorEndPoint(startPoint, vec){
	return new Array(vec[0] + startPoint[0], vec[1] + startPoint[1]);
}


function getRandomPoint(startPoint = null){
	var endPoint = new Array(getRandomIntInRange(0, window.innerWidth - 150), getRandomIntInRange(0, window.innerHeight - 150))
	if(startPoint != null){
		while(getDist(startPoint, endPoint) < 500){
			endPoint[0] = getRandomIntInRange(0, window.innerWidth - 150);
			endPoint[1] = getRandomIntInRange(0, window.innerHeight - 150);
		}
	}
	//console.log("frameh: " + frameh + "\n framew: " + framew + "\n left: " + 150 + "\n top: " + 150)
	return endPoint;
}

function getDist(p1, p2){
	// distance formula: L = sqrt((x1-x2)^2 + (y1-y2)^2)
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)) << 0;
}

function getRandomIntInRange(first, second){
	var a = Math.min(first, second), b = Math.max(first, second);
	return (((b - a) * Math.random()) + a) << 0
}
function getOffScreenPoint(){
	var rand = Math.random();
	if(rand >= 0.75){
		return new Array(-200,-200);
	}
	else if(rand >= 0.50){
		return new Array(-200, window.innerHeight + 200);
	}
	else if(rand >= 0.25){
		return new Array(window.innerWidth + 200, -200);
	} else {
		return new Array(window.innerWidth + 200, window.innerHeight + 200);
	}
}