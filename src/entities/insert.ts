import { Entity } from ".";
import { DxfDocument, DxfWriter } from "..";

export class Insert extends Entity {
    constructor(
        doc: DxfDocument,
        public blockName: string,
        public x: number,
        public y: number,
        public rotation: number = 0,
        public scaleX: number = 1,
        public scaleY: number = 1,
        public scaleZ: number = 1,
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

