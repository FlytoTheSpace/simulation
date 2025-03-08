"use strict";
const globalErrors = {
    InvalidNumber: new Error("Invalid Number")
};
class Matrix {
    // All Static Functions/Variables
    static defaultsidelen = 10;
    static defaultMatrixItemState = 0;
    static defaultNoiselvl = 10;
    static errors = {
        InvalidHTMLCanvasElement: new Error("Invalid HTMLCanvasElement"),
        InvalidSideLengthPX: new Error("Invalid Side Length PX"),
        InvalidSideLength: new Error("Invalid Side Length"),
        InvalidXYCord: new Error("Invalid X/Y Cord"),
        TargestDoesnotExist: new Error("Targest Does not Exist"),
        UnabletocreateContext: new Error("Unable to create Context"),
    };
    static statetoColorList = [
        // All These are HSL Color Codes
        [0, 0, 0], // Black
        [0, 0, 100], // White
    ];
    static statetoColor(state, noiselvl) {
        state = +state;
        if (Number.isNaN(state) || !Number.isFinite(state) || state < 0 || state >= Matrix.statetoColorList.length) {
            state = 0;
        }
        state = Math.floor(state);
        if (!noiselvl || state === 0) {
            noiselvl = 0;
        }
        const color = `hsl(${Matrix.statetoColorList[state][0]}, ${Matrix.statetoColorList[state][1]}%, ${Matrix.statetoColorList[state][2]}%)`;
        return color;
    }
    ;
    // Local Variables
    _sidelength = Matrix.defaultsidelen;
    _element = null;
    _sidelengthPX = 0;
    _unitlength = 0;
    _matrix = [];
    context = null;
    volume = Matrix.defaultsidelen ** 2;
    _cursorWrite = 1; // State to write when Clicking
    _cursorDown = false; // Whether the Mouse is held down or not
    constructor(element, sidelength, sidelengthPX) {
        this.element = element;
        this.sidelength = sidelength;
        this.sidelengthPX = sidelengthPX;
        this.refreshunitlength();
        this.element.addEventListener('mousedown', (e) => {
            this._cursorDown = true;
            this.mouseEvent(e);
        });
        this.element.addEventListener('mousemove', (e) => {
            if (this._cursorDown === false) {
                return;
            }
            ;
            this.mouseEvent(e);
        });
        window.addEventListener('mouseup', (e) => {
            if (this._cursorDown === false) {
                return;
            }
            ;
            this.mouseEvent(e);
            this._cursorDown = false;
        });
    }
    // Internal Functions
    refreshVolume() {
        this.volume = this.sidelength ** 2;
    }
    refreshunitlength() {
        this._unitlength = this.sidelengthPX / this.sidelength;
    }
    mouseEvent = (e) => {
        const domrect = this.element.getBoundingClientRect();
        const matrixCords = {
            x: domrect.x,
            y: domrect.y
        };
        const mouseCords = {
            x: e.x - matrixCords.x,
            y: e.y - matrixCords.y
        };
        const elementCords = {
            x: Math.floor(mouseCords.x / this._unitlength),
            y: Math.floor(mouseCords.y / this._unitlength)
        };
        if (elementCords.x >= this._sidelength || elementCords.x < 0) {
            return;
        }
        ;
        if (elementCords.y >= this._sidelength || elementCords.y < 0) {
            return;
        }
        ;
        this.drawGridElement(elementCords.x, elementCords.y, this._cursorWrite);
    };
    // Getters/Setters
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
        if (Number.isNaN(sidelengthPX) || !Number.isFinite(sidelengthPX) || sidelengthPX < 0) {
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
        if (Number.isNaN(sidelength) || !Number.isFinite(sidelength) || sidelength < 0) {
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
    // Interface Functions
    drawGrid(state) {
        this._matrix = [];
        this.refreshunitlength();
        this.context.strokeStyle = "white";
        // return;
        for (let i = 0; i < this.sidelength; i++) {
            this._matrix.push([]);
            for (let j = 0; j < this.sidelength; j++) {
                this.drawGridElement(i, j, state ? state : Matrix.defaultMatrixItemState);
            }
        }
    }
    drawGridElement(x, y, state, stroke = true) {
        x = +x;
        y = +y;
        if (Number.isNaN(x) || !Number.isFinite(x) || x < 0 || x >= this.sidelength) {
            throw Matrix.errors.InvalidXYCord;
        }
        ;
        if (Number.isNaN(y) || !Number.isFinite(y) || y < 0 || y >= this.sidelength) {
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
    drawNextGeneration() {
        for (let i = 0; i < this._sidelength; i++) {
            for (let j = 0; j < this._sidelength; j++) {
                const neighbours = {
                    topLeft: { x: i - 1, y: j + 1 },
                    top: { x: i, y: j + 1 },
                    topRight: { x: i + 1, y: j + 1 },
                    left: { x: i - 1, y: j },
                    right: { x: i + 1, y: j },
                    bottomLeft: { x: i - 1, y: j - 1 },
                    bottom: { x: i, y: j - 1 },
                    bottomRight: { x: i + 1, y: j - 1 },
                };
                let litNeighbours = 0;
                for (let i in neighbours) {
                    const cords = neighbours[i];
                    if ((cords.x < 0) || (cords.y < 0) || (cords.x >= this._sidelength) || (cords.y >= this._sidelength)) {
                        continue;
                    }
                    ;
                    const state = this._matrix[cords.x][cords.y].state;
                    if (state !== 1) {
                        continue;
                    }
                    ;
                    litNeighbours++;
                }
                if (litNeighbours !== 3) {
                    this.drawGridElement(i, j, 0, true);
                    continue;
                }
                this.drawGridElement(i, j, 1, true);
            }
        }
    }
}
let matrix;
async function main() {
    const canvasElement = document.querySelector("#playground");
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
        return 1;
    }
    ;
    const sidelength = 64;
    const baseWidth = 800;
    matrix = new Matrix(canvasElement, sidelength, baseWidth);
    matrix.drawGrid(0);
    const elementsElement = document.querySelector("#elements");
    if (!elementsElement || !(elementsElement instanceof HTMLDivElement)) {
        return 1;
    }
    ;
    elementsElement.style.width = `${baseWidth}px`;
    for (let i = 0; i < Matrix.statetoColorList.length; i++) {
        elementsElement.insertAdjacentHTML("beforeend", `<button id="element" style="background-color: ${Matrix.statetoColor(i)};"></button>`);
    }
    return 0;
}
;
main()
    .then((resolve) => {
    if (resolve === 1) {
        throw Error("Resolve Code 1");
    }
    console.log(`Program Exited with Code ${resolve}`);
})
    .catch((error) => {
    console.error(error);
});
