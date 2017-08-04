// var keysPressed = {};

// App constructor
var App = function(canvas, overlay, desc) {

	// set a pointer to our canvas
	this.canvas = canvas;
	this.overlay = overlay;
	this.desc = desc;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		console.log( ">>> Browser does not support WebGL <<<" );
		return;
	}
	this.gl.pendingResources = {};

	// create a simple scene
	this.scene = new Scene(this.gl, this.desc);
	this.keysPressed = {};
	// document.onkeydown = function(event) {
	// 	keysPressed[keyboardMap[event.keyCode]] = true;

	// };
	// document.onkeyup = function(event) {
	// 	keysPressed[keyboardMap[event.keyCode]] = false;
	//  };

	this.resize();
};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function(){
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	this.scene.camera.setAspectRatio(this.canvas.clientWidth/this.canvas.clientHeight);	
};


App.prototype.registerEventHandlers = function() {
	var theApp = this;
	document.onkeydown = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
	};
	document.onkeyup = function(event) {
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;
	};
	this.canvas.onmousedown = function(event) {

  		theApp.scene.camera.mouseDown();
		//jshint unused:false
		//theApp.scene.mouseDown(event);
	};
	this.canvas.onmousemove = function(event) {
		//jshint unused:false
		event.stopPropagation();
		theApp.scene.camera.mouseMove(event);
		//theApp.scene.mouseMove(event);
	};
	this.canvas.onmouseout = function(event) {
		//jshint unused:false
		//theApp.scene.mouseUp(event);
	};
	this.canvas.onmouseup = function(event) {
		theApp.scene.camera.mouseUp();
		//jshint unused:false
		//theApp.scene.mouseUp(event);
	};
	window.addEventListener('resize', function() {
		theApp.resize();
		//theApp.scene.resize(theApp.canvas);
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});		
};

// animation frame update
App.prototype.update = function() {

	var pendingResourceNames = Object.keys(this.gl.pendingResources);
	if(pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed, this.desc);
		this.overlay.innerHTML = "Ready.";
	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	var theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});	
};

// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	var overlay = document.getElementById("overlay");
	var desc = document.getElementById("desc");


	overlay.innerHTML = "WebGL";
	desc.innerHTML = " Evil balloons have misplaced three baby slowpokes!";


	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;

	var app = new App(canvas, overlay, desc);
	app.registerEventHandlers();
});
