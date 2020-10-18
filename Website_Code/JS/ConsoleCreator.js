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
	/*try{
		document.getElementById(currentlyOpen).remove();
	} catch(error){
		console.log("No panels open. Nothing to remove...")
	}*/
}

function makeExpressionBuilderConsole(){
	var expBuild = makeGenericConsoleTemplate("exBuild");

    expBuild.appendChild(makeTitle("Expression Builder"));

    var div1 = document.createElement("div")
   	div1.style = "height: 20%; width: 60%; position: relative;";
    div1.id = "div1";
    expBuild.appendChild(div1);

	var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");    
    //svg1.setAttribute("viewBox", "0 0 60 20");
    svg1.style = "width: 100%; height: 100%";
    svg1.id = "svgBox1";
    div1.appendChild(svg1);

    var input1 = document.createElement("input")
    input1.type = "text";
    input1.style = "bottom: 5%; left: 10%; text-align: center; position: absolute;";
    input1.placeholder = "ex: 24,11,444,21,89,211,33";
    div1.appendChild(input1);

    var absBox1 = svg1.getBoundingClientRect();
    var left1 = absBox1.width * 0.10;
    var down1 = absBox1.height * 0.95;
    var over1 = absBox1.width * 0.80;

	var lhsBox = document.createElementNS("http://www.w3.org/2000/svg", "path");
   	lhsBox.setAttribute("stroke-width", "5");
   	lhsBox.setAttribute("stroke", "black");
   	lhsBox.setAttribute("fill", "none");
   	lhsBox.setAttribute("d", "M " + left1 + " " + down1 + "l " + over1 + " 0");
   	svg1.appendChild(lhsBox);

   	var div2 = document.createElement("div");
   	div2.style = "width: 40%; height: 20%; position: relative";
    div2.id = "div2";
    expBuild.appendChild(div2);

    var input2 = document.createElement("input")
    input2.type = "text";
    input2.style = "bottom: 5%; left: 12%; width: 72%; text-align: center;";
    input2.placeholder = "ex: 152061840";
    div2.appendChild(input2);

   	var svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");  
   	svg2.style = "width: 100%; height: 100%";  
    svg2.id = "svgBox2";
    div2.appendChild(svg2);

    var absBox2 = svg2.getBoundingClientRect();
    var left2 = absBox2.width * 0.10;
    var down2 = absBox2.height * 0.95;
    var over2 = absBox2.width * 0.80;


   	var rhsBox = document.createElementNS("http://www.w3.org/2000/svg", "path");
   	rhsBox.setAttribute("stroke-width", "5");
   	rhsBox.setAttribute("stroke", "black");
   	rhsBox.setAttribute("fill", "none");
   	rhsBox.setAttribute("d", "M " + left2 + " " + down2 + "l " + over2 + " 0");
   	svg2.appendChild(rhsBox);

   	var goButton = document.createElement("button");
   	goButton.style = "top: 41%; margin-left: auto; position: absolute; background-color: #e4e1ff;";
   	goButton.innerHTML = "GO!";
   	goButton.onclick = () => {runExpressionBuilder(input1.value, input2.value)};
   	expBuild.append(goButton);

   	var answerDisplay = document.createElement("div");
   	answerDisplay.id = "answerDisplay";
   	answerDisplay.setAttribute("class", "answerDisplay");
   	expBuild.appendChild(answerDisplay);

   	var desc = document.createElement("p");
   	desc.innerHTML = "Welcome to the Expression Builder! Please enter eight or fewer comma-separated integers into the left box and a " + 
   					"single large positive integer (10E4-10E6) into the right box. When you are ready, hit the \"go\" button and wait a few seconds. Your " +
   					"browser will perform an exhaustive depth-first search to form an arithmetic expression, using the numbers in the left box, " + 
   					"which equals the number in the right box. <br><br> I love this example for so many reasons. It is simple, intuitive, and an accurate " +
   					"demonstration of the speed at which computers process information. Moreso, however, the recursive expression generation beautifully " +
   					"exemplifies the nature of exponential growth. Try using only " +
   					"three or four numbers on the left side. It processes instantly, right? Now try eight numbers on the left side and a different " +
   					"larger number on the right. It's going to take quite a while because even though you only entered a few more numbers, " +
   					"the computer must process billions more permutations. How long do you think it would take with nine numbers? Or ten?"
   					/*" <br><br>" +
   					"If the viewer takes anything away from this demo, it should be this: Use a long password to avoid the kind of brute force "+
   					"attacks that this program mimics. Obviously, the only thing that we are doing here is attacking an arbitrary number, but the same " +
   					"logic applies to cryptography."; 				*/
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
					"things went pretty well and I am proud to now have a (very) small piece of the internet to call my own. That being said, I " +
					"would be a fool not to give a shout-out to the following people and organizations who helped make this endeavor possible: <br><br>" +

					"Professor David Chiu: For teaching me to care less about how things work and more about " + italicize("why") + " they work. An" +
					"d, of course, for a clutch professor recommendation. Thank you. <br><br>" + 

					"Professor Sigrun Bodine: For making me a calculus wizard. This site is largely based on the vector section of your mult" +
					"i class. Also, thank you so much for your letter of recommendation. It means a lot.<br><br>" + 

					"Duncan M: CS extraordinaire and phone-a-friend. He suggested I use web assembly for this project. Never has anyone had more misplaced confide" +
					"nce in another human being. <br><br>" + 

					"Google: Here's the obligatory code citation to Google. In the head of this page's HTML, I have a copy-pasted a Google Analyti" +
					"cs tag to track usage. Those 5ish lines of code are NOT mine. Thanks, Google. <br><br>" +

					"Alex M (Humble Cornell Applicant): I wrote the other 700 lines of code myself using the prior knowledge given to me by the aforementioned people.";
	desc.style.top = "16%";
	desc.style.bottom = "5%";
	credits.appendChild(desc);
}

