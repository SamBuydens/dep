
import {$} from '../helpers/util';
let OrbitControls = require('three-orbit-controls')(THREE);
let canvasHeight = window.innerHeight;
let canvasWidth = window.innerWidth;
let geometry, material, wireMaterial;
let camera;
//complete source =  https://github.com/citylims/scenesJS/blob/master/terrain/lib.js
const creationMyth = () => {
  let mainColor = "#25cecd";
  let canvasHeight = window.innerHeight;
  let canvasWidth = window.innerWidth;
  let loader = new THREE.TextureLoader();

  let scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(mainColor, 0.002);

  camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
  camera.lookAt(new THREE.Vector3(0, 100, 0));
  camera.position.set(0, 50, 400);

  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 300, 300);
  spotLight.intensity = 1;
  spotLight.castShadow = true;
  scene.add(spotLight);

   let spotLight2 = new THREE.SpotLight(0xfff);
  spotLight2.position.set(30, 200, -300);
  spotLight2.intensity = 1;
  spotLight2.castShadow = true;
  scene.add(spotLight2);

  let controls = new OrbitControls(camera);
  controls.damping = 0.2;
  controls.enabled = true;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = 1;
  controls.minDistance = 300;
  controls.maxDistance = 500;

  let renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(mainColor, 1);
  $('body').appendChild(renderer.domElement);


  const genesisDevice = () => {
    geometry = new THREE.PlaneGeometry(canvasWidth * 2, canvasHeight * 2, 128, 128);
    geometry.verticesNeedUpdate = true;
    material = new THREE.MeshLambertMaterial({
      color: mainColor
    });

    wireMaterial = new THREE.MeshLambertMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true
    })

    inception();
  };

const inception = () => {
      //plot terrain vertices

      for (let i = 0; i < geometry.vertices.length; i++) {
        if (i % 2 === 0 || i % 5 === 0 || i % 7 === 0) {
          let num = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
          geometry.vertices[i].z = Math.random() * num;
        }
      }
      //define terrain model
      let terrain = new THREE.Mesh(geometry, material);
      let wire = new THREE.Mesh(geometry, wireMaterial);

      terrain.rotation.x = -Math.PI / 2;
      terrain.position.y = -20;
      wire.rotation.x =  -Math.PI / 2;
      wire.position.y = -19.8;

      terrain.recieveShadow = true;
      terrain.castShadow = true;

      scene.add(terrain, wire);

      return this;
    };

  //sky cube
  let skyGeometry = new THREE.CubeGeometry(1024, 1024, 1024);
  let skyArray = [];
  for (let i = 0; i < 6; i++) {
    skyArray.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture("http://i.imgur.com/IXZhbHa.jpg"),
      side: THREE.BackSide
    }));
  }
  let skyMaterial = new THREE.MeshFaceMaterial(skyArray);
  let skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skyBox)

  let terrain = genesisDevice();

  let render = function() {
      requestAnimationFrame(render);
      animation();
      renderer.render(scene, camera);
    }
    //animations
  function animation() {


    for (let i = 0; i < geometry.vertices.length; i++) {
        let bool = Boolean(Math.floor(Math.random() * 2));

        if(bool) geometry.vertices[i].z += Math.random();
        if(!bool) geometry.vertices[i].z -= Math.random();


    }

            geometry.computeFaceNormals();
        geometry.verticesNeedUpdate = true;
  }

  render();
}

const changeCamera = (facePosition) => {
    let ypos = (facePosition.y - camera.position.y)*0.4
    let xpos = (facePosition.x - camera.position.x)*0.4
    camera.position.set(-xpos, -ypos + 20, 0)

};

module.exports = {creationMyth, changeCamera}
