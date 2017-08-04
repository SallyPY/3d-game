var OrthoCamera = function() { 
  this.position = new Vec2(0.5, 0); 
  this.rotation = 0; 
  this.windowSize = new Vec2(13, 13); 
  
  this.viewProjMatrix = new Mat4(); 
  this.viewProjDMatrix = new Mat4();
  this.invProjMatrix = new Mat4();
  this.updateViewProjMatrix(); 
};

OrthoCamera.prototype.updateViewProjMatrix = function(){ 
  this.viewProjMatrix.set(). 
    scale(0.5). 
    scale(this.windowSize). 
    rotate(this.rotation). 
    translate(this.position). 
    invert(); 

    this.viewProjDMatrix.set(). 
      scale(0.5). 
      scale(this.windowSize). 
      rotate(this.rotation).
      invert(); 

   this.invProjMatrix.set(). 
      scale(0.5). 
      scale(this.windowSize). 
      rotate(this.rotation).
      translate(this.position);
};

OrthoCamera.prototype.setAspectRatio = function(ar) 
{ 
  this.windowSize.x = this.windowSize.y * ar;
  this.updateViewProjMatrix();
}; 