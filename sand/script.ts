type cordinates = {
    x: number,
    y: number
}

type matrixItem = {
    state: number,
    x: number, // Order Cordinates
    y: number, // Order Cordinates
    px: cordinates
}
const globalErrors: {
    InvalidNumber: Error
} = {
    InvalidNumber: new Error("Invalid Number")
}

function noise(base: number, noiselvl: number, limit?: {upper?: number, lower?: number}): number {
    base = + base;
    noiselvl = + noiselvl;

    if (Number.isNaN(base) || !Number.isFinite(base)){ throw globalErrors.InvalidNumber };
    if (Number.isNaN(noiselvl) || !Number.isFinite(noiselvl)){ noiselvl = 1; };

    const noiseSide: boolean = Boolean(Math.round(Math.random()));
    const noise: number = Math.random() * noiselvl;

    let noisedNumber: number;
    noisedNumber = Math.round(noiseSide? base + noise: base - noise);
    
    if (limit){
        if (limit.upper && ((Number.isNaN(limit.upper) || !Number.isFinite(limit.upper)))){ noisedNumber = Math.min(noisedNumber, limit.upper) }
        if (limit.lower && ((Number.isNaN(limit.lower) || !Number.isFinite(limit.lower)))){ noisedNumber = Math.min(noisedNumber, limit.lower) }
    }
    
    return noisedNumber;
}

class Matrix{
    
    // All Static Functions/Variables

    static readonly defaultsidelen = 10;
    static defaultMatrixItemState: number = 0;
    static defaultNoiselvl: number = 10;
    static readonly errors: {
        InvalidHTMLCanvasElement: Error,
        InvalidSideLengthPX: Error,
        InvalidSideLength: Error,
        InvalidXYCord: Error,
        TargestDoesnotExist: Error,
        UnabletocreateContext: Error,
    } = {
        InvalidHTMLCanvasElement: new Error("Invalid HTMLCanvasElement"),
        InvalidSideLengthPX: new Error("Invalid Side Length PX"),
        InvalidSideLength: new Error("Invalid Side Length"),
        InvalidXYCord: new Error("Invalid X/Y Cord"),
        TargestDoesnotExist: new Error("Targest Does not Exist"),
        UnabletocreateContext: new Error("Unable to create Context"),
    };
    static statetoColorList: [number, number, number][] = [
        // All These are HSL Color Codes
        [ 0, 0, 0 ], // Black
        [ 0, 0, 100 ], // White
        [ 0, 100, 50 ], // Red
        [ 240, 100, 50 ], // Blue
        [ 120, 100, 50 ], // Green
        [ 272, 100, 50 ], // Purple
    ];
    static statetoColor(state: number, noiselvl?: number): string {
        state = +state;
        if (Number.isNaN(state) || !Number.isFinite(state) || state < 0 || state >= Matrix.statetoColorList.length){
            state = 0;
        }
        state = Math.floor(state);
        if (!noiselvl || state === 0){ noiselvl = 0; }
        const color = 
            `hsl(${
            noise(Matrix.statetoColorList[state][0], noiselvl, {upper: 360, lower: 0}) }, ${
            noise(Matrix.statetoColorList[state][1], noiselvl, {upper: 100, lower: 0}) }%, ${
            noise(Matrix.statetoColorList[state][2], noiselvl, {upper: 100, lower: 0}) }%)`;

        return color;
    };

    // Local Variables
    _sidelength: number = Matrix.defaultsidelen;
    _element: HTMLCanvasElement = null as unknown as HTMLCanvasElement;
    _sidelengthPX: number = 0;
    _unitlength: number = 0;
    _matrix: matrixItem[][] = [];
    context: CanvasRenderingContext2D = null as unknown as CanvasRenderingContext2D;
    volume: number = Matrix.defaultsidelen ** 2;
    
    _cursorWrite: number = 1; // State to write when Clicking
    _cursorDown: boolean = false; // Whether the Mouse is held down or not

    constructor(element: HTMLCanvasElement, sidelength: number, sidelengthPX: number){
        this.element = element;
        this.sidelength = sidelength;
        this.sidelengthPX = sidelengthPX;

        this.refreshunitlength()


        this.element.addEventListener('mousedown', (e)=>{
            this._cursorDown = true;
            this.mouseEvent(e);
        });
        this.element.addEventListener('mousemove', (e)=>{
            if (this._cursorDown === false){ return; };
            this.mouseEvent(e)
        });
        window.addEventListener('mouseup', (e: MouseEvent)=>{
            if (this._cursorDown === false){
                return;
            };
            this.mouseEvent(e);
            this._cursorDown = false;
        });
    }
    
    // Internal Functions
    refreshVolume(): void {
        this.volume = this.sidelength**2
    }
    refreshunitlength(): void{
        this._unitlength = this.sidelengthPX/this.sidelength;
    }

