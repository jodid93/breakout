//generic constructor for the bullets
function Bullets(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//render the bullets
Bullets.prototype.render = function(g_ctx){

	g_ctx.fillStyle = "orange";
	
	fillCircle(g_ctx, this.cx, this.cy, 5);
	g_ctx.fillStyle = "black";
}

//update the bullets
Bullets.prototype.update = function(time){

	//i use s very similar update routine as for the ball
	//but here i only check if the bullet hit the brick or 
	//if it has gone off screen
	
	//save the old coordinates
	var prevX = this.cx;
    var prevY = this.cy;
	
    // Compute my provisional new position 
    var nextX = prevX;
    var nextY = prevY + (this.yVel * time);
	
	//then i check if the bullet hit the bricks
	for(var i = 0; i < g_bricks.length; i++){
		
		if(g_bricks[i].collideHorizon(prevX, prevY, nextX, nextY, this.radius)){
			
			if(!g_mute){
			
				//play a sound if it hit
				document.getElementById('Hit').play();
			}
			
			//and then update score without combo bonuses, and remove the bullet from the bullet array
			g_score.updateScore(1)
			var dot = g_bullets.splice((g_bullets.indexOf(this)),1);
		}

	}
	
	//if it didn't hit then i update the y coordinate
    this.cy += (this.yVel * time);
	
	//then i see if the bullet is out of bounds, if it is the i remove it from the bullet array
	if(this.cy < -5){
		var dot = g_bullets.splice(0,1);
	}	
}
