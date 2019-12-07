import { Entity } from ".";
import { DxfWriter, DxfDocument } from "..";

export enum TEXT_ALIGN {
    LEFT,
    CENTER1,
    RIGHT,
    ALIGNED,
    MIDDLE,
    FIT
}

export enum TEXT_VERTICAL_ALIGN {
    BASELINE,
    BOTTOM,
    MIDDLE,
    TOP
}

export class Text extends Entity {
    style?: string;

    constructor(
        doc: DxfDocument,
        public text: string,
        public height: number,
        public alignPoint: [number, number],
        public align?: TEXT_ALIGN,
        public secondAlignPoint?: [number, number],
        public valign?: TEXT_VERTICAL_ALIGN,
        public rotation?: number,
        ownerHandle?: string
    ) {
        super('TEXT', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbText');
        if (this.style) {
            writer.writeGroup(7, this.style);
        }
        writer.writeGroup(10, this.alignPoint[0]);
        writer.writeGroup(20, this.alignPoint[1]);
        writer.writeGroup(40, this.height);
        writer.writeGroup(1, this.text);
        if (this.rotation) {
            writer.writeGroup(50, this.rotation);
        }
        if (this.style) {
            writer.writeGroup(7, this.style);
        }
        if (this.align) {
            writer.writeGroup(72, this.align);
        }
        if (this.secondAlignPoint) {
            writer.writeGroup(11, this.secondAlignPoint[0]);
            writer.writeGroup(21, this.secondAlignPoint[1]);
        }
        writer.writeGroup(100, 'AcDbText');
        if (this.valign) {
            writer.writeGroup(73, this.valign);
        }
    }
}