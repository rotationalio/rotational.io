let stars = [];

function setup() {
  frameRate(15);
  createCanvas(windowWidth, windowHeight);

  ellipseMode(RADIUS);
  angleMode(DEGREES);

  for (let i = 0; i < 256; i++) {
    stars.push(new StarStreak());
  }
}

function draw() {
  background(33, 33, 42);
  for (let i = 0; i < 256; i++) {
    stars[i].update();
    stars[i].display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class StarStreak {
  constructor() {
    this.reset();
  }

  reset() {
    this.radius = random((width * sqrt(2)) / 2);
    this.length = random(5, 30);
    this.start = random(0, 360);
    this.speed = random(0.5, 2);
    this.lifespan = random(128, 255);
    this.stroke = random(1, 4);
  }

  update() {
    this.lifespan -= random(1, 8);

    if (this.isDead()) {
      this.reset();
    } else {
      this.length += random(0, 3);
      this.start += this.speed;
    }
  }

  display() {
    noFill();
    stroke(200, this.lifespan);
    strokeWeight(this.stroke);
    arc(
      width / 2,
      height / 2,
      this.radius,
      this.radius,
      this.start,
      this.start + this.length
    );
  }

  isDead() {
    return this.lifespan <= 0;
  }
}