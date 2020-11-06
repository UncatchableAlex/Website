"use strict";
class GameOfLife extends Console{
	// the color of the GameOfLife console's border:
	static BORDER_COLOR = "lavender";

	// make default seeds that the user can choose from:
	static PATTERNS = new Map(
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
		);


// initialize another Game of Life instance (ie, start from scratch):
	constructor(consoleCreator, canvasId, numCellsAcross = 200, patternList = ["block", "fpentomino", "rpentomino", "bheptomino", "spacefiller"]){
		super(consoleCreator);
		// these sets hold the cells that will either become alive or cease being alive for the next tick:
		this.birthSet = new Set();
		this.killSet = new Set();

		// holds the interval at which the ticks occur:
		this.tickInterval;

		// whether or not the squares are being drawn in rgb.
		this.colored = true;

		// the patterns that the user is actually going to see. More are defined below, but these are the ones that are going to be in play
		this.patternList = patternList;

		// the previous pattern that was selected by the user:
	    this.prevPattern = this.patternList[0];

	    // the current pattern selected by the user:
	    this.currPattern = this.patternList[0];

		// holds the return value from the setInterval() calling this.tick().
		this.tickInterval;

		// the frequency at which this.tick is being called.
		this.tickPeriod;



		// the canvas that this game of life will paint to:
		this.canvas = this.makeCanvas(canvasId, 0, 0, numCellsAcross * 4, numCellsAcross * 3);

		if(this.canvas.width % numCellsAcross != 0){
			throw "cells across isn't a factor of width";
		}
		// the size of each cell in canvas units:
		this.cellSize = this.canvas.width / numCellsAcross;

		// make sure that the dimensions can fit an whole number of cells:
		if(this.canvas.height % this.cellSize != 0){
			throw "cell height isn't a factor of this.canvas height";
		}
		// get the 2d context and make a new cell array:
		this.ctx = this.canvas.getContext("2d", {alpha: false});
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.cellArr = this.makeCellArr(this.canvas, this.cellSize);

	}


	// adjust the interval at which the ticks occur:
	adjTickInterval (newInterval){
		clearInterval(this.tickInterval);
		setInterval(tick, newInterval);
	}

	// update the game to its next state:
	tick(){
		let killList = Array.from(this.killSet.keys());
		let birthList = Array.from(this.birthSet.keys());

		// for each cell that is being killed, switch its "isAlive" state to false and paint over it with a white box:
		killList.forEach(currCell => 
			{
				currCell.isAlive = false;
				this.ctx.fillStyle = "white";
				this.ctx.fillRect(currCell.x * this.cellSize, currCell.y * this.cellSize, this.cellSize, this.cellSize);
			}
		);

		// for each cell that is being brought to life, switch its "isAlive" state to true, adjust its rgb, and paint it accordingly:
		if(!this.colored){
			this.ctx.fillStyle = "black";
		}

		birthList.forEach(currCell => 
			{
				currCell.isAlive = true;
				currCell.setRGB();
				if(this.colored){
					this.ctx.fillStyle = "rgb(" + currCell.rgb[0] + "," + currCell.rgb[1] + "," + currCell.rgb[2] + ")";
				}
				this.ctx.fillRect(currCell.x * this.cellSize, currCell.y * this.cellSize, this.cellSize, this.cellSize);
			}
		);
		// clear the sets for the next tick:
		this.killSet.clear();
		this.birthSet.clear();

		// update all of the neighbors of the changed cells for the next tick:
		birthList.forEach(currCell => this.updateNeighbors(currCell, false))
		killList.forEach(currCell => this.updateNeighbors(currCell, true));
	}

