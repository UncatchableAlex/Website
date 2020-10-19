var currentlyOpen;
var borders = new Map([["exBuild", "mistyrose"], ["blank", "hotpink"], ["credits", "powderblue"], ["about", "lightgoldenrodyellow"]]);
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
		default:
			makeBlackConsole();
			break;
	}
}

function receiveBgroundClick(){
	var consoles = document.querySelectorAll(".console")
	consoles.forEach(console => console.remove());
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
   					"three or four numbers on the left side. It processes instantly, right? Now try eight numbers on the left side and a different " +
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
	desc.innerHTML = "Believe it or not, this was my first actual attempt at making a website. There were ups and downs, but for the most part, " +
					"things went pretty well and I am proud to now own a (very) small piece of the internet. It wouldn't have been possible, however, without help from the following " +
          "people. Huge shout-outs go to: <br><br>" +

					"Professor David Chiu: For teaching me to care less about if things work, and more about " + italicize("why") + " they work the way they do. Also, " +
					"of course, for a clutch professor recommendation. Thank you. <br><br>" + 

					"Professor Sigrun Bodine: For being an awesome calculus instructor. Thank you so much for your fantastic instruction and letter of recommendation.<br><br>" 

         /* + "Mozilla Developer Network: For providing useful examples to difficult questions." + 
          " They are, essentially, a comprehensive almanac for everything web development related.";*/

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
					"Originally, the paths would force the blocks to make sharp turns that seemed to defy physics. Once again, this problem" +
					" was pretty much undocumented&mdash;I had to come up with something on my own. Eventually, I found a procedure for choosing " +
					"bezier curve control points that make much shallower turns.<br><br>"+


					"Finally, it was necessary to find the rotation of a block, mid animation, when the user attempts to pick it up. I initially" +
					" tried solving this geometrically using the blocks's bounding rectangle and inferring what its angle must be to fit inside " +
					"such a shape. Unfortunately, there are always two acceptable orientations, either of which could be incorrect. My current " +
					"strategy is to wait for two frames and calculate the inverse tangent of its motion's slope. This strategy works because the " +
					"block's forward-facing side is always perpendicular to its velocity vector.<br><br>" +

					"Going forward, I expect to focus mainly on formatting and compatibility issues, assuming no major bugs reveal themselves.";
	desc.style.top = "16%";
	desc.style.bottom = "5%";
	about.appendChild(desc);
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