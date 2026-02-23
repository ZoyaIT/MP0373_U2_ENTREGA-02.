let snake, food, scl = 15, score = 0, gameOver = false;
let snakeImg, foodImg;

function preload() {
  snakeImg = loadImage("snake.png");
  foodImg = loadImage("donut.png");
}

function setup() {
  let c = createCanvas(500, 500);
  c.parent("game-container");

  snake = new Snake();
  frameRate(10);
  newFood();

  document.getElementById("restartBtn").onclick = restart;
}

function draw() {
  background(51);

  if (gameOver) return showGameOver();

  snake.update();
  snake.show();

  if (snake.eat(food)) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    newFood();
  }

  image(foodImg, food.x, food.y, scl, scl);

  snake.checkDeath();
}

function keyPressed() {
  if (keyCode === UP_ARROW) snake.dir(0, -1);
  if (keyCode === DOWN_ARROW) snake.dir(0, 1);
  if (keyCode === RIGHT_ARROW) snake.dir(1, 0);
  if (keyCode === LEFT_ARROW) snake.dir(-1, 0);
}

function newFood() {
  food = createVector(floor(random(width / scl)), floor(random(height / scl)));
  food.mult(scl);
}

function showGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 10);

  document.getElementById("restartBtn").style.display = "inline-block";
}

function restart() {
  score = 0;
  gameOver = false;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("restartBtn").style.display = "none";
  snake = new Snake();
  newFood();
}

let last = this.tail.length > 0 ? this.tail[this.tail.length - 1] : createVector(this.x, this.y);
this.tail.push(last.copy());
this.tail.push(createVector(this.x, this.y));

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.tail = [];
  this.angle = 0; // rotation angle

  this.dir = (x, y) => {
    this.xspeed = x;
    this.yspeed = y;

    if (x === 1)  this.angle = 0;          // right
    if (x === -1) this.angle = PI;         // left
    if (y === 1)  this.angle = HALF_PI;    // down
    if (y === -1) this.angle = -HALF_PI;   // up
  };

  this.eat = pos => {
  if (dist(this.x, this.y, pos.x, pos.y) < 1) {
    let last = this.tail.length > 0 ? this.tail[this.tail.length - 1] : createVector(this.x, this.y);
    this.tail.push(last.copy());
    return true;
  }
  return false;
};


  this.update = () => {
    if (this.tail.length) this.tail.shift();
    this.tail.push(createVector(this.x, this.y));

    this.x += this.xspeed * scl;
    this.y += this.yspeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  };

  this.show = () => {
    // draw tail
    for (let t of this.tail) {
      push();
      translate(t.x + scl / 2, t.y + scl / 2);
      rotate(this.angle);
      imageMode(CENTER);
      image(snakeImg, 0, 0, scl, scl);
      pop();
    }

    // draw head
    push();
    translate(this.x + scl / 2, this.y + scl / 2);
    rotate(this.angle);
    imageMode(CENTER);
    image(snakeImg, 0, 0, scl, scl);
    pop();
  };

  this.checkDeath = () => {
    for (let t of this.tail)
      if (dist(this.x, this.y, t.x, t.y) < 1) gameOver = true;
  };
}