	updateNeighbors(cell, isDying){
		// for each of the cells surrounding the given cell:
		for(let i = Math.max(cell.x - 1, 0); i <= Math.min(this.cellArr[0].length - 1, cell.x + 1); i++){
			for(let j = Math.max(cell.y - 1, 0); j <= Math.min(this.cellArr.length - 1, cell.y + 1); j++){
				let currCell = this.cellArr[j][i];

				// evaluate the given cell separately, when it comes up in the for loops:
				if(i == cell.x && j == cell.y){
					if(currCell.isAlive && (currCell.neighbors > 3 || currCell.neighbors < 2)){
						this.killSet.add(currCell);
					}
					else if(!currCell.isAlive && currCell.neighbors == 3){
						this.birthSet.add(currCell)
					}
					continue;
				}
				// adjust the number of neighbors the current cell has:
				currCell.neighbors = isDying ? currCell.neighbors - 1 : currCell.neighbors + 1;

				// if the current cell is alive and is now experiencing overpopulation, add it to the killSet:
				if(currCell.isAlive && (currCell.neighbors > 3 || currCell.neighbors < 2)){
					this.killSet.add(currCell);
				}
				// if the current cell is dead and is now in perfect conditions, add it to the birthSet:
				else if(!currCell.isAlive && currCell.neighbors == 3){
					currCell.parent = cell;
					this.birthSet.add(currCell)
				}
				// if the current cell is dead and in the birthSet, but it now is experiencing overpopulation, remove it from the birthSet:
				else if(!currCell.isAlive && this.birthSet.has(currCell) && currCell.neighbors != 3){
					this.birthSet.delete(currCell);
				}

				// if the current cell is alive and in the killSet, but is now has 2 or 3 neighbors, remove it from the killSet:
				else if(currCell.isAlive && this.killSet.has(currCell) && (currCell.neighbors == 2 || currCell.neighbors == 3)){
					this.killSet.delete(currCell); 
				}
			}
		}
	}

	// place the user-specified pattern at the location of a click event:
	placePattern(e, pname){
		// get the pattern binary array from the pattern set:
		let pattern = GameOfLife.PATTERNS.get(pname);

		// convert the event coordinates to canvas coordinates:
		let rect = this.canvas.getBoundingClientRect();
		let offsetX = e.clientX - rect.left;
		let offsetY = e.clientY - rect.top;
		let canX = ((offsetX / rect.width) * this.canvas.width) << 0;
		let canY = ((offsetY / rect.height) * this.canvas.height) << 0;

		// find which cell they clicked on:
		canX = ((canX / this.cellSize) << 0) * this.cellSize;
		canY = ((canY / this.cellSize) << 0) * this.cellSize;	

		// center the pattern on the click:
		let patternOffsetX = (pattern[0].length >> 1) * this.cellSize;
		let patternOffsetY = (pattern.length >> 1) * this.cellSize;
		canX -= patternOffsetX;
		canY -= patternOffsetY;

		// keep track of the cells that are being brought to life, so they can be painted:
		let cellsAdded = new Array();

		// for each cell in the pattern array:
		for(let i = 0; i < pattern[0].length; i++){
			for(let j = 0; j < pattern.length; j++){
				let pixX = canX + (i * this.cellSize);
				let pixY = canY + (j * this.cellSize);
				let cellsOver = pixX / this.cellSize;
				let cellsDown = pixY / this.cellSize;

				// if the cell of the pattern is onscreen:
				if(cellsOver < this.cellArr[0].length  && cellsDown < this.cellArr.length && cellsOver >= 0 && 
					cellsDown >= 0 && !this.cellArr[cellsDown][cellsOver].isAlive && pattern[j][i] == 1){

					// find the corresponding cell in the cellArr, make it alive, and append it to the cellsAdded array:
					let currCell = this.cellArr[cellsDown][cellsOver];
					currCell.isAlive = true;
					cellsAdded.push(currCell);
				}
			}
		}

		// find the cell at the center of the pattern:
		let origin = this.cellArr[((canY + patternOffsetY) / this.cellSize) << 0][((canX + patternOffsetX) / this.cellSize) << 0]

		// for each cell that will be added, paint it the correct color in the correct location.
		if(!this.colored){
			this.ctx.fillStyle = "black";
		}

		cellsAdded.forEach(cell => 
			{	
				cell.origin = cell.parent = origin;
				cell.setRGB();
				this.updateNeighbors(cell, false);
				if(this.colored){
					this.ctx.fillStyle = "rgb(" + cell.rgb[0] + "," + cell.rgb[1] + "," + cell.rgb[2] + ")";
				}
				this.ctx.fillRect(cell.x * this.cellSize, cell.y * this.cellSize, this.cellSize, this.cellSize);
			}
		);
	}

	// make new array of dead cells that fits the given canvas with the given cell size:
	makeCellArr(canvas, cellSize){
		let arr = new Array();
		for(let j = 0; j < (canvas.height / cellSize); j++){
			let row = new Array();
			for(let i = 0; i < (canvas.width / cellSize); i++){
				let cell = new Cell(i, j);
				row.push(cell);
			}
			arr.push(row);
		}
		return arr;
	}

