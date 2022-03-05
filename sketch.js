let basicShader;

// dat gui
let controller = function(){
    this.Color_change =  2.6;
    this.Color_change_2 = 14;
    this.Edge_Thick = 65;
    this.Smooth_Edge =  7;
    this.Contrast =  0.8;
    this.Num_Cells =  8;
    this.Repulsion_Loc =  3.8;
}
let settings = new controller();

function preload(){
  basicShader = loadShader("shader.vert","shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
    let gui = new dat.GUI();
  gui.add(settings, 'Color_change', 0, 20);
  gui.add(settings, 'Color_change_2', 0, 50);
  gui.add(settings, 'Edge_Thick', 0,280);
  gui.add(settings, 'Smooth_Edge', 0,10);
  gui.add(settings, 'Contrast', 0,20);
  gui.add(settings, 'Num_Cells', 2,10);
  gui.add(settings, 'Repulsion_Loc', 0,10);
  
}

function draw() {
  background(0);
  
  basicShader.setUniform("u_resolution", [width*2, height*2]);
  basicShader.setUniform('u_time', frameCount * 0.02);
  basicShader.setUniform('Color_change', settings.Color_change);
  basicShader.setUniform('Color_change_2', settings.Color_change_2);
  basicShader.setUniform('Edge_Thick', settings.Edge_Thick);
  basicShader.setUniform('Smooth_Edge', settings.Smooth_Edge);
  basicShader.setUniform('Contrast', settings.Contrast);
  basicShader.setUniform('Num_Cells', settings.Num_Cells);
  basicShader.setUniform('Repulsion_Loc', settings.Repulsion_Loc);
  
  shader(basicShader);
  
  rect(0,0,width,height);
}
