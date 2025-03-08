declare const data: {
    tick: number;
    growthProbability: number;
    nonBaseCellchance: number;
};
declare const probabilityAssignedClass = "consider";
declare const inqueueClass = "inqueue";
declare let currentColor: celltypes;
declare function cellClickEvent(e: MouseEvent): void;
declare function changeAdjacent(target: HTMLDivElement, changeto: celltypes, changefrom: celltypes): Promise<void>;
type celltypes = "blue" | "white" | "black" | "green";
declare const celltypesList: [string, string, string, string];
declare function changeCellClass(element: HTMLDivElement, _class: celltypes): boolean;
declare class Matrix {
    static cellblueHTML: string;
    static cellwhiteHTML: string;
    static cellblackHTML: string;
    static cellgreenHTML: string;
    element: HTMLDivElement;
    volume: number;
    sidelength: number;
    constructor(matrixElement: HTMLDivElement, sidelength: number);
    setall(random: true): void;
    setall(random: false, tocell?: celltypes): void;
}
declare function randCellType(asHTML: true, i: number, j: number): string;
declare function randCellType(asHTML: false): celltypes;
declare const gridsizelength: number;
declare function main(): 0 | 1;
