var golCanvas;
var ctx;
var cellArr;
var birthSet = new Set();
var killSet = new Set();
var tickInterval;
var cellSize;
var numCellsAcross;

var patterns = new Map(
	[
		["block", [
			[[1]]]
		],
		["square", [
			[1,1],
			[1,1]]
		],
		["boat", [
			[1,1,0],
			[1,0,1],
			[0,1,0]]
		],
		["glider", [
			[1,1,1],
			[1,0,0],
			[0,1,0]]
		],
		["lightweight", [
			[0,1,0,0,1],
			[1,0,0,0,0],
			[1,0,0,0,1],
			[1,1,1,1,0]]
		],
		["fpentomino", [
			[0,1,0,0,0,0,0],
			[0,0,0,1,0,0,0],
			[1,1,0,0,1,1,1]]
		],
		["rpentomino", [
			[0,1,1],
			[1,1,0],
			[0,1,0]]
		],
		["bheptomino", [
			[1,0,1,1],
			[1,1,1,0],
			[0,1,0,0]]
		],
		["spacefiller", [
			[0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0],

			[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
			
			[0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]]
		]
	]
)

function adjTickInterval(interval){
	clearInterval(tickInterval);
	setInterval(tick, interval);
}

function tick(){
	var killList = Array.from(killSet.keys());
	var birthList = Array.from(birthSet.keys());
	killList.forEach(currCell => 
		{
			currCell.isAlive = false;
			ctx.fillStyle = "white";
			ctx.fillRect(currCell.x * cellSize, currCell.y * cellSize, cellSize, cellSize);
		}
	);
	birthList.forEach(currCell => 
		{
			currCell.isAlive = true;
			ctx.fillStyle = "rgb(" + currCell.rgb[0] + "," + currCell.rgb[1] + "," + currCell.rgb[2] + ")";
			ctx.fillRect(currCell.x * cellSize, currCell.y * cellSize, cellSize, cellSize);
		}
	);
	killSet.clear();
	birthSet.clear();
	birthList.forEach(currCell => updateNeighbors(currCell, false))
	killList.forEach(currCell => updateNeighbors(currCell, true));

}

function updateNeighbors(cell, isDying){
	var count = 0;
	for(var i = Math.max(cell.x - 1, 0); i <= Math.min(cellArr[0].length - 1, cell.x + 1); i++){
		for(var j = Math.max(cell.y - 1, 0); j <= Math.min(cellArr.length - 1, cell.y + 1); j++){
			var currCell = cellArr[j][i];
			if(i == cell.x && j == cell.y){
				if(currCell.isAlive && (currCell.neighbors > 3 || currCell.neighbors < 2)){
					killSet.add(currCell);
				}
				else if(!currCell.isAlive && currCell.neighbors == 3){
					birthSet.add(currCell)
				}
				continue;
			}
			currCell.neighbors = isDying ? currCell.neighbors - 1 : currCell.neighbors + 1;
			if(currCell.isAlive && (currCell.neighbors > 3 || currCell.neighbors < 2)){
				//currCell.adjColor(cell);
				killSet.add(currCell);
			}
			else if(!currCell.isAlive && currCell.neighbors == 3){
				currCell.setRGB(cell);
				birthSet.add(currCell)
			}
			else if(!currCell.isAlive && birthSet.has(currCell) && currCell.neighbors != 3){
				birthSet.delete(currCell);
			}
			else if(currCell.isAlive && killSet.has(currCell) && (currCell.neighbors == 2 || currCell.neighbors == 3)){
				killSet.delete(currCell); 
			}
		}
	}
}

function resetGolCanvas(){

}

function placePattern(e, pname){
	var pattern = patterns.get(pname);
	var rect = golCanvas.getBoundingClientRect();
	var offsetX = e.clientX - rect.left;
	var offsetY = e.clientY - rect.top;
	var canX = ((offsetX / rect.width) * golCanvas.width) << 0;
	var canY = ((offsetY / rect.height) * golCanvas.height) << 0;
	canX = ((canX / cellSize) << 0) * cellSize;
	canY = ((canY / cellSize) << 0) * cellSize;	
	var patternOffsetX = ((pattern[0].length / 2) << 0) * cellSize;
	var patternOffsetY = ((pattern.length / 2) << 0) * cellSize;
	canX -= patternOffsetX;
	canY -= patternOffsetY;
	var cellsAdded = new Array();
	for(var i = 0; i < pattern[0].length; i++){
		for(var j = 0; j < pattern.length; j++){
			var pixX = canX + (i * cellSize);
			var pixY = canY + (j * cellSize);
			var cellsOver = pixX / cellSize;
			var cellsDown = pixY / cellSize;
			// if the pixel of the pattern is onscreen
			if(cellsOver < cellArr[0].length  && cellsDown < cellArr.length && cellsOver >= 0 && 
				cellsDown >= 0 && !cellArr[cellsDown][cellsOver].isAlive && pattern[j][i] == 1){
				var currCell = cellArr[cellsDown][cellsOver];
				currCell.isAlive = true;
				//currCell.origin = [(canX + patternOffsetX) / cellSize, (canY + patternOffsetY) / cellSize];
				cellsAdded.push(currCell);
			}
		}
	}
	cellsAdded.forEach(cell => 
		{	
			cell.origin = cellArr[((canY + patternOffsetY) / cellSize) << 0][((canX + patternOffsetX) / cellSize) << 0];
			cell.setRGB(cell.origin);
			updateNeighbors(cell, false);
			ctx.fillStyle = "rgb(" + cell.rgb[0] + "," + cell.rgb[1] + "," + cell.rgb[2] + ")";
			ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
		}
	);
}

function golInitialize(numCellsAcross = 200){
	golCanvas = document.getElementById("golCanvas");
	if(golCanvas.width % numCellsAcross != 0){
		throw "cells across isn't a factor of width";
	}
	cellSize = golCanvas.width / numCellsAcross;
	if(golCanvas.height % cellSize != 0){
		throw "cell height isn't a factor of golCanvas height";
	}
	ctx = golCanvas.getContext("2d", {alpha: false});
	cellArr = makeCellArr(golCanvas);
	birthSet.clear();
	killSet.clear();
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, golCanvas.width, golCanvas.height);
	//tickInterval = setInterval(tick, interval);
}

