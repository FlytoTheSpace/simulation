"use strict";
const data = {
    tick: 5,
    growthProbability: 4, // The chances of growth will be `(n-1)/n`, n is the value set here
    nonBaseCellchance: 10, // Noise Concentration, 0 for None, High for very low, 3 for Maximum
};
const probabilityAssignedClass = "consider";
const inqueueClass = "inqueue";
let currentColor = "green";
function cellClickEvent(e) {
    const target = e.target;
    changeCellClass(target, currentColor);
    changeAdjacent(target, currentColor, "blue");
}
async function changeAdjacent(target, changeto, changefrom) {
    const queue = [target];
    let i = 0;
    while (queue.length > 0) {
        const poppedElement = queue.pop();
        if (!poppedElement) {
            break;
        }
        if (!(poppedElement.dataset.x && poppedElement.dataset.y)) {
            return;
        }
        if (poppedElement.classList.contains(changefrom)) {
            changeCellClass(poppedElement, changeto);
            poppedElement.classList.remove(inqueueClass);
        }
        const neighbours = [
            document.querySelector(`.cell[data-x="${parseInt(poppedElement.dataset.x)}"][data-y="${parseInt(poppedElement.dataset.y) + 1}"]`),
            document.querySelector(`.cell[data-x="${parseInt(poppedElement.dataset.x)}"][data-y="${parseInt(poppedElement.dataset.y) - 1}"]`),
            document.querySelector(`.cell[data-x="${parseInt(poppedElement.dataset.x) - 1}"][data-y="${parseInt(poppedElement.dataset.y)}"]`),
            document.querySelector(`.cell[data-x="${parseInt(poppedElement.dataset.x) + 1}"][data-y="${parseInt(poppedElement.dataset.y)}"]`),
        ];
        for (let neighbour of neighbours) {
            if (!neighbour) {
                continue;
            } // skip if doesn't exist
            if (neighbour.classList.contains(probabilityAssignedClass) || !neighbour.classList.contains(changefrom)) {
                continue;
            } // skip if the tile isn't base or the probability is assigned
            if (Math.floor(Math.random() * data.growthProbability)) {
                neighbour.classList.add(inqueueClass); // Assigne Probability
                queue.push(neighbour);
            }
            else {
                neighbour.classList.add(probabilityAssignedClass); // Failed Probability
                // Reseted failed probability after a cooldown
                setTimeout(() => {
                    neighbour.classList.remove(probabilityAssignedClass);
                }, data.tick * 200);
            }
        }
        await new Promise((res, rej) => {
            setTimeout(() => {
                res();
            }, data.tick);
        });
        i++;
    }
}
const celltypesList = ["blue", "white", "black", "green"];
function changeCellClass(element, _class) {
    if (element.classList.contains(_class)) {
        return true;
    }
    element.className = "";
    element.classList.add("cell");
    element.classList.add(_class);
    return true;
}
class Matrix {
    static cellblueHTML = `<div class="cell blue"></div>`;
    static cellwhiteHTML = `<div class="cell white"></div>`;
    static cellblackHTML = `<div class="cell black"></div>`;
    static cellgreenHTML = `<div class="cell green"></div>`;
    element;
    volume;
    sidelength;
    constructor(matrixElement, sidelength) {
        this.element = matrixElement;
        this.volume = sidelength ** 2;
        this.sidelength = sidelength;
        matrixElement.style.display = "grid";
        matrixElement.style.gridTemplateColumns = `repeat(${sidelength}, auto)`;
        matrixElement.style.gridTemplateRows = `repeat(${sidelength}, auto)`;
        for (let i = 0; i < this.sidelength; i++) {
            for (let j = 0; j < this.sidelength; j++) {
                this.element.insertAdjacentHTML("beforeend", randCellType(true, i, j));
                this.element.lastElementChild.addEventListener("click", cellClickEvent);
            }
        }
    }
    setall(random, tocell) {
        if (!random) {
            for (let i = 0; i < this.volume; i++) {
                setTimeout(() => { changeCellClass(this.element.children[i], tocell || "black"); }, i * 1);
            }
            return;
        }
        for (let i = 0; i < this.volume; i++) {
            setTimeout(() => { changeCellClass(this.element.children[i], randCellType(false)); }, i * 1);
        }
    }
}
function randCellType(asHTML, i, j) {
    const random = Math.floor(Math.random() * data.nonBaseCellchance);
    const randomCell = (random < 3 ? celltypesList[random] : celltypesList[0]);
    if (asHTML) {
        return `<div class="cell ${randomCell}" data-x="${i}" data-y="${j}"></div>`;
    }
    return randomCell;
}
const gridsizelength = 100;
function main() {
    const matrixelement = document.querySelector(".matrix");
    if (matrixelement == null) {
        return 1;
    }
    const matrix = new Matrix(matrixelement, gridsizelength);
    const metadata = document.querySelector("#metadata");
    if (metadata == null) {
        return 1;
    }
    metadata.innerText = `Growth Probability: ${(data.growthProbability - 1) / data.growthProbability * 100}%`;
    const clearBtn = document.querySelector("#clearbtn");
    if (clearBtn == null) {
        return 1;
    }
    clearBtn.addEventListener("click", () => { matrix.setall(true); });
    return 0;
}
;
if (main() === 1) {
    console.error("Error Occured main exit status 0");
}
;
