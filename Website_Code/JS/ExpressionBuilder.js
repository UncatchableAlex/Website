"use strict";
class ExpressionBuilder extends Console{

    static BORDER_COLOR = "mistyrose";

    constructor(consoleCreator){
        super(consoleCreator);
        this.worker = new Worker("Website_Code/JS/ExpressionBuilderWorker.js");
    }

    runExpressionBuilder(params, target){   
        let message;
        if(document.getElementById("answer") != null){
            document.getElementById("answer").remove();
        }

        if(/\D/.test(target)){
             message = "Incorrect formatting in target field. Please try again.";
        } else if(target.length == 0){
            message = "Target field empty";
        } else if(/[^\d ,]/.test(params)){
            message = "Incorrect formatting in the params field.";
        }
        target = parseInt(target);
        params = params.replaceAll(" ", "").replaceAll(/[,]+/g, ",").split(",");
        if(params[params.length - 1] == ""){
            params.pop();
        }
        if(params[0] == ""){
            params.shift();
        }
        if(params.length > 7 && message == null){
            let ui = confirm("You have entered " + params.length + " numbers. Be aware " +
                "that this may cause the tab to freeze for a long period or crash. " +
                "Press 'OK' to continue, or 'Cancel' to abort");
            if(!ui){
                message = "Enter fewer numbers this time!     :)";
            }
        }
        if(params.length == 0){
            message = "Params field is blank";
        }
        if(target.toString().length == 0){
            message = "Target field is blank";
        }
        if(target < 0 && message == null){
            message = "Target must be greater than zero.";
        }
        let nums = new Array();
        params.forEach(num => nums.push(parseInt(num)));
        var newDiv = document.createElement("div")
        newDiv.id = "answer";
        try{
            var answerDisplay = document.getElementById("answerDisplay");
        } catch(error){
            throw "Console must be rendered before ExpressionBuilder can be run";
        }
        if(message != null){
            newDiv.innerHTML = message;
            answerDisplay.appendChild(newDiv);
            return;
        }
        this.consoleCreator.orbitPlanner.evacuateAll();
        if(params.length > 6){
            var evacTime = Bloop.DURATION * 1050;
        } else {
            var evacTime = OrbitPlanner.EVACUATE_TIME * 1500;
        }

        setTimeout( () => {
                        this.worker.postMessage([nums, target]);
                        let self = this;
                        this.worker.onmessage = function(e){
                            let ans = e.data;
                            if(ans.length > 56){
                                newDiv.style.fontSize = "1vw";
                            }
                            newDiv.innerHTML = ans;
                            answerDisplay.appendChild(newDiv);
                            self.consoleCreator.orbitPlanner.animateOrbiters();
                        }
                    }, evacTime
                );
    }

    renderConsole(){
        let self = this;

        let expBuild = super.getGenericConsoleTemplate("expBuild", ExpressionBuilder.BORDER_COLOR);

        let container = document.createElement("container");
        container.setAttribute("class", "textContainer");
        container.style = "display: flex; flex-wrap: wrap; align-content: flex-start; width: 100%; left: 0%;";
        container.appendChild(super.makeTitle("Expression Builder"));
        expBuild.appendChild(container);

        let div1 = document.createElement("div")
        div1.style = "height: 20%; width: 60%; position: relative;";
        div1.id = "div1";
        container.appendChild(div1);

        let blackBar1 = document.createElement("div")
        blackBar1.setAttribute("class", "blackBar");
        blackBar1.id = "blackBar1";
        div1.appendChild(blackBar1);


        let input1 = document.createElement("input")
        input1.type = "text";
        input1.style = "bottom: 5%; left: 10%;";
        input1.placeholder = "ex: 24,11,444,21,89,211,33";
        div1.appendChild(input1);
        
        let div2 = document.createElement("div");
        div2.style = "width: 40%; height: 20%; position: relative";
        div2.id = "div2";
        container.appendChild(div2);

        let blackBar2 = document.createElement("div")
        blackBar2.setAttribute("class", "blackBar");
        blackBar2.id = "blackBar2";
        div2.appendChild(blackBar2);

        let input2 = document.createElement("input")
        input2.type = "text";
        input2.style = "bottom: 5%; left: 10%;";
        input2.placeholder = "ex: 152061840";
        div2.appendChild(input2);

        

        let goButton = document.createElement("button");
        goButton.style = "top: 41%; left: 45%; padding: 1% 5%; width: 15%; font-size: 2.5vh";
        goButton.innerHTML = "GO!";
        goButton.onclick = () => {self.runExpressionBuilder(input1.value, input2.value)};
        container.append(goButton);

        let answerDisplay = document.createElement("div");
        answerDisplay.id = "answerDisplay";
        answerDisplay.setAttribute("class", "answerDisplay");
        container.appendChild(answerDisplay);

        let desc = document.createElement("p");
        desc.innerHTML = "Welcome to the Expression Builder! Please enter seven or fewer comma-separated integers into the left box and a " + 
                "single large positive integer (10E4-10E8) into the right box. When you are ready, hit the \"Go\" button and wait a few seconds. Your " +
                "browser will perform an exhaustive depth-first search to form an arithmetic expression, using the numbers in the left box, " + 
                "which equals the number in the right box. <br><br> I love this example for so many reasons. It is simple, intuitive, and an accurate " +
                "demonstration of the speed at which computers process information. Moreso, however, the recursive expression generation beautifully " +
                "exemplifies the nature of exponential growth. Try using only " +
                "three or four numbers on the left side. It processes instantly, right? Now try entering seven numbers on the left side and a different " +
                "larger number on the right. It's going to take quite a while because even though you only entered a few more numbers, " +
                "the computer must process billions more permutations. How long do you think it would take with nine numbers? Or ten?"

        desc.style.top = "51%";
        desc.style.height = "33%";
        container.appendChild(desc);
        super.addXout(expBuild);
    }
}
