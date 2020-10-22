var canvasBin;
var userRGBA = [0,0,0,255];
var userThickness = 3;
var pathRGBA = [255, 0, 0, 255];
var pathThickness = 1;
var borderRGBA = [216,191,216, 255];
var borderThickness = 1;
var safeSpace = 40;
var prevCanX, prevCanY;
var canvas;
var pathlessData;
var lowerBoundY, upperBoundY, leftBoundX, rightBoundX;
var borderDrawn = false;
var borderBuffer = 3;
var ctx;

function makeCanvasBin(canvas){
	canvas = document.getElementById("pfcanvas");
	canvasBin = new Array();
	for(var i = 0; i < canvas.height; i++){
		var myCol = new Array();
		for(var j = 0; j < canvas.width; j++){
			myCol.push(0);
		}
		canvasBin.push(myCol);
	}
	lowerBoundY = (canvasBin.length * 0.95) << 0;
	rightBoundX = (canvasBin[0].length * 0.95) << 0;
	leftBoundX = (canvasBin[0].length * 0.05) << 0;
	upperBoundY = (canvasBin.length * 0.05) << 0;
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
		drawDot(imageData, currNode.x, currNode.y, pathRGBA, pathThickness, "path");
		currNode = currNode.parent;
	}
	ctx.putImageData(imageData, 0, 0);
	prevCanX = prevCanY = null;
}

function updateCanvas(e){
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
	drawDot(imageData, canX << 0, canY << 0, userRGBA, userThickness);
	while(distGone + (0.5 * userThickness) <= dist){		
		distGone += userThickness;
		drawDot(imageData, canX + (distGone * vec[0]) << 0, canY + (distGone * vec[1]) << 0, userRGBA, userThickness);
	}
	prevCanY = canY;
	prevCanX = canX;
	ctx.putImageData(imageData, 0, 0);
}

function drawDot(imageData, pixX, pixY, rgba, radius, type = "user"){
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
					canvasBin[pixY + j][pixX + i] = 1;
				}
				var pix = ((pixY + j) * canvas.width) + pixX + i;
				pix *= 4;
				var isBorderCell = true;
				for(var k = 0; k < 4; k++){
					isBorderCell = imageData.data[pix + k] != borderRGBA[k] ? false : isBorderCell;
				}	
				if(!isBorderCell){
					for(var k = 0; k < 4; k++){
						imageData.data[pix + k] = rgba[k];
						if(type != "path"){
							pathlessData.data[pix + k] = rgba[k];
						}
					}	
				}
			}
		}
}

function initialize(){
	canvas = document.getElementById("pfcanvas");
	ctx = canvas.getContext("2d");
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	pathlessData = ctx.createImageData(imageData);
	makeCanvasBin();
	for(var i = leftBoundX - borderBuffer; i <= rightBoundX + borderBuffer; i += Math.max(1, borderThickness / 2)){
		drawDot(imageData, i, upperBoundY - borderBuffer, borderRGBA, borderThickness, "border");
		drawDot(imageData, i, lowerBoundY + borderBuffer, borderRGBA, borderThickness, "border");
	}
	for(var i = upperBoundY - borderBuffer; i <= lowerBoundY + borderBuffer; i += Math.max(1, borderThickness / 2)){
		drawDot(imageData, leftBoundX - borderBuffer, i, borderRGBA, borderThickness, "border");
		drawDot(imageData, rightBoundX + borderBuffer, i, borderRGBA, borderThickness, "border");
	}
	ctx.putImageData(imageData, 0, 0)
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
	var queue = new Array(currNode);
	while(queue.length != 0){
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
		currNode = queue.shift();
	}
	//printArr(arr);
	return currNode.x == targetNode.x && currNode.y == targetNode.y ? currNode : null;
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

