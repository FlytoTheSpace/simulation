
type SnakeElement = {
    x: number,
    y: number,
    isHead: boolean
}

class Board {
    sidelength: number = 0;
    sidelengthPX: number = 0;
    _unitlength: number = 0;
    _element: HTMLCanvasElement = (null as unknown as HTMLCanvasElement);
    context: CanvasRenderingContext2D = (null as unknown as CanvasRenderingContext2D);

    snakebody: SnakeElement[] = [];
    direction: 0 | 1 | 2 | 3 = 1; /* Top, Left, Bottom, Right */

    static errors: {
        invalidNumber: Error,
        invalidElement: Error
        unabletocreatecontext: Error
    } = {
        invalidNumber: new Error("Invalid Number Input"),
        invalidElement: new Error("Invalid Canvas Element Input"),
        unabletocreatecontext: new Error("Unable to Create Context")
    }
    static cellcolor = "rgb(11, 72, 202)";
    static strokestyle = "white";

    constructor(element: HTMLCanvasElement, sidelength: number, sidelengthPX: number){

        if (typeof(sidelength) !== "number" || !Number.isFinite(sidelength) || sidelength <= 0){ throw Board.errors.invalidNumber};
        if (typeof(sidelengthPX) !== "number" || !Number.isFinite(sidelengthPX) || sidelengthPX <= 0){ throw Board.errors.invalidNumber};
        if (typeof element !== "object" || element === null || !(element instanceof HTMLCanvasElement)){ throw Board.errors.invalidElement };
        
        this.sidelength = sidelength;
        this.sidelengthPX = sidelengthPX;
        this._element = element;
        this._unitlength = sidelengthPX/sidelength;
        this._element.height = sidelengthPX;
        this._element.width = sidelengthPX;
        const context: CanvasRenderingContext2D | null = this._element.getContext("2d");
        if (context === null){ throw Board.errors.unabletocreatecontext; };
        this.context = context;
        this.drawBoard();

        this.snakebody.push({
            x: Math.floor(sidelength/2),
            y: Math.floor(sidelength/2),
            isHead: true
        })
    }

    drawBoard(): void {

        this.context.fillStyle = Board.cellcolor;
        this.context.strokeStyle = Board.strokestyle;
        for(let x = 0; x<this.sidelength; x++){
            for(let y = 0; y<this.sidelength; y++){
                const xCord = this._unitlength*x;
                const yCord = this._unitlength*y;
                this.context.fillRect(xCord, yCord, this._unitlength, this._unitlength);
                this.context.strokeRect(xCord, yCord, this._unitlength, this._unitlength);
            }
        }
    }

    drawSquare(x: number, y: number, color: string): void {

    }

    drawNextFrame(): void {

    }
}


let board: Board;
async function main(): Promise<0 | 1>{

    const boardelement: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>("#playground");
    if (boardelement === null){ return 1; }

    board = new Board(boardelement, 15, 500);

    return 0;
}

main().then(value=>{
    if (value === 0){
        console.log("Plain Exit")
        return;
    }
    console.error("Error Exit Code")
}).catch(error=>{
    console.error("Error Caught", error)
})