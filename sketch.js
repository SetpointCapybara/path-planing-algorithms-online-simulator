let bot = new Robot(50, 100);
let goal = new Goal(50, 200);
let scene = 1;
let algorithm = 1;
let start = document.getElementById("Start");
let stops = document.getElementById("Stop");
let state = false;
let scene_selector = document.getElementById("scene_selector");
let algorithm_selector = document.getElementById("Algorithm");

start.addEventListener("click", function() {
  state = true;
})

stops.addEventListener("click", function() {
  state = false;
  bot.map_not_ready = true;
  bot.show_grid = false;
  bot.map = [];
})

scene_selector.addEventListener("change", function() {
  if (scene_selector.value == "scene 1") {
    scene = 1;
  }
  if (scene_selector.value == "scene 2") {
    scene = 2;
  }
  if (scene_selector.value == "scene 3") {
    scene = 3;
  }
  if (scene_selector.value == "scene 4") {
    scene = 4;
  }
  if (scene_selector.value == "scene 5") {
    scene = 5;
  }
  if (scene_selector.value == "scene 6") {
    scene = 6;
  }
})

algorithm_selector.addEventListener("change", function() {
  if (algorithm_selector.value == "bug0") {
    algorithm = 1;
  }
  if (algorithm_selector.value == "bug1") {
    algorithm = 2;
  }

  if (algorithm_selector.value == "bug2") {
    algorithm = 3;
  }

  if (algorithm_selector.value == "wavefront") {
    algorithm = 4;
  }
  if (algorithm_selector.value == "rrt") {
    algorithm = 5;
  }
})

function scene1(){
  rect(700, 100, 50, 300);
  rect(500, 400, 250, 50);
  rect(500, 300, 50, 150);
  rect(200, 100, 500, 50);
  rect(200, 100, 50, 500);
  rect(200, 550, 400, 50);
}

function scene2(){
  rect(800, 250, 50, 200);
  rect(400, 100, 50, 500);
}

function scene3(){
  rect(400, 600, 800, 50);
  rect(400, 100, 800, 50);
  rect(400, 100, 50, 500);
  rect(600, 100, 50, 400);
  rect(800, 300, 50, 300);
  rect(1000, 100, 50, 400);
}

function scene4(){
  circle(800, 250, 100);
  circle(150, 100, 100);
  circle(550, 300, 100);
  circle(850, 100, 100);
  circle(1250, 300, 100);
  circle(100, 700, 100);
  circle(200, 350, 100);
  circle(400, 150, 100);
  circle(350, 600, 100);
  circle(700, 550, 100);
  circle(1000, 450, 100);
}

function scene5(){
  circle(640, 360, 400);
}

function scene6(){
  rect(1000, 100, 50, 500);
  rect(100, 100, 800, 50);
  rect(100, 600, 950, 50);
  rect(100, 100, 50, 500);
  rect(500, 400, 50, 200);
  rect(300, 400, 500, 50);
  rect(750, 300, 50, 100);
  rect(100, 250, 500, 50);
  
}

function draw() {
  background([255, 255, 255, 255]);
  fill([0, 0, 0, 255]);
  if(scene == 1){
    scene1();
  }
  if(scene == 2){
    scene2();
  }
  if(scene == 3){
    scene3();
  }
  if(scene == 4){
    scene4();
  }
  if(scene == 5){
    scene5();
  }
  if(scene == 6){
    scene6();
  }

  bot.show();
  goal.show();
  if(state){
    if(algorithm == 1){
      bot.bug0(goal);
    }
    if(algorithm == 2){
      bot.bug1(goal);
    }
    if(algorithm == 3){
      bot.bug2(goal);
    }
    if(algorithm == 4){
      bot.wavefront(goal);
    }
    if(algorithm == 5){
      bot.rrt(goal);
    }
  }

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
  var canvas = createCanvas(1280, 720);
  canvas.canvas.getContext("2d", { willReadFrequently: true })
  canvas.parent('canvasForHTML');
  
}

function windowResized() {
  //resizeCanvas(windowWidth - 200, windowHeight - 200);
}