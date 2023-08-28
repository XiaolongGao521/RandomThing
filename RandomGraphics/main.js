import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const scene = new THREE.Scene();
const loader = new GLTFLoader();

loader.load( 'models/megumin.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const zero = new THREE.Vector3();
const offset = new THREE.Vector3();
const distance = 150;
const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );

    const time = clock.getElapsedTime();

    offset.x = distance * Math.sin( time );
    offset.z = distance * Math.cos( time );

    camera.position.copy( zero ).add( offset );
    camera.lookAt( zero );

	renderer.render( scene, camera );
}

animate();