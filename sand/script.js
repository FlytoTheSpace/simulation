"use strict";
const globalErrors = {
    InvalidNumber: new Error("Invalid Number")
};
function noise(base, noiselvl, limit) {
    base = +base;
    noiselvl = +noiselvl;
    if (Number.isNaN(base) || !Number.isFinite(base)) {
        throw globalErrors.InvalidNumber;
    }
    ;
    if (Number.isNaN(noiselvl) || !Number.isFinite(noiselvl)) {
        noiselvl = 1;
    }
    ;
    const noiseSide = Boolean(Math.round(Math.random()));
    const noise = Math.random() * noiselvl;
    let noisedNumber;
    noisedNumber = Math.round(noiseSide ? base + noise : base - noise);
    if (limit) {
        if (limit.upper && ((Number.isNaN(limit.upper) || !Number.isFinite(limit.upper)))) {
            noisedNumber = Math.min(noisedNumber, limit.upper);
        }
        if (limit.lower && ((Number.isNaN(limit.lower) || !Number.isFinite(limit.lower)))) {
            noisedNumber = Math.min(noisedNumber, limit.lower);
        }
    }
    return noisedNumber;
}
class Matrix {
    static defaultsidelen = 10;
    static errors = {
        InvalidHTMLCanvasElement: new Error("Invalid HTMLCanvasElement"),
        InvalidSideLengthPX: new Error("Invalid Side Length PX"),
        InvalidSideLength: new Error("Invalid Side Length"),
        InvalidXYCord: new Error("Invalid X/Y Cord"),
        UnabletocreateContext: new Error("Unable to create Context"),
    };
    static statetoColorList = [
        // All These are HSL Color Codes
        [0, 0, 0], // Black
        [0, 0, 100], // White
        [0, 100, 50], // Red
        [240, 100, 50], // Blue
        [120, 100, 50], // Green
        [272, 100, 50], // Purple
    ];
    static statetoColor(state, noiselvl) {
        state = +state;
        if (Number.isNaN(state) || !Number.isFinite(state) || state - state !== 0 || state >= Matrix.statetoColorList.length) {
            state = 0;
        }
        state = Math.floor(state);
        if (!noiselvl || state === 0) {
            noiselvl = 0;
        }
        const color = `hsl(${noise(Matrix.statetoColorList[state][0], noiselvl, { upper: 360, lower: 0 })}, ${noise(Matrix.statetoColorList[state][1], noiselvl, { upper: 100, lower: 0 })}%, ${noise(Matrix.statetoColorList[state][2], noiselvl, { upper: 100, lower: 0 })}%)`;
        return color;
    }
    ;
    static defaultMatrixItemState = 0;
    static defaultNoiselvl = 10;
    _sidelength = Matrix.defaultsidelen;
    _element = null;
    _sidelengthPX = 0;
    _unitlength = 0;
    _matrix = [];
    context = null;
    volume = Matrix.defaultsidelen ** 2;
    constructor(element, sidelength, sidelengthPX) {
        this.element = element;
        this.sidelength = sidelength;
        this.sidelengthPX = sidelengthPX;
        this.refreshunitlength();
    }
    refreshVolume() {
        this.volume = this.sidelength ** 2;
    }
    refreshunitlength() {
        this._unitlength = this.sidelengthPX / this.sidelength;
    }
    get element() {
        return this._element;
    }
    set element(element) {
        if (element == null || typeof element !== "object" || !(element instanceof HTMLCanvasElement)) {
            throw Matrix.errors.InvalidHTMLCanvasElement;
        }
        this._element = element;
        const context = element.getContext("2d");
        if (!context) {
            throw Matrix.errors.UnabletocreateContext;
        }
        ;
        this.context = context;
    }
    get sidelengthPX() {
        return this._sidelengthPX;
    }
    set sidelengthPX(sidelengthPX) {
        sidelengthPX = +sidelengthPX;
        if (Number.isNaN(sidelengthPX) || !Number.isFinite(sidelengthPX) || sidelengthPX - sidelengthPX !== 0) {
            throw Matrix.errors.InvalidSideLengthPX;
        }
        ;
        const lengthLimit = Math.min(window.innerHeight, window.innerWidth);
        if (sidelengthPX > lengthLimit) {
            sidelengthPX = lengthLimit;
        }
        ;
        this._sidelengthPX = sidelengthPX;
        this.element.width = this.sidelengthPX;
        this.element.height = this.sidelengthPX;
        if (this.sidelength !== 0) {
            this.refreshunitlength();
        }
        ;
    }
    /**
     *
     * @param sidelength The new Side Length of The Matrix, pass `0` or `null` for Reset to Default
     * @returns the new Side Length, `-1` for Invalid Input, `0` for Reset,
    */
    get sidelength() {
        return this._sidelength;
    }
    set sidelength(sidelength) {
        sidelength = +sidelength;
        if (sidelength === 0 || sidelength === null) {
            this._sidelength = Matrix.defaultsidelen;
            this.refreshVolume();
            return;
        }
        if (Number.isNaN(sidelength) || !Number.isFinite(sidelength) || sidelength - sidelength !== 0) {
            throw Matrix.errors.InvalidSideLengthPX;
        }
        ;
        sidelength = Math.round(sidelength);
        this._sidelength = sidelength;
        this.refreshVolume();
        if (this.sidelengthPX !== 0) {
            this.refreshunitlength();
        }
        ;
    }
    drawGrid() {
        this._matrix = [];
        const domrect = this.element.getBoundingClientRect();
        console.log(domrect);
        const absCords = {
            x: domrect.x,
            y: domrect.y
        };
        this.refreshunitlength();
        this.context.strokeStyle = "white";
        // return;
        for (let i = 0; i < this.sidelength; i++) {
            this._matrix.push([]);
            for (let j = 0; j < this.sidelength; j++) {
                this.drawGridElement(i, j, Matrix.defaultMatrixItemState);
            }
        }
    }
    drawGridElement(x, y, state, stroke = true) {
        x = +x;
        y = +y;
        if (Number.isNaN(x) || !Number.isFinite(x) || x - x !== 0 || x >= this.sidelength) {
            throw Matrix.errors.InvalidXYCord;
        }
        ;
        if (Number.isNaN(y) || !Number.isFinite(y) || y - y !== 0 || y >= this.sidelength) {
            throw Matrix.errors.InvalidXYCord;
        }
        ;
        x = Math.floor(x);
        y = Math.floor(y);
        state = state ? state : Matrix.defaultMatrixItemState;
        const color = Matrix.statetoColor(state, Matrix.defaultNoiselvl);
        this.context.fillStyle = color;
        if (stroke) {
            this.context.strokeStyle = color;
        }
        const matrixItem = {
            state: state,
            x: x,
            y: y,
            px: {
                x: x * this._unitlength,
                y: y * this._unitlength,
            }
        };
        this.context.fillRect(matrixItem.px.x, matrixItem.px.y, this._unitlength, this._unitlength);
        this.context.strokeRect(matrixItem.px.x, matrixItem.px.y, this._unitlength, this._unitlength);
        this._matrix[matrixItem.x][matrixItem.y] = matrixItem;
    }
}
let matrix;
async function main() {
    const canvasElement = document.querySelector("#playground");
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
        return 0;
    }
    ;
    const sidelength = 16;
    matrix = new Matrix(canvasElement, sidelength, 500);
    matrix.drawGrid();
    return 0;
}
;
main()
    .then((resolve) => {
    console.log(`Program Exited with Code ${resolve}`);
})
    .catch((error) => {
    console.error(error);
});
