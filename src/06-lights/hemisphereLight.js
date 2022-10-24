import * as THREE from 'three';
import { resizeRendererToDisplaySize, ColorGUIHelper } from '../utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

// 添加半球光
const skyColor = 0xB1E1FF;  // 天空颜色
const groundColor = 0xB97A20;  // 地面颜色
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

// 创建GUI
const gui = new GUI();
gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
gui.add(light, 'intensity', 0, 2, 0.01);


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