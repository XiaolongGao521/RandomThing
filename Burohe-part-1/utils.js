import * as THREE from 'three';

const zeroVector = new THREE.Vector3( 0, 0, 0);

const getZeroVector = () => {
    return zeroVector.clone();
}

export { getZeroVector }