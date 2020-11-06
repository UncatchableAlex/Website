"use strict";
class About extends Console{
	static BORDER_COLOR = "#FFFFAA";
	constructor(consoleCreator){
		super(consoleCreator);
	}

	renderConsole(){
		let about = super.getGenericConsoleTemplate("about", About.BORDER_COLOR);

		let textContainer = document.createElement("container");
		textContainer.setAttribute("class", "textContainer");
		textContainer.style = "width: 100%; left: 0%;";
		textContainer.appendChild(super.makeTitle("About"));
		about.appendChild(textContainer);

		let desc = document.createElement("p");
		desc.innerHTML = "There were some parts of this project that were particularly challenging, and some that I have yet to figure out." + 
			" For example, I spent " + super.italicize("days") + " trying to get div elements to switch from one animation to another. " +
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


			"Finally, it was necessary to find the rotation of a block, mid animation, for when the user attempts to pick it up. I initially" +
			" tried solving this problem geometrically by inferring rotation from the blocks bounding rectangle. " +
			"Unfortunately, there are always two acceptable orientations, either of which could be incorrect. My current " +
			"strategy is to wait for two frames and calculate the inverse tangent of its motion's slope. This strategy works because the " +
			"block's forward-facing side is always perpendicular to its velocity.<br><br>" +

			"Going forward, I expect to focus mainly on formatting and compatibility issues, assuming no major bugs reveal themselves.";
		desc.style.top = "16%";
		desc.style.bottom = "5%";
		textContainer.appendChild(desc);
		super.addXout(about);
	}
}