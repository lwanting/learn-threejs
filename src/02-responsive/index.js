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

// 检查渲染器的绘图缓冲区是否和canvas尺寸相同
// https://stackoverflow.com/questions/66835903/what-is-the-difference-between-canvas-width-and-canvas-clientwidth
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const isNeedResize = canvas.width !== width || canvas.heigth !== height;
  if (isNeedResize) {
    // 如果不同就重新设置渲染器的canvas尺寸
    renderer.setSize(width, height, false);
  }
  return isNeedResize;
}

function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    // 将相机的宽高比设置为canvas的宽高比,不论窗口是什么尺寸，都保持几何体比例正确
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

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