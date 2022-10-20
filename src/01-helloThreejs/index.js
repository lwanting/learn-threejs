import * as THREE from 'three';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas})

// perspective camera
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// scene
const scene = new THREE.Scene();

// boxGeometry
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// material
// const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
// const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // 受光影响的材质

// mesh = geometry + material
// const cube = new THREE.Mesh(boxGeometry, material);

// light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});  // 受光影响的材质
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  return cube;
}
// cubes
const cubes = [
  makeInstance(boxGeometry, 0x44aa88, 0),
  makeInstance(boxGeometry, 0x8844aa, -2),
  makeInstance(boxGeometry, 0xaa8844, 2),
]

function render(time) {
  time *= 0.001;
  cubes.forEach((cube, index) => {
    const speed = 1 + index * 0.1;
    const rotationTime = time * speed;
    cube.rotation.x = rotationTime;
    cube.rotation.y = rotationTime;
  })

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
