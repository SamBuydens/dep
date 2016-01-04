'use strict';

let container;
let camera, scene, renderer;
let mouseX = 0, mouseY = 0;

//import {$} from '../helpers/util';

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let speedStep = 2;

let gridbuilder = require('./graphix/gridbuilder');
let Pointcloud = require('./graphix/Pointcloud');
let postProcessor = require('./postProcessor');
let showEffects = false;
let EventEmitter = require('eventemitter2');
let emitter = new EventEmitter({maxListeners: 1});

let effect;
let isMobile = false;

const init = () => {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 200, window.innerWidth / window.innerHeight, 20, 250 );
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x0FFFFF, 0.007 );

  //timed event

  makeGrids();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0x000000, 1 );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  makeVr();
  //postprocessing
  postProcessor.init(renderer, scene, camera);

  //

  window.addEventListener( 'resize', onWindowResize, false );
};


//input interactions//////////////////////////////////////

const onWindowResize = () => {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

};

const onDocumentMouseMove = (event) => {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

};

const onDocumentTouchStart = (event) => {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

};

const onDocumentTouchMove = (event) => {

  if ( event.touches.length === 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
};

const makeGrids = () => {

  gridbuilder.render().forEach((value)=>{
    scene.add(value);
  });

};

const setOrientationControls = (e) => {

  if (!e.alpha) {

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  } else {

    effect = new THREE.StereoEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    isMobile = true;
    gyro.frequency = 10;
    gyro.startTracking((o) => {

      camera.position.x += o.y;

    });
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }

  animate();
};

const fullscreen = () => {

  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }

};

const makeVr = () =>{
  window.addEventListener('deviceorientation', setOrientationControls, true);
};

//redrawing and rendering//////////////////////////////////////////

const redrawSound = (track) => {
  if(!track){

   for (var i = 0; i < scene.children.length; i++ ) {

    var object = scene.children[ i ];

    if( object instanceof THREE.Points ) {
      scene.remove(object);
    }
  }
    return;
  }

  let pc = new Pointcloud(track);

  let existingChild = scene.children.find((c) => {
    return c.name === pc.name;
  });

  if(existingChild && !existingChild.singleSound){
    scene.remove(existingChild);
  }

  scene.add(pc);

};

const playSingleSound = (sound) => {

  let pc = new Pointcloud(sound);
  scene.add(pc);

  setTimeout(()=>{
    scene.remove(pc);
  }, sound.track[0].decay);
};

const animate = () => {

  requestAnimationFrame( animate );

  render();

};

const render = () => {

  var time = Date.now() * 0.00005;


  if(Math.abs(camera.position.x + ((mouseX - camera.position.x)) * 0.02) < windowHalfX/3){
    camera.position.x += ((mouseX - camera.position.x)) * 0.02;
  }

  camera.position.y = -200;
  camera.position.z -= speedStep;



  //changes during renders//////////////////////////////////


  for (var i = 0; i < scene.children.length; i++ ) {

    var object = scene.children[ i ];

    if( object instanceof THREE.Points ) {
      object.position.z = camera.position.z;

      object.rotation.y = time * ( i < 4 ? i + object.decay : -( i+ 1 ) );
      //object.rotation.y = time * (particle.freq/10);

      object.update();
    }

    if( object instanceof THREE.GridHelper ){
      if(camera.position.z %250 === 0) object.position.z = -250 + camera.position.z;
    }

  }

  if(isMobile) effect.render(scene, camera);
  if(showEffects) postProcessor.composer().render( scene, camera );
  else renderer.render(scene, camera);

};

module.exports = {init, playSingleSound, emitter, redrawSound, camera, renderer};
