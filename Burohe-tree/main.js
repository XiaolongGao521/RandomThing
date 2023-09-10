import * as THREE from 'three';
import TileType from './tile-type';
import * as Tree from './tree'

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const scene = new THREE.Scene();

let tiles = Array.from({length: 15}, _ => new Array(15).fill(TileType.Log));

function tileTypeToMaterial(tileType){
    if (tileType === TileType.Trunk) {
        return new THREE.MeshBasicMaterial( { color: 0x553322 } )
    } else if (tileType === TileType.Leaf) {
        return new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    } else {
        return new THREE.MeshBasicMaterial( { color: 0x000000 } )
    }
}

function createCubeMesh(i, j) {
    const geometry = new THREE.BoxGeometry( 1, 1, 1 )
    const material = tileTypeToMaterial(TileType.Void)
    const mesh = new THREE.Mesh(geometry, material)
    const position = new THREE.Vector3(j, tiles.length - i, 0)
    mesh.position.copy(position)
    return mesh
}

let meshes = Array.from({length: 15}, _ => new Array(15).fill(null));

for (let i = 0; i < meshes.length; i++) {
    for(let j = 0; j < meshes[0].length; j++) {
        const mesh = createCubeMesh(i, j)
        scene.add(mesh)
        meshes[i][j] = mesh
    }
}

camera.position.x = 7
camera.position.y = 7
camera.position.z = 15
const lookAtVector = new THREE.Vector3( camera.position.x, camera.position.y, 0)
camera.lookAt(lookAtVector)

// tree logic

const clock = new THREE.Clock()
const treeOrigin = new THREE.Vector2(0, 7)
const treeHeightLimit = 15
const leafStartHeight = 5
const leafWidthLimit = 7
const tree = new Tree.Tree(treeOrigin, treeHeightLimit, leafStartHeight, leafWidthLimit)

function setTile(i, j, tileType) {
    tiles[tiles.length - i - 1][j] = tileType
    meshes[meshes.length - i - 1][j].material = tileTypeToMaterial(tiles[tiles.length - i - 1][j])
}

function update() {
    Tree.updateTree(tree, setTile, clock.getDelta())
}

function render() {
    requestAnimationFrame( animate )
	renderer.render( scene, camera )
}

function animate() {
	update()
    render()
}
animate()