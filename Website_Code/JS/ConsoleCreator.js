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