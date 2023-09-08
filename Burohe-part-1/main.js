import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import TileType from './tile-type';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const scene = new THREE.Scene();

let tiles = Array.from({length: 60}, _ => new Array(120).fill(TileType.Void));
console.log(tiles)

function tileTypeToMaterial(tileType){
    if (tileType === TileType.Dirt) {
        return new THREE.MeshBasicMaterial( { color: 0x553322 } )
    } else if (tileType === TileType.Grass) {
        return new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    } else if (tileType === TileType.Stone) {
        return new THREE.MeshBasicMaterial( { color: 0x888888 } )
    } else if (tileType === TileType.Iron) {
        return new THREE.MeshBasicMaterial( { color: 0xff5500 } )
    } else {
        throw "void material not supported"
    }
}

// terrain pass 
const terrainNoise = createNoise2D();
const amplitude = 5
const offsetY = 5
const terrainSmoothness = 20

for (let j = 0; j < tiles[0].length; j++) {
    let y = Math.round(amplitude*terrainNoise(j/terrainSmoothness, 0)+offsetY)
    for (let i = y; i < tiles.length; i++) {
        tiles[i][j] = i === y ? TileType.Grass : TileType.Dirt
    }
}

// cave pass
const caveNoise = createNoise2D();
const caveSmoothness = 25
const stoneMaxHeight = 30
const caveMaxHeight = 15

for (let j = 0; j < tiles[0].length; j++) {
    for (let i = caveMaxHeight; i < tiles.length; i++) {
        tiles[i][j] = Math.round((caveNoise(j/caveSmoothness, i)+1)/2) == 0 ? 
        TileType.Void : (i >= stoneMaxHeight ? TileType.Stone : tiles[i][j])
    }
}

// iron pass
const ironNoise = createNoise2D();
const ironSmoothness = 10
const ironMaxHeight = stoneMaxHeight

for (let j = 0; j < tiles[0].length; j++) {
    for (let i = caveMaxHeight; i < tiles.length; i++) {
        tiles[i][j] = Math.round((ironNoise(j/ironSmoothness, i)+2)/3) == 0 && tiles[i][j] !== TileType.Void && i >= ironMaxHeight ? 
        TileType.Iron : tiles[i][j]
    }
}

// create mesh
for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles[0].length; j++) {
        if (tiles[i][j] != TileType.Void) {
            let geometry = new THREE.BoxGeometry( 1, 1, 1 )
            let material = tileTypeToMaterial(tiles[i][j])
            let position = new THREE.Vector3(j, tiles.length - i, 0)
            
            let mesh = new THREE.Mesh(geometry, material)
            mesh.position.copy(position)

            scene.add( mesh )
        }
    }
}

camera.position.x = 60
camera.position.y = 30
camera.position.z = 50

const lookAtVector = new THREE.Vector3( camera.position.x, camera.position.y, 0);

camera.lookAt(lookAtVector)

function animate() {
	requestAnimationFrame( animate )
	renderer.render( scene, camera )
}
animate()