    mouseEvent = (e: MouseEvent): void =>{
        const domrect: DOMRect = this.element.getBoundingClientRect();

    
        const matrixCords: cordinates = {
            x: domrect.x,
            y: domrect.y
        }
        const mouseCords: cordinates = {
            x: e.x - matrixCords.x,
            y: e.y - matrixCords.y
        }
        const elementCords: cordinates = {
            x: Math.floor(mouseCords.x/this._unitlength),
            y: Math.floor(mouseCords.y/this._unitlength)
        }
        if (elementCords.x >= this._sidelength || elementCords.x < 0){ return; };
        if (elementCords.y >= this._sidelength || elementCords.y < 0){ return; };

        this.drawGridElement(elementCords.x, elementCords.y, this._cursorWrite)
    };

    // Getters/Setters
    get element(): typeof this._element{
        return this._element;
    }
    set element(element: HTMLCanvasElement){
        if (element == null || typeof element !== "object" || !(element instanceof HTMLCanvasElement)){ throw Matrix.errors.InvalidHTMLCanvasElement }
        this._element = element;
        const context: CanvasRenderingContext2D | null = element.getContext("2d");
        if (!context){ throw Matrix.errors.UnabletocreateContext};
        this.context = context;
    }
    get sidelengthPX(): typeof this._sidelengthPX{
        return this._sidelengthPX;
    }
    set sidelengthPX(sidelengthPX: number){
        sidelengthPX = +sidelengthPX;
        if (Number.isNaN(sidelengthPX) || !Number.isFinite(sidelengthPX) || sidelengthPX < 0){ throw Matrix.errors.InvalidSideLengthPX};
        const lengthLimit = Math.min(window.innerHeight, window.innerWidth)
        if (sidelengthPX > lengthLimit){ sidelengthPX = lengthLimit };
        this._sidelengthPX = sidelengthPX;

        this.element.width = this.sidelengthPX;
        this.element.height = this.sidelengthPX;

        if( this.sidelength !== 0){ this.refreshunitlength(); };
    }
    /**
     * 
     * @param sidelength The new Side Length of The Matrix, pass `0` or `null` for Reset to Default
     * @returns the new Side Length, `-1` for Invalid Input, `0` for Reset,
    */
    get sidelength(): typeof this._sidelength{
       return this._sidelength;
    }
    set sidelength(sidelength: number){
        sidelength = +sidelength;
        
        if (sidelength === 0 || sidelength === null){
            this._sidelength = Matrix.defaultsidelen;
            this.refreshVolume();
            return;
        }
        if (Number.isNaN(sidelength) || !Number.isFinite(sidelength) || sidelength < 0){ throw Matrix.errors.InvalidSideLengthPX };
        sidelength = Math.round(sidelength);
        this._sidelength = sidelength;
        this.refreshVolume();

        if( this.sidelengthPX !== 0){ this.refreshunitlength(); };
    }
    
    // Interface Functions
    drawGrid(state?: number): void {
        this._matrix = [];
        this.refreshunitlength();
        this.context.strokeStyle = "white";
        
        // return;
        for(let i = 0; i<this.sidelength; i++){
            this._matrix.push([]);
            for(let j = 0; j<this.sidelength; j++){
                this.drawGridElement(i, j, state? state : Matrix.defaultMatrixItemState);
            }
        }
    }

    drawGridElement(x: number, y: number, state?: number, stroke: boolean = true): void {
        x = + x;
        y = + y;
        
        if (Number.isNaN(x) || !Number.isFinite(x) || x < 0 || x >= this.sidelength ){ throw Matrix.errors.InvalidXYCord };
        if (Number.isNaN(y) || !Number.isFinite(y) || y < 0 || y >= this.sidelength ){ throw Matrix.errors.InvalidXYCord };

        x = Math.floor(x);
        y = Math.floor(y);
        state = state? state : Matrix.defaultMatrixItemState;
        const color: string = Matrix.statetoColor(state, Matrix.defaultNoiselvl);
        
        this.context.fillStyle = color;
        
        if (stroke){ this.context.strokeStyle = color; }

        const matrixItem: matrixItem = {
            state: state,
            x: x,
            y: y,
            px: {
                x: x*this._unitlength,
                y: y*this._unitlength,
            }
        }

        this.context.fillRect(matrixItem.px.x, matrixItem.px.y, this._unitlength, this._unitlength)
        this.context.strokeRect(matrixItem.px.x, matrixItem.px.y, this._unitlength, this._unitlength)
        this._matrix[matrixItem.x][matrixItem.y] = matrixItem;
    }
}
let matrix: Matrix;
async function main(): Promise<0 | 1> {
    const canvasElement: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>("#playground");
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)){ return 0; };
    const sidelength = 16;
    matrix = new Matrix(canvasElement, sidelength, 500);

    matrix.drawGrid(0);

    return 0;
};

main()
    .then((resolve)=>{
        console.log(`Program Exited with Code ${resolve}`);
    })
    .catch((error)=>{
        console.error(error);
    });