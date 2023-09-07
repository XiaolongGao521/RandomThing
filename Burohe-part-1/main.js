import * as THREE from 'three';
import Block from './block.js';
import { getZeroVector } from './utils.js';
import { createNoise2D } from 'simplex-noise';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const scene = new THREE.Scene();

const noise2D = createNoise2D();

for (let i = -50; i < 50; i++)
{
    let y = Math.floor(5*noise2D(i/20, 1)+5)
    console.log(y)
    for (let j = y; j > -30; j--)
    {
        if (j > 0 || noise2D(i/20, j) > 0)
        {
            const block = new Block(
                new THREE.BoxGeometry( 1, 1, 1 ),
                new THREE.MeshBasicMaterial( { color: j == y ? 0x00ff00 : 0x553322 } ),
                new THREE.Vector3(i, j, 0)
            );
            scene.add( block.getMesh() );
        }
    }
}

camera.position.y = 5;
camera.position.z = 40;
camera.lookAt(getZeroVector())

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();