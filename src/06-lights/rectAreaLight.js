import * as THREE from 'three';
import { resizeRendererToDisplaySize, ColorGUIHelper, DegRadHelper } from '../utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import GUI from 'lil-gui';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });

const scene = new THREE.Scene();

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

// OrbitControls可以控制围绕某一个点旋转摄像机
// 传入两个参数：相机对象，检测事件的DOM元素
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);  // 设置观察点位置，摄像机的旋转中心
controls.update();  // 更新观察点位置


// RectAreaLight只能影响到 MeshStandardMaterial 和 MeshPhysicalMaterial
// 创建平面
const planeSize = 40;

const loader = new THREE.TextureLoader();
const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeat = planeSize / 2;
texture.repeat.set(repeat, repeat);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
})
const planMesh = new THREE.Mesh(planeGeo, planeMat);
planMesh.rotation.x = Math.PI * 0.5;
scene.add(planMesh);

// 创建立方体
const cubeSize = 4;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshStandardMaterial({ color: '#8AC' });
const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
scene.add(cubeMesh);

// 创建球体
const sphereRadius = 3;
const sphereGeo = new THREE.SphereGeometry(sphereRadius);
const sphereMat = new THREE.MeshStandardMaterial({ color: '#CA8' });
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
scene.add(sphereMesh);

// 添加矩形区域光
const color = 0xFFFFFF;
const intensity = 5;
const width = 12;
const height = 4;
const light = new THREE.RectAreaLight(color, intensity, width, height);
light.position.set(0, 10, 0);
light.rotation.x = THREE.MathUtils.degToRad(-90);
scene.add(light);

// 辅助对象帮助展示场景中的不可见对象（光照，相机）
const helper = new RectAreaLightHelper(light);
light.add(helper)

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).name(name).onChange(onChangeFn);
  folder.add(vector3, 'y',0, 10).name(name).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).name(name).onChange(onChangeFn);
}

// 更新函数
function updateLight() {
  helper.update();
}

// 创建GUI
const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
gui.add(light, 'intensity', 0, 10, 0.01);
gui.add(light, 'width', 0, 20);
gui.add(light, 'height', 0, 20);
gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation');
gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('x rotation');
gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('x rotation');
makeXYZGUI(gui, light.position, 'position');


function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    // 将相机的宽高比设置为canvas的宽高比,不论窗口是什么尺寸，都保持几何体比例正确
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  // 引入模块并初始化
  RectAreaLightUniformsLib.init();
  requestAnimationFrame(render);
}
requestAnimationFrame(render);