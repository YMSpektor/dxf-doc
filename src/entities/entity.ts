import { DxfObject } from "../dxf-object";
import { DxfWriter } from "..";
import { Layer } from "./layer";
import { LType } from "./ltype";

export abstract class Entity implements DxfObject {
    layer?: string;
    ltype?: string;
    color?: number;
    lineWeight?: number;

    constructor(public recordName: string, public handle: string, public ownerHandle?: string) {
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, this.recordName);
        writer.writeGroup(5, this.handle);
        if (this.ownerHandle) {
            writer.writeGroup(330, this.ownerHandle);
        }
        writer.writeGroup(100, 'AcDbEntity');
        writer.writeGroup(8, this.layer ? this.layer : Layer.LAYER_0);
        writer.writeGroup(6, this.ltype ? this.ltype : LType.BY_LAYER);
        if (this.color) {
            writer.writeGroup(62, this.color);
        }
        if (this.lineWeight) {
            writer.writeGroup(370, this.lineWeight);
        }
        this.writeEntity(writer);
    }

    protected abstract writeEntity(writer: DxfWriter): void;
}