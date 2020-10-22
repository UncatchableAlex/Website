var currentlyOpen;
var mousedown = false;
var evacuated = false;
var borders = new Map(
  [
      ["exBuild", "mistyrose"], 
      ["blank", "hotpink"], 
      ["credits", "powderblue"], 
      ["about", "lightgoldenrodyellow"], 
      ["pathfinder", "#FFC6C6"]
  ]
);
function makeConsole(id){
	switch(id){
		case("expBuild"): 
			makeExpressionBuilderConsole();
			break;
		case("credits"):
			makeCreditsConsole();
			break;
		case("about"):
			makeAboutConsole();
			break;
    case("amaze"):
      makePathFinderConsole();
      break;
		default:
			makeBlackConsole();
			break;
	}
}

function receiveBgroundClick(){
	var consoles = document.querySelectorAll(".console")
	consoles.forEach(console => console.remove());
  if(evacuated){
    makeOrbiters();
    evacuated = false;
  }
}

function makeExpressionBuilderConsole(){
	var expBuild = makeGenericConsoleTemplate("exBuild");

  var container = document.createElement("container");
  container.setAttribute("class", "textContainer");
  container.style = "display: flex; flex-wrap: wrap; align-content: flex-start;width: 100%; left: 0%;";
  container.appendChild(makeTitle("Expression Builder"));
  expBuild.appendChild(container);

    var div1 = document.createElement("div")
   	div1.style = "height: 20%; width: 60%; position: relative;";
    div1.id = "div1";
    container.appendChild(div1);

    var blackBar1 = document.createElement("div")
    blackBar1.setAttribute("class", "blackBar");
    blackBar1.id = "blackBar1";
    div1.appendChild(blackBar1);


    var input1 = document.createElement("input")
    input1.type = "text";
    input1.style = "bottom: 5%; left: 10%;";
    input1.placeholder = "ex: 24,11,444,21,89,211,33";
    div1.appendChild(input1);
	
   	var div2 = document.createElement("div");
   	div2.style = "width: 40%; height: 20%; position: relative";
    div2.id = "div2";
    container.appendChild(div2);

    var blackBar2 = document.createElement("div")
    blackBar2.setAttribute("class", "blackBar");
    blackBar2.id = "blackBar2";
    div2.appendChild(blackBar2);

    var input2 = document.createElement("input")
    input2.type = "text";
    input2.style = "bottom: 5%; left: 10%;";
    input2.placeholder = "ex: 152061840";
    div2.appendChild(input2);

  

   	var goButton = document.createElement("button");
   	goButton.style = "top: 41%; left: 45%; background-color: #e4e1ff;";
   	goButton.innerHTML = "GO!";
   	goButton.onclick = () => {runExpressionBuilder(input1.value, input2.value)};
   	container.append(goButton);

   	var answerDisplay = document.createElement("div");
   	answerDisplay.id = "answerDisplay";
   	answerDisplay.setAttribute("class", "answerDisplay");
   	container.appendChild(answerDisplay);

   	var desc = document.createElement("p");
   	desc.innerHTML = "Welcome to the Expression Builder! Please enter seven or fewer comma-separated integers into the left box and a " + 
   					"single large positive integer (10E4-10E8) into the right box. When you are ready, hit the \"Go\" button and wait a few seconds. Your " +
   					"browser will perform an exhaustive depth-first search to form an arithmetic expression, using the numbers in the left box, " + 
   					"which equals the number in the right box. <br><br> I love this example for so many reasons. It is simple, intuitive, and an accurate " +
   					"demonstration of the speed at which computers process information. Moreso, however, the recursive expression generation beautifully " +
   					"exemplifies the nature of exponential growth. Try using only " +
   					"three or four numbers on the left side. It processes instantly, right? Now try entering seven numbers on the left side and a different " +
   					"larger number on the right. It's going to take quite a while because even though you only entered a few more numbers, " +
   					"the computer must process billions more permutations. How long do you think it would take with nine numbers? Or ten?"

   	desc.style.top = "50%";
   	desc.style.height = "35%";
   	container.appendChild(desc);
}

