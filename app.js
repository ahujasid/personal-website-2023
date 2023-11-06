// Three JS
window.addEventListener('load', init, false);
function init() {
  console.log('Init Functions');
  createWorld();
//   createLights();
  createGrid();
  // createGUI();
  createSkin();
  createLife();
}

var Theme = {
  _gray:0xFFFFFF,
  _dark:0xFFFFFF,   // Background
  _cont:0xFFFFFF,   // Lines
  _blue:0x000FFF,
  _red:0xF00000,    //
  _cyan:0x00FFFF,   // Material
  _white:0xF00589   // Lights
}

var scene, camera, renderer, container;
var _width, _height;
var _ambientLights, _lights, _rectAreaLight;
var _skin;

var mat;
var geo;
var groupMoon = new THREE.Object3D();

//--------------------------------------------------------------------
function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  //---
  scene = new THREE.Scene();
//   scene.fog = new THREE.Fog(Theme._dark, 150, 320);
  scene.background = new THREE.Color(Theme._dark);
  scene.add(groupMoon);
  //---
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,10,120);
  // camera.aspect = _height / _width;
  //---
  renderer = new THREE.WebGLRenderer({antialias:false, alpha:true});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;
  // renderer.setPixelRatio( window.devicePixelRatio, 2 );
  // camera.fov = Math.atan(_width / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;

  //---
  document.body.appendChild(renderer.domElement);
  //---
  window.addEventListener('resize', onWindowResize, false);
  console.log('Create world');
}
function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  // camera.fov = Math.atan(_width / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
}
//--------------------------------------------------------------------
function createLights() {
  _ambientLights = new THREE.HemisphereLight(Theme._cont, Theme._white, 1);
  _backlight = new THREE.PointLight(Theme._white, 1);
  _backlight.position.set(-5,-20,-20);
  //---
  _rectAreaLight = new THREE.RectAreaLight(Theme._white, 20, 3, 3);
  _rectAreaLight.position.set(0, 0, 2);
  //---
  _rectAreaLightHelper = new THREE.RectAreaLightHelper(_rectAreaLight);
  //---
  _frontlight = new THREE.PointLight(Theme._white, 2);
  _frontlight.position.set(20,10,0);
  //---
  scene.add(_backlight);
  scene.add(_ambientLights);
  scene.add(_rectAreaLight);
  scene.add(_frontlight);
  //scene.add(_rectAreaLightHelper);
  console.log('Create Lights');
}

var uniforms = {
  time: {
    type: "f",
    value: 0.0
  },
  RGBr: {
    type: "f",
    value: 0.0
  },
  RGBg: {
    type: "f",
    value: 0.0
  },
  RGBb: {
    type: "f",
    value: 0.0
  },
  RGBn: {
    type: "f",
    value: 0.0
  },
  RGBm: {
    type: "f",
    value: 0.0
  },
  morph: {
    type: 'f',
    value: 0.0
  },
  dnoise: {
    type: 'f',
    value: 0.0
  },
  psize: {
    type: 'f',
    value: 3.0
  }
}

var options = {
  perlin: {
    time: 4.0,
    morph: 2.0,
    dnoise: 2.5
  },
  chroma: {
    RGBr: 3.5,
    RGBg: 0.0,
    RGBb: 0.0,
    RGBn: 3.0,
    RGBm: 1.0
  },
  camera: {
    zoom: 150,
    speedY: 0.6,
    speedX: 0.0,
    guide: false
  },
  sphere: {
    wireframe: false,
    points: true,
    psize: 1.5
  }
}

function randomMoon() {
  
  //TweenMax.to(options.perlin, 1, {morph: Math.random() * 20});
  //TweenMax.to(options.perlin, 2, {time: 1 + Math.random() * 4});
  //TweenMax.to(options.perlin, 1, {dnoise: Math.random() * 100});
  
  TweenMax.to(options.chroma, 1, {RGBr: Math.random() * 10});
  TweenMax.to(options.chroma, 1, {RGBg: Math.random() * 10});
  TweenMax.to(options.chroma, 1, {RGBb: Math.random() * 10});
  
  TweenMax.to(options.chroma, 1, {RGBn: Math.random() * 2});
  TweenMax.to(options.chroma, 1, {RGBm: Math.random() * 5});
  
  /*options.perlin.time = 1;
  options.perlin.dnoise = 0;
  options.perlin.morph = 0;
  options.chroma.RGBr = Math.random() * 10;
  options.chroma.RGBg = Math.random() * 10;
  options.chroma.RGBb = Math.random() * 10;
  options.chroma.RGBn = Math.random() * 2;
  options.chroma.RGBm = Math.random() * 5;*/
  
}

