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

function createTopBun(radius, height, color, yBottom) {
    const baseHeight = Math.min(0.2, height * 0.3);
    const domeHeight = height - baseHeight;
    const material = new THREE.MeshStandardMaterial({ color });
    const group = new THREE.Group();

    const baseGeometry = new THREE.CylinderGeometry(radius, radius, baseHeight, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, material);
    baseMesh.position.y = yBottom + baseHeight / 2;
    group.add(baseMesh);

    const domeGeometry = new THREE.SphereGeometry(
        radius,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
    );
    domeGeometry.scale(1, domeHeight / radius, 1);
    const domeMesh = new THREE.Mesh(domeGeometry, material);
    domeMesh.position.y = yBottom + baseHeight;
    group.add(domeMesh);

    const seedGeometry = new THREE.SphereGeometry(0.06, 8, 6);
    seedGeometry.scale(1, 0.5, 1.8);
    const seedMaterial = new THREE.MeshStandardMaterial({ color: "#f5deb3" });

    for (let i = 0; i < 35; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI / 3);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = domeHeight * Math.cos(phi);

        const seed = new THREE.Mesh(seedGeometry, seedMaterial);
        seed.position.set(x, yBottom + baseHeight + y, z);
        seed.rotation.set(
            Math.random() * 0.6,
            Math.random() * Math.PI,
            Math.random() * 0.6
        );

        group.add(seed);
    }

    burger.add(group);
}

let stackY = 0;
const addFlat = (radius, height, color) => {
    const y = stackY + height / 2;
    createIngredient(radius, height, color, y);
    stackY += height;
};
const addTopBun = (radius, height, color) => {
    createTopBun(radius, height, color, stackY);
    stackY += height;
};

// bottom bun
addFlat(2.2, 0.4, "#d4a373");

// patty
addFlat(2.0, 0.4, "#5a3a1b");

// cheese
addFlat(2.1, 0.12, "#ffcc33");

// tomato
addFlat(1.9, 0.18, "#e63946");

// lettuce
addFlat(2.3, 0.25, "#3a5a40");

// top bun
addTopBun(2.2, 0.7, "#d4a373");


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
