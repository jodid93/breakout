//a cinstuctor for the Sprite
function Sprite(image) {
   this.image = image;
};

//globals that keep the
var g_Background;
var g_paddleSprite;

//load the images
function preloadBackground() {
	
	//make 2 image objects
    var g_bakgrunnur = new Image();
    var g_pallur = new Image();
	
	//then fill the image object with images
    g_Background = new Sprite(g_bakgrunnur);
    
    g_bakgrunnur.src = "https://notendur.hi.is/~jot17/abc/notBreakout/Awesome-Backgrounds2.jpg";
    
	
	g_paddleSprite = new Sprite(g_pallur);
    
    g_pallur.src = "http://joebentleyonemansportfolio.files.wordpress.com/2012/08/paddle1.png";
    
}

//render paddle
Sprite.prototype.drawAtRotate = function (ctx, X, Y, rotation){
	
	ctx.save(); 
    ctx.beginPath();
    ctx.translate(X, Y);  
    
    ctx.rotate(rotation);  
	
	//this is how i make the paddle grow and shrink
    ctx.drawImage(this.image , (-g_paddle.halfWidth), (-g_paddle.halfHeight),(2*g_paddle.halfWidth),20);
    
    ctx.restore();
}

//render Background
Sprite.prototype.draw = function (ctx) {

	//i make the background move with the paddle by adding -1*(g_paddle.cx/10) as the argument for x
	ctx.drawImage(this.image , (-1*(g_paddle.cx/10)), 0);

};