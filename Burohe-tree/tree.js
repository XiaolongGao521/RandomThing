import * as THREE from 'three';
import TileType from './tile-type';

export class Tree {
    constructor (treeOrigin, treeHeightLimit, leafStartHeight, leafWidthLimit) {
        this.treeOrigin = treeOrigin
        this.treeHeightLimit = treeHeightLimit
        this.leafStartHeight = leafStartHeight
        this.leafWidthLimit = leafWidthLimit
        this.trunks = []
        this.trunkGrowthTimer = 0
    }
    
    getTrunkTileCoordinate(trunk) {
        return this.treeOrigin.clone().add(new THREE.Vector2(trunk.trunkHeight, 0))
    }

    getLeafTileCoordinate(trunk, leaf) {
        return this.treeOrigin.clone().add(new THREE.Vector2(trunk.trunkHeight, leaf.leftFacing ? -leaf.distanceToTrunk : leaf.distanceToTrunk))
    }
}

export class Trunk {
    constructor (trunkHeight) {
        this.trunkHeight = trunkHeight
        this.leftLeaves = []
        this.rightLeaves = []
        this.leftLeavesGrowthTimer = 0
        this.rightLeavesGrowthTimer = 0
    }
}

export class Leaf {
    constructor (leftFacing, distanceToTrunk) {
        this.leftFacing = leftFacing
        this.distanceToTrunk = distanceToTrunk
    }
}

function updateLeftLeaves(tree, trunk, tileSetter, delta) {
    trunk.leftLeavesGrowthTimer += delta

    if (trunk.leftLeaves[trunk.leftLeaves.length - 1] &&
        trunk.leftLeaves[trunk.leftLeaves.length - 1].distanceToTrunk == tree.leafWidthLimit - 1) {
        return
    }

    if (trunk.leftLeavesGrowthTimer > 1) {
        trunk.leftLeaves.push(new Leaf(true, trunk.leftLeaves.length + 1))
        const leafTileCoordinate = tree.getLeafTileCoordinate(trunk, trunk.leftLeaves[trunk.leftLeaves.length - 1])
        tileSetter(leafTileCoordinate.x, leafTileCoordinate.y, TileType.Leaf)
        trunk.leftLeavesGrowthTimer = 0
    }
}

function updateRightLeaves(tree, trunk, tileSetter, delta) {
    trunk.rightLeavesGrowthTimer += delta

    if (trunk.rightLeaves[trunk.rightLeaves.length - 1] &&
        trunk.rightLeaves[trunk.rightLeaves.length - 1].distanceToTrunk == tree.leafWidthLimit - 1) {
        return
    }

    if (trunk.rightLeavesGrowthTimer > 1) {
        trunk.rightLeaves.push(new Leaf(false, trunk.rightLeaves.length + 1))
        const leafTileCoordinate = tree.getLeafTileCoordinate(trunk, trunk.rightLeaves[trunk.rightLeaves.length - 1])
        tileSetter(leafTileCoordinate.x, leafTileCoordinate.y, TileType.Leaf)
        trunk.rightLeavesGrowthTimer = 0
    }
}

function updateLeaves(tree, trunk, tileSetter, delta) {
    if (trunk.trunkHeight < tree.leafStartHeight) {
        return
    }
    updateLeftLeaves(tree, trunk, tileSetter, delta)
    updateRightLeaves(tree, trunk, tileSetter, delta)
}

function updateTrunk(tree, tileSetter, delta) {
    tree.trunkGrowthTimer += delta

    if (tree.trunks[tree.trunks.length - 1] &&
        tree.trunks[tree.trunks.length - 1].trunkHeight == tree.treeHeightLimit - 1) {
        return
    }

    if (tree.trunkGrowthTimer > 1) {
        tree.trunks.push(new Trunk(tree.trunks.length))
        const trunkTileCoordinate = tree.getTrunkTileCoordinate(tree.trunks[tree.trunks.length - 1])
        tileSetter(trunkTileCoordinate.x, trunkTileCoordinate.y, TileType.Trunk)
        tree.trunkGrowthTimer = 0
    }
}

export function updateTree(tree, tileSetter, delta) {
    updateTrunk(tree, tileSetter, delta)
    tree.trunks.forEach(trunk => {updateLeaves(tree, trunk, tileSetter, delta)})
}