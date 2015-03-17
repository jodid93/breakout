//a generic constructor for the gun object
function Gun(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//globals for the gun
var g_gun;
var g_bullets = [];
var KEY_J = 'J'.charCodeAt(0);

//make the gun
makeGun = function(){
	g_gun = new Gun({
	
	//since the gun is bound to the paddle, i use the paddle as a referance 
	//point for the gun
    cx : g_paddle.cx,
    cy : g_paddle.cy,
	
	//timer to stop the player from getting an endless steam of bullets
    time: 0,
    SHOOT : KEY_J
	});
}

//render the gun
Gun.prototype.render = function(g_ctx){

	g_ctx.fillStyle = "yellow";
	fillCircle(g_ctx, g_paddle.cx, g_paddle.cy-5, 5)
	g_ctx.fillStyle = "black";
}

//update the gun
Gun.prototype.update = function(time){
	
	//i use the time from the update file to keep track of the time
	//since the last shot (the time variable)
	this.time -= time;
	
	//make this x and y the same as the paddle
	this.cx = g_paddle.cx;
	this.cy = g_paddle.cy;
	
	//then i check for shots if there at least is at least half a second since 
	//the last shot was taken
	if(this.time < 0){
		if (g_keys[this.SHOOT]) {
			if(!g_mute){
			
				//play a shot sound
				document.getElementById('shot').play();
			}
			
			//shoot the gun
			this.shoot();
			
			//and then set the timer for another half a second
			//since we are going for approx 60 FPS i allow myself
			//to assume that after 30 calls to this object, atleast
			//half a second has passed. i know you hate this but the
			//gun doesn't have to be too accurate
			this.time = 30;
		}
	}
}

//shoot the gun
Gun.prototype.shoot = function(){
	
	//make a new bullet 
	g_bullets.push(new Bullets({
	
	//that starts at the center of the paddle
    cx: g_paddle.cx,
    cy: g_paddle.cy,
    radius: 3, 
    
	//with an upwards direction of 5
    yVel:-5,
	}));
}