var canvasBin;
var userRGBA = [0,0,0,255]; // black
var userThickness;
var pathRGBA = [255, 0, 0, 255]; // red
var pathThickness;
var eraseRGBA = [0, 0, 0, 0] //white
var safeSpace = 40;
var prevCanX, prevCanY;
var canvas;
var pathlessData;
var lowerBoundY, upperBoundY, leftBoundX, rightBoundX;
var borderDrawn = false;
var ctx;

function makeBlankArr(can){
	canvas = document.getElementById("pfcanvas");
	blankArr = new Array();
	for(var i = 0; i < can.height; i++){
		var myCol = new Array();
		for(var j = 0; j < can.width; j++){
			myCol.push(0);
		}
		blankArr.push(myCol);
	}
	lowerBoundY = (blankArr.length * 0.95) << 0;
	rightBoundX = (blankArr[0].length * 0.95) << 0;
	leftBoundX = (blankArr[0].length * 0.05) << 0;
	upperBoundY = (blankArr.length * 0.05) << 0;
	return blankArr;
}

function copyArray(arr){
	copy = new Array();
	for(var i = 0; i < arr.length; i++){
		var row = new Array();
		for(var j = 0; j < arr[0].length; j++){
			row.push(arr[i][j]);
		}
		copy.push(row);
	}
	return copy;
}

function drawShortestPath(){
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var currNode = getPath(copyArray(canvasBin));
	while(currNode != null){
		drawDot(imageData, currNode.x, currNode.y, pathRGBA, pathThickness, false, "path");
		currNode = currNode.parent;
	}
	ctx.putImageData(imageData, 0, 0);
	prevCanX = prevCanY = null;
}

function updatePfCanvas(e, erase = false){
	//console.log("updating canvas");
	canvas = document.getElementById("pfcanvas");
	var rect = canvas.getBoundingClientRect();
	imageData = pathlessData;
	var offsetX = e.clientX - rect.left;
	var offsetY = e.clientY - rect.top;
	var canX = ((offsetX / rect.width) * canvas.width) << 0;
	var canY = ((offsetY / rect.height) * canvas.height) << 0;
	prevCanX = prevCanX == null ? canX : prevCanX;
	prevCanY = prevCanY == null ? canY : prevCanY;
	var vec = [prevCanX - canX, prevCanY - canY];
	var dist = getDist([0,0], vec);
	vec = normalizeVector(vec);
	var distGone = 0;
	drawDot(imageData, canX << 0, canY << 0, userRGBA, userThickness, erase);
	while(distGone + (0.3 * userThickness) <= dist){		
		distGone += (0.3 * userThickness);
		drawDot(imageData, canX + (distGone * vec[0]) << 0, canY + (distGone * vec[1]) << 0, userRGBA, userThickness, erase);
	}
	prevCanY = canY;
	prevCanX = canX;
	ctx.putImageData(imageData, 0, 0);
}

function drawDot(imageData, pixX, pixY, rgba, radius, erase = false, type = "user"){
	//console.log("drawing dot");
	if(type == "user" && (getDist([pixX, pixY], [leftBoundX, upperBoundY]) < safeSpace || getDist([pixX, pixY], [rightBoundX, lowerBoundY]) < safeSpace)){
		return;
	}
	for(var i = -1 * radius; i < radius; i++){
			var upper = Math.sqrt(Math.pow(radius, 2) - Math.pow(i, 2))
			upper = Math.round(upper) << 0;
			var lower = -1 * upper;
			//var lower = -1 * radius, upper = radius;
			for(var j = lower; j <= upper; j++){
				if((pixX + i <= 0) || (pixY + j <= 0) || (pixX + i >= canvas.width) || (pixY + j >= canvas.height)){
					continue;
				}
				if(type == "user"){
					canvasBin[pixY + j][pixX + i] = erase ? 0 : 1;
				}
				var pix = ((pixY + j) * canvas.width) + pixX + i;
				pix *= 4;
				for(var k = 0; k < 4; k++){
					imageData.data[pix + k] = erase ? 0 : rgba[k];
					if(type != "path"){
						pathlessData.data[pix + k] = erase ? 0 : rgba[k];
					}
				}
			}
		}
}

function pfInitialize(){
	canvas = document.getElementById("pfcanvas");
	ctx = canvas.getContext("2d");
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	pathlessData = ctx.createImageData(imageData);
	pathThickness = canvas.width * 0.002;
	userThickness = canvas.width * 0.006;
	canvasBin = makeBlankArr(canvas);
}

function getPathArr(node){
	arr = [];
	while(node != null){
		arr.push([node.x, node.y]);
		node = node.parent;
	}
	return arr;	
}

function getPath(arr){
	var targetNode = new Node(rightBoundX - 1, lowerBoundY - 1);
	var currNode = new Node(leftBoundX + 1, upperBoundY + 1);
	var queue = new Queue();
	queue.push(currNode);
	while(!queue.isEmpty()){
		for(var i = Math.max(currNode.y - 1, upperBoundY); i <= Math.min(currNode.y + 1, lowerBoundY); i++){
			for(var j = Math.max(currNode.x - 1, leftBoundX); j <= Math.min(currNode.x + 1, rightBoundX); j++){
				if(i == targetNode.y && j == targetNode.x){
					targetNode.parent = currNode;
					return targetNode;
				}
				if((i != currNode.y || j != currNode.x) && (arr[i][j] == 0 || arr[i][j] == 2)){
					queue.push(new Node(j, i, currNode));
					arr[i][j] = 3;
				}
			}
		}
		currNode = queue.poll();
	}
	//printArr(arr);
	return currNode.x == targetNode.x && currNode.y == targetNode.y ? currNode : null;
}

function resetPfCanvas(){
	var newCanvas = ctx.createImageData(canvas.width, canvas.height);
	ctx.putImageData(newCanvas, 0, 0);
	pathlessData = ctx.createImageData(canvas.width, canvas.height);
	canvasBin = makeBlankArr(canvas);
}

	
function printArr(arr){
	var str = "";
	for(var i = 0; i < arr.length; i++){
		for(var j = 0; j < arr[0].length; j++){
			str += arr[i][j];
		}
		str += "\n";
	}
	console.log(str);
}

function Node(x, y, parent = null){
	this.x = x;
	this.y = y;
	this.parent = parent;
}