	// return a canvas element with the specified name, coordinates, and size:
	makeCanvas(canvasName, left, top, width, height){
 		let canvas = document.createElement("canvas");
	   	canvas.id = canvasName;
	    canvas.style.left = left + "%";
	    canvas.style.top = top + "%";
	    canvas.width = width;
	    canvas.height = height;
	    return canvas;
	}

	// make a new console for the game of life:
	renderConsole(){
		// make the basic console template:
		let golConsole = super.getGenericConsoleTemplate("gol", GameOfLife.BORDER_COLOR);
	    golConsole.style.height = golConsole.style.width = "80%";
	    golConsole.style.top = "5%";
	    golConsole.style.left = "7.5%";

	    // make a container for the canvas so that it has a nice grey border around it:
	    let canvasContainer = document.createElement("container");
	    golConsole.appendChild(canvasContainer);
	    canvasContainer.appendChild(this.canvas);

	    // this next statement is necessary because it allows this object to request references to itself from other scopes:
	    let self = this;

	    // add an event listener to the canvas for placing the selected 
	    this.canvas.addEventListener("click", function(e){self.placePattern(e, self.currPattern)})

	    // add a user-selectable tile for each pattern option:
	    for(let i = 0; i < this.patternList.length; i++){
	    	golConsole.appendChild(this.makeTile(3 + (i * 7) + "%", "5%", this.patternList[i]));
	    }

	    // set the border for the currently selected pattern to black
	    document.getElementById(this.currPattern).style.borderColor = "black";

	    // make a reset button:
	    let reset = document.createElement("button");
	    reset.innerHTML = "RESET!";
	    reset.style = "left: 59%; top: 16%; height: 5%; width: 7%; background: red; border: 2px solid black; font-size: 2.3vh";
	    reset.onclick = function(){
	    	self.birthSet.clear();
	    	self.killSet.clear();
	    	self.ctx.fillStyle = "white";
	    	self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
	    	self.cellArr = self.makeCellArr(self.canvas, self.cellSize);
	  	}
	  	golConsole.appendChild(reset);

	  	// make a go/stop button:
	  	let goButton = document.createElement("button");
	  	goButton.innerHTML = "GO!";
	  	goButton.style = "left: 59%; top: 4%; height: 5%; width: 7%; background: palegreen; border: 2px solid black; font-size: 2.3vh";
	  	goButton.onclick = function(){
		    if(goButton.innerHTML == "GO!"){
		    	if(self.tickInterval != null){
		        	clearInterval(self.tickInterval);
		      	}
		    	self.tickInterval = setInterval(function(){self.tick();}, self.tickPeriod);
		    	goButton.innerHTML = "STOP!";
		    	goButton.style.background = "pink";
		    } else {
		    	clearInterval(self.tickInterval);
		    	self.tickInterval = null;
		    	goButton.innerHTML = "GO!";
		    	goButton.style.background = "palegreen";
		    }
	  	}
		golConsole.appendChild(goButton);

		// make a slider for controlling the speed:
		let slider = document.createElement("input");
		slider.style = "width: 15%; height: 5%; top: 7%; left: 40%;";
		slider.type = "range";
		slider.min = "1"; 
		slider.max = "100";
		slider.value = "10";
		slider.id = "frequencySlider";
		slider.oninput = function(){
	  		console.log(slider.value);
	    	self.tickPeriod = (1000 / slider.value) << 0;
	    	if(goButton.innerHTML == "STOP!"){
	       		if(self.tickInterval != null){
	          		clearInterval(self.tickInterval);
	        	}
	      		self.tickInterval = setInterval(function(){self.tick();}, self.tickPeriod);
	    	}
	    }
		golConsole.appendChild(slider);

		// how many milliseconds pass between ticks:
		this.tickPeriod = (1000 / slider.value) << 0;

		// make a button that will increment the frame by one tick:
	  	let tickButton = document.createElement("button");
	  	tickButton.innerHTML = "Tick!";
	  	tickButton.style = "left: 59%; top: 10%; height: 5%; width: 7%; background: gold; border: 2px solid black; font-size: 2.3vh";
	  	tickButton.onclick = function(){self.tick();}
	  	golConsole.appendChild(tickButton);

	  	// make a container for the description box so that it will have a grey border:
	  	let descContainer = document.createElement("container");
	  	descContainer.setAttribute("class", "textContainer");
	  	descContainer.style = "left: 70%; top: 0%; width: 30%";
	  	golConsole.appendChild(descContainer);

	  	// give the demo a title:
	  	descContainer.appendChild(super.makeTitle("Life..."));

	  	// give the demo a description:
	  	let desc = document.createElement("p"); 
	  	desc.innerHTML = /*"Welcome to John Conway's " + super.italicize("Game of Life") + ". Back in his time, the only way to play this game was with " +
	  					"a Go set and a massive amount of patience. After computers came along, this game became significantly easier to play, but still, " +
	  					"something was missing. There was no easy way to keep track of which cells to kill each turn and which ones to ressurect. Enter the " +
	  					"hashset&emdash;A datastructure made of pure magic. "*/

	  	"This demonstration is based off of John Conway's " + super.italicize("Game of Life") + " but with a colorful twist. To the left there is a board" +
	  	" consisting of many \"dead\" cells in a large grid. The rules are simple: <br><br> 1.) Every turn, a dead cell will become alive if three of its eight neighbors are alive " +
	  	"<br>2.) Every turn, a live cell will die if more than three or fewer than two of its neighbors are alive. <br><br> To start, please select a tile from along the top bar of the left canvas " +
	  	" (its border will become dark when selected) and click on the canvas to place it. Click \"GO!\" to start the simulation and use the slider to control the speed. Good luck!";
	  	desc.style.height = "80%";
	  	desc.style.top = "12%";
	  	desc.style.width = "90%";
	  	descContainer.appendChild(desc);
	  	super.addXout(golConsole);
	}

