var Scene = function(gl, desc) {
  this.gameObjects = [];
  this.slowpokeBabies = [];
  this.timeAtLastFrame = new Date().getTime();
  this.desc = desc;

  var scene = this;

  this.vsTrafo2d = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
  this.vsBack = new Shader(gl, gl.VERTEX_SHADER, "background_vs.essl");
  this.vsShadow = new Shader(gl, gl.VERTEX_SHADER, "shadow_vs.essl");

  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl"); 
  this.fsEnv = new Shader(gl, gl.FRAGMENT_SHADER, "env_fs.essl"); 
  this.fsBack = new Shader(gl, gl.FRAGMENT_SHADER, "background_fs.essl"); 
  this.fsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs.essl"); 
  this.fsProc = new Shader(gl, gl.FRAGMENT_SHADER, "proc_text_fs.essl");
  this.fsProc2 = new Shader(gl, gl.FRAGMENT_SHADER, "proc_text2_fs.essl");

  this.fsNorm = new Shader(gl, gl.FRAGMENT_SHADER, "proc_norm_fs.essl");

  this.fsBlue = new Shader(gl, gl.FRAGMENT_SHADER, "blue_texture_fs.essl"); 

  this.envProgram = new Program(gl, this.vsTrafo2d, this.fsEnv);
  this.procNormProgram = new Program(gl, this.vsTrafo2d, this.fsNorm);

  this.backProgram = new Program(gl, this.vsBack, this.fsBack);
  this.program = new Program(gl, this.vsTrafo2d, this.fsSolid);
  this.blueProgram = new Program(gl, this.vsTrafo2d, this.fsBlue);
  this.shadowProgram = new Program(gl, this.vsShadow, this.fsShadow);
  this.procProgram = new Program(gl, this.vsTrafo2d, this.fsProc);
  this.proc2Program = new Program(gl, this.vsTrafo2d, this.fsProc2);


  this.camera = new PerspectiveCamera();

  this.win = false;
  this.capturedSlowpokes = 0;

  //CHEVY
  
  this.texture = new Texture2D(gl, 'json/chevy/chevy.png');

  this.chevyMat = new Material(gl, this.program);
  this.chevyMat.colorTexture.set(this.texture);
  this.chevyMat.texScale.set(1, 1);
  this.chevyMat.shininess.set(3.0);

  this.chevyMesh = new MultiMesh(gl, 'json/chevy/chassis.json', [this.chevyMat]);

  this.chevy = new GameObject2D(this.chevyMesh);
  this.chevy.boundingRadius = 10;
  this.chevy.orientation = -90 * 3.14/180;
  this.chevy.axis.set(0, 1, 0);
  this.chevy.position.set(0, 1.2, -200);
  this.chevy.invMass = 1;
  this.chevy.force.x = -5;

  //get to -30
  var reached = false;

  this.chevy.move = function(dt, gameObjects) {

      var dist = this.position.minus(-30, 1.2, -200); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + 5;

      if (distt >= mind) {
        this.acceleration.setScaled(this.force, this.invMass);
        this.velocity.addScaled(dt, this.acceleration);
        this.velocity.mul(Math.exp(-dt * 3 * this.invMass));
        this.position.addScaled(dt, this.velocity);

      } else {
        reached = true;
      }
  }

  this.gameObjects.push(this.chevy);

  this.texture = new Texture2D(gl, 'json/chevy/chevy.png');

  this.chevyWheelMat = new Material(gl, this.program);
  this.chevyWheelMat.colorTexture.set(this.texture);
  this.chevyWheelMat.texScale.set(1, 1);
  this.chevyWheelMat.shininess.set(1.0);

  this.chevyWheelMesh = new MultiMesh(gl, 'json/chevy/wheel.json', [this.chevyWheelMat]);

  this.chevyWheel = new GameObject2D(this.chevyWheelMesh);
  this.chevyWheel.parent = this.chevy;
  this.chevyWheel.position.set(9.5, -1.8, 14);
  this.chevyWheel.invAngMass = 1;
  this.chevyWheel.axis.set(1, 0, 0);


   this.chevyWheel.move = function(dt, gameObjects) {

    if(!reached) {
      this.torque = 30;
      this.angularAcceleration = this.torque * this.invAngMass;
      this.angularVelocity += this.angularAcceleration * dt;
      this.angularVelocity *= Math.exp(-dt * 30/(this.invAngMass));
      this.orientation += this.angularVelocity * dt;
    }

    
  }


  this.gameObjects.push(this.chevyWheel);


  this.chevyWheel2 = new GameObject2D(this.chevyWheelMesh);
  this.chevyWheel2.parent = this.chevy;
  this.chevyWheel2.position.set(9.5, -1.8, -11);
  this.chevyWheel2.invAngMass = 1;
  this.chevyWheel2.axis.set(1, 0, 0);


   this.chevyWheel2.move = function(dt, gameObjects) {
    if(!reached) {
        this.torque = 30;
        this.angularAcceleration = this.torque * this.invAngMass;
        this.angularVelocity += this.angularAcceleration * dt;
        this.angularVelocity *= Math.exp(-dt * 30/(this.invAngMass));
        this.orientation += this.angularVelocity * dt;
    }
  }

  this.gameObjects.push(this.chevyWheel2);




  //TREE

  this.texture = new Texture2D(gl, 'json/tree.png');

  this.treeMat = new Material(gl, this.procProgram);
  this.treeMat.colorTexture.set(this.texture);
  this.treeMat.shininess.set(10.0);

  this.treeMultiMesh = new MultiMesh(gl, 'json/tree.json', [this.treeMat]);

  this.tree2Mat = new Material(gl, this.proc2Program);
  this.tree2Mat.colorTexture.set(this.texture);
  this.tree2Mat.shininess.set(1.7);

  this.tree2MultiMesh = new MultiMesh(gl, 'json/tree.json', [this.tree2Mat]);


  this.tree = new GameObject2D(this.treeMultiMesh);
  this.tree.position.set(-8, 1.2, -3);
  this.tree.scale.set(.5, .5, .5);
  this.tree.boundingRadius = 11;

  //TREE SHADOW

  this.treeShadowMat = new Material(gl, this.shadowProgram);
  this.treeShadowMesh = new MultiMesh(gl, 'json/tree.json', [this.treeShadowMat]);

  this.treeShadow = new GameObject2D(this.treeShadowMesh);

  var shadowMat = new Mat4([1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 1, 0, 0, .01, 0, 1]);
  this.treeShadow.shadowMatrix = shadowMat;
  this.treeShadow.parent = this.tree;

  // CAR TREE

  this.treeCar = new GameObject2D(this.treeMultiMesh);
  this.treeCar.position.set(-35, 1.2, -190);
  this.treeCar.scale.set(.5, .5, .5);
  this.treeCar.axis.set(0, 0, 1);

  this.treeCar.move = function(dt, gameObjects) {
    if(reached) {
      this.orientation = 90 * 3.14/180;
    }
  }

  //CAR TREE SHADOW

  this.treeCarShadow = new GameObject2D(this.treeShadowMesh);
  this.treeCarShadow.shadowMatrix = shadowMat;
  this.treeCarShadow.parent = this.treeCar;

  this.gameObjects.push(this.treeCar);
  this.gameObjects.push(this.treeCarShadow);



  //RANDOM TREES

 


  for (var i = 0; i < 18; i++) {
    if(i % 2 == 0) {
      var tree = new GameObject2D(this.treeMultiMesh);
    } else {
      var tree = new GameObject2D(this.tree2MultiMesh);
    }
    tree.scale.set(.5, .5, .5);
    tree.position.set(Math.floor(Math.random() * (700)), 1.2,Math.floor(Math.random() * (700)));
    if (Math.random() > .5) {
      tree.position.x = -tree.position.x;
    }
    if (Math.random() > .5) {
      tree.position.z = -tree.position.z;
    }
    this.gameObjects.push(tree);

    var shadow = new GameObject2D(this.treeShadowMesh);
    shadow.shadowMatrix = shadowMat;
    shadow.parent = tree;
    this.gameObjects.push(shadow);


  }

  //MOVING TREE

  this.treeFollow = new GameObject2D(this.tree2MultiMesh);
  this.treeFollow.position.set(55, 1.2, -30);
  this.treeFollow.scale.set(.5, .5, .5);

  //follow avatar
  this.gameObjects.push(this.treeFollow);

  this.treeFollowShadow = new GameObject2D(this.treeShadowMesh);
  this.treeFollowShadow.shadowMatrix = shadowMat;
  this.treeFollowShadow.parent = this.treeFollow;

  this.gameObjects.push(this.treeFollowShadow);

  //SLOWPOKE IN TREE
  this.texture = new Texture2D(gl, 'slowpoke/YadonEyeDh.png');

  this.slowpoke1Mat = new Material(gl, this.program);
  this.slowpoke1Mat.colorTexture.set(this.texture);
  this.slowpoke1Mat.texScale.set(1, 1);
  this.slowpoke1Mat.shininess.set(1.0);
  
  this.texture = new Texture2D(gl, 'slowpoke/YadonDh.png');

  this.slowpoke2Mat = new Material(gl, this.program);
  this.slowpoke2Mat.colorTexture.set(this.texture);
  this.slowpoke2Mat.texScale.set(1, 1);
  this.slowpoke2Mat.shininess.set(1.0);

  this.multMats = [];
  this.multMats.push(this.slowpoke2Mat);
  this.multMats.push(this.slowpoke1Mat);

  this.slowpokeMultiMesh = new MultiMesh(gl, 'slowpoke/Slowpoke.json', this.multMats);
  this.slowpoke = new GameObject2D(this.slowpokeMultiMesh);
  this.slowpoke.boundingRadius = 16;
  this.slowpoke.parent = this.treeFollow;
  this.slowpoke.position.set(0, 30, 10);

  var treeFollow = this.treeFollow;
  var capturedSlowpokes = this.capturedSlowpokes;


  this.slowpoke.interactAvatar = function(avatar) {
      var dist = treeFollow.position.plus(0, 30, 0).minus(avatar.position); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + avatar.boundingRadius;

      if (distt < mind) {
        if(this.show) {
          this.show = false;
          capturedSlowpokes++;
          if(capturedSlowpokes == 3) {
            desc.innerHTML = "Return them to their mom!"

          } else {
            desc.innerHTML = 
              "You've rescued " + capturedSlowpokes + " slowpokes!";
          }
          setTimeout(function() {desc.innerHTML = ""}, 5000);
        }
      }
  }

  this.slowpoke1ShadowMat = new Material(gl, this.shadowProgram);
  this.slowpoke2ShadowMat = new Material(gl, this.shadowProgram);

  this.multMats = [];
  this.multMats.push(this.slowpoke2ShadowMat);
  this.multMats.push(this.slowpoke1ShadowMat);

  this.slowpokeShadowMultiMesh = new MultiMesh(gl, 'slowpoke/Slowpoke.json', this.multMats);

  // SLOWPOKE IN TREE SHADOW
  this.slowpokeShadow = new GameObject2D(this.slowpokeShadowMultiMesh);
  this.slowpokeShadow.parent = this.slowpoke;
  this.slowpokeShadow.shadowMatrix = shadowMat;

  // SLOWPOKE RUNNING TOWARD TREE SHADOW
  this.slowpokeTreeShadow = new GameObject2D(this.slowpokeShadowMultiMesh);
  this.slowpokeTreeShadow.shadowMatrix = shadowMat;

  var slowpokeTreeShadow = this.slowpokeTreeShadow;

  // SLOWPOKE RUNNING TOWARD TREE
  this.slowpokeTree = new GameObject2D(this.slowpokeMultiMesh);
  this.slowpokeTree.scale.set(.5, .5, .5);
  this.slowpokeTree.orientation = 320 * 3.14 / 180
  this.slowpokeTree.axis.set(0, 1, 0);
  this.slowpokeTree.boundingRadius = 5;
  this.slowpokeTree.position.set(-30, 0, 30);
  this.slowpokeTree.invMass = 1;
  this.slowpokeTree.invAngMass = 1;


  var ran = false;

  this.slowpokeTree.interactAvatar = function(avatar) {
      var dist = this.position.minus(avatar.position); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + avatar.boundingRadius;

      if (distt < mind) {
        if(this.show) {
          this.show = false;
          slowpokeTreeShadow.show = false;
          capturedSlowpokes++;
          if(capturedSlowpokes == 3) {
            desc.innerHTML = "Return them to their mom!"

          } else {
            desc.innerHTML = 
              "You've rescued " + capturedSlowpokes + " slowpokes!";
          }
          setTimeout(function() {desc.innerHTML = ""}, 5000);

        }
        
      }
     if (!ran) {

      dist = this.position.minus(avatar.position); //get distance squared
      distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      mind = this.boundingRadius + avatar.boundingRadius + 9;

      if (distt < mind) {
        ran = true;
        this.force.x = -15;
         this.force.z = 15;
             
      }
    }
  }

  var treeReached = false;

  this.slowpokeTree.move = function(dt, gameObjects) {

      var dist = this.position.minus(-60, 0, 50); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + 10;

      if (distt >= mind) {
        // console.log("yeah?");
        this.acceleration.setScaled(this.force, this.invMass);
        this.velocity.addScaled(dt, this.acceleration);
        this.velocity.mul(Math.exp(-dt * 3 * this.invMass));
        this.position.addScaled(dt, this.velocity);

      } else {
        treeReached = true;
      }



  }


  this.slowpokeTreeShadow.parent = this.slowpokeTree;

  this.slowpokeMomWin = new GameObject2D(this.slowpokeMultiMesh);
  this.slowpokeMomWin.orientation = 180 * 3.14/180;
  this.slowpokeMomWin.axis.set(0, 3, 0);
  this.slowpokeMomWin.scale.set(3, 3, 3);
  this.slowpokeMomWin.boundingRadius = 10;
  this.slowpokeMomWin.position.set(10, 0, 100);

  this.lightSources = [];
  this.lightSources.push(new LightSource(new Vec4(0, 7, 5, 1),new Vec4(0, 0, 0, 0) ));
  this.lightSources.push(new LightSource(new Vec4(3, 3, 3, 0),new Vec4(2, 2, 2, 0) ));
  this.blueLight = [];
  this.blueLight.push(new LightSource(new Vec4(10, 20, 110, 1),new Vec4(1, 1, 1, 0) ));
  this.blueLight.push(new LightSource(new Vec4(7, 18, 100, 1),new Vec4(1, 1, 1, 0) ));

  this.quadGeom = new QuadGeometry(gl);

    this.skyCubeTexture = new
    TextureCube(gl, [
      "envmap/arrakisday/arrakisday_ft.jpg",
      "envmap/arrakisday/arrakisday_bk.jpg",
      "envmap/arrakisday/arrakisday_up.jpg",
      "envmap/arrakisday/arrakisday_dn.jpg",
      "envmap/arrakisday/arrakisday_rt.jpg",
      "envmap/arrakisday/arrakisday_lf.jpg",]
      );

  // BALLOON
  this.balloonTexture = new Texture2D(gl, 'json/balloon.png');

  this.balloonMat = new Material(gl, this.envProgram);
  this.balloonMat.envmapTexture.set(this.skyCubeTexture);

  this.balloonMultiMesh = new MultiMesh(gl, 'json/balloon.json', [this.balloonMat]);

  this.balloon = new GameObject2D(this.balloonMultiMesh);
  this.balloon.position.set(8, 50, 1);
  this.balloon.invMass = 1;

  this.balloon.move = function(dt, gameObjects) {
    this.position.x = Math.cos(new Date().getTime()/7000) * 50;
    // this.position.z = Math.sin(new Date().getTime()/7000) * 50;

  }


  this.balloonBumpyMat = new Material(gl, this.procNormProgram);
  this.balloonBumpyMat.envmapTexture.set(this.skyCubeTexture);

  this.balloonBumpyMultiMesh = new MultiMesh(gl, 'json/balloon.json', [this.balloonBumpyMat]);

  this.balloonBumpy = new GameObject2D(this.balloonBumpyMultiMesh);
  this.balloonBumpy.position.set(45, 30, -105);




  this.slowpokeBalloon = new GameObject2D(this.slowpokeMultiMesh);
  this.slowpokeBalloon.parent = this.balloon;
  this.slowpokeBalloon.position.set(0, -25, 0);
  this.slowpokeBalloon.boundingRadius = 5;

  var balloon = this.balloon;

   this.slowpokeBalloon.interactAvatar = function(avatar) {
      var dist = balloon.position.minus(0, 25, 0).minus(avatar.position); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + avatar.boundingRadius;
      if (distt < mind) {
         if(this.show) {
           this.show = false;
          capturedSlowpokes++;
          if(capturedSlowpokes == 3) {
            desc.innerHTML = "Return them to their mom!"
          } else {
            desc.innerHTML = 
              "You've rescued " + capturedSlowpokes + " slowpokes!";
          }
          setTimeout(function() {desc.innerHTML = ""}, 5000);
         }
      }
  }

    // FROZEN SLOWPOKE

  this.texture = new Texture2D(gl, 'slowpoke/YadonEyeDh.png');
  this.slowpoke1Mat = new Material(gl, this.blueProgram);
  this.slowpoke1Mat.shininess.set(15.0);

  this.texture2 = new Texture2D(gl, 'slowpoke/YadonDh.png');
  this.slowpoke2Mat = new Material(gl, this.blueProgram);
  this.slowpoke2Mat.shininess.set(15.0);

  this.multMats = [];
  this.multMats.push(this.slowpoke2Mat);
  this.multMats.push(this.slowpoke1Mat);

  this.slowpokeMomMultiMesh = new MultiMesh(gl, 'slowpoke/Slowpoke.json', this.multMats);
  this.slowpokeMom = new GameObject2D(this.slowpokeMomMultiMesh);
  this.slowpokeMom.orientation = 180 * 3.14/180;
  this.slowpokeMom.axis.set(0, 3, 0);
  this.slowpokeMom.scale.set(3, 3, 3);
  this.slowpokeMom.position.set(10, 0, 100);
  this.slowpokeMom.boundingRadius = 40;

  this.slowpokeMom.interactAvatar = function(avatar) {
     var dist = this.position.minus(avatar.position); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + avatar.boundingRadius;
      if (distt < mind) {
        if(capturedSlowpokes == 3) {
          this.frozen = false;
          desc.innerHTML =  "The babies are safe! The mom is unfroze! You've won!"


        }
      }
  }


  //BACKGROUND

  this.backMat = new Material(gl, this.backProgram);
  this.backMat.envmapTexture.set(this.skyCubeTexture);
  this.backMesh = new Mesh(this.quadGeom, this.backMat);
  this.back = new GameObject2D(this.backMesh);

  // HELI

  this.texture = new Texture2D(gl, 'json/heli/heli.png');
  this.heliMat = new Material(gl, this.program);
  this.heliMat.colorTexture.set(this.texture);
  this.heliMat.texScale.set(1, 1);
  this.heliMat.shininess.set(5.6);

  this.heliMultiMesh = new MultiMesh(gl, 'json/heli/heli1.json', [this.heliMat]);
  this.heli = new GameObject2D(this.heliMultiMesh);
  this.heli.position.set(10, 10, 0);
  this.heli.boundingRadius = 10;
  this.heli.scale.set(.5, .5, .5);
  this.heli.invMass = .2;
  this.heli.invAngMass = .2;


  this.heli.control = function(keysPressed) {
      this.force.x = 0;
     this.force.y = -3;
     this.force.z = 0;
     this.torque = 0;

     if (keysPressed['J']) {
      this.force.x += -30;
      this.torque += 1;
    }
    if (keysPressed['O']) {
      this.force.y += 30;
      hit = false;


    }
    if (keysPressed['L']) {
      this.force.x += 30;

      this.torque -= 1;

    }
     if (keysPressed['U']) {
      this.force.y -= 30;

    }
     if (keysPressed['I']) {
      this.force.z -= 30;

    }
     if (keysPressed['K']) {
      this.force.z += 30;

    }
  };  

  var slowpokeMom = this.slowpokeMom;
  var slowpokeBabies = this.slowpokeBabies;

  var hit = false;

  this.heli.move = function(dt, gameObjects) {

    if(!hit) {
      this.angularAcceleration = this.torque * this.invAngMass;
      this.angularVelocity += this.angularAcceleration * dt;

      this.angularVelocity *= Math.exp(-dt * 30/(this.invAngMass));
      this.orientation += this.angularVelocity * dt;

      for (var i = gameObjects.length - 1; i >= 0; i--) {
        gameObjects[i].interactAvatar(this);

      }
      for (var i = slowpokeBabies.length - 1; i >= 0; i--) {
        slowpokeBabies[i].interactAvatar(this);

      }

      slowpokeMom.interactAvatar(this);

      this.acceleration.setScaled(this.force, this.invMass);
      this.velocity.addScaled(dt, this.acceleration);
      this.velocity.mul(Math.exp(-dt * 3 * this.invMass));
      this.position.addScaled(dt, this.velocity);
    } else {
      this.velocity.set(0, 0, 0);
    }

    if(this.position.y < 0) {
        hit = true;
    }

    this.cam = this.position;

    // Frenet frame (assumes airborne avatar) -Position is physically animated,
    //  orientation is not. In case of a fixed-winged aircraft: nose points the same direction as the velocity vector,
    //  wing points into direction velocity-cross-acceleration-normalized, and tail fin points into direction nose-cross-wing-normalized.

    this.wing = this.acceleration.cross(this.velocity).normalize();
    var vel = this.velocity.clone().normalize();

    var wing = this.velocity.cross(this.acceleration).normalize();
    var tail = this.velocity.cross(wing).normalize();


    var frenet = new Mat4([
                          vel.x, vel.y, vel.z, 0,
                          tail.x         , tail.y         , tail.z         , 0,
                          wing.x         , wing.y         , wing.z         , 0,
                          0              , 0              , 0              , 0]

      );

     // console.log(frenet.p);

   //vel, wing, tail
   //tail, vel, wing
   //tail, wing, vel
   //vel, tail, wing
   //wing, tail , vel
   //wing, vel, tai
  //   this.frenetMatrix = frenet;

  };

  //HELI ROTOR

  this.texture = new Texture2D(gl, 'json/heli/heli.png');

  this.heliRotorMat = new Material(gl, this.program);
  this.heliRotorMat.colorTexture.set(this.texture);
  this.heliRotorMat.texScale.set(1, 1);
  this.heliRotorMat.shininess.set(5.0);

  this.multMats = [];
  this.multMats.push(this.heliRotorMat);
  this.multMats.push(this.heliRotorMat);

  this.heliRotorMultiMesh = new MultiMesh(gl, 'json/heli/mainrotor.json', this.multMats);

  this.heliRotor = new GameObject2D(this.heliRotorMultiMesh);
  this.heliRotor.position.set(10, 12, 0);
  this.heliRotor.parent = this.heli;
  this.heliRotor.position.x = this.heli.position.x - 10;
  this.heliRotor.position.y = this.heli.position.y + 4;
  this.heliRotor.position.z = this.heli.position.y - 3;
  this.heliRotor.invMass = 1;
  this.heliRotor.invAngMass = 1;
  this.heliRotor.axis.set(0, this.heliRotor.position.y, 0);
  this.heliRotor.torque = 300;

  this.heliRotor.move = function(dt, gameObjects) {

    if(!hit) {
      if(this.torque < 300) {
       this.torque +=3;
     }
    } else {
      if(this.torque > 0) {
        this.torque -=3;
      } 
    }
    
      this.angularAcceleration = this.torque * this.invAngMass;
      this.angularVelocity += this.angularAcceleration * dt;
      this.angularVelocity *= Math.exp(-dt * 30/(this.invAngMass));
      this.orientation += this.angularVelocity * dt;

  };

    // BALLOON FOLLOW
  this.balloonFollowMat = new Material(gl, this.procNormProgram);
  this.balloonFollowMat.envmapTexture.set(this.skyCubeTexture);



  this.balloonFollowMultiMesh = new MultiMesh(gl, 'json/balloon.json', [this.balloonFollowMat]);



  this.balloonFollow = new GameObject2D(this.balloonFollowMultiMesh);
  this.balloonFollow.position.set(-80, 20, -80);
  this.balloonFollow.invMass = 1;
  this.balloonFollow.scale.set(.4, .4, .4);
  this.balloonFollow.boundingRadius = 4;


  var avatar = this.heli;
  var mom = this.slowpokeMom;

  this.balloonFollow.move = function(dt, gameObjects) {

    if(mom.frozen) {
      var dir = new Vec3();
      dir.x = avatar.position.x - this.position.x;
      dir.y = avatar.position.y - this.position.y;
      dir.z = avatar.position.z - this.position.z;

      this.force.x = dir.x * .1;
      this.force.y = dir.y * .1;
      this.force.z = dir.z * .1;

      this.acceleration.setScaled(this.force, this.invMass);
      this.velocity.addScaled(dt, this.acceleration);
      this.velocity.mul(Math.exp(-dt * 3 * this.invMass));
      this.position.addScaled(dt, this.velocity);
    }
    


  }

   this.balloonFollow.interactAvatar = function(avatar) {
      var dist = this.position.minus(avatar.position); //get distance squared
      var distt = Math.sqrt(Math.pow(dist.x, 2) +  Math.pow(dist.y, 2) +  Math.pow(dist.z, 2));
      var mind = this.boundingRadius + avatar.boundingRadius;
      if (distt < mind) {
            desc.innerHTML = 
              "You've hit the balloon! You've lost! Refresh to start again.";
            avatar.position.set(0, 0, 0);

         
      }
  }

   this.gameObjects.push(this.balloonFollow);
   this.gameObjects.push(this.balloonBumpy);
  this.gameObjects.push(this.tree);
  this.gameObjects.push(this.treeShadow);
  this.gameObjects.push(this.balloon);
  this.gameObjects.push(this.heli);
  this.gameObjects.push(this.heliRotor);
  this.gameObjects.push(this.back);


  this.slowpokeBabies.push(this.slowpokeTree);
  this.slowpokeBabies.push(this.slowpokeTreeShadow);
  this.slowpokeBabies.push(this.slowpoke);
  this.slowpokeBabies.push(this.slowpokeShadow);
  this.slowpokeBabies.push(this.slowpokeBalloon);

  setTimeout(function() {this.desc.innerHTML = "Bring the slowpokes back to their frozen mom to revive her. Avoid the balloon trying to stop you."}, 5000);
  setTimeout(function() {this.desc.innerHTML = ""}, 10000);


}

