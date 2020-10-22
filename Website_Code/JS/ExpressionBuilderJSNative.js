var closest;
var ops = ["+", "-", "*", "/"];

function runExpressionBuilder(params, target){
    closest = Number.MAX_VALUE;
    var message;
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
    params = params.replace(" ", "").split(",");
    if(params.length > 7 && message == null){
        ui = confirm("You have entered " + params.length + " numbers. Be aware " +
            "that this may cause the tab to freeze for a long period or crash. " +
            "Press 'OK' to continue, or 'Cancel' to abort");
        if(!ui){
            message = "Enter fewer numbers this time!     :)";
        }
    }
    if(target < 0 && message == null){
        message = "Target must be greater than zero.";
    }
    if(params.length == 1 && params[0] == target){
        message = params[0] + " = " + target;
    }
    var nums = new Array();
    params.forEach(num => nums.push(parseInt(num)));
    var newDiv = document.createElement("div")
    newDiv.id = "answer";
    if(message != null){
        newDiv.innerHTML = message;
        document.getElementById("answerDisplay").appendChild(newDiv);
        return;
    }
    document.getElementById("bloops").innerHTML = "";
    evacuateAll();
    setTimeout(() => {document.getElementById("bloops").innerHTML = "";}, evacuateTime * 800);
    setTimeout(
            () => {
                document.getElementById("bloops").innerHTML = "";
                newDiv.innerHTML = buildExpression(nums, target);
                document.getElementById("answerDisplay").appendChild(newDiv);
                makeOrbiters();
            }, evacuateTime * 1000);
}

function buildExpression(list, target){
    var res = buildExpressionHelper(list, target);
    return res == null ? " No solution found. Try " + closest + " as a target instead. " : res.slice(1, res.length - 1) + " = " + target; 
}

function buildExpressionHelper(list, target){
    var last = list[list.length - 1];
    closest = Math.abs(target - last) < Math.abs(target - closest) ? last : closest;
    if(last == target){
        return target.toString();
    }
    for(var i = 0; i < list.length - 1; i++){
        for(var j = i + 1; j < list.length; j++){
            for(var a = 0; a < ops.length; a++){
                 var res = getRes(list, target, i, j, ops[a]);
                if(res != null){
                     return res;
                }
            }
        }
    }
    return null;
}

function getRes(list, target, i, j, op){
    var first = list[i], second = list[j], res;
    var newList = new Array();
    for(var a = 0; a < list.length; a++){
        if(a != i && a != j){
            newList.push(list[a]);
        }
    }
    switch(op){
        case "+": 
            newList.push(first + second);
            res = buildExpressionHelper(newList, target);
            if(res != null){
                return expandExpression(first, second, res, "+", first + second)
            }
            newList.pop();
            break;
        case "-":
            newList.push(Math.abs(first - second));
            res = buildExpressionHelper(newList, target);
            if(res != null){
                return expandExpression(Math.max(first, second), Math.min(first, second), res, "-", Math.abs(first - second))
            }
            newList.pop();
            break;
        case "*":
            newList.push(first * second);
            res = buildExpressionHelper(newList, target);
            if(res != null){
                return expandExpression(first, second, res, "*", first * second)
            }
            newList.pop();
            break;
        case "/":
            if(first % second == 0 && second != 0){
                newList.push((first / second) << 0)
                res = buildExpressionHelper(newList, target);
                if(res != null){
                    return expandExpression(first, second, res, "/", (first / second) << 0)
                }
                newList.pop();
                break;
            }
            if(second % first == 0 && first != 0){
                newList.push((second / first) << 0)
                res = buildExpressionHelper(newList, target);
                if(res != null){
                    return expandExpression(second, first, res, "/", (second / first) << 0)
                }
                newList.pop();
                break;
            }
        default:
            return null;
    }
}

function expandExpression(first, second, curr, op, numToReplace){
    // I recognize that I could have done this with a regular expression. I'm not comfortable enough with them yet. I will change it at some point.
    var strNtr = numToReplace.toString();
    var insertExp = "(" + first + " " + op + " " + second + ")";
    for(var i = strNtr.length; i <= curr.length; i++){
        var scope = curr.substring(i - strNtr.length, i); 
        if(scope == strNtr){
            var nextChar = curr.charAt(i);
            try{
                var prevChar = curr.charAt(i - strNtr.length - 1);
            } catch(error){
                var prevChar = ".";
            }
            if((nextChar < '0' || nextChar > '9') && (prevChar < '0' || prevChar > '9')){
                var res = curr.substring(0, i - strNtr.length) + insertExp + curr.substring(i);
                return res;
            }
        }
    }
    //return curr.replace(numToReplace.toString(), "(" + first + " " + op + " " + second + ")");
}
