let bot = new Robot(50, 100);
let goal = new Goal(500, 500);
let scene = 1;
let start = document.getElementById("Start");
let stops = document.getElementById("Stop");
let state = false;
let scene_selector = document.getElementById("scene_selector");

start.addEventListener("click", function() {
  state = true;
})

stops.addEventListener("click", function() {
  state = false;
})

scene_selector.addEventListener("change", function() {
  if (scene_selector.value == "scene 1") {
    scene = 1;
  }
  if (scene_selector.value == "scene 2") {
    scene = 2;
  }
})


function draw() {
  background([255, 255, 255, 255]);
  fill([0, 0, 0, 255]);
  if(scene == 1){
    rect(700, 100, 50, 300);
    rect(500, 400, 250, 50);
    rect(200, 100, 500, 50);
    rect(200, 100, 500, 50);
    rect(200, 100, 50, 500);
    rect(200, 550, 400, 50);
  }

  if(scene == 2){
    rect(400, 400, 50, 200);
    rect(500, 300, 250, 50);
    rect(300, 200, 500, 50);
    rect(300, 600, 500, 50);
    rect(200, 100, 50, 500);
    rect(100, 150, 400, 50);
  }

  bot.show();
  goal.show();
  if(state){
    bot.bug0(goal);
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
  var canvas = createCanvas(windowWidth - 200, windowHeight - 160);
  canvas.canvas.getContext("2d", { willReadFrequently: true })
  canvas.parent('canvasForHTML');
  
}

function windowResized() {
  //resizeCanvas(windowWidth - 200, windowHeight - 200);
}