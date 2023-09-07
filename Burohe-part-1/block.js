import * as THREE from 'three';
class Block {
    constructor(geometry, material, position) {
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.position.copy(position);
    }
    getMesh() {
        return this.mesh;
    }
} 

export default Block