import { Enumify } from "enumify"

class TileType extends Enumify {
    static Void = new TileType()
    static Grass = new TileType()
    static Dirt = new TileType()
    static Stone = new TileType()
    static Iron = new TileType()
    static _ = this.closeEnum()
}

export default TileType