function makeCreditsConsole(){
	credits = makeGenericConsoleTemplate("credits");
	credits.id = "credits";
  var textContainer = document.createElement("container");
  textContainer.setAttribute("class", "textContainer");
  textContainer.style = "width: 100%; left: 0%;";
  credits.appendChild(textContainer);
	var desc = document.createElement("p");
	desc.innerHTML = "This website would not have been possible without help from the following people. Huge shout-outs go to: <br><br>" +

					"Professor David Chiu: For teaching me to care less about if things work, and more about " + italicize("why") + " they work the way they do. Also, " +
					"of course, for a clutch professor recommendation. Thank you. <br><br>" + 

					"Professor Sigrun Bodine: For being an awesome calculus mentor. Thank you so much for your fantastic instruction and letter of recommendation.<br><br>";
  desc.style = "overflow: hidden";
	desc.style.top = "16%";
	desc.style.bottom = "5%";
  textContainer.appendChild(makeTitle("Credits"));
  textContainer.appendChild(desc);
}

function makeAboutConsole(){
	var about = makeGenericConsoleTemplate("about")
  about.id = "about";

  var textContainer = document.createElement("container");
  textContainer.setAttribute("class", "textContainer");
  textContainer.style = "width: 100%; left: 0%;";
  textContainer.appendChild(makeTitle("About"));
  about.appendChild(textContainer);

	var desc = document.createElement("p");
	desc.innerHTML = "There were some parts of this project that were particularly challenging, and some that I have yet to figure out." + 
					" For example, I spent " + italicize("days") + " trying to get div elements to switch from one animation to another. " +
					"For some reason, there was hardly any documentation online of people trying to accomplish a similar goal. Regardless, I ended" + 
					" up solving the problem by dropping the animation entirely, changing the element's style, and waiting for the next repaint before " +
					"assigning it a new class.<br><br>" +

					"Additionally, because multithreading is unsupported in Javascript, the blocks can't be animated while the computer is" +
					" working on something else (ex: Expression Builder). I dodged this problem by making the blocks evacuate the screen until" + 
					" the demonstration is complete.<br><br>" +

					"The block animation, as a whole, was possibly the largest challenge. To avoid using the repaint strategy, each " +
					"block follows a predefined path instead of generating its route in real-time. Essentially, the paths repeat at " +
					"scheduled intervals, with the repeat point happening off-screen. Some smoke and mirrors worked nicely here.<br><br>" +
					"Originally, the paths would force the blocks to make sharp turns which seemed to defy physics. Once again, this problem" +
					" was pretty much undocumented&mdash;I had to come up with something on my own. Eventually, I discovered a procedure for choosing " +
					"bezier curve control points that make much shallower turns.<br><br>"+


					"Finally, it was necessary to find the rotation of a block, mid animation, when the user attempts to pick it up. I initially" +
					" tried solving this geometrically using the blocks's bounding rectangle and inferring what its angle must be to fit inside " +
					"such a shape. Unfortunately, there are always two acceptable orientations, either of which could be incorrect. My current " +
					"strategy is to wait for two frames and calculate the inverse tangent of its motion's slope. This strategy works because the " +
					"block's forward-facing side is always perpendicular to its velocity.<br><br>" +

					"Going forward, I expect to focus mainly on formatting and compatibility issues, assuming no major bugs reveal themselves.";
	desc.style.top = "16%";
	desc.style.bottom = "5%";
	textContainer.appendChild(desc);
}

