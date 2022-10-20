import * as THREE from 'three';
import { resizeRendererToDisplaySize } from '../utils';
import img from '../assets/img/cool.png'

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas});

const scene = new THREE.Scene();

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;


const loader = new THREE.TextureLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1);

// 使用一种纹理
// const material = new THREE.MeshBasicMaterial({ map: loader.load(img), side: 1 });

// 每一个面使用一种纹理
const materials = Array.from({ length: 6 }, (_, index) => {
  const material = new THREE.MeshBasicMaterial({ map: loader.load(`https://threejs.org/manual/examples/resources/images/flower-${index + 1}.jpg`) });
  return material;
})
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

function render(time) {
  if (resizeRendererToDisplaySize(renderer)) {
    // 将相机的宽高比设置为canvas的宽高比,不论窗口是什么尺寸，都保持几何体比例正确
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
