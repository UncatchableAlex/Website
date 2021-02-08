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
		desc.innerHTML = "This panel will eventually become another exhibit but, for now, it will serve as a self-promo. I made this website on my own " +
						"without the use any animation libraries or code external to vanilla Javascript. If you are " +
						"thinking about doing something similar, make sure that you know what you're getting into. " + 
						"This project was a monumental task requiring hundreds of hours of planning, coding, debugging, and testing. " +
						"While any project can be sped up dramatically through the use of libraries, making this website from scratch was a great way for me " +
						"to learn Javascript and its limits (Okay, fine... mostly the limits). <br><br> On the off-chance that you find yourself doing any project " +
						"involving Javascript, I'd highly recommend visiting Mozilla Developer Network's all-encompassing guide to web dev. It's the first place I go " +
						"when I have a question or don't understand something. Currently, Chrome autofills MDN's guide to regular expressions when I type the \"r\" " +
						"key in my search box, so it seems fitting to include a link (it's regex. " + super.italicize("Of course") + " you need a refresher). " +
						"Clicking the link will open a new tab. <br><br>" + 
						"<a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions\" target = _blank>Mozilla Developer Network</a>";
		desc.style.top = "16%";
		desc.style.bottom = "5%";
		textContainer.appendChild(super.makeTitle("Credits"));
		textContainer.appendChild(desc);


		super.addXout(credits);
	}
}