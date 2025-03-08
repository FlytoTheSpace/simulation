"use strict";
class Board {
    sidelength = 0;
    sidelengthPX = 0;
    _unitlength = 0;
    _element = null;
    context = null;
    snakebody = [];
    direction = 1; /* Top, Left, Bottom, Right */
    static errors = {
        invalidNumber: new Error("Invalid Number Input"),
        invalidElement: new Error("Invalid Canvas Element Input"),
        unabletocreatecontext: new Error("Unable to Create Context")
    };
    static cellcolor = "rgb(11, 72, 202)";
    static strokestyle = "white";
    constructor(element, sidelength, sidelengthPX) {
        if (typeof (sidelength) !== "number" || !Number.isFinite(sidelength) || sidelength <= 0) {
            throw Board.errors.invalidNumber;
        }
        ;
        if (typeof (sidelengthPX) !== "number" || !Number.isFinite(sidelengthPX) || sidelengthPX <= 0) {
            throw Board.errors.invalidNumber;
        }
        ;
        if (typeof element !== "object" || element === null || !(element instanceof HTMLCanvasElement)) {
            throw Board.errors.invalidElement;
        }
        ;
        this.sidelength = sidelength;
        this.sidelengthPX = sidelengthPX;
        this._element = element;
        this._unitlength = sidelengthPX / sidelength;
        this._element.height = sidelengthPX;
        this._element.width = sidelengthPX;
        const context = this._element.getContext("2d");
        if (context === null) {
            throw Board.errors.unabletocreatecontext;
        }
        ;
        this.context = context;
        this.drawBoard();
        this.snakebody.push({
            x: Math.floor(sidelength / 2),
            y: Math.floor(sidelength / 2),
            isHead: true
        });
    }
    drawBoard() {
        this.context.fillStyle = Board.cellcolor;
        this.context.strokeStyle = Board.strokestyle;
        for (let x = 0; x < this.sidelength; x++) {
            for (let y = 0; y < this.sidelength; y++) {
                const xCord = this._unitlength * x;
                const yCord = this._unitlength * y;
                this.context.fillRect(xCord, yCord, this._unitlength, this._unitlength);
                this.context.strokeRect(xCord, yCord, this._unitlength, this._unitlength);
            }
        }
    }
    drawSquare(x, y, color) {
    }
    drawNextFrame() {
    }
}
let board;
async function main() {
    const boardelement = document.querySelector("#playground");
    if (boardelement === null) {
        return 1;
    }
    board = new Board(boardelement, 15, 500);
    return 0;
}
main().then(value => {
    if (value === 0) {
        console.log("Plain Exit");
        return;
    }
    console.error("Error Exit Code");
}).catch(error => {
    console.error("Error Caught", error);
});
