import { Entity } from ".";
import { DxfWriter, DxfDocument } from "..";

export class Circle extends Entity {
    constructor(doc: DxfDocument, public cx: number, public cy: number, public r: number, ownerHandle?: string) {
        super('CIRCLE', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbCircle');
        writer.writeGroup(10, this.cx);
        writer.writeGroup(20, this.cy);
        writer.writeGroup(40, this.r);
    }
}