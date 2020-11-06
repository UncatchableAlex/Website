"use strict";
class Util{
	static getCssRule(stylesheet, selectorText){
		var rVal = null; 
		Array.from(stylesheet.cssRules).forEach(
			currRule => {
				if(currRule.selectorText == selectorText){
					rVal = currRule
				}
			}
		);
		return rVal
	}

	static deleteCssRule(stylesheet, selectorText){
		for(let i = 0; i < stylesheet.cssRules.length; i++){
			if(stylesheet.cssRules[i].selectorText == selectorText){
				stylesheet.deleteRule(i);
				return true;
			}
		}
		return false;
	}

	static getEndPoint(startPoint, firstCtrl){
		const givenVec = [firstCtrl[0] - startPoint[0], firstCtrl[1] - startPoint[1]];
		let perp = Util.rotateVector(givenVec, Math.PI / 2);
		perp = Util.normalizeVector(perp);
		const minMax = Util.getMinMaxScalar(startPoint, perp);
		const mag = Math.abs(minMax[0]) > Math.abs(minMax[1]) ? Util.getRandomIntInRange((minMax[0] * 0.75) << 0, minMax[0]) : Util.getRandomIntInRange((minMax[1] * 0.75) << 0, minMax[1]);
		const midPoint = [(startPoint[0] + firstCtrl[0]) / 2, (startPoint[1] + firstCtrl[1]) / 2];
		const endPoint = new Array();
		endPoint.push((perp[0] * mag << 0) + midPoint[0]);
		endPoint.push((perp[1] * mag << 0) + midPoint[1]);
		return endPoint;
	}

	// returns an array with two elements: the largest and smallest a scalar can be and still point at a coordinate pair on screen.
	static getMinMaxScalar(startPoint, unitVec){
		// evaluate left bound:
		const leftBound = unitVec[0] == 0 ? Number.MAX_VALUE : (-1 * startPoint[0]) / unitVec[0];
		const rightBound = unitVec[0] == 0 ? Number.MAX_VALUE :(window.innerWidth - blockWidth - startPoint[0]) / unitVec[0];
		const topBound = unitVec[1] == 0 ? Number.MAX_VALUE : (-1 * startPoint[1]) / unitVec[1];
		const bottomBound = unitVec[1] == 0 ? Number.MAX_VALUE : (window.innerHeight - blockHeight - startPoint[1]) / unitVec[1];
		const directions = [[leftBound, topBound], [rightBound, topBound], [bottomBound, leftBound], [bottomBound, rightBound]];
		directions.sort(function(a,b){return Math.min(a[0], a[1]) - Math.min(b[0], b[1])})
		const min = Math.min(directions[0][0], directions[0][1]);
		const max = Math.min(directions[directions.length - 1][0], directions[directions.length - 1][1]);
		return [min << 0, max << 0];
	}


	// use the dot product cosine rule to get the angle between two vectors: dot(a,b) = magnitude(a) * magnitude(b) * cos(theta). Solve for theta.
	static getAngle(vecA, vecB){
		const dot = (vecA[0] * vecB[0]) + (vecA[1] * vecB[1]);
		const magA = Util.getDist([0,0], vecA);
		const magB = Util.getDist([0,0], vecB);
		return Math.acos(dot / (magA * magB));
	}

	// rotate vec by theta degrees preserving its magnitude
	static rotateVector(vec, theta){
		const xcomponent = (vec[0] * Math.cos(theta)) - (vec[1] * Math.sin(theta));
		const ycomponent = (vec[0] * Math.sin(theta)) + (vec[1] * Math.cos(theta));
		return [xcomponent, ycomponent];
	}

	// shorten/lengthen vec to have a magnitude of 1
	static normalizeVector(vec){
		const mag = Util.getDist(new Array(0,0), vec);
		return mag == 0 ? [0, 0] : [vec[0] / mag, vec[1] / mag];
	}

	// make vec point in the opposite direction.
	static flipVector(vec){
		return [vec[0] * -1, vec[1] * -1];
	}

	// show where vec points to if it starts at startPoint
	static getVectorEndPoint(startPoint, vec){
		return [vec[0] + startPoint[0], vec[1] + startPoint[1]];
	}

	//get a random point where a block could be visible on screen.
	static getRandomPoint(startPoint = null, rad = 500){
		let endPoint = [Util.getRandomIntInRange(0, window.innerWidth - 150), Util.getRandomIntInRange(0, window.innerHeight - 150)]
		if(startPoint != null){
			while(Util.getDist(startPoint, endPoint) < rad){
				endPoint[0] = Util.getRandomIntInRange(0, window.innerWidth - 150);
				endPoint[1] = Util.getRandomIntInRange(0, window.innerHeight - 150);
			}
		}
		return endPoint;
	}

	// get the distance between two points
	static getDist(p1, p2){
		// distance formula: d = sqrt((x1-x2)^2 + (y1-y2)^2)
		return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)) << 0;
	}

	static getRandomIntInRange(first, second){
		const a = Math.min(first, second), b = Math.max(first, second);
		return (((b - a) * Math.random()) + a) << 0
	}
	
	static getOffScreenPoint(){
		const rand = Math.random();
		if(rand >= 0.75){
			return new Array(-200,-200);
		}
		else if(rand >= 0.50){
			return new Array(-200, window.innerHeight + 200);
		}
		else if(rand >= 0.25){
			return new Array(window.innerWidth + 200, -200);
		} else {
			return new Array(window.innerWidth + 200, window.innerHeight + 200);
		}
	}

	// evaluate all off-screen corners and return the furthest one from the defined point:
	static getFurthestOffScreenPoint(currPoint){
		const midPoint = [window.innerWidth / 2, window.innerHeight / 2];
		if((currPoint[0] < midPoint[0]) && (currPoint[1] < midPoint[1])){
			return [window.innerWidth + 200, window.innerHeight + 200];
		} 
		else if((currPoint[0] < midPoint[0]) && (currPoint[1] > midPoint[1])){
			return [window.innerWidth + 200, - 200];
		} 
		else if((currPoint[0] > midPoint[0]) && (currPoint[1] > midPoint[1])){
			return [-200, -200];
		} 
		return 	[-200, window.innerHeight + 200]
	}
}