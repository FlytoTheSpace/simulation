type SnakeElement = {
    x: number;
    y: number;
    isHead: boolean;
};
declare class Board {
    sidelength: number;
    sidelengthPX: number;
    _unitlength: number;
    _element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    snakebody: SnakeElement[];
    direction: 0 | 1 | 2 | 3;
    static errors: {
        invalidNumber: Error;
        invalidElement: Error;
        unabletocreatecontext: Error;
    };
    static cellcolor: string;
    static strokestyle: string;
    constructor(element: HTMLCanvasElement, sidelength: number, sidelengthPX: number);
    drawBoard(): void;
    drawSquare(x: number, y: number, color: string): void;
    drawNextFrame(): void;
}
declare let board: Board;
declare function main(): Promise<0 | 1>;
