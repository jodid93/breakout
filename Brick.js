// A generic constructor for bricks
function Brick(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Brick.prototype.halfWidth = 25;
Brick.prototype.halfHeight = 10;

//global for the colors
var g_colors = ["blue","purple","red","orange","yellow"];

//render the bricks
Brick.prototype.render = function (ctx) {
	
	//have a nice gradiant for the bricks
	var shade = ctx.createRadialGradient(this.cx,this.cy,(this.halfWidth/16),this.cx,this.cy,this.halfWidth);
    shade.addColorStop(0,"white");
	
	shade.addColorStop(0.8,this.color);
	shade.addColorStop(1,this.color);

	
	ctx.fillStyle=shade;
    // (cx, cy) is the centre, then i have the -1 there to make space between the bricks 
    ctx.fillRect((this.cx - this.halfWidth),
                 this.cy - this.halfHeight,
                 (this.halfWidth * 2)-1,
                 ((this.halfHeight * 2)-1));
    
    ctx.fillStyle="black";
};

//wrap around for moving bricks
Brick.prototype.wrapDraw = function (ctx){

	//see if the brick has gone out of bounds on the right side
	if(this.cx > g_canvas.width - this.halfWidth ){
	
		//and then draw a duplicate in the far left side
		var shade = ctx.createRadialGradient((this.cx-g_canvas.width),this.cy,(this.halfWidth/16),(this.cx-g_canvas.width),this.cy,this.halfWidth);
		shade.addColorStop(0,"white");
		shade.addColorStop(1,this.color);

		ctx.fillStyle=shade;
		// (cx, cy) is the centre;
		ctx.fillRect((this.cx-g_canvas.width-this.halfWidth),
                 this.cy - this.halfHeight,
                 (this.halfWidth * 2)-1,
                 ((this.halfHeight * 2)-1));
    
		ctx.fillStyle="black";
	}
	
	//then check if the brick has gone out of bounds in the left side
	if(this.cx < this.halfWidth ){
	
		//and then draw a duplicate in the far right side
		var shade = ctx.createRadialGradient((this.cx+g_canvas.width),this.cy,(this.halfWidth/16),(this.cx+g_canvas.width),this.cy,this.halfWidth);
		shade.addColorStop(0,"white");
		shade.addColorStop(1,this.color);

		ctx.fillStyle=shade;
		// (cx, cy) is the centre
		ctx.fillRect((this.cx+g_canvas.width-this.halfWidth),
                 this.cy - this.halfHeight,
                 (this.halfWidth * 2)-1,
                 ((this.halfHeight * 2)-1));
    
		ctx.fillStyle="black";
	}
	
	//then i change the center of the brick if more than half of it is on the other side
	if(this.cx > g_canvas.width ){
		this.cx = this.cx-g_canvas.width;
	}
	if(this.cx < 0 ){
		this.cx = this.cx+g_canvas.width;
		
	}
}

//update the bricks
Brick.prototype.update = function (time) {

	//simple stuff
	this.cx = this.cx+(this.speed*time);
	
}

//vertical collosion
Brick.prototype.collideVericle = function (prevX, prevY,nextX, nextY, r){

	//the vertical line through the brick
    var brickVertical = this.cx;
	
    // make sure that i only collide with bricks that aren't already hit
	if(this.hit === false){
		
		//check the x coordinares
		if ((prevX < brickVertical-this.halfWidth && nextX >= brickVertical-this.halfWidth) ||
			(prevX > brickVertical+this.halfWidth && nextX <= brickVertical+this.halfWidth)) {
			
			// Check Y coords
			if (nextY >= this.cy - this.halfHeight &&
				nextY < this.cy + this.halfHeight) {
				
				// It's a hit!
				
				//decrement the duration and change the color to the corresponding duration
				this.duration -= 1;
				this.color = g_colors[this.duration-1];
				
				//see if the brick was destroyed
				if(this.duration == 0){
					this.hit = true;
					
					//if the brick had a power up then i get the power up
					if(this.power){
						getPowerUp(this.cx, this.cy);
					}
				}
				
				//return true because it's a hit
				return true;
			}
		}
	}
	
    // It's a miss!
    return false;
	
};

//horizontal collision
Brick.prototype.collideHorizon = function(prevX, prevY, nextX, nextY, r){
	
	//same as in vertical collosion
	if(this.hit === false){
		var brickHorizontal = this.cy
			// Check Y coords
			if ((nextY > brickHorizontal-this.halfHeight && prevY <= brickHorizontal-this.halfHeight) ||
				(nextY < brickHorizontal+this.halfHeight && prevY >= brickHorizontal+this.halfHeight)){
				
				// check x 
				if (nextX >= this.cx - this.halfWidth &&
					nextX  < this.cx + this.halfWidth) {
					
					this.duration -= 1;
					this.color = g_colors[this.duration-1];
					if(this.duration == 0){
						this.hit = true;
						
						if(this.power){
							getPowerUp(this.cx, this.cy);
						}
					}
					
					return true;
				}
			}
		}
		return false;
};