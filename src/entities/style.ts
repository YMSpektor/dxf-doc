import { TableRecord } from "./table";
import { DxfWriter } from "..";

export class Style extends TableRecord {
    public static STANDARD = 'Standard';
    public static FONT_DEFAULT = 'txt';

    constructor(
        public name: string,
        public font: string,
        handle: string,
        public ownerHandle: string,
        public verticalText = false,
        public fixedHeight = false,
        public widthFactor = 1,
        public obliqueAngle = 0,
        public backwardText = false,
        public updownText = false,
        public bigfont = ''
    ) {
        super('STYLE', handle, ownerHandle);
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbTextStyleTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, this.verticalText ? 4 : 0);
        writer.writeGroup(40, this.fixedHeight ? 1 : 0);
        writer.writeGroup(41, this.widthFactor);
        writer.writeGroup(50, this.obliqueAngle);
        writer.writeGroup(71, (this.backwardText ? 2 : 0) | (this.updownText ? 4 : 0));
        writer.writeGroup(42, 1);
        writer.writeGroup(3, this.font);
        writer.writeGroup(4, this.bigfont);
    }
}