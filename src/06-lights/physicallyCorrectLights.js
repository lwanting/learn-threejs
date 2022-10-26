import * as THREE from 'three';
import { resizeRendererToDisplaySize, ColorGUIHelper } from '../utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
// physicallyCorrectLights设置了离光源距离越远，光照越弱
// 影响PointLight / SpotLight / RectAreaLight
renderer.physicallyCorrectLights = true;

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
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
})
const planMesh = new THREE.Mesh(planeGeo, planeMat);
planMesh.rotation.x = Math.PI * 0.5;
scene.add(planMesh);

// 创建立方体
const cubeSize = 4;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
cubeMesh.position.set(cubeSize + 1, cubeSize / 2, 0);
scene.add(cubeMesh);

// 创建球体
const sphereRadius = 3;
const sphereGeo = new THREE.SphereGeometry(sphereRadius);
const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
scene.add(sphereMesh);

// 添加点光源
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.PointLight(color, intensity);
light.power = 800; // 单位流明
light.decay = 2;  // 沿着光照距离的衰减量，设置2为现实世界的光衰减
light.distance = Infinity;
light.position.set(0, 10, 0);
scene.add(light);

// 辅助对象帮助展示场景中的不可见对象（光照，相机）
const helper = new THREE.PointLightHelper(light);
scene.add(helper)

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);  // GUI分组
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
gui.add(light, 'decay', 0, 4, 0.01);
gui.add(light, 'power', 0, 2000);
makeXYZGUI(gui, light.position, 'position', updateLight);

function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    // 将相机的宽高比设置为canvas的宽高比,不论窗口是什么尺寸，都保持几何体比例正确
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);