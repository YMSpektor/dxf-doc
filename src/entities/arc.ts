import { Entity } from ".";
import { DxfDocument, DxfWriter } from "..";

export class Arc extends Entity {
    constructor(
        doc: DxfDocument,
        public cx: number,
        public cy: number,
        public r: number,
        public startAngle: number,
        public endAngle: number,
        ownerHandle?: string
    ) {
        super('ARC', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbCircle');
        writer.writeGroup(10, this.cx);
        writer.writeGroup(20, this.cy);
        writer.writeGroup(40, this.r);
        writer.writeGroup(100, 'AcDbArc');
        writer.writeGroup(50, this.startAngle);
        writer.writeGroup(51, this.endAngle);
    }
}