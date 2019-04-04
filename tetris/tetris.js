const WINDOW_WIDTH = 256;
const WINDOW_HEIGHT = 512;
const GRID_SIZE = 16;

var tick = 16;

class Tetromino {
    constructor(x_pos, y_pos, shape_matrix, color) {
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.shape = shape_matrix;
	this.color = color;
    }

    draw() {
	
    }
}

class Field {
    constructor(width, height) {
	this.width = width;
	this.height = height;
	this.field = [];
	for (var h = 0; h < height; h++) {
	    this.field.push([])
	    for (var w = 0;  w < width; w++) {
		this.field[h].push()
	    }
	}
    }

    draw() {
	
    }
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);    
}

function draw() {
    background(0);
}

function reset() {

}

function keyPressed() {

}
