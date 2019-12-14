import { DxfTextWriter } from "./dxf-writer";
import { Section, Table, LType, Layer, Style, AppId, BlockRecord, Block, BlockEnd, DimStyleTable, Dictionary, Entity } from "./entities";
import { HeaderVariable } from "./entities/header-variables";
import { StyleFlags } from "./entities/style";

export class DxfDocument {
    private _nextHandle = 256;
    private header = new Section('HEADER');
    private classes = new Section('CLASSES');
    private tables = new Section('TABLES');
    private blocks = new Section('BLOCKS');
    private entities = new Section('ENTITIES');
    private objects = new Section('OBJECTS');
    private layerTable: Table;
    private blockRecTable: Table;
    private ltypeTable: Table;
    private styleTable: Table;

    constructor() {
        this.addHeaderVariables(
            new HeaderVariable('$ACADVER', new Map([[1, 'AC1021']]))
        );

        const vportTable = new Table('VPORT', this.nextHandle());

        this.ltypeTable = new Table('LTYPE', this.nextHandle());
        this.addLineType(LType.BY_BLOCK);
        this.addLineType(LType.BY_LAYER);
        this.addLineType(LType.CONTINUOUS);

        this.layerTable = new Table('LAYER', this.nextHandle());
        this.addLayer(Layer.LAYER_0);

        this.styleTable = new Table('STYLE', this.nextHandle());
        this.addStyle(Style.STANDARD);

        const viewTable = new Table('VIEW', this.nextHandle());

        const ucsTable = new Table('UCS', this.nextHandle());

        const appIdTable = new Table('APPID', this.nextHandle());
        const acad = new AppId('ACAD', this.nextHandle(), appIdTable.handle);
        appIdTable.entries.push(acad);

        const dimstyleTable = new DimStyleTable(this.nextHandle());

        this.blockRecTable = new Table('BLOCK_RECORD', this.nextHandle());
        this.addBlock(BlockRecord.MODEL_SPACE);
        this.addBlock(BlockRecord.PAPER_SPACE);

        this.tables.entities.push(vportTable, this.ltypeTable, this.layerTable, this.styleTable, viewTable, ucsTable, appIdTable, dimstyleTable, this.blockRecTable);

        const mainDict = new Dictionary(this.nextHandle());
        const acadGroup = new Dictionary(this.nextHandle(), mainDict.handle);
        mainDict.entries[Dictionary.ACAD_GROUP] = acadGroup.handle;
        this.objects.entities.push(mainDict, acadGroup);
    }

    addHeaderVariables(...variables: HeaderVariable[]) {
        variables.forEach(v => this.header.entities.push(v));
    }

    addLayer(name: string): Layer {
        const layer = new Layer(name, this.nextHandle(), this.layerTable.handle);
        this.layerTable.entries.push(layer);
        return layer;
    }

    addLineType(name: string, dashes?: number[]): LType {
        const ltype = new LType(name, this.nextHandle(), this.ltypeTable.handle, dashes);
        this.ltypeTable.entries.push(ltype);
        return ltype;
    }

    addStyle(name: string, font: string = Style.FONT_DEFAULT, flags = StyleFlags.NONE): Style {
        const style = new Style(name, font, this.nextHandle(), this.styleTable.handle, flags);
        this.styleTable.entries.push(style);
        return style;
    }

    addBlock(name: string): Block {
        const blockRec = new BlockRecord(name, this.nextHandle(), this.blockRecTable.handle);
        this.blockRecTable.entries.push(blockRec);
        const block = new Block(name, this.nextHandle(), blockRec.handle);
        const blockEnd = new BlockEnd(this.nextHandle(), blockRec.handle);
        this.blocks.entities.push(block, blockEnd);
        return block;
    }

    addEntity(entity: Entity) {
        this.entities.entities.push(entity);
    }

    addEntities(...entities: Entity[]) {
        entities.forEach(entity => this.addEntity(entity));
    }

    nextHandle(): string {
        return (this._nextHandle++).toString(16).toUpperCase();
    }

    dxf(): string {
        const writer = new DxfTextWriter();
        this.addHeaderVariables(
            new HeaderVariable('$HANDSEED', new Map([[5, this._nextHandle.toString(16).toUpperCase()]]))
        );
        this.header.writeDxf(writer);
        this.classes.writeDxf(writer);
        this.tables.writeDxf(writer);
        this.blocks.writeDxf(writer);
        this.entities.writeDxf(writer);
        this.objects.writeDxf(writer);
        writer.writeGroup(0, 'EOF');
        return writer.text;
    }

    extents(min: [number, number], max: [number, number]) {
        this.addHeaderVariables(
            new HeaderVariable('$EXTMIN', new Map([[10, min[0]], [20, min[1]]])),
            new HeaderVariable('$EXTMAX', new Map([[10, max[0]], [20, max[1]]]))
        )
    }

    limits(min: [number, number], max: [number, number]) {
        this.addHeaderVariables(
            new HeaderVariable('$LIMMIN', new Map([[10, min[0]], [20, min[1]]])),
            new HeaderVariable('$LIMMAX', new Map([[10, max[0]], [20, max[1]]]))
        )
    }
}