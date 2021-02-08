class Console{
  constructor(consoleCreator){
    this.consoleCreator = consoleCreator;
    this.headElem;
  }
  closePanel(){
    if(this.headElem == null){
      throw "No Panel Open!"
    }
    this.headElem.remove();
    this.headElem = null;
    this.consoleCreator.currentConsole = null;
  }
  addXout(elem){
    let xout = document.createElement("button");
    xout.setAttribute("class", "xout");
    xout.id = "xout";
    xout.innerHTML = "X";
    let self = this;
    xout.addEventListener("click", () => {self.consoleCreator.closeConsole();});
    elem.appendChild(xout);
  }

  getGenericConsoleTemplate(name, color){
  	let currentConsole = name;
  	let panel = document.createElement("div");
    panel.setAttribute("class", "console");
    document.body.appendChild(panel);
    panel.id = name;
    panel.style = "width: 35vw; height: 50vh; border-color: " + color + ";";
    this.headElem = panel;
    return panel;
  }

  makeTitle(contents){
  	var title = document.createElement("h2");
  	title.innerHTML = contents;
  	return title;
  }

  italicize(str){
  	return str.italics();
  }

  renderConsole(){
    throw "renderConsole is abstract and must be implemented in a subclass";
  }
}