// A generic constructor for paddle
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}


//i had to have the halfWidth 49.5 so that the gun could shoot the left most
//and right most bricks
Paddle.prototype.halfWidth = 49.5;
Paddle.prototype.halfHeight = 10;
Paddle.prototype.rotation = 0;

//reset the paddle to it's initial position
Paddle.prototype.reset = function(){
	this.cx = 250;
	this.cy = 370;
	this.halfWidth = 49.5;
	this.halfHeight = 10;
	this.rotation = 0;
}

//update the paddle
Paddle.prototype.update = function (time) {
     
		//go right
        if (g_keys[this.GO_FORW]) {
            this.cx += (this.speed * time);
			
			//make the paddle lean forward
			this.rotation = (Math.PI/32)
        }
		
		//go left
		if (g_keys[this.GO_BACW]) {
            this.cx -= (this.speed * time);
			
			//make the paddle lean backwards
			this.rotation = -(Math.PI/32)
        }
		if (!g_keys[this.GO_BACW]&&!g_keys[this.GO_FORW]) {
           
		    //reset the leaning if nothing is being pressed
			this.rotation = 0;
		}
		
	//variables used to bind the paddle to the g_canvas
	var leftSide = this.cx - this.halfWidth;
	var rightSide = this.cx+this.halfWidth;
	
	this.bind(leftSide, rightSide);
};

//render paddle
Paddle.prototype.render = function (ctx) {

	//draw the sprite that contains the paddle
	g_paddleSprite.drawAtRotate(g_ctx,this.cx,this.cy,this.rotation);
};

// a function to check wheather the paddles have gone out of bounds
//and restrict it from going out of bounds
Paddle.prototype.bind = function (x,y){

	//the paddle has gone too far to the left
    if(x < 0){
		this.cx = 0 + this.halfWidth;
	}
	
	//the paddle has gone too far to the right
	if(y > g_canvas.width){
		this.cx = g_canvas.width - this.halfWidth;
	}
};

Paddle.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
   
   var paddleEdge = this.cy;

    // Check X coords
    if ((prevY + (r+8) < paddleEdge && nextY + (r+8) >= paddleEdge)) {
	
        // Check Y coords
        if (nextX + r >= this.cx - this.halfWidth &&
            nextX - r <= this.cx + this.halfWidth) {
			
            // It's a hit!
            return true;
        }
    }
	
    // It's a miss!
    return false;
};

//a function to change the velocity of the ball based on where it hit the paddle
Paddle.prototype.whereOnPaddle = function(nextX, nextY, r){

	var paddleLeftMost = this.cx-this.halfWidth;
	var paddleLeft = this.cx-30;
	var paddleMiddle = this.cx-10;
	var paddleRight = this.cx+10;
	var paddleRightMost = this.cx+(this.halfWidth-20)
	
	//see where it hit and return the corresponding value
	if (nextX + r >= paddleLeftMost && nextX < paddleLeft) {
        return -3;
    } else if(nextX >= paddleLeft && nextX < paddleMiddle){
		return -2
	} else if(nextX >= paddleMiddle && nextX < paddleRight){
		return 0;
	} else if(nextX >= paddleRight && nextX < paddleRightMost){
	 	return 2;
	} else if(nextX >= paddleRightMost && nextX <= this.cx + this.halfWidth){
		return 3;
	}else return 3;
};