function makeAboutConsole(){
	about = makeGenericConsoleTemplate("about")
	about.appendChild(makeTitle("About"));
	about.id = "about";
	var desc = document.createElement("p");
	desc.innerHTML = "\tThere were some parts of this project that were particularly challenging, and some that I have yet to figure out." + 
					" For example, I spent " + italicize("days") + " trying to get div elements to switch from one animation to another. " +
					"For some reason, there was hardly any documentation online of people trying to accomplish a similar goal, and I am" +
					" led to believe that it is a very niche dilemma that doesn't occur very often. Regardless, I ended up solving the " +
					"problem by dropping the animation entirely, changing the element's style, and waiting for the next repaint before " +
					"assigning it a new animation. It is an ugly solution but it seems to work. <br><br>" +

					"\tAdditionally, while the browser is working on a project demonstration, the blocks can't easily be animating becaus" +
					"e of how JavaScript doesn't support threading. Instead, I dodged this problem by making the blocks evacuate the sc" +
					"reen until demonstration is complete. <br><br>" +

					"\tThe block animation, as a whole, was possibly the largest challenge. To avoid having to use the repaint strategy, " +
					"each block follows a predefined path, as opposed to having its path generated in real-time. Essentially, the paths" +
					" repeat at scheduled intervals, with the repeat point happening off screen. A little smoke and mirrors worked nice" +
					"ly here. <br><br>" +

					"\tThe paths themselves originally forced the blocks to make extremely sharp turns which were unpleasent to watch. " +
					"Once again, this problem was pretty much undocumented and I had to come up with something on my own. I eventuall" +
					"y found a proceedure for choosing bezier curve control points that make much shallower turns.<br><br>" + 

					"\tFinally, it was necessary to find the angle of an element mid animation for when the user attempts to pick it up. "+
					"I initially tried solving this geometrically using the element's bounding rectangle and inferring what it's angle " +
					"must be to fit inside such a shape. Unfortunately, there are always two possible orientations and it was impossible" +
					" to infer which one was correct from looking only at one frame. Instead, I simply waited for two frames to pass, and calc"+
					"ulated the inverse tangent of its motion's slope.<br><br>" +

					"\tGoing forward, I expect to focus mainly on formatting and compatibility issues, assuming no major bugs reveal themselves";
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