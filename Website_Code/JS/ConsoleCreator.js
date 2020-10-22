var currentlyOpen;
var mousedown = false;
var evacuated = false;
var borders = new Map(
  [
      ["exBuild", "mistyrose"], 
      ["blank", "hotpink"], 
      ["credits", "powderblue"], 
      ["about", "lightgoldenrodyellow"], 
      ["pathfinder", "lavender"]
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
  }
}

function makeExpressionBuilderConsole(){
	var expBuild = makeGenericConsoleTemplate("exBuild");

    expBuild.appendChild(makeTitle("Expression Builder"));

    var div1 = document.createElement("div")
   	div1.style = "height: 20%; width: 60%; position: relative;";
    div1.id = "div1";
    expBuild.appendChild(div1);

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
    expBuild.appendChild(div2);

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
   	expBuild.append(goButton);

   	var answerDisplay = document.createElement("div");
   	answerDisplay.id = "answerDisplay";
   	answerDisplay.setAttribute("class", "answerDisplay");
   	expBuild.appendChild(answerDisplay);

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
   	expBuild.appendChild(desc);
}

function makeCreditsConsole(){
	credits = makeGenericConsoleTemplate("credits");
	credits.appendChild(makeTitle("Credits"));
	credits.id = "credits";
	var desc = document.createElement("p");
	desc.innerHTML = "This website would not have been possible without help from the following people. Huge shout-outs go to: <br><br>" +

					"Professor David Chiu: For teaching me to care less about if things work, and more about " + italicize("why") + " they work the way they do. Also, " +
					"of course, for a clutch professor recommendation. Thank you. <br><br>" + 

					"Professor Sigrun Bodine: For being an awesome calculus mentor. Thank you so much for your fantastic instruction and letter of recommendation.<br><br>";

	desc.style.top = "16%";
	desc.style.bottom = "5%";
	credits.appendChild(desc);
}

function makeAboutConsole(){
	about = makeGenericConsoleTemplate("about")
	about.appendChild(makeTitle("About"));
	about.id = "about";
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
	about.appendChild(desc);
}

function makePathFinderConsole(){
  evacuateAll(false);
  evacuated = true;
  var pf = makeGenericConsoleTemplate("pathfinder");
  pf.style.width = "60%";
  pf.style.left = "17.5%";
  var canvas = document.createElement("canvas");
  canvas.id = "pfcanvas";
  pf.appendChild(canvas);
  canvas.width = 500;
  canvas.height = 250;
  canvas.addEventListener("mousedown", () => {mousedown = true;});
  canvas.addEventListener("mouseup", () => {mousedown = false; drawShortestPath();});
  canvas.addEventListener("mousemove", (e) => {if(mousedown) updateCanvas(e);});
  initialize();
  var title = makeTitle("Build... Amaze");
  pf.appendChild(title);
  title.style.top = "5%";
  title.style.left = "34%";
  title.style.width = "50%";
  title.setAttribute("position", "absolute");
  desc = document.createElement("p")
  desc.innerHTML = "Instructions: Drag your mouse over the left-side canvas to construct the walls of your maze. The computer will attempt to find a " +
                  " passage from the top left to the bottom right. If it is unable, it will give up and the game is over. <br><br>" + 
                  "Description: Perhaps by now you have seen the \"depth-first \" exhibit and the stunning precision that it can achieve. Often overlooked, however,"+
                  " is its sister searching algorithm: the \"breadth-first\" search. Neither algorithm is better in all cases, and a lot of the time, deciding "+
                  "between them can be a challenge. If depth-first searching is like lightning, always looking for an expansion node furthest away from its source, " +
                  "then breadth-first searching is more like an oil spill, stretching outward in all directions evenly until finding its target. In this case, the " +
                  "media that is being flooded is a two dimensional plane with the size and resolution of the canvas displayed on-screen (the origin of the spill being the top left). The first edge of the " +
                  "metaphorical spilled oil that touches the target destination (bottom right) will be traced back to its source and marked in red. This algorithm goes much faster than the " +
                  "depth-first search because there are only MxN nodes to evaluate (the number of pixels on the canvas) as opposed to the billions of permutations that the depth-first search must account for."
desc.style = "padding: 1% 1% 1% 1%";
desc.style.width = "25%";
desc.style.left = "72%"
desc.style.top = "17%"
desc.style.height = "75%";
//desc.setAttribute("text-align", "right");
pf.appendChild(desc)
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