import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';
import { resizeRendererToDisplaySize } from '../utils'

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas});

const fov = 40;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 120;

const scene = new THREE.Scene();

// light
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const loader = new FontLoader();
// promisify font loading
function loadFont(url) {
return new Promise((resolve, reject) => {
  loader.load(url, resolve, undefined, reject);
});
}

const parent = new THREE.Object3D();

async function doit(params) {
  const font = await loadFont('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json');  
  const geometry = new TextGeometry(`hello world, i'm lwt`, {
    font: font,
    size: 3.0,
    height: .2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: .3,
    bevelSegments: 5,
  });

  const material = new THREE.MeshPhongMaterial({
    color: 0x44aa88,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  geometry.computeBoundingBox();
  geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);
  parent.add(mesh);
  scene.add(parent);
}
doit()

function render(time) {
  if (resizeRendererToDisplaySize(renderer)) {
    // 将相机的宽高比设置为canvas的宽高比,不论窗口是什么尺寸，都保持几何体比例正确
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  time *= 0.001;
  parent.rotation.x = time;
  parent.rotation.y = time;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);