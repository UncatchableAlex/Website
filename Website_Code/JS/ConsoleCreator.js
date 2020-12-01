"use strict";

class ConsoleCreator{

  static SHOULD_EVAC = new Map(
      [
          ["expBuild", false],
          ["credits", false],
          ["about", false],
          ["amaze", true],
          ["gameOfLife", true]
      ]
    );

  constructor(orbitPlanner){
    // for everyone:
    this.orbitPlanner = orbitPlanner;
    this.currentConsole;
    this.evacuated = false;
  }

  openConsole(id){
    if(this.currentConsole != null){
      return;
    }
  	switch(id){
  		case("expBuild"): 
  			this.makeExpressionBuilderConsole();
  			break;
  		case("credits"):
  			this.makeCreditsConsole();
  			break;
  		case("about"):
  			this.makeAboutConsole();
  			break;
      case("amaze"):
        this.makePathFinderConsole();
        break;
      case("gameOfLife"):
        this.makeGameOfLifeConsole();
        break;
  		default:
  			this.makeBlackConsole();
  			break;
  	}
    if(ConsoleCreator.SHOULD_EVAC.get(id)){
      this.orbitPlanner.evacuateAll();
      this.evacuated = true;
    }
  }

 closeConsole(){
    if(this.currentConsole != null){
  	 this.currentConsole.closePanel();
     this.currentConsole = null;
    }
    if(this.evacuated){
      this.orbitPlanner.animateOrbiters();
      this.evacuated = false;
    }
  }

  makeExpressionBuilderConsole(){
    this.currentConsole = new ExpressionBuilder(this);
    this.currentConsole.renderConsole();
  }

  makeCreditsConsole(){
    this.currentConsole = new Credits(this);
    this.currentConsole.renderConsole();
  }

  makeAboutConsole(){
    this.currentConsole = new About(this);
    this.currentConsole.renderConsole();
  }

  makePathFinderConsole(){
    this.currentConsole = new Pathfinder(this, "pfCanvas", 1000, 500);
    this.currentConsole.renderConsole();
  }

  makeGameOfLifeConsole(){
    this.currentConsole = new GameOfLife(this, "golCanvas");
    this.currentConsole.renderConsole();
  }
}

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