function makeCellArr(canvas){
	var arr = new Array();
	for(var j = 0; j < (canvas.height / cellSize); j++){
		var row = new Array();
		for(var i = 0; i < (canvas.width / cellSize); i++){
			var cell = new Cell(i, j);
			row.push(cell);
		}
		arr.push(row);
	}
	return arr;
}

function Cell(x, y, isAlive){
	this.rgb;
	this.neighbors = 0;
	this.x = x;
	this.y = y;
	this.isAlive = false;
	this.dist = 0;
	this.origin;
	this.rebound = false;
}

Cell.prototype.toString = function(){
	return "[" + this.x + ", " + this.y + "] " + this.isAlive;
}

Cell.prototype.setRGB = function(parent){
	var cycles = 40;
	this.origin = this.origin == null ? parent.origin : this.origin;
	var dx = this.x - this.origin.x;
	var dy = this.y - this.origin.y;
	var theta = getAngle([dx, dy], [1, 0]);
	if(dy < 0){
		theta = (2 * Math.PI) - theta;
	} else if(dy == 0){
		theta = 0;
	}
	this.rebound = this.rebound == 255 || this.rebound == 0 ? !this.rebound : this.rebound;
	this.dist = this.rebound ? parent.dist - 1 : parent.dist + 1;
	this.rgb = [
		Math.abs(255 * Math.cos(theta)) << 0, 
		Math.abs(255 * Math.sin(theta)) << 0, 
		Math.abs(255 * Math.sin(this.dist / cycles)) << 0
	];
}