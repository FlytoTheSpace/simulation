var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var data = {
    tick: 5,
    growthProbability: 4, // The chances of growth will be `(n-1)/n`, n is the value set here
    nonBaseCellchance: 10, // Noise Concentration, 0 for None, High for very low, 3 for Maximum
};
var probabilityAssignedClass = "consider";
var inqueueClass = "inqueue";
function cellClickEvent(e) {
    var target = e.target;
    changeCellClass(target, "green");
    changeAdjacent(target, "green", "blue");
}
function changeAdjacent(target, changeto, changefrom) {
    return __awaiter(this, void 0, void 0, function () {
        var queue, i, poppedElement, neighbours, _loop_1, _i, neighbours_1, neighbour;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queue = [target];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(queue.length > 0)) return [3 /*break*/, 3];
                    poppedElement = queue.pop();
                    if (!poppedElement) {
                        return [3 /*break*/, 3];
                    }
                    if (!(poppedElement.dataset.x && poppedElement.dataset.y)) {
                        return [2 /*return*/];
                    }
                    if (poppedElement.classList.contains(changefrom)) {
                        changeCellClass(poppedElement, changeto);
                        poppedElement.classList.remove(inqueueClass);
                    }
                    neighbours = [
                        document.querySelector(".cell[data-x=\"".concat(parseInt(poppedElement.dataset.x), "\"][data-y=\"").concat(parseInt(poppedElement.dataset.y) + 1, "\"]")),
                        document.querySelector(".cell[data-x=\"".concat(parseInt(poppedElement.dataset.x), "\"][data-y=\"").concat(parseInt(poppedElement.dataset.y) - 1, "\"]")),
                        document.querySelector(".cell[data-x=\"".concat(parseInt(poppedElement.dataset.x) - 1, "\"][data-y=\"").concat(parseInt(poppedElement.dataset.y), "\"]")),
                        document.querySelector(".cell[data-x=\"".concat(parseInt(poppedElement.dataset.x) + 1, "\"][data-y=\"").concat(parseInt(poppedElement.dataset.y), "\"]")),
                    ];
                    _loop_1 = function (neighbour) {
                        if (!neighbour) {
                            return "continue";
                        } // skip if doesn't exist
                        if (neighbour.classList.contains(probabilityAssignedClass) || !neighbour.classList.contains(changefrom)) {
                            return "continue";
                        } // skip if the tile isn't base or the probability is assigned
                        if (Math.floor(Math.random() * data.growthProbability)) {
                            neighbour.classList.add(inqueueClass); // Assigne Probability
                            queue.push(neighbour);
                        }
                        else {
                            neighbour.classList.add(probabilityAssignedClass); // Failed Probability
                            // Reseted failed probability after a cooldown
                            setTimeout(function () {
                                neighbour.classList.remove(probabilityAssignedClass);
                            }, data.tick * 200);
                        }
                    };
                    for (_i = 0, neighbours_1 = neighbours; _i < neighbours_1.length; _i++) {
                        neighbour = neighbours_1[_i];
                        _loop_1(neighbour);
                    }
                    return [4 /*yield*/, new Promise(function (res, rej) {
                            setTimeout(function () {
                                res();
                            }, data.tick);
                        })];
                case 2:
                    _a.sent();
                    i++;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var celltypesList = ["blue", "white", "black", "green"];
function changeCellClass(element, _class) {
    if (element.classList.contains(_class)) {
        return true;
    }
    element.className = "";
    element.classList.add("cell");
    element.classList.add(_class);
    return true;
}
var Matrix = /** @class */ (function () {
    function Matrix(matrixElement, sidelength) {
        this.element = matrixElement;
        this.volume = Math.pow(sidelength, 2);
        this.sidelength = sidelength;
        matrixElement.style.display = "grid";
        matrixElement.style.gridTemplateColumns = "repeat(".concat(sidelength, ", auto)");
        matrixElement.style.gridTemplateRows = "repeat(".concat(sidelength, ", auto)");
        for (var i = 0; i < this.sidelength; i++) {
            for (var j = 0; j < this.sidelength; j++) {
                this.element.insertAdjacentHTML("beforeend", randCellType(true, i, j));
                this.element.lastElementChild.addEventListener("click", cellClickEvent);
            }
        }
    }
    Matrix.prototype.setall = function (random, tocell) {
        var _this = this;
        if (!random) {
            var _loop_2 = function (i) {
                setTimeout(function () { changeCellClass(_this.element.children[i], tocell || "black"); }, i * 1);
            };
            for (var i = 0; i < this.volume; i++) {
                _loop_2(i);
            }
            return;
        }
        var _loop_3 = function (i) {
            setTimeout(function () { changeCellClass(_this.element.children[i], randCellType(false)); }, i * 1);
        };
        for (var i = 0; i < this.volume; i++) {
            _loop_3(i);
        }
    };
    Matrix.cellblueHTML = "<div class=\"cell blue\"></div>";
    Matrix.cellwhiteHTML = "<div class=\"cell white\"></div>";
    Matrix.cellblackHTML = "<div class=\"cell black\"></div>";
    Matrix.cellgreenHTML = "<div class=\"cell green\"></div>";
    return Matrix;
}());
function randCellType(asHTML, i, j) {
    var random = Math.floor(Math.random() * data.nonBaseCellchance);
    var randomCell = (random < 3 ? celltypesList[random] : celltypesList[0]);
    if (asHTML) {
        return "<div class=\"cell ".concat(randomCell, "\" data-x=\"").concat(i, "\" data-y=\"").concat(j, "\"></div>");
    }
    return randomCell;
}
var gridsizelength = 100;
function main() {
    var matrixelement = document.querySelector(".matrix");
    if (matrixelement == null) {
        return 1;
    }
    var matrix = new Matrix(matrixelement, gridsizelength);
    var metadata = document.querySelector("#metadata");
    if (metadata == null) {
        return 1;
    }
    metadata.innerText = "Growth Probability: ".concat((data.growthProbability - 1) / data.growthProbability * 100, "%");
    var clearBtn = document.querySelector("#clearbtn");
    if (clearBtn == null) {
        return 1;
    }
    clearBtn.addEventListener("click", function () { matrix.setall(true); });
    return 0;
}
;
if (main() === 1) {
    console.error("Error Occured main exit status 0");
}
;
