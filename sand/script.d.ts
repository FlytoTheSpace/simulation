type matrixItem = {
    state: number;
    x: number;
    y: number;
    px: {
        x: number;
        y: number;
    };
};
declare const globalErrors: {
    InvalidNumber: Error;
};
declare function noise(base: number, noiselvl: number, limit?: {
    upper?: number;
    lower?: number;
}): number;
declare class Matrix {
    static readonly defaultsidelen = 10;
    static readonly errors: {
        InvalidHTMLCanvasElement: Error;
        InvalidSideLengthPX: Error;
        InvalidSideLength: Error;
        InvalidXYCord: Error;
        UnabletocreateContext: Error;
    };
    static readonly statetoColorList: [number, number, number][];
    static statetoColor(state: number, noiselvl?: number): string;
    static defaultMatrixItemState: number;
    static defaultNoiselvl: number;
    _sidelength: number;
    _element: HTMLCanvasElement;
    _sidelengthPX: number;
    _unitlength: number;
    _matrix: matrixItem[][];
    context: CanvasRenderingContext2D;
    volume: number;
    constructor(element: HTMLCanvasElement, sidelength: number, sidelengthPX: number);
    refreshVolume(): void;
    refreshunitlength(): void;
    get element(): typeof this._element;
    set element(element: HTMLCanvasElement);
    get sidelengthPX(): typeof this._sidelengthPX;
    set sidelengthPX(sidelengthPX: number);
    /**
     *
     * @param sidelength The new Side Length of The Matrix, pass `0` or `null` for Reset to Default
     * @returns the new Side Length, `-1` for Invalid Input, `0` for Reset,
    */
    get sidelength(): typeof this._sidelength;
    set sidelength(sidelength: number);
    drawGrid(): void;
    drawGridElement(x: number, y: number, state?: number, stroke?: boolean): void;
}
declare let matrix: Matrix;
declare function main(): Promise<0 | 1>;