function createGUI() {
  var gui = new dat.GUI();
  var camGUI = gui.addFolder('Camera');
  camGUI.add(options.camera, 'zoom', 50, 250).name('Zoom').listen();
  camGUI.add(options.camera, 'speedY', -1, 1).name('Speed Y').listen();
  camGUI.add(options.camera, 'speedX', 0, 1).name('Speed X').listen();
  camGUI.add(options.camera, 'guide', false).name('Guide').listen();
  //camGUI.open();
  //---
  var timeGUI = gui.addFolder('Setup');
  timeGUI.add(options.perlin, 'time', 0.0, 10.0).name('Speed').listen();
  timeGUI.add(options.perlin, 'morph', 0.0, 20.0).name('Morph').listen();
  timeGUI.add(options.perlin, 'dnoise', 0.0, 100.0).name('DNoise').listen();
  timeGUI.open();
  //---
  var rgbGUI = gui.addFolder('RGB');
  rgbGUI.add(options.chroma, 'RGBr', 0.0, 10.0).name('Red').listen();
  rgbGUI.add(options.chroma, 'RGBg', 0.0, 10.0).name('Green').listen();
  rgbGUI.add(options.chroma, 'RGBb', 0.0, 10.0).name('Blue').listen();
  rgbGUI.add(options.chroma, 'RGBn', 0.0, 3.0).name('Black').listen();
  rgbGUI.add(options.chroma, 'RGBm', 0.0, 1.0).name('Chroma').listen();
  rgbGUI.open();
  //---
  var wirGUI = gui.addFolder('Sphere');
  wirGUI.add(options.sphere, 'wireframe', true).name('Wireframe').listen();
  wirGUI.add(options.sphere, 'points', true).name('Points').listen();
  wirGUI.add(options.sphere, 'psize', 1.0, 10.0).name('Point Size').step(1);
  //wirGUI.open();
  console.log('Create GUI');
}

skinElement = function(geo_frag = 5) {
  var geo_size = 20;
  if (geo_frag>=5) geo_frag = 5;
  //---
  geo = new THREE.IcosahedronBufferGeometry(geo_size,geo_frag);
  //---
  mat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    //attributes: attributes,
    side:THREE.DoubleSide,
    vertexShader: document.getElementById( 'noiseVertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    wireframe:options.sphere.wireframe
  });
  this.point = new THREE.Points(geo, mat);
  //---
  this.mesh = new THREE.Mesh(geo, mat);
  this.mesh.geometry.verticesNeedUpdate = true;
  this.mesh.geometry.morphTargetsNeedUpdate = true;
//   this.mesh.reseivedShadow = true;
//   this.mesh.castShadow = true;
  //---
  groupMoon.add(this.point);
  groupMoon.add(this.mesh);
  //---
}
//---
function createSkin() {
  _skin = new skinElement();
  _skin.mesh.scale.set(1,1,1);
  scene.add(_skin.mesh);
}

var gridHelper;

function createGrid(_gridY = -20) {
  gridHelper = new THREE.GridHelper(200, 20, Theme._cont, Theme._gray);
  gridHelper.position.y = _gridY;
  scene.add(gridHelper);
}

//--------------------------------------------------------------------

var frame = Date.now();
//---
function createLife() {
  var time = Date.now();
  //---
  uniforms.time.value = (options.perlin.time / 10000) * (time - frame);
  uniforms.morph.value = (options.perlin.morph);
  uniforms.dnoise.value = (options.perlin.dnoise);
  //---
  TweenMax.to(camera.position, 2, {z:300-options.camera.zoom});
  //---
  _skin.mesh.rotation.y += options.camera.speedY/100;
  _skin.mesh.rotation.z += options.camera.speedX/100;
  //---
  _skin.point.rotation.y = _skin.mesh.rotation.y;
  _skin.point.rotation.z = _skin.mesh.rotation.z;
  gridHelper.rotation.y = _skin.mesh.rotation.y;
  //---
  mat.uniforms['RGBr'].value = options.chroma.RGBr/10;
  mat.uniforms['RGBg'].value = options.chroma.RGBg/10;
  mat.uniforms['RGBb'].value = options.chroma.RGBb/10;
  mat.uniforms['RGBn'].value = options.chroma.RGBn/50;
  mat.uniforms['RGBm'].value = options.chroma.RGBm;
  mat.uniforms['psize'].value = options.sphere.psize;
  //---
  gridHelper.visible = options.camera.guide;
  //---
  _skin.mesh.visible = !options.sphere.points;
  _skin.point.visible = options.sphere.points;
  //---
  mat.wireframe = options.sphere.wireframe;
  //---
  camera.lookAt(scene.position);
  //---
  requestAnimationFrame(createLife);
  renderer.render(scene, camera);
}
