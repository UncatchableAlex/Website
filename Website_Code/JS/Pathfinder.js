"use strict";

/*
	The Pathfinder class allows for the creation of a Pathfinder console where a user can draw a maze for the computer to execute a breadth-first
	search on. 
*/
class Pathfinder extends Console{

	// define static field variables:
	static USER_RGBA = [0,0,0,255]; // black
	static PATH_RGBA = [255, 0, 0, 255]; // red
	static ERASE_RGBA = [0, 0, 0, 0]; //white
	static MAZE_FILLED = 3;
	static MAZE_PATH = 2;
	static MAZE_WALL = 1;
	static MAZE_OPEN = 0;
	static PATH_THICKNESS_FACTOR = 0.002;
	static USER_THICKNESS_FACTOR = 0.006;

	// the radius of the "off limits" zone around the source and sink:
	static SAFESPACE = 40;

	// the color of the console's border:
	static BORDER_COLOR = "#FFC6C6";


	constructor(consoleCreator, canvasId, width, height){
		super(consoleCreator);

		// for storing the coordinates of the user's previous update:
		this.prevCan = null;

		// for storing the this.canvas that is being altered:
		this.canvas = this.makeCanvas(canvasId, width, height);

		// the width of the lines traced by the computer and the user:
		this.pathThickness = width * Pathfinder.PATH_THICKNESS_FACTOR;
		this.userThickness = width * Pathfinder.USER_THICKNESS_FACTOR;

		// for storing the this.canvas's 2d context:
		this.ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, width, height);

		// for storing a binary array representing the this.canvas state
		this.canvasBin = this.makeBlankArr(this.canvas);

		//store the image data for the canvas context without the computer's solution:
		this.pathlessData = this.ctx.getImageData(0, 0, width, height);

		// for storing the boundaries for any possible solution (ie, the computer cannot find a solution outside of these boundaries):
		this.lowerBoundY = (height * 0.95) << 0;
		this.rightBoundX = (width * 0.95) << 0;
		this.leftBoundX = (width * 0.05) << 0;
		this.upperBoundY = (height * 0.05) << 0;

		// whether or not the mouse is currently being depressed:
		this.mousedown = false;

