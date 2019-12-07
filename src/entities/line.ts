import { Entity } from ".";
import { DxfWriter, DxfDocument } from "..";

export class Line extends Entity {
    constructor(doc: DxfDocument, public x1: number, public y1: number, public x2: number, public y2: number, ownerHandle?: string) {
        super('LINE', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbLine');
        writer.writeGroup(10, this.x1);
        writer.writeGroup(20, this.y1);
        writer.writeGroup(11, this.x2);
        writer.writeGroup(21, this.y2);
    }
}