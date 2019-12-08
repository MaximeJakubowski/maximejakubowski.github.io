const CANVASWIDTH = 1000;
const CANVASHEIGHT = 600;

p5v = p5.Vector; // Namespace alias

let pause = false;
let coheson = true;
let separon = true;
let alignon = true;

let pbutton = document.getElementById("pause-button");
pbutton.addEventListener("click", () => {
    pause = !pause
    if (pause) {
	pbutton.innerHTML = "Play";
    } else {
	pbutton.innerHTML = "Pause";
    }
});

let rbutton = document.getElementById("reset-button");
rbutton.addEventListener("click", () => {
    reset_simulation();
});

let alignbut = document.getElementById("align-button");
alignbut.addEventListener("click", () => {
    alignon = !alignon;
    if (alignon) {
	alignbut.innerHTML = "On";
    } else {
	alignbut.innerHTML = "Off";
    }
});

let cohesbut = document.getElementById("cohes-button");
cohesbut.addEventListener("click", () => {
    coheson = !coheson;
    if (coheson) {
	cohesbut.innerHTML = "On";
    } else {
	cohesbut.innerHTML = "Off";
    }
});

let separbut = document.getElementById("separ-button");
separbut.addEventListener("click", () => {
    separon = !separon;
    if (separon) {
	separbut.innerHTML = "On";
    } else {
	separbut.innerHTML = "Off";
    }
});


class Boid {
    // Boid datastructure
    constructor(posx, posy, velx, vely) {
	this.pos = createVector(posx, posy);
	this.vel = createVector(velx, vely);
	this.sensor_radius = 100;
	//preferably smaller than sensor_radius obviously: if I can't perceive them,
	//I cannot want distance from them.
	this.personal_space = 30;
	this.dir = 0;
	this.max_vel = 50;
    }

    draw() {
	push();
	translate(this.pos.x, this.pos.y);
	if (this.vel.x != 0 || this.vel.y != 0) {
	    this.dir = atan2(this.vel.y, this.vel.x);
	}
	rotate(this.dir);
	fill(0,0,0,0);
	stroke(0,0,0,50);
	ellipse(0, 0, this.sensor_radius*2, this.sensor_radius*2);
	fill(255,255,255);
	stroke(0,0,0);
	triangle(10, 0, -10,  10, -10, -10);
	ellipse(0, 0, 5, 5);

	pop();
    }
}

class Obstacle {
    constructor(x, y, size) {
	this.pos = createVector(x, y);
	this.size = size;
    }

    draw() {
	push();
	translate(this.pos.x, this.pos.y);
	fill(200,0,0);
	stroke(0,0,0,50);
	ellipse(0, 0, this.size, this.size);
	pop();
    }
}

//Environment 
var boids = [];
var obstacles = [];

function update(boid, boids, obstacles) {
    let n = get_neighbours(boid, boids);
    let o = obstacles;

    let delta_cohesion = createVector(0,0);
    let delta_separation = createVector(0,0);
    let delta_alignment = createVector(0,0);

    if (coheson) {
	delta_cohesion = cohesion_rule(boid, n);
    }
    if (separon) {
	delta_separation = separation_rule(boid, n);
    }
    if (alignon) {
	delta_alignment = alignment_rule(boid, n);
    }
    
    boid.vel = [boid.vel,
		delta_alignment,
		delta_cohesion,
		delta_separation].reduce((a,v) => p5v.add(a,v));
    
    if (boid.vel.x > boid.max_vel) {
	boid.vel.x = boid.max_vel;
    } else if (boid.vel.x < -boid.max_vel) {
	boid.vel.x = -boid.max_vel;
    }
    if (boid.vel.y > boid.max_vel) {
	boid.vel.y = boid.max_vel;
    } else if (boid.vel.y < -boid.max_vel) {
	boid.vel.y = -boid.max_vel;
    }

    boid.pos = p5v.add(boid.pos, p5v.mult(boid.vel, deltaTime/1000));

    if (boid.pos.x > CANVASWIDTH) {
	boid.pos.x = 0;
    } else if (boid.pos.x < 0) {
	boid.pos.x = CANVASWIDTH;
    }
    if (boid.pos.y > CANVASHEIGHT) {
	boid.pos.y = 0;
    } else if (boid.pos.y < 0) {
	boid.pos.y = CANVASHEIGHT;
    }
}

function cohesion_rule(boid, neighbours) {
    let n = neighbours;
    if (n.length == 0) {
	return createVector(0, 0);
    }
    let center = n.map((b) => b.pos).reduce((a, v) => p5v.add(a, v));
    let avg_c = p5v.div(center, n.length);
    // adj percent to the avg center
    let adj = 0.01;
    let delta = p5v.mult(p5v.sub(avg_c, boid.pos), adj);
    return delta;
}

function separation_rule(boid, neighbours) {
    let n = neighbours;
    let delta = createVector(0, 0);
    n.forEach((b, i, a) => {
	if (!(b === boid)) {
	    let distance = Math.sqrt(Math.pow(boid.pos.x - b.pos.x, 2) + Math.pow(boid.pos.y - b.pos.y, 2));
	    if (distance < boid.personal_space) {
		delta = p5v.sub(delta, p5v.sub(b.pos, boid.pos));
	    }
	}
    });
    return delta;
}

function alignment_rule(boid, neighbours) {
    let n = neighbours;
    if (n.length == 0) {
	return createVector(0, 0);
    }
    let acc_vel = n.map((b) => b.vel).reduce((a, v) => p5v.add(a, v));
    let avg_vel = p5v.div(acc_vel, n.length); 
    // adjust adj percent to velocity
    let adj = 0.05;
    let delta = p5v.mult(p5v.sub(avg_vel, boid.vel), adj);
    return delta;
}

function get_neighbours(boid, boids) {
    let radius = boid.sensor_radius;
    return boids.filter(b => b.pos.dist(boid.pos) < radius && b !== boid)
}

function reset_simulation() {
    boids = [];
    obstacles = [];
    for (var i=0; i<30; i++) {
	let randx = Math.random()*CANVASWIDTH;
	let randy = Math.random()*CANVASHEIGHT;
	let randvelx = -30 + Math.random()*60;
	let randvely = -30 + Math.random()*60;
	boids.push(new Boid(randx, randy, randvelx, randvely));
    }
}

function setup() {
    let canvas = createCanvas(CANVASWIDTH, CANVASHEIGHT);
    canvas.parent('boids-container');
    background(200);
    ellipseMode(CENTER);
    reset_simulation();
}

function draw() {
    background(200);
    boids.forEach((b, i, a) => {
	b.draw();
	if (!pause) {
	    update(b, boids, obstacles)
	}
    });
    obstacles.forEach((o, i, a) => {
	o.draw();
    });
}
