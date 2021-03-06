// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady=false;
var stoneImage=new Image();
stoneImage.onload=function() {
	stoneReady=true;
};
stoneImage.src= "images/stone.png";

// monster image
var monsterReady=false;
var monsterImage=new Image();
monsterImage.onload=function() {
	monsterReady=true;
};
monsterImage.src="images/monster.png";

// Game objects
var hero = {
	speed: 300 // movement in pixels per second
};
var princess = {};
var priCgt = 0;
var priCgt  = localStorage.getItem("priCgt");
var level = 0;
var level  = localStorage.getItem("level");
var stone = new Array();
stone[0]={};
stone[1]={};
var monster = new Array();
monster[0]={};
monster[1]={};
var monsterspeed = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly without collision
	do {
		princess.x = 32 + (Math.random() * (canvas.width - 96));
		princess.y = 32 + (Math.random() * (canvas.height - 96));
	} while ((princess.x>hero.x-32 && princess.x<hero.x+32) && (princess.y<hero.y+32 && princess.y>hero.y-32))

    // Throw the first stone somewhere on the screen randomly without collision
    do {
		stone[0].x = 32 + (Math.random() * (canvas.width - 96));
		stone[0].y = 32 + (Math.random() * (canvas.height - 96));
	} while (((stone[0].x>hero.x-32 && stone[0].x<hero.x+32) && (stone[0].y<hero.y+32 && stone[0].y>hero.y-32)) ||
        ((stone[0].x>princess.x-32 && stone[0].x<princess.x+32) && (stone[0].y<princess.y+32 && stone[0].y>princess.y-32)))

    // Throw the second stone somewhere on the screen randomly without collision
    do {
		stone[1].x = 32 + (Math.random() * (canvas.width - 96));
		stone[1].y = 32 + (Math.random() * (canvas.height - 96));
	} while (((stone[1].x>hero.x-32 && stone[1].x<hero.x+32) && (stone[1].y<hero.y+32 && stone[1].y>hero.y-32)) ||
        ((stone[1].x>princess.x-32 && stone[1].x<princess.x+32) && (stone[1].y<princess.y+32 && stone[1].y>princess.y-32)) ||
        ((stone[1].x>stone[0].x-32 && stone[1].x<stone[0].x+32) && (stone[1].y<stone[0].y+32 && stone[1].y>stone[0].y-32)))

    // Throw the first monster somewhere on the screen randomly without collision
    do {
		monster[0].x = 32 + (Math.random() * (canvas.width - 96));
		monster[0].y = 32 + (Math.random() * (canvas.height - 96));
	} while (((monster[0].x>hero.x-128 && monster[0].x<hero.x+128) && (monster[0].y<hero.y+128 && monster[0].y>hero.y-128)) ||
        ((monster[0].x>princess.x-32 && monster[0].x<princess.x+32) && (monster[0].y<princess.y+32 && monster[0].y>princess.y-32)) ||
        ((monster[0].x>stone[0].x-32 && monster[0].x<stone[0].x+32) && (monster[0].y<stone[0].y+32 && monster[0].y>stone[0].y-32)) ||
        ((monster[0].x>stone[1].x-32 && monster[0].x<stone[1].x+32) && (monster[0].y<stone[1].y+32 && monster[0].y>stone[1].y-32)))

    // Throw the second monster somewhere on the screen randomly without collision
    do {
		monster[1].x = 32 + (Math.random() * (canvas.width - 96));
		monster[1].y = 32 + (Math.random() * (canvas.height - 96));
	} while (((monster[1].x>hero.x-128 && monster[1].x<hero.x+128) && (monster[1].y<hero.y+128 && monster[1].y>hero.y-128)) ||
        ((monster[1].x>princess.x-32 && monster[1].x<princess.x+32) && (monster[1].y<princess.y+32 && monster[1].y>princess.y-32)) ||
        ((monster[1].x>stone[0].x-32 && monster[1].x<stone[0].x+32) && (monster[1].y<stone[0].y+32 && monster[1].y>stone[0].y-32)) ||
        ((monster[1].x>stone[1].x-32 && monster[1].x<stone[1].x+32) && (monster[1].y<stone[1].y+32 && monster[1].y>stone[1].y-32)) ||
        ((monster[1].x>monster[0].x-32 && monster[1].x<monster[0].x+32) && (monster[1].y<monster[0].y+32 && monster[1].y>monster[0].y-32)))
};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown && hero.y>32 &&
        (hero.y<=stone[0].y || hero.y>=stone[0].y+32 || hero.x<=stone[0].x-32 || hero.x>=stone[0].x+32) &&
        (hero.y<=stone[1].y || hero.y>=stone[1].y+32 || hero.x<=stone[1].x-32 || hero.x>=stone[1].x+32)) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y<canvas.height-64 &&
        (hero.y<=stone[0].y-32 || hero.y>=stone[0].y || hero.x<=stone[0].x-32 || hero.x>=stone[0].x+32) &&
        (hero.y<=stone[1].y-32 || hero.y>=stone[1].y || hero.x<=stone[1].x-32 || hero.x>=stone[1].x+32)) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x>32 &&
        (hero.y<=stone[0].y-32 || hero.y>=stone[0].y+32 || hero.x<=stone[0].x || hero.x>=stone[0].x+32) &&
        (hero.y<=stone[1].y-32 || hero.y>=stone[1].y+32 || hero.x<=stone[1].x || hero.x>=stone[1].x+32)) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x<canvas.width-64 &&
        (hero.y<=stone[0].y-32 || hero.y>=stone[0].y+32 || hero.x<=stone[0].x-32 || hero.x>=stone[0].x) &&
        (hero.y<=stone[1].y-32 || hero.y>=stone[1].y+32 || hero.x<=stone[1].x-32 || hero.x>=stone[1].x)) { // Player holding right
		hero.x += hero.speed * modifier;
	}

    // Monster's speed
    if (level < 25) {
        monsterspeed = 10*(level);
    } else {
        monsterspeed = 250;
    }

    // First monster movement
    if (monster[0].x<hero.x &&
        (monster[0].y<=stone[0].y-32 || monster[0].y>=stone[0].y+32 || monster[0].x<=stone[0].x-32 || monster[0].x>=stone[0].x) &&
        (monster[0].y<=stone[1].y-32 || monster[0].y>=stone[1].y+32 || monster[0].x<=stone[1].x-32 || monster[0].x>=stone[1].x)) {
        monster[0].x += monsterspeed * modifier;
    } else if (monster[0].x>hero.x &&
        (monster[0].y<=stone[0].y-32 || monster[0].y>=stone[0].y+32 || monster[0].x<=stone[0].x || monster[0].x>=stone[0].x+32) &&
        (monster[0].y<=stone[1].y-32 || monster[0].y>=stone[1].y+32 || monster[0].x<=stone[1].x || monster[0].x>=stone[1].x+32)) {
        monster[0].x -= monsterspeed * modifier;
    }
    if (monster[0].y<hero.y &&
        (monster[0].y<=stone[0].y-32 || monster[0].y>=stone[0].y || monster[0].x<=stone[0].x-32 || monster[0].x>=stone[0].x+32) &&
        (monster[0].y<=stone[1].y-32 || monster[0].y>=stone[1].y || monster[0].x<=stone[1].x-32 || monster[0].x>=stone[1].x+32)) {
        monster[0].y += monsterspeed * modifier;
    } else if (monster[0].y>hero.y &&
        (monster[0].y<=stone[0].y || monster[0].y>=stone[0].y+32 || monster[0].x<=stone[0].x-32 || monster[0].x>=stone[0].x+32) &&
        (monster[0].y<=stone[1].y || monster[0].y>=stone[1].y+32 || monster[0].x<=stone[1].x-32 || monster[0].x>=stone[1].x+32)) {
        monster[0].y -= monsterspeed * modifier;
    }

    // Second monster movement
    if (monster[1].x<hero.x &&
        (monster[1].y<=stone[0].y-32 || monster[1].y>=stone[0].y+32 || monster[1].x<=stone[0].x-32 || monster[1].x>=stone[0].x) &&
        (monster[1].y<=stone[1].y-32 || monster[1].y>=stone[1].y+32 || monster[1].x<=stone[1].x-32 || monster[1].x>=stone[1].x)) {
        monster[1].x += monsterspeed * modifier;
    } else if (monster[1].x>hero.x &&
        (monster[1].y<=stone[0].y-32 || monster[1].y>=stone[0].y+32 || monster[1].x<=stone[0].x || monster[1].x>=stone[0].x+32) &&
        (monster[1].y<=stone[1].y-32 || monster[1].y>=stone[1].y+32 || monster[1].x<=stone[1].x || monster[1].x>=stone[1].x+32)) {
        monster[1].x -= monsterspeed * modifier;
    }
    if (monster[1].y<hero.y &&
        (monster[1].y<=stone[0].y-32 || monster[1].y>=stone[0].y || monster[1].x<=stone[0].x-32 || monster[1].x>=stone[0].x+32) &&
        (monster[1].y<=stone[1].y-32 || monster[1].y>=stone[1].y || monster[1].x<=stone[1].x-32 || monster[1].x>=stone[1].x+32)) {
        monster[1].y += monsterspeed * modifier;
    } else if (monster[1].y>hero.y &&
        (monster[1].y<=stone[0].y || monster[1].y>=stone[0].y+32 || monster[1].x<=stone[0].x-32 || monster[1].x>=stone[0].x+32) &&
        (monster[1].y<=stone[1].y || monster[1].y>=stone[1].y+32 || monster[1].x<=stone[1].x-32 || monster[1].x>=stone[1].x+32)) {
        monster[1].y -= monsterspeed * modifier;
    }

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++priCgt;
		localStorage.setItem("priCgt", priCgt);

        if (priCgt % 1 == 0) {
			level++;
			localStorage.setItem("level", level);
        }
		reset();
	}

	if (
        hero.x <= (monster[0].x + 16)
		&& monster[0].x <= (hero.x + 16)
		&& hero.y <= (monster[0].y + 16)
		&& monster[0].y <= (hero.y + 32)
	) {
        priCgt = 0;
        level = 0;
		reset();
	}

	if (
		hero.x <= (monster[1].x + 16)
		&& monster[1].x <= (hero.x + 16)
		&& hero.y <= (monster[1].y + 16)
		&& monster[1].y <= (hero.y + 32)
	) {
        priCgt = 0;
        level = 0;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady) {
		ctx.drawImage(stoneImage, stone[0].x, stone[0].y);
		ctx.drawImage(stoneImage, stone[1].x, stone[1].y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster[0].x, monster[0].y);
		ctx.drawImage(monsterImage, monster[1].x, monster[1].y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + priCgt, 32, 32);
    ctx.fillText("Level: " + level, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
