var currentlyOpen;
function makeConsole(id){
	switch(id){
		case("expBuild"): 
			makeExpressionBuilderConsole();
			break;
		default:
			makeBlackConsole();
			break;
	}
}

function receiveBgroundClick(){
	switch(currentlyOpen){
		case("expBuild"):
			document.getElementById("ebPanel").remove();
			break;
		case("blank"):
			document.getElementById("blank").remove();
			break;
		default:
			break;
	}
}

function makeExpressionBuilderConsole(){
	currentlyOpen = "expBuild";
    var ebPanel = document.createElement("div");
    ebPanel.setAttribute("class", "console");
    document.body.appendChild(ebPanel);
    ebPanel.id = "ebPanel";
    ebPanel.style = "width: 35vw; height: 50vh; border-color: mistyrose";

    var title = document.createElement("h2");
    title.innerHTML = "Expression Builder";
    ebPanel.appendChild(title);

    var div1 = document.createElement("div")
   	div1.style = "height: 20%; width: 60%; position: relative;";
    div1.id = "div1";
    ebPanel.appendChild(div1);

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
    ebPanel.appendChild(div2);

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
   	ebPanel.append(goButton);

   	var answerDisplay = document.createElement("div");
   	answerDisplay.id = "answerDisplay";
   	answerDisplay.setAttribute("class", "answerDisplay");
   	ebPanel.appendChild(answerDisplay);

   	var desc = document.createElement("p")
   	desc.innerHTML = "Welcome to the Expression Builder! Please enter eight or fewer comma-separated integers into the left box and a " + 
   					"single large positive integer into the right box. When you are ready, hit the \"go\" button and wait a few seconds. Your " +
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
   	ebPanel.appendChild(desc);
}

function makeBlackConsole(){
	currentlyOpen = "blank";
	var blank = document.createElement("div");
    blank.setAttribute("class", "console");
    document.body.appendChild(blank);
    blank.id = "blank";
    blank.style = "width: 35vw; height: 50vh; border-color: hotpink";
    var title = document.createElement("h2");
    title.innerHTML = "This block doesn't have a code project bound to it yet. Try another color. Click anywhere else onscreen to remove this panel.";
    blank.appendChild(title);
}