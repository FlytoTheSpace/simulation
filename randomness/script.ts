
const data = {
    tick: 5,
    growthProbability: 4, // The chances of growth will be `(n-1)/n`, n is the value set here
    nonBaseCellchance: 10, // Noise Concentration, 0 for None, High for very low, 3 for Maximum
}

const probabilityAssignedClass = "consider";
const inqueueClass = "inqueue";

let currentColor: celltypes = "green"
function cellClickEvent(e: MouseEvent): void {
    const target: HTMLDivElement = (e.target as HTMLDivElement);
    changeCellClass(target, currentColor)
    changeAdjacent(target, currentColor, "blue");
}

async function changeAdjacent(target: HTMLDivElement, changeto: celltypes, changefrom: celltypes): Promise<void> {
    const queue: HTMLDivElement[] = [target];

    let i = 0;
    while (queue.length > 0) {

        const poppedElement: HTMLDivElement | undefined = queue.pop();
        if (!poppedElement) { break; }
        if (!(poppedElement.dataset.x && poppedElement.dataset.y)) { return; }
        if (poppedElement.classList.contains(changefrom)) { changeCellClass(poppedElement, changeto); poppedElement.classList.remove(inqueueClass) }
        
        const neighbours: [
            HTMLDivElement | null,
            HTMLDivElement | null,
            HTMLDivElement | null,
            HTMLDivElement | null
        ] = [
            document.querySelector<HTMLDivElement>(`.cell[data-x="${parseInt(poppedElement.dataset.x)}"][data-y="${parseInt(poppedElement.dataset.y) + 1}"]`),
            document.querySelector<HTMLDivElement>(`.cell[data-x="${parseInt(poppedElement.dataset.x)}"][data-y="${parseInt(poppedElement.dataset.y) - 1}"]`),
            document.querySelector<HTMLDivElement>(`.cell[data-x="${parseInt(poppedElement.dataset.x) - 1}"][data-y="${parseInt(poppedElement.dataset.y)}"]`),
            document.querySelector<HTMLDivElement>(`.cell[data-x="${parseInt(poppedElement.dataset.x) + 1}"][data-y="${parseInt(poppedElement.dataset.y)}"]`),
        ];

        for (let neighbour of neighbours) {
            if(!neighbour){ continue; } // skip if doesn't exist

            if(neighbour.classList.contains(probabilityAssignedClass) || !neighbour.classList.contains(changefrom)){ continue; } // skip if the tile isn't base or the probability is assigned

            
            if (Math.floor(Math.random() * data.growthProbability)) {
                neighbour.classList.add(inqueueClass); // Assigne Probability
                queue.push(neighbour);
            } else {
                neighbour.classList.add(probabilityAssignedClass); // Failed Probability
                // Reseted failed probability after a cooldown
                setTimeout(()=>{
                    neighbour.classList.remove(probabilityAssignedClass);
                }, data.tick*200)
            }

        }

        await new Promise<void>((res, rej)=>{
            setTimeout(()=>{
                res();
            }, data.tick)
        })
        i++
    }
}


type celltypes = "blue" | "white" | "black" | "green"
const celltypesList: [string, string, string, string] = ["blue", "white", "black", "green"]

function changeCellClass(element: HTMLDivElement, _class: celltypes): boolean {
    if (element.classList.contains(_class)) { return true; }

    element.className = "";

    element.classList.add("cell");
    element.classList.add(_class);

    return true;
}

class Matrix {
    static cellblueHTML: string = `<div class="cell blue"></div>`;
    static cellwhiteHTML: string = `<div class="cell white"></div>`;
    static cellblackHTML: string = `<div class="cell black"></div>`;
    static cellgreenHTML: string = `<div class="cell green"></div>`;
    element: HTMLDivElement;
    volume: number;
    sidelength: number;

    constructor(matrixElement: HTMLDivElement, sidelength: number) {
        this.element = matrixElement;
        this.volume = sidelength ** 2;
        this.sidelength = sidelength;

        matrixElement.style.display = "grid";
        matrixElement.style.gridTemplateColumns = `repeat(${sidelength}, auto)`;
        matrixElement.style.gridTemplateRows = `repeat(${sidelength}, auto)`;

        for (let i = 0; i < this.sidelength; i++) {
            for (let j = 0; j < this.sidelength; j++) {
                this.element.insertAdjacentHTML("beforeend", randCellType(true, i, j));
                (this.element.lastElementChild as HTMLDivElement).addEventListener("click", cellClickEvent);
            }
        }
    }

    setall(random: true): void;
    setall(random: false, tocell?: celltypes): void;

    setall(random: boolean, tocell?: celltypes): void {
        if (!random) {
            for (let i = 0; i < this.volume; i++) {
                setTimeout(() => { changeCellClass((this.element.children[i] as HTMLDivElement), tocell || "black") }, i * 1)
            }
            return;
        }
        for (let i = 0; i < this.volume; i++) {
            setTimeout(() => { changeCellClass((this.element.children[i] as HTMLDivElement), randCellType(false)) }, i * 1)
        }
    }
}


function randCellType(asHTML: true, i: number, j: number): string;
function randCellType(asHTML: false): celltypes;

function randCellType(asHTML: true | false, i?: number, j?: number): string | celltypes {

    const random: number = Math.floor(Math.random() * data.nonBaseCellchance);
    const randomCell: celltypes = (random < 3 ? celltypesList[random] : celltypesList[0]) as celltypes

    if (asHTML) {
        return `<div class="cell ${randomCell}" data-x="${i}" data-y="${j}"></div>`;
    }

    return randomCell;
}


const gridsizelength: number = 100;

function main(): 0 | 1 {
    const matrixelement: HTMLDivElement | null = document.querySelector<HTMLDivElement>(".matrix");
    if (matrixelement == null) { return 1; }

    const matrix: Matrix = new Matrix(matrixelement, gridsizelength)

    const metadata: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#metadata");
    if (metadata == null) { return 1; }

    metadata.innerText = `Growth Probability: ${(data.growthProbability-1) / data.growthProbability * 100}%`

    const clearBtn: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#clearbtn");
    if (clearBtn == null) { return 1; }
    clearBtn.addEventListener("click", () => { matrix.setall(true); });


    return 0;
};

if (main() === 1) {
    console.error("Error Occured main exit status 0");
};