Scene.prototype.update = function(gl, keysPressed, desc) {

  gl.clearColor(.2, .1, .3, 1); // affects background color
  gl.clearDepth(1.0);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.enable(gl.BLEND);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);


  var timeAtThisFrame = new Date().getTime();
  var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;

  this.timeAtLastFrame = timeAtThisFrame;

  this.lightSources[0].direction.x = Math.cos(new Date().getTime()/1000) * 7;
  this.lightSources[0].direction.y = Math.sin(new Date().getTime()/1000) * 7;

  this.blueLight[1].direction.x = Math.cos(new Date().getTime()/1000) * 15;
  this.blueLight[1].direction.y = Math.sin(new Date().getTime()/1000) * 15;

  for (var i = this.gameObjects.length - 1; i >= 0; i--) {
   this.gameObjects[i].control(keysPressed);
   this.gameObjects[i].move(dt, this.gameObjects);
   this.gameObjects[i].updateModelTransformation();

  }

  for (var i = this.slowpokeBabies.length - 1; i >= 0; i--) {

    if(this.slowpokeMom.frozen) {
     this.slowpokeBabies[i].control(keysPressed);
     this.slowpokeBabies[i].move(dt, this.slowpokeBabies);
     this.slowpokeBabies[i].updateModelTransformation();
    } else {
      //set orientations and position toward mo
    }
  }
  this.camera.position = this.heli.cam.minus(this.camera.ahead.times(50));


  this.camera.move(dt,keysPressed);
  this.camera.updateProjMatrix();

  for (var i = this.gameObjects.length - 1; i >= 0; i--) {
    if(this.gameObjects[i].show) {
      this.gameObjects[i].draw(this.camera, this.lightSources);
    }

  }

  for (var i = this.slowpokeBabies.length - 1; i >= 0; i--) {
     if(this.slowpokeBabies[i].show) {
       this.slowpokeBabies[i].draw(this.camera, this.lightSources);
     }
  }

  if(!this.slowpokeMom.frozen) {
     this.slowpokeMomWin.control(keysPressed);
     this.slowpokeMomWin.updateModelTransformation();
     this.slowpokeMomWin.draw(this.camera, this.lightSources);

  } else {
     this.slowpokeMom.control(keysPressed);
     this.slowpokeMom.updateModelTransformation();
     this.slowpokeMom.draw(this.camera, this.blueLight);
  } 

}

