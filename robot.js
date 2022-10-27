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
    let c = [0, 0, 0];
    for (let i = 0; i < 8; i++) {
      x = this.x + 21 * Math.cos(i * (Math.PI / 8));
      y = this.y + 21 * Math.sin(i * (Math.PI / 8));
      c = get(x, y).reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);
      if (c == 255) {
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
