class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.grabbed = false;
    this.around_Object = false;
    this.first_x = 0;
    this.first_y = 0;
    this.steps = 0;
    this.go_to_min = 0;
    this.min_x = 0;
    this.min_y = 0;
    this.min_dist= 1280;
    this.marker = false;
    this.line_drawn = false;
    this.line_x = 0;
    this.line_y = 0;
    this.goal_x = 0;
    this.goal_y = 0;

  }

  show() {
    if(this.marker){
      fill([0, 255, 0, 255]);
      circle(this.min_x, this.min_y, 2 * this.r);
    }
    if(this.line_drawn){
      stroke([0, 255, 0, 255]);
      line(this.line_x, this.line_y, this.goal_x, this.goal_y);
      stroke(0);
    }
    noFill();
    circle(this.x, this.y, 2 * this.r);

  }

  isTouching() {
    let sensors = [];
    let x = 0;
    let y = 0;
    let d = 0;
    let c = [0, 0, 0];
    for (let i = 0; i < 360; i++) {
      x = this.x + 25 * Math.cos(i * (Math.PI / 180));
      y = this.y + 25 * Math.sin(i * (Math.PI / 180));
      d = get(Math.round(x), Math.round(y)).reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      if (d == 255) {
        sensors.push(true);
      } else {
        sensors.push(false);
      }
    }

    return sensors;
  }

  isOverLine(){
    let d = get(this.x, this.y);
    if (d[1] == 255 && d[0]!=255) {
      return true;
      console.log(d);
    } else {
      return false;
    }
  }

  clicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < this.r) {
      this.grabbed = true;
    } else {
      this.grabbed = false;
    }
  }

  goToGoal(goal){
    let dx = 0;
    let dy = 0;
    let dt = 0.1;
    let dist = Math.sqrt(Math.pow(Math.abs(this.x - goal.x),2) + Math.pow(Math.abs(this.y - goal.y),2));
    this.x = this.x + dt * 10*((goal.x - this.x)/dist);
    this.y = this.y + dt * 10*((goal.y - this.y)/dist);
  }

  goAwayFromGoal(goal){
    let dx = 0;
    let dy = 0;
    let dt = 0.1;
    this.x = this.x + dt * ((goal.x - this.x) > 0 ? -10 : 10);
    this.y = this.y + dt * ((goal.y - this.y) > 0 ? -10 : 10);
  }

  followWall(){
    let dx = 0;
    let dy = 0;
    let dt = 0.1;
    let lim = 200;
    let hits = 0;
    let c = this.isTouching();
    for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}
    for(let i = 0; i < 360; i++){
      if(c[i]){
        dx = dx -10*Math.cos(i * (Math.PI / 180));
        dy = dy -10*Math.sin(i * (Math.PI / 180));
      }
    }
    dx > lim ? dx = lim : dx < -lim ? dx = -lim : dx = dx;
    dy > lim ? dy = lim : dy < -lim ? dy = -lim : dy = dy; 
    if(hits < 10){
      this.x = this.x + dt * -dx/20;
      this.y = this.y + dt * -dy/20;
      return 0;
    }
    this.x = this.x + dt * dy/20;
    this.y = this.y + dt * -dx/20;
  }

  bug0(goal){
    let hits = 0;
    let hits2 = 0;
    let c = this.isTouching();
    for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}
    if(hits < 1){
      for(let i = 0; i < 3; i++){this.goToGoal(goal);}
      let c = this.isTouching();
      for(let i = 0; i < 360; i++){ c[i]? hits2 += 1: hits2 = hits2;}
      if(hits2 > hits){
        for(let i = 0; i < 3; i++){this.goAwayFromGoal(goal);}
        this.followWall();
      }
    }else{
      this.goToGoal(goal);
    }
  }

  bug1(goal){
    let hits = 0;
    let c = this.isTouching();
    for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}
    if(this.around_Object){
      let dist = Math.sqrt(Math.pow(Math.abs(this.x - goal.x),2) + Math.pow(Math.abs(this.y - goal.y),2));
      if(dist < this.min_dist){
        this.min_x = this.x;
        this.min_y = this.y;
        this.min_dist = dist;
        this.marker = true;
      }
      this.followWall();
      this.steps += 1;
      if(!this.go_to_min && (this.steps > 10) && (Math.abs(this.x - this.first_x) < 10) && (Math.abs(this.y - this.first_y) < 10)){
        console.log("dei a volta");
        this.go_to_min = true;
      }
      if(this.go_to_min && (Math.abs(this.x - this.min_x) < 10) && (Math.abs(this.y - this.min_y) < 10)){
        for(let i = 0; i < 5; i++){this.goToGoal(goal);}
        this.go_to_min = false;
        this.around_Object = false;
        this.marker = false;
        this.steps = 0;
      }
    }else{
      if(hits > 0){
        this.around_Object = true;
        this.first_x = this.x;
        this.first_y = this.y;
      }else{
        this.goToGoal(goal);
      }
    }
  }

  bug2(goal){
    if(!this.line_drawn){
      this.goal_x = goal.x;
      this.goal_y = goal.y;
      this.line_x = this.x;
      this.line_y = this.y;
      this.line_drawn = true;
    }
    let hits = 0;
    let c = this.isTouching();
    for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}
    if(this.around_Object){
      let dist = Math.sqrt(Math.pow(Math.abs(this.x - goal.x),2) + Math.pow(Math.abs(this.y - goal.y),2));

      this.followWall();
      this.steps += 1;

      if(this.isOverLine() && (this.steps > 10) && (dist < this.min_dist)){
        this.min_dist = dist - 50;
        for(let i = 0; i < 10; i++){this.goToGoal(goal);}
        this.around_Object = false;
        this.steps = 0;
      }
    }else{
      if(hits > 0){
        this.around_Object = true;
        this.first_x = this.x;
        this.first_y = this.y;
      }else{
        this.goToGoal(goal);
      }
    }

  }
}

class Goal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.grabbed = false;
  }

  show() {
    fill([255, 0, 0, 255]);
    circle(this.x, this.y, 2 * this.r);
  }

  clicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < this.r) {
      this.grabbed = true;
    } else {
      this.grabbed = false;
    }
  }
}
