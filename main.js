import * as THREE from 'three';
import THREEx from 'threex.domevents';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

let isRotating = false;

THREE.Object3D.prototype.rotateAroundWorldAxis = (function () {
  // rotate object around axis in world space (the axis passes through point)
  // axis is assumed to be normalized
  // assumes object does not have a rotated parent

  var q = new THREE.Quaternion();

  return function rotateAroundWorldAxis(point, axis, angle) {
    q.setFromAxisAngle(axis, angle);

    this.applyQuaternion(q);

    this.position.sub(point);
    this.position.applyQuaternion(q);
    this.position.add(point);

    return this;
  };
})();

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(200));

let element = document.getElementById('app');

let width = window.innerWidth;
let height = window.innerHeight;
console.log(width);
console.log(height);
const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);

const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
let text = document.createElement('h1');
text.style.color = '#ff0000';
text.appendChild(document.createTextNode('Hello'));
document.getElementById('app').appendChild(renderer.domElement);
document.querySelector('canvas').appendChild(text);

// let cube = [];

// console.log(geometry);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff00ff,
// });
// cubeGeometry.translate(0, 0, 0);
const cubeMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }), //RIGHT
  new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }), //LEFT
  new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }), //TOP
  new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.DoubleSide }), //BOTTOM
  new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }), //FRONT
  new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide }), //BACK
];
const cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);

const group = new THREE.Group();

const cubeGap = 0.08;
for (let i = -(1 + cubeGap); i < 2; i += 1 + cubeGap) {
  for (let j = -(1 + cubeGap); j < 2; j += 1 + cubeGap) {
    for (let k = -(1 + cubeGap); k < 2; k += 1 + cubeGap) {
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

      const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cubeMesh.position.set(i, j, k);

      const edgeGeometry = new THREE.EdgesGeometry(cubeMesh.geometry); // or WireframeGeometry
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1,
      });
      let edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      cubeMesh.add(edges);

      group.add(cubeMesh);
    }
  }
}

scene.add(group);
camera.lookAt(group);

const distance = 7;
camera.position.x = distance;
camera.position.y = distance;
camera.position.z = distance;
camera.lookAt(scene);

console.log(group);
console.log(group.children[0]);
console.log(group.children[26]);
console.log(scene);

// group.children.forEach((cube) => {
//   if (cube.position['z'] === -1.08) {
//     var p = new THREE.Vector3(0, 0, 0);
//     var ax = new THREE.Vector3(0, 0, 1);
//     cube.rotateAroundWorldAxis(p, ax, (45 * Math.PI) / 180);
//   }
// });

function animate() {
  // group.children[26].rotateX(0.01);
  // group.rotation.x += 0.01;
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
// let a = 0;
// let refreshIntervalId = setInterval(() => {
//   a++;
//   group.children.forEach((cube) => {
//     if (cube.position['z'] === -1.08) {
//       var p = new THREE.Vector3(0, 0, 0);
//       var ax = new THREE.Vector3(0, 0, 1);
//       cube.rotateAroundWorldAxis(p, ax, (1 * Math.PI) / 180);
//     }
//   });
//   if (a >= 90) {
//     clearInterval(refreshIntervalId);
//   }
// }, 10);

const rotateFace = (group, faceCoordinate, faceIndex, reverse = false) => {
  let a = 0;
  let axis = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1],
  };
  reverse = Boolean(reverse);
  if (reverse === true) {
    axis[faceCoordinate] = axis[faceCoordinate].map((el) => el * -1);
  }
  console.log(reverse);
  isRotating = true;

  var p = new THREE.Vector3(0, 0, 0);
  var ax = new THREE.Vector3(...axis[faceCoordinate]);
  let refreshIntervalId = setInterval(() => {
    a++;
    group.children.forEach((cube) => {
      if (cube.position[faceCoordinate] === faceIndex) {
        cube.rotateAroundWorldAxis(p, ax, (1 * Math.PI) / 180);
      }
    });
    if (a >= 90) {
      clearInterval(refreshIntervalId);
    }
  }, 10);
  isRotating = true;
};

// rotateFace(group, 'x', -1.08, true);
// rotateFace(group, 'z', -1.08, true);

// document.getElementById('x-1rotate').addEventListener('click', (e) => {
//   e.preventDefault();
//   rotateFace(group, 'x', -1.08);
// });

const options = document.querySelectorAll('a');

options.forEach((option) => {
  const faceCoordinate = option.getAttribute('faceCoordinate');
  const faceIndex = Number(option.getAttribute('faceIndex'));
  const reverse = option.getAttribute('reverse');
  option.addEventListener('click', (e) => {
    e.preventDefault();
    rotateFace(group, faceCoordinate, faceIndex, reverse);
  });
});
