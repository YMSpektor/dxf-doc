import { TableRecord } from "./table";
import { DxfWriter } from "..";

export class LType extends TableRecord {
    public static BY_LAYER = 'ByLayer';
    public static BY_BLOCK = 'ByBlock';
    public static CONTINUOUS = 'Continuous';

    constructor(public name: string, handle: string, public ownerHandle: string, public dashes: number[] = []) {
        super('LTYPE', handle, ownerHandle);
    }

    protected writeTableRecord(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbLinetypeTableRecord');
        writer.writeGroup(2, this.name);
        writer.writeGroup(70, 0);
        writer.writeGroup(3, '');
        writer.writeGroup(72, 65);
        writer.writeGroup(73, this.dashes.length);
        const len = this.dashes.reduce((acc, dash) => acc + dash, 0);
        writer.writeGroup(40, len);
        this.dashes.forEach((x, i) => {
            writer.writeGroup(49, x * (i % 2 === 0 ? 1 : -1));
            writer.writeGroup(74, 0);
        });
    }
}