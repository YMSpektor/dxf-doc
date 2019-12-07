import { DxfWriter } from "..";
import { DxfObject } from "../dxf-object";
import { HeaderVariable } from "./header-variables";

export class Section implements DxfObject {
    public entities: DxfObject[] = [];

    constructor(public name: string) { }

    public writeDxf(writer: DxfWriter): void {
        writer.writeGroup(0, 'SECTION');
        writer.writeGroup(2, this.name);
        this.entities.forEach(x => x.writeDxf(writer));
        writer.writeGroup(0, 'ENDSEC');
    }
}