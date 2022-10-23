import * as THREE from 'three';

export function resizeRendererToDisplaySize(renderer) {
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

// 将gui获取到的角度deg转换为弧度rad
export class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}

// 将gui获取到的string转换为number
export class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }
  get value() {
    return this.obj[this.prop];
  }
  set value(v) {
    this.obj[this.prop] = parseFloat(v);
  }
}
