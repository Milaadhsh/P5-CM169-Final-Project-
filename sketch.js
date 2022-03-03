let basicShader;

// dat gui
let controller = function(){
    this.sensor_distance =  10;
	this.sensor_angle = 40/180*Math.PI; // radians
	this.turning_speed = 40/180*Math.PI; // radians
	this.speed = 3;
	this.decay_factor = 0.9;
	this.deposit_amount = 0.2;
	this.num_agents = 5000;
	this.start_in_circle = false; // otherwise start randomly
	this.highlight_agents = false;
	this.random_turning = false; // randomly turn within the limits of turning_speed
	this.wrap_around = true;
}
let settings = new controller();

function preload(){
  basicShader = loadShader("shader.vert","shader.frag");
}

function setup() {
  createCanvas(400, 400, WEBGL);
  
    let gui = new dat.GUI();
  gui.add(settings, 'sensor_distance', 1, 100);
  gui.add(settings, 'sensor_angle', 0,PI);
  gui.add(settings, 'turning_speed', 0,PI);
  gui.add(settings, 'speed', 0,40);
  gui.add(settings, 'decay_factor', 0, 1);
  gui.add(settings, 'deposit_amount', 0,1);
  gui.add(settings, 'num_agents', 1,20000);
  gui.add(settings, 'start_in_circle');
  gui.add(settings, 'highlight_agents');
  gui.add(settings, 'random_turning');
  gui.add(settings, 'wrap_around');
  let obj = { reset_sim: function () { reset(); } }
  gui.add(obj, 'reset_sim');
}

function draw() {
  background(0);
  
  basicShader.setUniform("u_resolution", [width*2, height*2]);
  basicShader.setUniform('u_time', frameCount * 0.05);
  basicShader.setUniform('sensor_distance', settings.sensor_distance);
  
  shader(basicShader);
  
  rect(0,0,width,height);
}
