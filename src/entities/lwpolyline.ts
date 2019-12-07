import { Entity } from ".";
import { DxfWriter, DxfDocument } from "..";

export class LwPolyline extends Entity {
    constructor(doc: DxfDocument, public points: [number, number][], public isClosed: boolean, ownerHandle?: string) {
        super('LWPOLYLINE', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbPolyline');
        writer.writeGroup(90, this.points.length);
        writer.writeGroup(70, this.isClosed ? 1 : 0);
        this.points.forEach(p => {
            writer.writeGroup(10, p[0]);
            writer.writeGroup(20, p[1]);
        });
    }
}