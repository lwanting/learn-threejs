import * as THREE from 'three';
import GUI from 'lil-gui'
import { resizeRendererToDisplaySize, DegRadHelper, StringToNumberHelper } from '../utils';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

const scene = new THREE.Scene();

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const loader = new THREE.TextureLoader();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const texture = loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 设置GUI
// options
const wrapModes = {
  'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
  'RepeatWrapping': THREE.RepeatWrapping,
  'MirroredRepeatWrapping': THREE.MirroredRepeatWrapping,
}
// texture属性发生变化时更新
function updateTexture() {
  texture.needsUpdate = true;
}
const gui = new GUI()
// add 参数 obj, valueName, options/min-max, step
gui.add(new StringToNumberHelper(texture, 'wrapS'), 'value', wrapModes)
  .name('texture.wrapS')
  .onChange(updateTexture);
gui.add(new StringToNumberHelper(texture, 'wrapT'), 'value', wrapModes)
  .name('texture.wrapT')
  .onChange(updateTexture);
gui.add(texture.repeat, 'x', 0, 5, 0.01).name('texture.repeat.x');
gui.add(texture.repeat, 'y', 0, 5, 0.01).name('texture.repeat.y');
gui.add(texture.offset, 'x', -2, 2, 0.01).name('texture.offset.x');
gui.add(texture.offset, 'y', -2, 2, 0.01).name('texture.offset.y');
gui.add(texture.center, 'x', -.5, 1.5, 0.01).name('texture.center.x');
gui.add(texture.center, 'y', -.5, 1.5, 0.01).name('texture.center.y');
gui.add(new DegRadHelper(texture, 'rotation'), 'value', -360, 360)
  .name('texture.rotation');

function render(time) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  time *= 0.001;
  cube.rotation.x = time;
  cube.rotation.y = time;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
