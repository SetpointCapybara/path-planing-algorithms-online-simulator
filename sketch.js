let bot = new Robot(100, 100);
let goal = new Goal(300, 300);
let dt = 0.01;

function draw() {
  background([255, 255, 255, 255]);
  image(img, 1280 / 2, 720 / 2);
  fill([0, 0, 0, 255]);
  rect(500, 500, 55, 55);

  bot.show();
  goal.show();

  dx = goal.x - bot.x;
  dy = goal.y - bot.y;

  bot.x = bot.x + dt * dx;
  bot.y = bot.y + dt * dy;
}

function preload() {
  img = loadImage("Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg");
}

function mousePressed() {
  bot.clicked(mouseX, mouseY);
  goal.clicked(mouseX, mouseY);
}

function mouseReleased() {
  bot.grabbed = false;
  goal.grabbed = false;
}

function mouseDragged() {
  if (bot.grabbed) {
    bot.x = mouseX;
    bot.y = mouseY;
  }
  if (goal.grabbed) {
    goal.x = mouseX;
    goal.y = mouseY;
  }
}

function setup() {
  createCanvas(1280, 720);
}
