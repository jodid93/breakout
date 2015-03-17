// ==============
// POWER UP STUFF
// ==============

var g_powerups = [];

//a general constructor for a power up
function g_Powers(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//get a new power up
getPowerUp = function (X,Y){
	g_powerups.push(new g_Powers({
		//get the x  and y from the brick that contained a powerup
		cx: X,
		cy:Y,
		radius: 8, 
		
		xVel:0,
		
		//with a downward velocity of 2.5
		yVel:2.5
	}));
	
	//after the powerup has been created then i choose the power up's ability by chance
	//with a random variable choose
	
	//there are 10 different abilities, both good and bad
	// 1. loose life
	// 2. gain life
	// 3. ball speed up
	// 4. ball slow down
	// 5. a gun
	// 6. longer paddle
	// 7. shorter paddle
	// 8. loose score
	// 9. gain score
	// 10. an extra ball
	
	var choose = Math.random();
	
	if(choose < 0.1){
		
		//tell the object what ability it's getting and wether that ability is good or bad
		g_powerups[g_powerups.length-1].power = "looseLife"; 
		g_powerups[g_powerups.length-1].good = false;
	}else if(choose < 0.2){
		g_powerups[g_powerups.length-1].power = "gainLife"; 
		g_powerups[g_powerups.length-1].good = true;
	}else if(choose < 0.3){
		g_powerups[g_powerups.length-1].power = "longBoard"; 
		g_powerups[g_powerups.length-1].good = true;
	}else if(choose < 0.4){
		g_powerups[g_powerups.length-1].power = "shortBoard"; 
		g_powerups[g_powerups.length-1].good = false;
	}else if(choose < 0.5){
		g_powerups[g_powerups.length-1].power = "fastBall"; 
		g_powerups[g_powerups.length-1].good = false;
	} else if(choose < 0.6){
		g_powerups[g_powerups.length-1].power = "slowBall"; 
		g_powerups[g_powerups.length-1].good = true;
	} else if(choose < 0.7){
		g_powerups[g_powerups.length-1].power = "addBall";
		g_powerups[g_powerups.length-1].good = true;
	} else if(choose < 0.8){
		g_powerups[g_powerups.length-1].power = "Gun";
		g_powerups[g_powerups.length-1].good = true;
	} else if(choose < 0.9){
		g_powerups[g_powerups.length-1].power = "looseScore"; 
		g_powerups[g_powerups.length-1].good = false;
	} else{
		g_powerups[g_powerups.length-1].power = "gainScore"; 
		g_powerups[g_powerups.length-1].good = true;
	}
}

//function to implement abilities. these function work directly on the objects at hand
// through the global scope that is allowed in JavaScript. i do this to simplify things a little
// in order to see directly the effect of the powerups right here in this document
g_Powers.prototype.looseLife = function (){
	g_score.life -= 1;
};

g_Powers.prototype.gainLife = function (){
	//make sure you don't get too much life
	if(g_score.life < 10){
		g_score.life += 1;
	}
};

g_Powers.prototype.longBoard = function (){
	
	//the maximum width of the board is double the original
	if(g_paddle.halfWidth < 100){
		g_paddle.halfWidth += 10;
	}
};

g_Powers.prototype.shortBoard = function (){

	//and the minimum is 20 across
	if(g_paddle.halfWidth > 10){
		g_paddle.halfWidth -= 10;
	}
};

g_Powers.prototype.slowBall = function (){

	//slow down all the balls
	for(var i = 0; i < g_balls.length; i++){
		g_balls[i].xVel = (g_balls[i].xVel)/2
		g_balls[i].yVel = (g_balls[i].yVel)/1.5
	
	}
};

g_Powers.prototype.fastBall = function (){

	//speed up all the balls
	for(var i = 0; i < g_balls.length; i++){
		g_balls[i].xVel = (g_balls[i].xVel)*1.5
		g_balls[i].yVel = (g_balls[i].yVel)*1.5
	
	}
};

//add a new ball
g_Powers.prototype.addBall = function (){

//get the center of the paddle for the new x y position of the ball
var newx = g_paddle.cx;
var newy = g_paddle.cy;

	//make the ball
	g_balls.push(new g_ball({
    cx: newx,
    cy: newy,
    radius: 10, 
    
    xVel:-2.5,
    yVel:-5
}));
}

g_Powers.prototype.gainScore = function (){

	//add to the score
	g_score.score += 250;
	
};

g_Powers.prototype.looseScore = function (){
	
	//make sure you never get a negative score
	if(g_score.score  > 250){
		g_score.score -= 250;
	}
	else{
		g_score.score = 0;
	}
};

//render the powerups
g_Powers.prototype.renderPower = function(g_ctx, good){

	//for the good powerups i make them yellow-ish
	if(good){
		var shade = g_ctx.createRadialGradient(this.cx,this.cy,(this.radius/5),this.cx,this.cy,this.radius+1);
		shade.addColorStop(0,"yellow");
		shade.addColorStop(0.80,"white");
		shade.addColorStop(1,"white");

		//fill with gradient
		g_ctx.fillStyle = shade;
		fillCircle(g_ctx, this.cx, this.cy, this.radius);
		g_ctx.fillStyle = "black";
	}else{
		
		//but the bad ones are colored blue/black/red
		var shade = g_ctx.createRadialGradient(this.cx,this.cy,(this.radius/5),this.cx,this.cy,this.radius+1);
		shade.addColorStop(0,"red");
		shade.addColorStop(0.20,"black");
		shade.addColorStop(0.80,"blue");
		shade.addColorStop(1,"red");

		//fill with gradient
		g_ctx.fillStyle = shade;
		fillCircle(g_ctx, this.cx, this.cy, this.radius);
		g_ctx.fillStyle = "black";
	}
}

//update the powerups
g_Powers.prototype.updatePower = function(time){

	//save the old coordinates
	var prevX = this.cx;
    var prevY = this.cy;
    
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + (this.xVel * time);
    var nextY = prevY + (this.yVel * time);
	
	//check if the powerup has collided with the paddle
    if (g_paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {
		//then apply the propper ability
		if(this.power == "looseLife"){
			if(!g_mute){
				//and play a bad sound for bad abilities
				document.getElementById('powerDn').play();
			}
			this.looseLife();
		}else if (this.power == "gainLife"){
			if(!g_mute){
				//and a good one for good abilities
				document.getElementById('powerUp').play();
			}
			this.gainLife();
		}else if (this.power == "longBoard"){
			if(!g_mute){
	
				document.getElementById('powerUp').play();
			}
			this.longBoard();
		}else if(this.power == "shortBoard"){
			if(!g_mute){
	
				document.getElementById('powerDn').play();
			}	
			this.shortBoard();
		}else if(this.power == "slowBall"){
			if(!g_mute){
	
				document.getElementById('powerUp').play();
			}
			this.slowBall();
		}else if(this.power == "fastBall"){
			if(!g_mute){
	
				document.getElementById('powerDn').play();
			}
			this.fastBall();
		}else if(this.power == "addBall"){
			if(!g_mute){
	
				document.getElementById('powerUp').play();
			}
			this.addBall();
		}else if(this.power == "Gun"){
			if(!g_mute){
	
				document.getElementById('powerUp').play();
			}
			makeGun();
			g_gunEnable = true;
		}else if(this.power == "looseScore"){
			if(!g_mute){
	
				document.getElementById('powerDn').play();
			}
			this.looseScore();
		}else {
			if(!g_mute){
	
				document.getElementById('powerUp').play();
			}
			this.gainScore();
		}
		
		//finally i remove the powerup from the powerup array
		var dot = g_powerups.splice((g_powerups.indexOf(this)),1);
    }
	
	//if the powerup didn't collide with the paddle i check if it has gone out of bounds
	if(this.cx > 410){
		//if it has then i remove it from the powers array
		var dot = g_powerups.splice((g_powerups.indexOf(this)),1);
	}
	
	//finally i update the x and y coordinate
	this.cx += (this.xVel * time);
    this.cy += (this.yVel * time);
	
};