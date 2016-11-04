// the global namespace for this program
var snake = {};

snake.snake_body = [{x: 10, y: 10}];
snake.apple = {x: 20, y:20};

snake.snake_size = 2;
snake.apple_size = 5;

// how many pixels to move each time
snake.move_step = 2;

snake.direction = "right";

// the period of moving, ms
snake.move_period = 50;

// the size of the whole game space
//snake.window_height = document.documentElement.clientHeight - 4;
//snake.window_width = document.documentElement.clientWidth - 15;
snake.window_height = document.querySelector(".container").clientHeight - 4;
snake.window_width = document.querySelector(".container").clientWidth - 4;

// html5 canvas related manipulation
snake.canvas = document.querySelector("#game");
snake.context = snake.canvas.getContext("2d");

snake.canvas.setAttribute("height", snake.window_height);
snake.canvas.setAttribute("width", snake.window_width);


// you need to clear the canvas before drawing new position of snake and apple,
// so that you can see them move, not incresing.
snake.clear_screen = function() {
  this.context.clearRect(0, 0, this.window_width, this.window_height);
};


// support both "awsd" and "hjkl" key bindings
snake.listen_keys = function() {
  var that = this;
  window.addEventListener("keydown", function(e) {
    switch (String.fromCharCode(e.keyCode)) {
      case "A":
      case "H":
        that.direction = "left";
        break;
      case "D":
      case "L":
        that.direction = "right";
        break;
      case "S":
      case "J":
        that.direction = "down";
        break;
      case "W":
      case "K":
        that.direction = "up";
        break;
      default:
        null; // just ignore
    }
  }, true);
};

snake.new_head = function() {
  var snake_head = this.snake_body[0];
  switch (this.direction) {
    case "left":
      return {x: snake_head.x - this.move_step, y: snake_head.y};
    case "right":
      return {x: snake_head.x + this.move_step, y: snake_head.y};
    case "down":
      return {x: snake_head.x, y: snake_head.y + this.move_step};
    case "up":
      return {x: snake_head.x, y: snake_head.y - this.move_step};
    default:
      console.log("wrong directioin:" + this.directioin);
      return snake_head;
  }
};


snake.start_moving_snake = function() {
  var that = this;
  var move = function() {
    that.snake_body.unshift(that.new_head());
    if (that.eat_apple()) {
      that.apple_reborn();
      //console.log("new apple:", that.apple.x, ",", that.apple.y);
    } else {
      that.snake_body.pop();
    }
    setTimeout(move, that.move_period);
  };
  move();
};


snake.start_drawing = function() {
  var that = this;
  var draw = function() {
    that.clear_screen();
    that.draw_snake_head_position();
    that.draw_snake();
    that.draw_apple();
    requestAnimationFrame(draw);
  };
  draw();
};

snake.draw_snake_head_position = function() {
  var head = this.snake_body[0];
  var pos_str = "[" + head.x + "," + head.y + "]";
  this.context.fillText(pos_str, 0, this.window_height);
};


snake.draw_snake = function() {
  var that = this;
  this.snake_body.forEach(function(p) {
    that.draw_arc({x: p.x, y: p.y, size: that.snake_size, color: "blue"});
  });
};

snake.draw_apple = function() {
  var p = this.apple;
  this.draw_arc({x: p.x, y: p.y, size: this.apple_size, color: "red"});
};

// the argument is like {x: .., y: .., size: .., color: ..}
snake.draw_arc = function(info) {
  var old_fillStyle = this.context.fillStyle;
  if (info.color) {
    this.context.fillStyle = info.color;
  }
  this.context.beginPath();
  this.context.arc(info.x, info.y, info.size, 0, Math.PI * 2, true);
  this.context.closePath();
  this.context.fill();
  if (info.color) {
    this.context.fillStyle = old_fillStyle;
  }
};


snake.eat_apple = function() {
  var p1 = this.snake_body[0], p2 = this.apple;
  var distance = Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
  if (distance <= this.snake_size + this.apple_size)
    return true;
  else
    return false;
};

snake.apple_reborn = function() {
  var that = this;
  var random_point = function() {
    var x = Math.floor(Math.random() * that.window_height / 2),
        y = Math.floor(Math.random() * that.window_width / 2);
    return {x: x, y: y};
  };
  this.apple = random_point();
};


snake.start = function() {
  this.start_moving_snake();
  this.start_drawing();
  this.listen_keys();
};


snake.start();


