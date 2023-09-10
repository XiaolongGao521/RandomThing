import { Enumify } from "enumify"

class TileType extends Enumify {
    static Void = new TileType()
    static Trunk = new TileType()
    static Leaf = new TileType()
    static _ = this.closeEnum()
}

export default TileType