function makePathFinderConsole(){
  var pf = makeGenericConsoleTemplate("pathfinder");
  pf.style.width = "60%";
  pf.style.left = "17.5%";

  var canvasContainer = document.createElement("container");
  var leftBar = document.createElement("div");
  leftBar.style = "position: absolute; top: 5%; height: 91%; left: 3%; width: 0.6%; background-color: thistle; z-index: 200000;";
  var rightBar = document.createElement("div");
  rightBar.style = "position: absolute; top: 5%; height: 91%; left: 67%; width: 0.6%; background-color: thistle; z-index: 200000;";
  var topBar = document.createElement("div");
  topBar.style = "position: absolute; top: 4%; height: 0.6vh; left: 3%; width: 64.6%; background-color: thistle; z-index: 200000";
  var bottomBar = document.createElement("div");
  bottomBar.style = "position: absolute; bottom: 3%; height: 0.6vh; left: 3%; width: 64.6%; background-color: thistle; z-index: 200000";
  canvasContainer.appendChild(leftBar);
  canvasContainer.appendChild(rightBar);
  canvasContainer.appendChild(topBar);
  canvasContainer.appendChild(bottomBar);
  canvasContainer.setAttribute("style", "z-index: 2000000;");
  pf.appendChild(canvasContainer);

  var canvas = document.createElement("canvas");
  canvas.id = "pfcanvas";
  canvasContainer.appendChild(canvas);
  canvas.style.left = "0%";
  canvas.width = 1000;
  canvas.height = 500;
  canvas.addEventListener("mousedown", (e) => {mousedown = true; console.log(e.type)});
  canvas.addEventListener("mouseup", (e) => {mousedown = false; drawShortestPath(); console.log(e.type);});
  canvas.addEventListener("mousemove", (e) => {if(mousedown) updateCanvas(e); console.log(e.type);});

  var textContainer = document.createElement("container");
  textContainer.setAttribute("class", "textContainer");
  textContainer.style = "width: 30%; right: 0%;";

  var title = makeTitle("Be Amazed!");
  title.setAttribute("style","z-index: 10;");
  title.style.top = "5%";
  title.style.left = "0%";
  title.setAttribute("position", "relative");
  textContainer.appendChild(title);

  desc = document.createElement("p")
  desc.innerHTML = "Instructions: Drag your mouse over the left-side canvas to construct the walls of your maze. The computer will attempt to find a " +
                  " passage from the top left to the bottom right. If it is unable, it will give up and the game is over. <br><br>" + 
                  "Description: Perhaps by now you have seen the \"depth-first\" exhibit and the stunning precision that it can achieve. Often overlooked, however,"+
                  " is its sister searching algorithm: the \"breadth-first\" search. Neither algorithm is better in all cases, and a lot of the time, deciding "+
                  "between them can be a challenge. If depth-first searching is like lightning, always looking for an expansion node furthest away from its source, " +
                  "then breadth-first searching is more like an oil spill, stretching outward in all directions evenly until finding its target. In this case, the " +
                  "medium that is being flooded is a two dimensional plane with the size and resolution of the canvas displayed on-screen (the origin of the spill being the top left). The first edge of the " +
                  "metaphorical spilled oil that touches the target destination (bottom right) will be traced back to its source and marked in red. This algorithm goes much faster than the " +
                  "depth-first search because there are only MxN nodes to evaluate (the number of pixels on the canvas) as opposed to the billions of permutations that the depth-first search must account for."
desc.style = "padding: 1% 1% 1% 1%";
desc.style.width = "90%";
desc.style.left = "5%"
desc.style.top = "17%"
desc.style.height = "80%";
textContainer.appendChild(desc)

pf.appendChild(textContainer);
evacuateAll(false);
evacuated = true;
initialize();
}

function makeBlackConsole(){
	var blank = makeGenericConsoleTemplate("blank");
    var title = document.createElement("h2");
    title.innerHTML = "This block doesn't have a code project bound to it yet. Try another color. " +
     					"Click anywhere else onscreen to remove this panel.";
    blank.appendChild(title);
}

function makeGenericConsoleTemplate(name){
	currentlyOpen = name;
	var panel = document.createElement("div");
    panel.setAttribute("class", "console");
    document.body.appendChild(panel);
    panel.id = name;
    panel.style = "width: 35vw; height: 50vh; border-color: " + borders.get(name);
    return panel;
}

function makeTitle(contents){
	title = document.createElement("h2");
	title.innerHTML = contents;
	return title;
}

function italicize(str){
	return str.italics();
}