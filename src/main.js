import './style.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("#scene");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(4, 3, 6);
camera.lookAt(0,1,0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.update();


// LIGHTS
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,5);
scene.add(light);


// GROUP (burger container)
const burger = new THREE.Group();
scene.add(burger);


// helper to create ingredients
function createIngredient(radius, height, color, y){
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = new THREE.MeshStandardMaterial({ color });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;

    burger.add(mesh);
}


// bottom bun
createIngredient(2.2, 0.6, "#d4a373", 0);

// patty
createIngredient(2.0, 0.4, "#5a3a1b", 0.5);

// cheese
createIngredient(2.1, 0.12, "#ffcc33", 0.75);

// tomato
createIngredient(1.9, 0.18, "#e63946", 0.95);

// lettuce
createIngredient(2.3, 0.25, "#3a5a40", 1.15);

// top bun
createIngredient(2.2, 0.7, "#d4a373", 1.55);


// animation
function animate(){
    requestAnimationFrame(animate);

    burger.rotation.y += 0.01;
    controls.update();

    renderer.render(scene,camera);
}

animate();


// resize
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


document.querySelector('#app').innerHTML = `
<div>
    
</div>
`
