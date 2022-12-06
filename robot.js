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
    this.show_grid = false;
    this.map_not_ready =  true;
    this.map = []
    this.graph_not_ready = true;
    this.first_ball_not_placed = true;
    this.balls_list = [];
    this.balls_list2 = [];
    this.lines_list = [];
    this.step = 40;
    this.adjacency_list = new Map();
    this.start_bfs = "0,0";
    this.end_bfs = "0,0";
    this.way = [];
    this.not_find_way = true;
    this.start_walking = false;
    this.next_step = 1;
  }

  addNode(coordinates){
    this.adjacency_list.set(coordinates, []);
  }

  addEdge(coordinates1, coordinates2){
    this.adjacency_list.get(coordinates1).push(coordinates2);
    this.adjacency_list.get(coordinates2).push(coordinates1);
  }

  getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      for(let i = 0; i < value.length; i++){
        if (value[i] === searchValue)
        return key;
      }
    }
  }

  findway(start, end){
    let looking_for = end;
    let holder = "0";
    let local_way = [];
    let i = 0;
    while((holder != start) && i < 1000){
      holder = this.getByValue(this.adjacency_list, looking_for);
      looking_for = holder;
      local_way.push(holder);
      i++;
    }
    return local_way
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
    if(this.show_grid){
      for(let i = 0; i < (Math.round(720/50) + 1) ; i++){
        line(0,i*50, 1280, i*50);
      }
      for(let i = 0; i < (Math.round(1280/50) + 1) ; i++){
        line(i*50,0, i*50, 1280);
      }
    }
    for(let i = 0; i < this.balls_list.length; i++){
      fill([0, 0, 255, 255]);
      circle(this.balls_list[i][0], this.balls_list[i][1], 5);
    }

    for(let i = 0; i < this.lines_list.length; i++){
      fill([0, 0, 255, 255]);
      line(this.lines_list[i][0], this.lines_list[i][1], this.lines_list[i][2], this.lines_list[i][3]);
    }
    noFill();
    circle(this.x, this.y, 2 * this.r);

  }

  isTouching() {
    let sensors = [];
    let x = 0;
    let y = 0;
    let d = 0;
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
    let dist = Math.sqrt(Math.pow(Math.abs(this.x - goal.x),2) + Math.pow(Math.abs(this.y - goal.y),2));
    this.x = this.x + dt * -10*((goal.x - this.x)/dist);
    this.y = this.y + dt * -10*((goal.y - this.y)/dist);
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
        dx = dx - 10*Math.cos(i * (Math.PI / 180));
        dy = dy - 10*Math.sin(i * (Math.PI / 180));
      }
    }
    dx > lim ? dx = lim : dx < -lim ? dx = -lim : dx = dx;
    dy > lim ? dy = lim : dy < -lim ? dy = -lim : dy = dy; 
    if(hits < 10){
      this.x = this.x + dt * -dx/20;
      this.y = this.y + dt * -dy/20;
      return 0;
    }
    if(hits > 90){
      this.x = this.x + dt * dx/20;
      this.y = this.y + dt * dy/20;
      return 0;
    }
    console.log(dy/20, -dx/20, hits);
    this.x = this.x + dt * dy/20;
    this.y = this.y + dt * -dx/20;
  }

  bug0(goal){
    let hits = 0;
    let hits2 = 0;
    let c = this.isTouching();
    for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}
    if(hits > 1){
      for(let i = 0; i < 5; i++){this.goToGoal(goal);}
      let c = this.isTouching();
      for(let i = 0; i < 360; i++){ c[i]? hits2 += 1: hits2 = hits2;}
      if(hits2 > hits){
        for(let i = 0; i < 5; i++){this.goAwayFromGoal(goal);}
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

  wavefront(goal){
    this.show_grid = true; // creating grid
    let map = this.map;
    if(this.map_not_ready){
      //creating empty map
      let row = [];
      let pixel_color = 0;
      for(let i = 0; i < (Math.round(1280/50) + 1) ; i++){
        row.push(0)
      }
      for(let i = 0; i < (Math.round(720/50) + 1) ; i++){
        map.push(Array.from(row))
      }
      let k = 0;
      //populating map
      //detecting obstacles
      for(let i = 0; i < (Math.round(720/50) + 1) ; i++){
        for(let j = 0; j < (Math.round(1280/50) + 1) ; j++){
          pixel_color = get( (j*50+25), (i*50+25)).reduce((accumulator, value) => {
            return accumulator + value;
          }, 0);
          if(pixel_color == 255){
            map[i][j] = 999;
          }
        }
      }
      //detecting goal
      let goalj = Math.floor(goal.y/50);
      let goali = Math.floor(goal.x/50);
      map[goalj][goali] = 1;
      //Detecting robot
      let botj = Math.floor(this.y/50);
      let boti = Math.floor(this.x/50);

    //Calculating cell values
    
      let any_zeros = true;
      while(any_zeros){
        any_zeros = false;
        for(let i = 0; i < (Math.round(720/50) + 1) ; i++){
          for(let j = 0; j < (Math.round(1280/50) + 1) ; j++){
            if((map[i][j] != 0)){
              if((map[i][j] != 999)){
                try{
                  if(map[i-1][j] == 0){
                    map[i-1][j] = map[i][j] + 1;
                  }
                }catch(error){
                  console.log('out of bounds');
                }
                try{
                  if(map[i+1][j] == 0){
                    map[i+1][j] = map[i][j] + 1;
                  }
                }catch(error){
                  console.log('out of bounds');
                }
                try{
                  if(map[i][j-1] == 0){
                    map[i][j-1] = map[i][j] + 1;
                  }
                }catch(error){
                  console.log('out of bounds');
                }
                try{
                  if(map[i][j+1] == 0){
                    map[i][j+1] = map[i][j] + 1;
                  }
                }catch(error){
                  console.log('out of bounds');
                }
              }
            }else{
              any_zeros = true;
            }
          }
        }
      }
      this.map_not_ready = false;
    }

    for(let i = 0; i < (Math.round(720/50) + 1) ; i++){
      for(let j = 0; j < (Math.round(1280/50) + 1) ; j++){
        fill(0, 102, 153);
        text(map[i][j], j*50 + 25, i*50 + 25);
      }
    }
    //console.log(map);
    //Going away from wall if necessary
    let c = this.isTouching();
    let hits = 0;
    let dx = 0;
    let dy = 0;
    let dt = 0.1;
    for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}
    if(hits > 0){
      for(let i = 0; i < 360; i++){
        if(c[i]){
          dx = dx - 10*Math.cos(i * (Math.PI / 180));
          dy = dy - 10*Math.sin(i * (Math.PI / 180));
        }
      }
      this.x = this.x + dt * dx/20;
      this.y = this.y + dt * dy/20;
    }
    //Detecting robot
    let botj = Math.floor(this.y/50);
    let boti = Math.floor(this.x/50);
    fill(0, 0, 153);
    text(map[botj][boti], boti*50 + 25, botj*50 + 25);
    //deciding where to go
    if((typeof map[botj+1] !== "undefined") && map[botj+1][boti] < map[botj][boti]){
      let temp_goal = new Goal((boti)*50 + 25, (botj+1)*50 + 25);
      fill(255, 0, 0);
      text(map[botj+1][boti], (boti)*50 + 25, (botj+1)*50 + 25);
      this.goToGoal(temp_goal);
    }else if((typeof map[botj-1] !== "undefined") && map[botj-1][boti] < map[botj][boti]){
      let temp_goal = new Goal((boti)*50 + 25, (botj-1)*50 + 25);
      fill(255, 0, 0);
      text(map[botj-1][boti], (boti)*50 + 25, (botj-1)*50 + 25);
      this.goToGoal(temp_goal);
    }else if((typeof map[botj][boti + 1] !== "undefined") && map[botj][boti + 1] < map[botj][boti]){
      let temp_goal = new Goal((boti + 1)*50 + 25, (botj)*50 + 25);
      fill(255, 0, 0);
      text(map[botj][boti + 1], (boti + 1)*50 + 25, (botj)*50 + 25);
      this.goToGoal(temp_goal);
    }else if((typeof map[botj][boti - 1] !== "undefined") && map[botj][boti - 1] < map[botj][boti]){
      let temp_goal = new Goal((boti - 1)*50 + 25, (botj)*50 + 25);
      fill(255, 0, 0);
      text(map[botj][boti - 1], (boti - 1)*50 + 25, (botj)*50 + 25);
      this.goToGoal(temp_goal);
    }

  }

  toMapKey(x, y){
    return x.toString().concat( ",", y.toString())
  }

  rrt(goal){
    if(this.graph_not_ready){
      if(this.first_ball_not_placed){
        circle(this.x, this.y, 5);
        //Creates first node
        this.addNode(this.toMapKey(this.x, this.y));
        this.start_bfs = this.toMapKey(this.x, this.y)
        this.balls_list.push([this.x, this.y]);

        this.first_ball_not_placed = false;
      }
      let randomx = Math.floor(Math.random() * 1280);
      let randomy =  Math.floor(Math.random() * 720);
      let closest = 0;
      let dist = Math.sqrt(Math.pow(Math.abs(randomx - this.balls_list[0][0]),2) + Math.pow(Math.abs(this.balls_list[0][1] - randomy),2));
      let min_dist = dist;
      for(let i = 0; i < this.balls_list.length; i++){
        dist = Math.sqrt(Math.pow(Math.abs(randomx - this.balls_list[i][0]),2) + Math.pow(Math.abs(this.balls_list[i][1] - randomy),2));
        if(dist < min_dist){
          closest = i;
          min_dist = dist;
        }
      }

      let newx = this.balls_list[closest][0] + this.step*((randomx - this.balls_list[closest][0])/min_dist);
      let newy = this.balls_list[closest][1] + this.step*((randomy - this.balls_list[closest][1])/min_dist);

      let originalx = this.x;
      let originaly = this.y;

      this.x = newx;
      this.y = newy;

      //if edge invalid
      let c = this.isTouching();
      let hits = 0;
      for(let i = 0; i < 360; i++){ c[i]? hits += 1: hits = hits;}

      if(hits == 0){
        //Creates node
        this.addNode(this.toMapKey(newx, newy));
        this.balls_list.push([newx, newy]);
        //Creates edge
        this.addEdge(this.toMapKey(newx, newy), this.toMapKey(this.balls_list[closest][0], this.balls_list[closest][1]))
        this.lines_list.push([newx, newy, this.balls_list[closest][0], this.balls_list[closest][1]])
    
        //if edge inside goal
        let dist_to_goal = Math.sqrt(Math.pow(Math.abs(newx - goal.x),2) + Math.pow(Math.abs(newy - goal.y),2));
        if(dist_to_goal < 20){
          this.end_bfs = this.toMapKey(newx, newy)
          this.graph_not_ready = false;
        }

      }

      this.x = originalx;
      this.y = originaly;

    }else{
      if(this.not_find_way){
        let local_way = this.findway(this.start_bfs, this.end_bfs)
        let localx = 0;
        let localy = 0;
        for(let i = 0; i < local_way.length; i++){
          localx = +local_way[i].split(",")[0];
          localy = +local_way[i].split(",")[1];
          this.way.push([localx, localy]);
        }

        this.not_find_way = false;
        this.start_walking = true;
        this.way = this.way.reverse();
      }
    }
    if(this.start_walking){
      let temp_goal = new Goal(this.way[this.next_step][0], this.way[this.next_step][1]);
      this.goToGoal(temp_goal);
      let dist = Math.sqrt(Math.pow(Math.abs(this.x - this.way[this.next_step][0]),2) + Math.pow(Math.abs(this.y - this.way[this.next_step][1]),2));
      if(dist < 5){
        this.next_step = this.next_step + 1;
      }
      if(this.next_step > (this.way.length - 1)){
        this.start_walking = false;
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
