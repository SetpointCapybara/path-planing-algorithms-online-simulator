class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.grabbed = false;
  }

  show() {
    fill([255, 255, 255, 255]);
    circle(this.x, this.y, 2 * this.r);
  }

  isTouching() {
    let sensors = [];
    let x = 0;
    let y = 0;
    let d = 0;
    let c = [0, 0, 0];
    for (let i = 0; i < 10; i++) {
      x = this.x + 25 * Math.cos(i * (Math.PI / 5));
      y = this.y + 25 * Math.sin(i * (Math.PI / 5));
      
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

  clicked(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < this.r) {
      this.grabbed = true;
    } else {
      this.grabbed = false;
    }
  }

  bug0(goal){
    let c = this.isTouching();
    let dx = 0;
    let dy = 0;
    let dt = 0.1;

    dx = (goal.x - this.x);
    if(dx > 0){
      dx = 10
    }
    if(dx < 0){
      dx = -10
    }
    dy = (goal.y - this.y);
    if(dy > 0){
      dy = 10
    }
    if(dy < 0){
      dy = -10
    }

    for(let i = 0; i < 10; i++){
      if(c[i]){
        dx = -15*Math.sin(i * (Math.PI / 5));
        dy = 10*Math.cos(i * (Math.PI / 5));
      }
    }
      let thisx = this.x;
      let thisy = this.y

      this.x = 0;
      this.y = 0;

      this.x = thisx + dt * dx;
      this.y = thisy + dt * dy;
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
