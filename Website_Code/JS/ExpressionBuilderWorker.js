onmessage = function(e){
    let ebw = new ExpressionBuilderWorker();
    let ans = ebw.buildExpression(e.data[0], e.data[1]);
    postMessage(ans);
}
class ExpressionBuilderWorker{

    static OPS = ["+", "-", "*", "/"];

    constructor(){
        this.closest = Number.MAX_VALUE;
    }

    buildExpression(list, target){
        let res = this.buildExpressionHelper(list, target);
        if(res == null){
            res = " No solution found. Try " + this.closest + " as a target instead. "
        } else {
            res = res.replaceAll(/^[(]|[)]$/g, "") + " = " + target;
        }
        return res;
    }

    buildExpressionHelper(list, target){
        let last = list[list.length - 1];
        this.closest = Math.abs(target - last) < Math.abs(target - this.closest) ? last : this.closest;
        if(last == target){
            return target.toString();
        }
        for(let i = 0; i < list.length - 1; i++){
            for(let j = i + 1; j < list.length; j++){
                for(let a = 0; a < ExpressionBuilderWorker.OPS.length; a++){
                    let res = this.getRes(list, target, i, j, ExpressionBuilderWorker.OPS[a]);
                    if(res != null){
                         return res;
                    }
                }
            }
        }
        return null;
    }

    getRes(list, target, i, j, op){
        let first = list[i], second = list[j], res;
        let newList = new Array();
        for(let a = 0; a < list.length; a++){
            if(a != i && a != j){
                newList.push(list[a]);
            }
        }
        switch(op){
            case "+": 
                newList.push(first + second);
                res = this.buildExpressionHelper(newList, target);
                if(res != null){
                    return this.expandExpression(first, second, res, "+", first + second)
                }
                newList.pop();
                break;
            case "-":
                newList.push(Math.abs(first - second));
                res = this.buildExpressionHelper(newList, target);
                if(res != null){
                    return this.expandExpression(Math.max(first, second), Math.min(first, second), res, "-", Math.abs(first - second))
                }
                newList.pop();
                break;
            case "*":
                newList.push(first * second);
                res = this.buildExpressionHelper(newList, target);
                if(res != null){
                    return this.expandExpression(first, second, res, "*", first * second)
                }
                newList.pop();
                break;
            case "/":
                if(first % second == 0 && second != 0){
                    newList.push((first / second) << 0)
                    res = this.buildExpressionHelper(newList, target);
                    if(res != null){
                        return this.expandExpression(first, second, res, "/", (first / second) << 0)
                    }
                    newList.pop();
                    break;
                }
                if(second % first == 0 && first != 0){
                    newList.push((second / first) << 0)
                    res = this.buildExpressionHelper(newList, target);
                    if(res != null){
                        return this.expandExpression(second, first, res, "/", (second / first) << 0)
                    }
                    newList.pop();
                    break;
                }
            default:
                return null;
        }
    }

    expandExpression(first, second, curr, op, numToReplace){
        // I recognize that I could have done this with a regular expression. I'm not comfortable enough with them yet. I will change it at some point.
        const strNtr = numToReplace.toString();
        const  insertExp = "(" + first + " " + op + " " + second + ")";
        for(let i = strNtr.length; i <= curr.length; i++){
            let frame = curr.substring(i - strNtr.length, i); 
            if(frame == strNtr){
                let nextChar = curr.charAt(i);
                let prevChar;
                try{
                   prevChar = curr.charAt(i - strNtr.length - 1);
                } catch(error){
                   prevChar = ".";
                }
                if((nextChar < '0' || nextChar > '9') && (prevChar < '0' || prevChar > '9')){
                    let res = curr.substring(0, i - strNtr.length) + insertExp + curr.substring(i);
                    return res;
                }
            }
        }
        return curr;
    }
}