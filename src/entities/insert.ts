import { Entity } from ".";
import { DxfDocument, DxfWriter } from "..";

export class Insert extends Entity {
    constructor(
        doc: DxfDocument,
        public blockName: string,
        public x: number,
        public y: number,
        public scaleX: number = 1,
        public scaleY: number = 1,
        public scaleZ: number = 1,
        public rotation: number = 0,
        ownerHandle?: string
    ) {
        super('INSERT', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbBlockReference');
        writer.writeGroup(2, this.blockName);
        writer.writeGroup(10, this.x);
        writer.writeGroup(20, this.y);
        writer.writeGroup(41, this.scaleX);
        writer.writeGroup(42, this.scaleY);
        writer.writeGroup(43, this.scaleZ);
        writer.writeGroup(50, this.rotation);

    }
}

// 70
// Column count (optional; default = 1)
// 71
// Row count (optional; default = 1)
// 44
// Column spacing (optional; default = 0)
// 45
// Row spacing (optional; default = 0)
// 210
// Extrusion direction (optional; default = 0, 0, 1)
// DXF: X value; APP: 3D vector
