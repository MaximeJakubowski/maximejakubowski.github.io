const GRID_SIZE = 16;
const WINDOW_WIDTH = 256;
const WINDOW_HEIGHT = 256;
const TICK = 128;

class Snake {
	constructor(x_pos, y_pos) {
		this.x_pos = x_pos;
		this.y_pos = y_pos;
		this.new_block = 0;
		this.location_history = [[this.x_pos, this.y_pos]];
	}

	get x() {
		return this.x_pos;
	}

	get y() {
		return this.y_pos;
	}

	get locations() {
		return this.location_history;
	}

	eat(amount) {
		this.new_block += amount;
	}

	move_up() {
		this.y_pos -= GRID_SIZE;
		this._update_history();
	}

	move_down() {
		this.y_pos += GRID_SIZE;
		this._update_history();
	}

	move_left() {
		this.x_pos -= GRID_SIZE;
		this._update_history();
	}

	move_right() {
		this.x_pos += GRID_SIZE;
		this._update_history();
	}

	_update_history() {
		this.location_history.unshift([this.x_pos, this.y_pos]);
		if (this.new_block == 0) {
			this.location_history.pop();
		} else {
			this.new_block -= 1;
		}
	}

	draw() {
		fill(color(255, 255, 255))
		for (var i = 0; i < this.location_history.length; i++) {
			var loc = this.location_history[i];
			rect(loc[0], loc[1], GRID_SIZE, GRID_SIZE);
		}
	}
}

class Food {
	constructor(x_pos, y_pos) {
		this.x_pos = x_pos;
		this.y_pos = y_pos;
	}

	get x() {
		return this.x_pos;
	}

	get y() {
		return this.y_pos;
	}

	respawn() {
		this.x_pos = Math.floor((Math.random() * (WINDOW_WIDTH/GRID_SIZE) - 1) + 1) * GRID_SIZE;
		this.y_pos = Math.floor((Math.random() * (WINDOW_HEIGHT/GRID_SIZE) - 1) + 1) * GRID_SIZE;
	}

	draw() {
		fill(color(255,0,0));
		rect(this.x_pos, this.y_pos, GRID_SIZE, GRID_SIZE);
	}
}

var snake;
var food;
var timerid;
var last_keyCode;
var game_over;
var score;
var high_score;

function setup() {
	createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
	reset();

	high_score = 0;
}

function draw() {
	background(0);
	textSize(16);
	fill(color(255, 255, 255));
	textFont("Courier New");
	text("Highscore:\t" + high_score, 0, 16);
	text("Score:\t\t" + score, 0, 32);

	if (game_over) {
		if (score > high_score) {
			high_score = score;
		}
		reset();
		game_over = false;
	}
	food.draw();
	snake.draw();
	if (check_eat(snake, food)) {
		food.respawn();
		snake.eat(1);
		score += 1;
	}
	if (check_eat_self(snake)) {
		game_over = true;
	}
	if (check_wall_bounce(snake)) {
		game_over = true;
	}
}

function reset() {
	clearInterval(timerid);
	last_keyCode = null;
	snake = new Snake(Math.floor((Math.random() * (WINDOW_WIDTH/GRID_SIZE) - 1) + 1) * GRID_SIZE, Math.floor((Math.random() * (WINDOW_HEIGHT/GRID_SIZE) - 1) + 1) * GRID_SIZE);
	food = new Food(0, 0);
	game_over = false;
	score = 0;
	food.respawn();
}

function keyPressed() {
	if (keyCode == UP_ARROW && last_keyCode != UP_ARROW) {
		clearInterval(timerid);
		up();
		timerid = setInterval(up, TICK);
	} else if (keyCode == LEFT_ARROW && last_keyCode != LEFT_ARROW) {
		clearInterval(timerid);
		left();
		timerid = setInterval(left, TICK);
	} else if (keyCode == RIGHT_ARROW && last_keyCode != RIGHT_ARROW) {
		clearInterval(timerid);
		right();
		timerid = setInterval(right, TICK);	
	} else if (keyCode == DOWN_ARROW && last_keyCode != DOWN_ARROW) {
		clearInterval(timerid);
		down();
		timerid = setInterval(down, TICK);
	} 
	last_keyCode = keyCode;
}

function check_eat(snake, food) {
	for (var i = 0; i < snake.locations.length; i++) {
		var loc = snake.locations[i];
		if (loc[0] == food.x && loc[1] == food.y) {
			return true;
		}
	}
	return false;
}

function check_eat_self(snake, food) {
	var snake_head = [snake.x, snake.y]
	for (var i = 1; i < snake.locations.length; i++) {
		var loc = snake.locations[i];
		if (loc[0] == snake_head[0] && loc[1] == snake_head[1]) {
			return true;
		}
	}
	return false;
}

function check_wall_bounce(snake) {
	return snake.x > WINDOW_WIDTH || snake.x < 0 || snake.y > WINDOW_HEIGHT || snake.y < 0;
}

function up() {
	snake.move_up();
}

function left() {
	snake.move_left();
}

function right() {
	snake.move_right();
}

function down() {
	snake.move_down();
}
