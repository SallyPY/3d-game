var Material = function(gl, program) { 
  this.gl = gl; 
  this.program = program; 
  var theMaterial = this; 
  Object.keys(program.uniforms).forEach(function(uniformName) { 
    var uniform = program.uniforms[uniformName]; 
    var reflectionVariable =
        UniformReflectionFactories.makeVar(gl, uniform.type,
                   uniform.arraySize, uniform.textureUnit);
    // TODO: shared uniforms

    if(uniformName in Material.shared){
      if(Material.shared[uniformName]){
         if(typeof Material.shared[uniformName] !== typeof reflectionVariable) {
           throw new Error(
             "Conflicting definitions of shared uniform ' " + uniformName + "'.");
         }
      } else {
        Object.defineProperty(Material.shared,
              uniformName, {value: reflectionVariable} );
      }
    } else {
      Object.defineProperty(theMaterial, uniformName,
          {value: reflectionVariable} ); 
    }
  }); 
}; 

Material.prototype.commit = function() { 
  var gl = this.gl; 
  this.program.commit(); 
  var theMaterial = this; 
  Object.keys(this.program.uniforms).forEach( function(uniformName) { 
    var uniform = theMaterial.program.uniforms[uniformName]; 

    if(uniformName in Material.shared) {
      Material.shared[uniformName].commit(
        gl, uniform.location);
    } else {
      theMaterial[uniformName].commit(
        gl, uniform.location);
    }
  }); 
};

Material.shared = {
  modelViewProjMatrix : new Mat4(),
  texTranslate: new Vec2(),
  modelMatrix: new Mat4(),
  modelMatrixInverse: new Mat4(), //set to new mat4 if don't want to get error
  lightPos: new Vec4Array(2),
  rayDirMatrix: new Mat4(),
  lightPowerDensity: new Vec4Array(2),
  opacity: 1,
  eye: new Vec3(),
};
