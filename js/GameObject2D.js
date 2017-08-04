var GameObject2D = function(mesh) { 
  this.mesh = mesh;

  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 
  this.force = new Vec3(0, 0, 0);
  
  this.position = new Vec3(0, 0, 0); 
  this.acceleration = new Vec3(0, 0, 0);
  this.momentum = new Vec3(0, 0, 0);
  this.velocity = new Vec3(0, 0, 0);
  this.invMass = 0;
  this.camStat = false;

  this.angularMomentum = new Vec3(0, 0, 0);
  this.angularVelocity = 0;
  this.invAngMass = 0;
  this.angularAcceleration = new Vec3(0, 0, 0);
  this.torque = 0;
  this.armLength = 0;

  this.show = true;
  this.opacity = 1;

  this.axis = new Vec3(0, 0, 0);
  
  this.texTranslate = new Vec2(0, 0);
  this.modelMatrix = new Mat4(); 
  this.rayDirMatrix = new Mat4();
  this.shadowMatrix = undefined;
  this.frenetMatrix = undefined;

  this.cam = new Vec3(0, 0, 0);
  this.boundingRadius = 0;
  this.frozen = true;

  this.updateModelTransformation(); 

  this.move = function(dt, objects) {};
  this.control = function(keysPressed) {};
  this.interactAvatar = function(obj) {};
  

  
};

GameObject2D.prototype.updateModelTransformation =
                              function(){ 

  if(this.frenetMatrix != undefined) {
    this.modelMatrix.set(). 
    mul(this.frenetMatrix) .
    rotate(this.orientation, this.axis). 
    translate(this.position);

  } else {                            
    this.modelMatrix.set(). 
    scale(this.scale). 
    rotate(this.orientation, this.axis). 
    translate(this.position);
  }

  if(this.parent) {
    this.modelMatrix.mul(this.parent.modelMatrix);
  }

  if(this.shadowMatrix != undefined) {
    this.modelMatrix.mul(this.shadowMatrix);
  }







};

GameObject2D.prototype.draw = function(camera, lightSources){ 

  this.invVP = camera.viewProjMatrix.clone().invert().translate(new Vec3(-camera.position.x, -camera.position.y, -camera.position.z));
  Material.shared.rayDirMatrix.set(this.invVP);

  if(!this.camStat) {
  Material.shared.modelViewProjMatrix.set(). 
    mul(this.modelMatrix).mul(camera.viewProjMatrix); //is this right?
  }
  else {
     Material.shared.modelViewProjMatrix.set(). 
    mul(this.modelMatrix).mul(camera.viewProjDMatrix);;
  }



  Material.shared.modelMatrix.set().mul(this.modelMatrix);
  Material.shared.modelMatrixInverse.set().mul(this.modelMatrix.clone()).invert();

  for(var i = 0; i < 2; i++) {
     Material.shared.lightPos[i].set(lightSources[i].direction);
     Material.shared.lightPowerDensity[i].set(lightSources[i].powerDensity);
  }
 
  Material.shared.texTranslate.set(this.texTranslate);
  // Material.shared.opacity.set(this.opacity);

  Material.shared.eye.set(camera.position);

    this.mesh.draw(); 
  
};
