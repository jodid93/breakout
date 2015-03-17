/*
This is breakout
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

//some ugly globals to help with program flow
var g_hasWon = false;
var g_shouldDoIntro = true; 

//used for the intro to make the screen come into place
var g_displacement = -370

//for the gun
var g_gunEnable = false;

//for the mute button
var MUTE = 'M'.charCodeAt(0);
var g_mute = false;

//I start out by constructing the basics
// ============
// PADDLE STUFF
// ============

//keys for moving left and right
var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle = new Paddle({
    cx : 250,
    cy : 370,
	speed : 10,
    
    //keys for moving left and right
    GO_FORW : KEY_D,
    GO_BACW : KEY_A
});

//============
// BALL STUFF
//============

//an array to hold all my balls
var g_balls = [];	
	
g_balls.push(new g_ball({

	//make the ball start at the center of the paddle
    cx: g_canvas.width / 2,
    cy:330,
    radius: 10, 
    
    xVel:-2.5,
    yVel:-5
}));

// ============
// SCORE STUFF
// ============
var g_score = new Score({

	//score holds the important stuff
	score : 0,
	life: 5,
	level: 3
});

//============
// BRICK STUFF
//============

//for the bricks
var colors = ["blue","purple","red","orange","yellow"];

//an array of the bricks
var g_bricks = [];

//since the bricks are different in each level, I use the level implimentation to construct the bricks
setLevel(g_score.level);

//=====================
// Level implementation
//=====================
function setLevel(level) {

	//start by clearing all existing bricks from g_bricks
	while(g_bricks.length !== 0){
		g_bricks.pop();
	}
	
	//then i reset the paddle, ball and such
	initLvlInit();
	
	//after which i initiate the next level based on the level counter in g_scores
	if(g_score.level === 1){
	
		if(!g_mute){
		
			//play a start up sound.
			document.getElementById('start').play();
		}
		initLvlOne();
	}
	else if(g_score.level === 2){
	
		if(!g_mute){
			document.getElementById('lvltransit').play();
		}
		initLvlTwo();
	}
	else if(g_score.level === 3){
		
		if(!g_mute){
			document.getElementById('lvltransit').play();
		}
		initLvlThree();
	}
	else if(g_score.level === 4){
		
		if(!g_mute){
			document.getElementById('lvltransit').play();
		}
		initLvlFour();
	}else{
		
		//if the score counter is greater than 4 then i jump to the end 
		g_hasWon = true;
		if(!g_mute){
			
			//i stop the theme mustic and play the victory music
			document.getElementById('theme').pause();
			document.getElementById('victory').play();
		}
		
		//then i go to the victory segment
		victory(g_ctx);
	}
}

function initLvlInit(){

	//reset intro logic
	g_shouldDoIntro = true;
	g_displacement = -100;
	
	//disable the gun
	g_gunEnable = false;
	
	//and the balls and paddle (including the power ups)
	g_balls[0].reset();
	g_balls[0].clearTrace();
	g_paddle.reset();
};

function initLvlOne(){

	//the way i arrange the bricks is by having a double for loop that determines their initial position
	//along with their basic attributes like whether they hold a power or not, their duration, speed and
	//color
	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
			g_bricks.push(new Brick({
			
				//order them into place by using u for rows and i for columns
				cx: (i* 50) + 25,
				cy: 70 + (u*20),
				
				//initial speed and duration
				speed: 0,
				duration: 1,
				hit: false,
				
				//use the color array to get the color
				color: colors[0],
		
				//whether or not the brick contains a power up. if it does than the power will
				//be determined later by chance
				power: false
			}));
		}
	}
	//then i iterate through them again to give them extra abilities, like powers or speed or extra duration
	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
		
			//make it a 20% chance to get a power up
			if((Math.random()) < 0.20){
				g_bricks[(10*u)+i].power = true;
			}
		}
	}
};

function initLvlTwo(){

	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
			g_bricks.push(new Brick({
				cx: (i* 50) + 25,
				cy: 70 + (u*20),
				speed: 0,
				duration: 1,
				
				color: colors[0],
				hit: false,
				power: false
			}));
		}
	}
	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
		
			//make the top bricks have higher duration and make the color corespond to the durability
			if(u == 0 || u == 1 || u == 2){
				g_bricks[(10*u)+i].duration = 2;
				g_bricks[(10*u)+i].color = colors[1];
			}
			if((Math.random()) < 0.20){
				g_bricks[(10*u)+i].power = true;
			}
		}
	}
};

function initLvlThree(){

	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
			g_bricks.push(new Brick({
				cx: (i* 50) + 25,
				cy: 70 + (u*20),
				hit: false,
				
				//make them move continuesly to the right (with a wrap around)
				speed: 1,
				duration: 1,
				
				color: colors[0],
				power: false
			}));
		}
	}
	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
			if(u == 0 || u == 1 ){
				g_bricks[(10*u)+i].color = colors[2];
				g_bricks[(10*u)+i].duration = 3;
			}
			else if(u == 2 || u == 3 ){
				g_bricks[(10*u)+i].color = colors[1];
				g_bricks[(10*u)+i].duration = 2;
			}
			else{
				g_bricks[(10*u)+i].color = colors[0];
			}
			if((Math.random()) < 0.20){
				g_bricks[(10*u)+i].power = true;
			}
		}
	}
};

function initLvlFour(){

	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
			g_bricks.push(new Brick({
				cx: (i* 50) + 25,
				cy: 70 + (u*20),
				speed: 1,
				duration: 1,
				
				color: colors[u],
				hit: false,
				power: false
			}));
		}
	}
	for(var u = 0; u < 5; u++){
		for(var i = 0; i < 10; i++){
		
			//make every other row move coninuesly to the right
			if(u == 0 || u == 2 || u == 4){
				g_bricks[(10*u)+i].speed = -1;
				g_bricks[(10*u)+i].duration = 4;
				g_bricks[(10*u)+i].color = colors[4]
				
			}
			if(u == 1 || u == 3 ){
				g_bricks[(10*u)+i].speed = 1;
				g_bricks[(10*u)+i].duration = 3;
				g_bricks[(10*u)+i].color = colors[3]
				
			}
			if((Math.random()) < 0.20){
				g_bricks[(10*u)+i].power = true;
			}
		}
	}
};

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

//I use the template from the pong excercise, with the 'update' 
// that calls this updateSimulation and handles stuff like pause

// Breakout specific update logic

function updateSimulation(du) {
    
   // if you are dead or have won then we ask if you want to replay
	if(isDead() || g_hasWon){
		replay();
	}else{
	
		//ask if you want to reset the game
		Reset();
		if(!g_mute){
			
			//reset the theme if the song is over
			document.getElementById('theme').play();
			console.log("here");
		}
		
		//mute or unmute by pressing M
		if (eatKey(MUTE)) {
			g_mute = !g_mute;
			if(g_mute == true){
				document.getElementById('theme').pause();
			}else{
				document.getElementById('theme').play();
			}
		}
		
		//if you should do the intro then you dont update anything that way the screen 
		//falls into place with out the game starting
		if(!g_shouldDoIntro){
		
			//other wise you update the game
			g_paddle.update(du);
		   
			//update all the balls
			for(var i = 0; i < g_balls.length; i++){
				
				g_balls[i].update(du);
				//and make a trace for all the balls
				if(g_balls[i] != null){
					g_balls[i].makeTrace();
				}
			}
			
			//then i update the trace for all the balls. this works because there is only one array
			//that holds all the traces, so you only have to call it once for the first ball
			g_balls[0].updateTrace(du);
			
			//update the bricks if they have speed
			for(var i = 0; i < g_bricks.length; i++){
				
				if(!g_bricks[i].hit){
					g_bricks[i].update(du);
				}
			}
			
			//make the poweups drop down with this update
			if(g_powerups != null){
				for(var i = 0; i < g_powerups.length; i++){
					g_powerups[i].updatePower(du)
				}
			}
			
			//enable the gun
			if(g_gunEnable ){
				g_gun.update(du)
			}
			
			//uppdate all the bullets
			for(var i = 0; i < g_bullets.length; i++){
				g_bullets[i].update(du);
			}
			
			//check if all the bricks have been hit, if not then return
			for(var i = 0; i < g_bricks.length; i++){
				
				if(!g_bricks[i].hit){
					return;
				}
			}
			
			//else i increment the level and life (as an added bonus) and then set the next level
			g_score.level += 1;
			g_score.life += 1; 
			setLevel(g_score.level);
		}
	}
}

// =================
// RENDER SIMULATION
// =================

// I also use the pong template here,
// and use The primary `render` routine which handles generic stuff.
// It then delegates the game-specific logic to `gameRender`

function renderSimulation(g_ctx) {
	
	//if you are dead then go to the end screen
	if(isDead()){
		goToEnd(g_ctx, g_displacement);
	}else if(g_hasWon){
		
		//or the victory screen if you won
		victory(g_ctx, g_displacement);
	}else{
	
		//if you're still alive and havn't won then we render the game starting with the background
		g_Background.draw(g_ctx);
		
		if(g_shouldDoIntro){
			
			//render the bricks falling into place
			renderIntro(g_ctx, g_displacement);
		}else{
			
			//render the paddle
			g_paddle.render(g_ctx);
			
			//render all the ball traces
			for(var i = 0; i < g_balls.length; i++){
				g_balls[i].renderTrace(g_ctx);
			}
			
			//and then all the balls
			for(var i = 0; i < g_balls.length; i++){
				g_balls[i].render(g_ctx);
			}
			
			//then all the bricks
			for(var i = 0; i < g_bricks.length; i++){
				
				if(!g_bricks[i].hit){
					g_bricks[i].render(g_ctx);
					
					//wrap them if they are moving
					g_bricks[i].wrapDraw(g_ctx);
				}
			}
			
			//render the gun if it's on
			if(g_gunEnable){
				g_gun.render(g_ctx)
			}
			
			//render all the bullets
			for(var i = 0; i < g_bullets.length; i++){
				g_bullets[i].render(g_ctx);
			}
			
			//and then all the powerups
			for(var i = 0; i < g_powerups.length; i++){
				g_powerups[i].renderPower(g_ctx, g_powerups[i].good )
			}
			
			//finally render the score (life and score)
			g_score.render(g_ctx);
		}
	}
}

var KEY_RESET  = 'L'.charCodeAt(0);

//if you want to reset then I reset the game to level 1
function Reset() {
    if (eatKey(KEY_RESET)) {
        g_score.reset();
		g_paddle.reset();
		g_balls[0].reset();
		g_balls[0].clearTrace();
		
		g_shouldDoIntro = true;
		g_displacement = -370;
		g_hasWon = false;
		
		setLevel(g_score.level);
    } 
}

//the way I make the screen fall into place is to use the global g_displacement
//as a y coordinate that i use for matrix tempering, then i simply increment the
//displacement untill the screen is in place. and then i set g_shouldDoIntro to false
function renderIntro(g_ctx, disP){
	
	g_Background.draw(g_ctx);
	g_ctx.save();
	g_ctx.fillStyle = "white";
	g_ctx.font="Bold 100px Arial";
	g_ctx.fillText('Level '+g_score.level+'!' ,50,300);
	g_ctx.restore();
	g_ctx.save();
	
	//translete the screen with respect to the displacement
	g_ctx.translate(0,disP);
	g_paddle.render(g_ctx);
	
	//render all the bricks
	for(var i = 0; i < g_bricks.length; i++){
		g_bricks[i].render(g_ctx);
	}
	
	//then calculate the new displacement
	g_displacement = g_displacement + (Math.abs(g_displacement*0.1)); 
	
	//and if we're just about in place we say we're there
	if(g_displacement > -1){
		g_shouldDoIntro = false;
	}
	g_ctx.restore();
};

//the end screen with the same drop down logic as in renderIntro
function goToEnd(g_ctx, disP){
	
	clearCanvas(g_ctx);
	g_Background.draw(g_ctx);
	g_ctx.save();
	g_ctx.translate(0,disP);
	
	g_ctx.fillStyle = "white";
	g_ctx.font="Bold 90px Arial";
	g_ctx.fillText('Game over' ,10,150);
	
	g_ctx.font="Bold 40px Arial"
	g_ctx.fillText('Your Score: '+ g_score.score ,60,250);
	
	g_ctx.font="Bold 30px Arial"
	g_ctx.fillText('Play again?',170,300);
	g_ctx.fillText('Y/N',230,350);
	
	g_ctx.fillStyle = "black";
	
	g_displacement = g_displacement + (Math.abs(g_displacement*0.1)); 
	
	if(g_displacement > -1){
		g_shouldDoIntro = false;
	}
	g_ctx.restore();
}

//the victory screen with the same drop down logic as in renderIntro
function victory(g_ctx, disP){
	
	g_ctx.save();
	clearCanvas(g_ctx);
	g_Background.draw(g_ctx);
	g_ctx.translate(0,disP);
	
	g_ctx.fillStyle = "white";
	g_ctx.font="Bold 90px Arial";
	g_ctx.fillText('VICTORY!' ,10,150);
	
	g_ctx.font="Bold 40px Arial"
	g_ctx.fillText('Your Score: '+ g_score.score ,60,250);
	
	g_ctx.font="Bold 30px Arial"
	g_ctx.fillText('Play again?',170,300);
	g_ctx.fillText('Y/N',230,350);
	
	g_ctx.fillStyle = "black";
	
	g_displacement = g_displacement + (Math.abs(g_displacement*0.1)); 
	
	if(g_displacement > -1){
		g_shouldDoIntro = false;
	}
	g_ctx.restore();
}

var YES = 'Y'.charCodeAt(0);
var NO = 'N'.charCodeAt(0);

//to replay or not to replay, that is the question
function replay(){

	//if you press Y then the game resets to level one
	if (g_keys[YES]) {
        g_score.reset();
		g_paddle.reset();
		g_balls[0].reset();
		g_shouldDoIntro = true;
		g_displacement = -370;
		setLevel(g_score.level);
		g_hasWon = false;
		g_balls[0].clearTrace();
		
		//pause the victory music to resume the theme
		document.getElementById('victory').pause();
    }
	
	//if you press N then the game quits
	if(g_keys[NO]){
		
		//and the music stops
		document.getElementById('theme').pause();
		g_main.gameOver();
	}
};
// Kick it off
g_main.init();