		// whether or not the eraser is toggled:
		this.eraseToggle = false;

	}

	// make the canvas element that will be drawn on:
	makeCanvas(id, width, height){
		let canvas = document.createElement("canvas");
		canvas.id = id;
		canvas.style.left = "0%";
		canvas.width = width;
		canvas.height = height;
		let self = this;
		// give the canvas event listeners so that the user can modify it
		canvas.addEventListener("mousedown", (e) => {self.mousedown = true;});
		canvas.addEventListener("mouseup", (e) => {self.mousedown = false; self.drawShortestPath();});
		canvas.addEventListener("mousemove", (e) => {if(self.mousedown) self.updateCanvas(e);});
		return canvas;
	}

	// make an array of zeros with the height and width of the given this.canvas:
	makeBlankArr(can){
		let blankArr = new Array();
		for(let i = 0; i < can.height; i++){
			let myCol = new Array();
			for(let j = 0; j < can.width; j++){
				myCol.push(Pathfinder.MAZE_OPEN);
			}
			blankArr.push(myCol);
		}
		return blankArr;
	}

	// return a deep copy of the given array:
	copyArray(arr){
		let copy = new Array();
		for(let i = 0; i < arr.length; i++){
			let row = new Array();
			for(let j = 0; j < arr[0].length; j++){
				row.push(arr[i][j]);
			}
			copy.push(row);
		}
		return copy;
	}

	//draw a series of dots along the shortest path calculated:
	drawShortestPath(){
		// get the current image data:
		let imgDat = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		// get the final node in the path:
		let currNode = this.getPath(this.canvasBin);
		// draw a dot for each node along the found path:
		while(currNode != null){
			this.drawDot(imgDat, [currNode.x, currNode.y], Pathfinder.PATH_RGBA, this.pathThickness, "path");
			currNode = currNode.parent;
		}
		// plug the altered image data into the canvas context to make the changes visable to the user:
		this.ctx.putImageData(imgDat, 0, 0);
		this.prevCan = null;
	}

	// update the this.canvas with user input:
	updateCanvas(e){
		// convert the given coordinates from the event, to usable this.canvas coordinates:
		const rect = this.canvas.getBoundingClientRect();

		const offset = [e.clientX - rect.left, e.clientY - rect.top];
		const can = [((offset[0] / rect.width) * this.canvas.width) << 0, ((offset[1] / rect.height) * this.canvas.height) << 0];
		this.prevCan = this.prevCan == null ? can : this.prevCan;

		// find the vector between this update's coordinates and the previous one's:
		let vec = [this.prevCan[0] - can[0], this.prevCan[1] - can[1]];
		const dist = Util.getDist([0,0], vec);
		vec = Util.normalizeVector(vec);
		let distGone = 0;
		this.drawDot(this.pathlessData, can, Pathfinder.USER_RGBA, this.userThickness, "user");
		while(distGone + (0.2 * this.userThickness) <= dist){		
			distGone += (0.2 * this.userThickness);
			this.drawDot(this.pathlessData, [can[0] + (distGone * vec[0]) << 0, can[1] + (distGone * vec[1]) << 0], Pathfinder.USER_RGBA, this.userThickness, "user");
		}
		this.prevCan = can;
		this.ctx.putImageData(this.pathlessData, 0, 0);
	}

	drawDot(imgDat, canvasCoors, rgba, radius, type = "user"){
		if(type == "user" && (Util.getDist(canvasCoors, [this.leftBoundX, this.upperBoundY]) < Pathfinder.SAFESPACE || Util.getDist(canvasCoors, [this.rightBoundX, this.lowerBoundY]) < Pathfinder.SAFESPACE)){
			return;
		}
		// for each x coordinate in the radius
		for(let i = -1 * radius; i < radius; i++){
				// find the height of the circle at that x and loop for each pixel along that column:
				let upper = Math.sqrt(Math.pow(radius, 2) - Math.pow(i, 2));
				upper = Math.round(upper) << 0;
				const lower = -1 * upper;
				for(let j = lower; j <= upper; j++){
					//if the coordinates are too close to the source or sink, just skip it:
					if((canvasCoors[0] + i <= 0) || (canvasCoors[1] + j <= 0) || (canvasCoors[0] + i >= this.canvas.width) || (canvasCoors[1] + j >= this.canvas.height)){
						continue;
					}
					// if the user is doing the drawing, update the canvasBin according to whether or not erase-mode is in effect:
					if(type == "user"){
						this.canvasBin[canvasCoors[1] + j][canvasCoors[0] + i] = this.eraseToggle ? Pathfinder.MAZE_OPEN : Pathfinder.MAZE_WALL;
					}
					// modify the relevent pixels in imageData.data
					const pix = 4 * (((canvasCoors[1] + j) * this.canvas.width) + canvasCoors[0] + i)
					for(var k = 0; k < 4; k++){
						imgDat.data[pix + k] = (this.eraseToggle && type == "user") ? Pathfinder.ERASE_RGBA[k] : rgba[k];
					}
				}
			}
	}

	// return an array of the nodes used in the maze solution (mainly for debuggers and inquisitive minds):
	getPathArr(node){
		let arr = [];
		while(node != null){
			arr.push([node.x, node.y]);
			node = node.parent;
		}
		return arr;	
	}

	// find the path from the source to the sink useing a depth-first search:
	getPath(binArr){

		// copy the array because we are going to flood/destroy it while finding a solution:
		let arr = this.copyArray(binArr);

		// set a sink node as the final target:
		const targetNode = new Node(this.rightBoundX - 1, this.lowerBoundY - 1);

		// set a source node as a start point:
		let currNode = new Node(this.leftBoundX + 1, this.upperBoundY + 1);

		// create a new Queue to hold nodes to be evaluated:
		const queue = new Queue();

		// start by adding the first node (the source) for evaluation:
		queue.offer(currNode);

		while(!queue.isEmpty()){
			//for every node surrounding the node being evauated:
			for(let i = Math.max(currNode.y - 1, this.upperBoundY); i <= Math.min(currNode.y + 1, this.lowerBoundY); i++){
				for(let j = Math.max(currNode.x - 1, this.leftBoundX); j <= Math.min(currNode.x + 1, this.rightBoundX); j++){
					// if the node being evaluated is the target node:
					if(i == targetNode.y && j == targetNode.x){
						// set its parent to the previous node and return:
						targetNode.parent = currNode;
						return targetNode;
					}
					// if the current node's neighbor isn't the node itself and the neighbor isn't a maze wall, add it to the queue with 
					// its parent as the node being evaluated.
					if((i != currNode.y || j != currNode.x) && (arr[i][j] == Pathfinder.MAZE_OPEN || arr[i][j] == Pathfinder.MAZE_PATH)){
						queue.offer(new Node(j, i, currNode));
						arr[i][j] = Pathfinder.MAZE_FILLED;
					}
				}
			}
			// move on to the next node:
			currNode = queue.poll();
		}
		// if we found the target node, return it, otherwise return null:
		return currNode.x == targetNode.x && currNode.y == targetNode.y ? currNode : null;
	}

	// reset the this.canvas:
	resetCanvas(){
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.pathlessData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.canvasBin = this.makeBlankArr(this.canvas);
	}

	
	// print an array (debuggers and curious coders only):
	printArr(arr){
		let str = "";
		for(let i = 0; i < arr.length; i++){
			for(let j = 0; j < arr[0].length; j++){
				str += arr[i][j];
			}
			str += "\n";
		}
		console.log(str);
	}

	// make a console for the pathfinder game:
	renderConsole(){

		// store a reference to this Pathfinder instance so that it can be referenced from different scopes:
		let self = this;

		// make the generic body of the canvas 
		let pf = super.getGenericConsoleTemplate("pathfinder", Pathfinder.BORDER_COLOR);
		pf.style.width = "60%";
		pf.style.left = "17.5%";

		let canvasContainer = document.createElement("container");
		canvasContainer.appendChild(this.canvas);

		let leftBar = document.createElement("div");
		leftBar.style = "position: absolute; top: 5%; height: 91%; left: 3%; width: 0.6%; background-color: thistle; z-index: 200000;";

		let rightBar = document.createElement("div");
		rightBar.style = "position: absolute; top: 5%; height: 91%; left: 67%; width: 0.6%; background-color: thistle; z-index: 200000;";


		let topBar = document.createElement("div");
		topBar.style = "position: absolute; top: 4%; height: 0.6vh; left: 3%; width: 64.6%; background-color: thistle; z-index: 200000";

		let bottomBar = document.createElement("div");
		bottomBar.style = "position: absolute; bottom: 3%; height: 0.6vh; left: 3%; width: 64.6%; background-color: thistle; z-index: 200000";

		[leftBar, rightBar, topBar, bottomBar].forEach(bar => {
			bar.addEventListener("mousedown", (e) => {self.mousedown = true;});
			bar.addEventListener("mouseup", (e) => {self.mousedown = false; self.drawShortestPath();});
			bar.addEventListener("mousemove", (e) => {if(self.mousedown) self.updateCanvas(e);});
			canvasContainer.appendChild(bar);
		}
		);

		canvasContainer.style ="z-index: 2000000";
 		pf.appendChild(canvasContainer);

		let textContainer = document.createElement("container");
		textContainer.setAttribute("class", "textContainer");
		textContainer.style = "width: 30%; right: 0%;";

 		let title = super.makeTitle("Be Amazed!");
		title.setAttribute("style","z-index: 10;");
		title.style.top = "5%";
		title.style.left = "0%";
		title.setAttribute("position", "relative");
		textContainer.appendChild(title);

		let resetButton = document.createElement("button");
		resetButton.id = "resetButton";
		resetButton.style = "left: 4%; bottom: 5%; height: 5%; width: 3%; z-index: 2000000; font-size: 2vh"
		resetButton.innerHTML = "R";
		resetButton.onclick = function(){self.resetCanvas();}
		pf.appendChild(resetButton);

		var eraseButton = document.createElement("button");
		eraseButton.id = "eraseButton";
		var ebBaseStyle = "left: 8%; bottom: 5%; height: 5%; width: 3%; z-index: 2000000; font-size: 2vh;";
		eraseButton.style = ebBaseStyle;
		eraseButton.innerHTML = "E";
		eraseButton.onclick = function(){
			self.eraseToggle = !self.eraseToggle;
			eraseButton.style = ebBaseStyle + (self.eraseToggle ? " background-color: azure;" : "");
		}
		pf.appendChild(eraseButton);


		let desc = document.createElement("p")
		desc.innerHTML = "Instructions: Drag your mouse over the left-side this.canvas to construct the walls of your maze. The computer will attempt to find a " +
				" passage from the top left to the bottom right. If it is unable, it will give up and the game is over. Use the button marked \"R\" to reset and \"E\" to toggle the eraser. " + 
				"Please make an epic maze to do this demo justice. <br><br>" + 
				"Description: Perhaps by now you have seen the \"depth-first\" exhibit and the stunning precision that it can achieve. Often overlooked, however,"+
				" is its sister searching algorithm: the \"breadth-first\" search. Neither algorithm is better in all cases, and a lot of the time, deciding "+
				"between them can be a challenge. If depth-first searching is like lightning, always looking for an expansion node furthest away from its source, " +
				"then breadth-first searching is more like an oil spill, stretching outward in all directions evenly until finding its target. In this case, the " +
				"medium that is being flooded is a two dimensional plane with the size and resolution of the this.canvas displayed on-screen (the origin of the spill being the top left). The first edge of the " +
				"metaphorical spilled oil that touches the target destination (bottom right) will be traced back to its source and marked in red. This algorithm goes much faster than the " +
				"depth-first search because there are only MxN nodes to evaluate (the number of pixels on the this.canvas) as opposed to the billions of permutations that the depth-first search must account for."
		desc.style = "padding: 1% 1% 1% 1%";
		desc.style.width = "90%";
		desc.style.left = "5%"
		desc.style.top = "17%"
		desc.style.height = "80%";
		textContainer.appendChild(desc)

		pf.appendChild(textContainer);
		super.addXout(pf);
	}
}

function Node(x, y, parent = null){
	this.x = x;
	this.y = y;
	this.parent = parent;
}

