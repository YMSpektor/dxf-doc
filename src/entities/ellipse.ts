import { Entity } from ".";
import { DxfDocument, DxfWriter } from "..";

export class Ellipse extends Entity {
    constructor(
        doc: DxfDocument,
        public cx: number,
        public cy: number,
        public majorAxisDx: number,
        public majorAxisDy: number,
        public axisRatio: number,
        public startAngle = 0,
        public endAngle = 360,
        ownerHandle?: string
    ) {
        super('ELLIPSE', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbEllipse');
        writer.writeGroup(10, this.cx);
        writer.writeGroup(20, this.cy);
        writer.writeGroup(11, this.majorAxisDx);
        writer.writeGroup(21, this.majorAxisDy);
        writer.writeGroup(40, this.axisRatio);
        writer.writeGroup(41, this.startAngle * Math.PI / 180);
        writer.writeGroup(42, this.endAngle * Math.PI / 180);
    }
}