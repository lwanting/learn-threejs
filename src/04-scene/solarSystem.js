import * as THREE from 'three';
import { resizeRendererToDisplaySize } from '../utils';

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({canvas});

const fov = 40;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.PointLight(color, intensity);
scene.add(light);

// 更新旋转角度的对象列表
const objects = [];

// 创建可多次服用的球体
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// 创建太阳
const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
objects.push(sunMesh);

// 创建地球
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244,
})
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
objects.push(earthMesh);

// 创建月球
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222,
})
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);

// 创建一个3d空间，包含月球
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
moonOrbit.add(moonMesh);
objects.push(moonOrbit);

// 创建一个3d空间，包含地球和月球空间
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
earthOrbit.add(earthMesh);
earthOrbit.add(moonOrbit);
objects.push(earthOrbit);

// 创建一个3d空间，包含太阳和地球-月球空间
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
solarSystem.add(sunMesh);
solarSystem.add(earthOrbit);
objects.push(solarSystem);

function render(time) {
  time *= 0.0005;
  if (resizeRendererToDisplaySize(renderer)) {
    // 将相机的宽高比设置为canvas的宽高比,不论窗口是什么尺寸，都保持几何体比例正确
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  objects.forEach(node => {
    node.rotation.y = time;
    // 显示坐标轴
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    node.add(axes);
  })
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);