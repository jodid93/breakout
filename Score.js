//constructor for the Score
function Score(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

//update Score as a multiple of the combo
//generated in g_ball.update
Score.prototype.updateScore = function(combo){
	this.score = this.score + (combo * 10);
}

//update life
Score.prototype.updateLife = function(){
	this.life -= 1;
}

//render score
Score.prototype.render = function(ctx){

	//for the combo,
	if(g_balls[0].combo > 1){
		ctx.save()
		
		//the color for the combo
		var shade = ctx.createLinearGradient(250,20,400,20);
		shade.addColorStop(0,"purple");
		shade.addColorStop(0.1,"blue");
		shade.addColorStop(0.2,"green");
		shade.addColorStop(0.3,"orange");
		shade.addColorStop(0.4,"red");
		shade.addColorStop(0.5,"blue");
		shade.addColorStop(0.6,"white");
		shade.addColorStop(0.7,"green");
		shade.addColorStop(0.8,"yellow");
		shade.addColorStop(0.9,"black");
		shade.addColorStop(1,"blue");
		
		//then i need to know the size of combo because the bigger the combo, the bigger the letters
		if(g_balls[0].combo == 2){
			ctx.fillStyle = shade;
			ctx.font="Bold 15px Arial";
			ctx.fillText('Combo ' + g_balls[0].combo + 'X', 300, 20);
		}
		else if(g_balls[0].combo == 4){
		
			ctx.fillStyle = shade;
			ctx.font="Bold 20px Arial";
			ctx.fillText('Combo ' + g_balls[0].combo + 'X', 280, 24);
		}
		else if(g_balls[0].combo == 8){
		
			ctx.fillStyle = shade;
			ctx.font="Bold 25px Arial";
			ctx.fillText('Combo ' + g_balls[0].combo + 'X', 260, 28);
		}
		else if(g_balls[0].combo == 16){
		
			ctx.fillStyle = shade;
			ctx.font="Bold 30px Arial";
			ctx.fillText('Combo ' + g_balls[0].combo + 'X', 240, 32);
		}
		ctx.restore();
		
	}
	
	//for the life counter
	ctx.fillStyle = "white";
	ctx.font="Bold 15px Arial";
	ctx.fillText('life: ',10,20);
    ctx.fillText('Score: ' + this.score, g_canvas.width-100, 20);
	for(var i = 0; i < this.life; i++){
		fillCircle(ctx, (i*12)+45,15, 5);
	}
	g_ctx.fillStyle = "black";
}

//returns true if you are dead
function isDead(){
	
	if(g_score.life == 0){
		if(!g_mute){
			//play loosing sound for a looser
			document.getElementById('loose').play();
		}
		return true;
	}
	return false;
}

//reset to initial score,life and level
Score.prototype.reset = function (){
	this.score = 0;
	this.life = 5;
	this.level = 1;
}