	// make a user selectable tile displaying an image of the pattern that it represents:
	makeTile(left, top, patternName){  
		var image = document.createElement("img");
		image.src = "PatternPics/" + patternName + ".PNG";
		image.id = patternName;
		image.style = "left: " + left + "; top: " + top + "; height: 7vh; width: 7vh;";
		var self = this;
		image.addEventListener("click", function(){
	  		if(patternName == self.prevPattern){
	      		return;
	    	}
	    	self.currPattern = patternName;
	    	image.style.borderColor = "black";
	    	try{
	      		document.getElementById(self.prevPattern).style.borderColor = "lightgrey";
	    	}catch(error){/*Ignore. There was no prevPattern.*/}
	    	self.prevPattern = patternName;
  		});
  		return image;
	}
}


// define the Cell object:
function Cell(x, y, isAlive){
	// meant to hold an array with the values: [r,g,b]
	this.rgb;
	// the number of currently alive neighbors
	this.neighbors = 0;
	// the Cell's coordinates:
	this.x = x;
	this.y = y;
	// its current state:
	this.isAlive = false;
	// how many iterations it has been since starting
	this.dist = 1;
	// where the original center point was
	this.origin;
	// the cell that most recently directly affected this cell:
	this.parent;
}

// gives the Cell's most essential information in string format (for debugging mostly)
Cell.prototype.toString = function(){
	return "[" + this.x + ", " + this.y + "] " + this.isAlive;
}

// set the cell's color according to its position and iteration number
Cell.prototype.setRGB = function(){
	// make sure that the essential cell properties have been defined:
	if(this.parent == null){
		throw "You must define parent Cell before setting rgb";
	}
	this.origin = this.origin == null ? this.parent.origin : this.origin;

	// define how many cycles it takes to to reach the top of the blue range from the bottom
	let cycles = 40;

	// find the angle between this cell and the origin
	let dx = this.x - this.origin.x;
	let dy = this.y - this.origin.y;
	let theta = Util.getAngle([dx, dy], [1, 0]);
	if(dy < 0){
		theta = (2 * Math.PI) - theta;
	} else if(dy == 0){
		theta = 0;
	}
	// update the dist:
	this.dist = this.parent.dist + 1;

	// find the rgb using oscillating trig functions. The point is to zig-zag through the color spectrum as wildly as possible.
	// (When graphed in 3d, this parametrized function looks a bit like a half-slinky from hell. It's kind of neat):
	this.rgb = [
		Math.abs(255 * Math.cos(theta)) << 0, 
		Math.abs(255 * Math.sin(theta)) << 0, 
		Math.abs(255 * Math.sin(this.dist / cycles)) << 0
	];
}