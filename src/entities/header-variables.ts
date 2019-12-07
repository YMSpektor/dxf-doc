import { DxfObject } from "../dxf-object";
import { DxfWriter } from "..";

export class HeaderVariable implements DxfObject {
    constructor(public name: string, public groups: Map<number, string | number>) { }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(9, this.name);
        this.groups.forEach((value, code) => writer.writeGroup(code, value));
    }
}