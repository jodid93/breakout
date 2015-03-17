// ==========
// BALL STUFF
// ==========

//a general constructor for a ball
function g_ball(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//a common radius for the ball
g_ball.prototype.radius = 10;
g_ball.prototype.hitTime = 0;
g_ball.prototype.combo = 0;
var g_ballTrace = [];


//update the ball
g_ball.prototype.update = function(time){
    
    //save my old x and y
    var prevX = this.cx;
    var prevY = this.cy;
    
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + (this.xVel * time);
    var nextY = prevY + (this.yVel * time);

    // Bounce off the paddle1
    if (g_paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {
		//if i hit then i change the direction of the ball
		this.yVel *= -1;
		
		//then to add the illusion of the paddle being a bit curved, i update xVel 
		//according to where it lands on the paddle. but i make sure that this doesn't get
		//out of controll by making it never go higher than 15
		if(this.xVel > -15 || this.xVel < 15){
			
			//update xVel
			this.xVel += (g_paddle.whereOnPaddle(nextX,nextY,this.radius));
		}
		if(!g_mute){
			
			//play a little hit sound
			document.getElementById('pallHit').play();
		}
    }
	
	//then i check if the ball hit any of the bricks
	//if any brick is hit i increment the hitTime on this ball
	//then i use the hitTime to calculate the combo that is to be
	//used in the score update
	for(var i = 0; i < g_bricks.length; i++){
	
		//first i check for a verticle collode
		if(g_bricks[i].collideVericle(prevX, prevY, nextX, nextY, this.radius)){
			
			//if i hit it vertically then i change the xVel
			this.xVel *= -1;
			
			//increment the hitTime to give the player half a second more to
			//hit the next brick.
			
			//since we are going for approx 60 FPS i allow myself
			//to assume that after 30 calls to this object, atleast
			//half a second has passed. 
			this.hitTime += 30;
			
			//if the hitTime isn't 0 (if the player has recently hit a brick, with in the hitTime margin) 
			//i increment the combo variable to variable * 2, but make sure that the
			// combo never goes beoynd 16
			if(this.hitTime != 0){
				if(this.combo == 0){
					this.combo = 1;
				}
				else{
					if(this.combo < 16){
						this.combo *= 2;
					}
				}
			}
			if(!g_mute){
				//play a little hit sound
				document.getElementById('Hit').play();
			}
			
			//update the score as a multiple of the combo
			g_score.updateScore(this.combo)
			
		}else if(g_bricks[i].collideHorizon(prevX, prevY, nextX, nextY, this.radius)){
			
			//then i check the Horizontal collision
			
			//if it's a hit then i change the direction of the ball and 
			//do everything the same as in checking the vertical collision
			this.yVel *= -1;
			this.hitTime += 30;
			
			if(this.hitTime != 0){
				if(this.combo == 0){
					this.combo = 1;
				}
				else{
					if(this.combo < 16){
						this.combo *=2;
					}
				}
			}
			if(!g_mute){
				document.getElementById('Hit').play();
			}
			g_score.updateScore(this.combo)
		}
		
	}
	
	//decrement the hitTime by the time du
	if(this.hitTime > 0){
		this.hitTime -= time;
	}
	
	//and reset the combo to 0 if the hitTime is 0 (if you havn't hit a brick in more than half a second)
	if(this.hitTime < 0){
		this.combo = 0;
	}
	
    
    var margin = this.radius;
	
	//bounce of the left side
    if (nextX < this.radius){
		if(!g_mute){
			//play hit sound
			document.getElementById('wallHit').play();
		}
        this.xVel *= -1;                 //reverse direction of the ball
    }
	
	//bounce of the right side
    if (nextX > g_canvas.width-this.radius) {
		if(!g_mute){
	
			document.getElementById('wallHit').play();
		}
        this.xVel *= -1;                //reverse the ball direction
        
    }
	
	//bounce of the top
	if (nextY < this.radius){
			this.yVel *= -1;  			//reverse the direction of the ball
			if(!g_mute){
	
				document.getElementById('wallHit').play();
			}
    }
	
	//check if the ball has gone past the paddle
	if (nextY > g_canvas.height+this.radius+3) {
		
		//make sure that if you have multiple balls you don't reset anything
		if(g_balls.length == 1){
		
			//reset the paddle and ball and remove all abilities
			g_paddle.reset();
			g_gunEnable = false;
			this.reset();     
			g_score.updateLife();
			if(!g_mute){
				//play a loosing sound
				document.getElementById('loose').play();
			}
        }else{
			
			//if you have more than 1 ball take out the ball that went past the paddle
			var dot = g_balls.splice((g_balls.indexOf(this)),1);
		}
    }

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    this.cx += (this.xVel * time);
    this.cy += (this.yVel * time);
};

//reset the ball
g_ball.prototype.reset = function () {
    this.cx = g_canvas.width / 2;
    this.cy = 330;
    this.xVel = -2.5;
    this.yVel = -5;
	
};

//remove the trace from the ball
g_ball.prototype.clearTrace = function(){
	while(g_ballTrace.length !== 0){
		g_ballTrace.pop();
	}
}

//render the trace
g_ball.prototype.renderTrace = function(ctx){
	
    g_ctx.fillStyle = "white";
	g_ctx.save()
	
	//go through the g_ballTrace array and print each circle in the trace with an alpha 
	//corresponding to the trace's radius
	for(var i = 0; i < g_ballTrace.length; i++){
		g_ctx.globalAlpha=(g_ballTrace[i].radius/10);
		fillCircle(g_ctx, (g_ballTrace[i].cx), (g_ballTrace[i].cy), (g_ballTrace[i].radius));
	}
	g_ctx.fillStyle = "black";
	g_ctx.restore()
}

//create the trace
g_ball.prototype.makeTrace = function(){
	
	//add a new circle to the trace with the x and y of the 
	// ball that called for the trace
	g_ballTrace.push(new g_ball({
		cx: this.cx,
		cy: this.cy,
		
		radius: this.radius,
		xVel: 0,
		yVel: 0
	}));
}

//update the trace
g_ball.prototype.updateTrace = function(){

	//go through the circles in the trace and decrement the radius
	for(var i = 0; i < g_ballTrace.length; i++){
		g_ballTrace[i].radius -= 0.5;
		
		//if the radius is less than 2 then remove the circle from the trace
		if(g_ballTrace[i].radius < 2){
			var dot = g_ballTrace.splice(i,1);
		}
	}
}

//render trace
g_ball.prototype.render = function (g_ctx) {

	var shade = g_ctx.createRadialGradient(this.cx,this.cy,(this.radius/5),this.cx,this.cy,this.radius+1);
    shade.addColorStop(0,"orange");
    shade.addColorStop(0.20,"yellow");
    shade.addColorStop(0.80,"white");
    shade.addColorStop(1,"white");

    //fill with gradient
    g_ctx.fillStyle = shade;
    fillCircle(g_ctx, this.cx, this.cy, this.radius);
	g_ctx.fillStyle = "black";
};
