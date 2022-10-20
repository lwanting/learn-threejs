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
