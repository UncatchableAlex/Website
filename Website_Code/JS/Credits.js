"use strict";
class Credits extends Console{
	static BORDER_COLOR = "powderblue";
	constructor(consoleCreator){
		super(consoleCreator);
	}

	renderConsole(){
		let credits = super.getGenericConsoleTemplate("credits", Credits.BORDER_COLOR);
		credits.id = "credits";
		let textContainer = document.createElement("container");
		textContainer.setAttribute("class", "textContainer");
		textContainer.style = "width: 100%; left: 0%;";
		credits.appendChild(textContainer);
		const desc = document.createElement("p");
		desc.innerHTML = "This website would not have been possible without help from the following people. Huge shout-outs go to: <br><br>" +

						"Professor David Chiu: For teaching me to care less about if things work, and more about " + super.italicize("why") + " they work the way they do. Also, " +
						"of course, for a clutch professor recommendation. Thank you. <br><br>" + 

						"Professor Sigrun Bodine: For being an awesome calculus mentor. Thank you so much for your fantastic instruction and letter of recommendation.<br><br>";
		desc.style.top = "16%";
		desc.style.bottom = "5%";
		textContainer.appendChild(super.makeTitle("Credits"));
		textContainer.appendChild(desc);
		super.addXout(credits);
	}
}