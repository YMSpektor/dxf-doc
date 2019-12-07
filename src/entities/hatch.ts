import * as LineReader from 'line-reader';

import { Entity } from ".";
import { DxfDocument, DxfWriter } from "..";
import { DxfObject } from "../dxf-object";

export enum HatchStyle {
    NORMAL,
    OUTER,
    IGNORE
}

export class Hatch extends Entity {
    constructor(
        doc: DxfDocument,
        public boundaryPaths: HatchBoundaryPath[],
        public pattern?: HatchPattern,
        public hatchStyle = HatchStyle.NORMAL,
        ownerHandle?: string
    ) {
        super('HATCH', doc.nextHandle(), ownerHandle); 
    }

    protected writeEntity(writer: DxfWriter): void {
        writer.writeGroup(100, 'AcDbHatch');
        writer.writeGroup(10, 0);
        writer.writeGroup(20, 0);
        writer.writeGroup(30, 0);
        writer.writeGroup(210, 0);
        writer.writeGroup(220, 0);
        writer.writeGroup(230, 1);
        writer.writeGroup(2, this.pattern ? this.pattern.name : HatchPattern.SOLID);
        const isSolid = !this.pattern || this.pattern.name === HatchPattern.SOLID;
        writer.writeGroup(70, isSolid ? 1 : 0);
        writer.writeGroup(71, 0);
        writer.writeGroup(91, this.boundaryPaths.length);
        this.boundaryPaths.forEach(x => x.writeDxf(writer));
        writer.writeGroup(75, this.hatchStyle);
        writer.writeGroup(76, 0);
        if (this.pattern) {
            writer.writeGroup(52, 0);
            writer.writeGroup(41, 1);
            writer.writeGroup(77, 0);
            this.pattern.writeDxf(writer);
        }
        writer.writeGroup(98, 0);
    }
}

export interface HatchPatterLine {
    angle: number,
    x: number,
    y: number,
    offsetX: number,
    offsetY: number,
    dashes: number[]
}

export class HatchPattern implements DxfObject {
    public static SOLID = 'SOLID';

    constructor(public name: string, public lines: HatchPatterLine[]) { }

    static readFileAsync(path: string): Promise<HatchPattern[]> {
        return new Promise((resolve, reject) => {
            LineReader.open(path, (err, reader) => {
                if (err) reject(err);
                const result: HatchPattern[] = [];
                let pattern: HatchPattern | null = null;
                while (reader.hasNextLine()) {
                    if (err) reject(err);
                    reader.nextLine((err, line) => {
                        line = line.trim();
                        if (line.length) {
                            // New pattern
                            if (line[0] === '*') {
                                const nameMatch = line.match(/\*(\w+),?/);
                                if (nameMatch) {
                                    pattern = new HatchPattern(nameMatch[1], []);
                                    result.push(pattern);
                                }
                            }
                            // Line data
                            else if (pattern) {
                                const lineData = line.split(',').map(x => parseFloat(x.trim()));
                                if (lineData.length >= 5) {
                                    const patternLine = {
                                        angle: lineData[0],
                                        x: lineData[1],
                                        y: lineData[2],
                                        offsetX: lineData[3],
                                        offsetY: lineData[4],
                                        dashes: lineData.slice(5)
                                    };
                                    pattern.lines.push(patternLine);
                                }
                            }
                        }
                    });
                }

                resolve(result);
            });
        });
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(78, this.lines.length);
        this.lines.forEach(line => {
            writer.writeGroup(53, line.angle);
            writer.writeGroup(43, line.x);
            writer.writeGroup(44, line.y);
            writer.writeGroup(45, line.offsetX);
            writer.writeGroup(46, line.offsetY);
            const dashes = line.dashes || [];
            writer.writeGroup(79, dashes.length);
            dashes.forEach(dash => writer.writeGroup(49, dash));
        });
    }
}

export abstract class HatchBoundaryPath implements DxfObject {
    public abstract writeDxf(writer: DxfWriter): void;
}

export class PolylineBoundaryPath extends HatchBoundaryPath {
    constructor(public points: [number, number][]) {
        super();
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(92, 3);
        writer.writeGroup(72, 0);
        writer.writeGroup(73, 1);
        writer.writeGroup(93, this.points.length);
        this.points.forEach(p => {
            writer.writeGroup(10, p[0]);
            writer.writeGroup(20, p[1]);
        });
        writer.writeGroup(97, 0);
    }
}

abstract class Edge implements DxfObject {
    public abstract writeDxf(writer: DxfWriter): void;
}

class LineEdge extends Edge {
    constructor(public x1: number, public y1: number, public x2: number, public y2: number) {
        super();
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(72, 1);
        writer.writeGroup(10, this.x1);
        writer.writeGroup(20, this.y1);
        writer.writeGroup(11, this.x2);
        writer.writeGroup(21, this.y2);
    }
}

class ArcEdge extends Edge {
    constructor(public x: number, public y: number, public r: number, public startAngle: number, public endAngle: number, public counterClockwise: boolean) {
        super();
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(72, 2);
        writer.writeGroup(10, this.x);
        writer.writeGroup(20, this.y);
        writer.writeGroup(40, this.r);
        writer.writeGroup(50, this.startAngle);
        writer.writeGroup(51, this.endAngle);
        writer.writeGroup(73, this.counterClockwise ? 1 : 0);
    }
}

class EllipseEdge extends Edge {
    constructor(
        public x: number,
        public y: number,
        public majorAxisDx: number,
        public majorAxisDy: number,
        public minorAxisPercenage: number,
        public startAngle: number,
        public endAngle: number,
        public counterClockwise: boolean
    ) {
        super();
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(72, 3);
        writer.writeGroup(10, this.x);
        writer.writeGroup(20, this.y);
        writer.writeGroup(11, this.majorAxisDx);
        writer.writeGroup(21, this.majorAxisDy);
        writer.writeGroup(40, this.minorAxisPercenage);
        writer.writeGroup(50, this.startAngle);
        writer.writeGroup(51, this.endAngle);
        writer.writeGroup(73, this.counterClockwise ? 1 : 0);
    }
}

export class EdgeBoundaryPath extends HatchBoundaryPath {
    private edges: Edge[] = [];

    line(x1: number, y1: number, x2: number, y2: number) {
        this.edges.push(new LineEdge(x1, y1, x2, y2));
    }

    acr(x: number, y: number, r: number, startAngle: number, endAngle: number, counterClockwise: boolean) {
        this.edges.push(new ArcEdge(x, y, r, startAngle, endAngle, counterClockwise));
    }

    ellipse(x: number, y: number, majorAxisDx: number, majorAxisDy: number, minorAxisPercenage: number, startAngle: number, endAngle: number, counterClockwise: boolean) {
        this.edges.push(new EllipseEdge(x, y, majorAxisDx, majorAxisDy, minorAxisPercenage, startAngle, endAngle, counterClockwise));
    }

    writeDxf(writer: DxfWriter): void {
        writer.writeGroup(92, 1);
        writer.writeGroup(93, this.edges.length);
        this.edges.forEach(x => x.writeDxf(writer));
        writer.writeGroup(97, 0);
    }
}