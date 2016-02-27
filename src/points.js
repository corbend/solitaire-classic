
export default class PointChecker {

	constructor(cells) {
		this.cells = cells;

		this.cellMap = {};

		this.cells.forEach((c) => {
			this.cellMap[[c.x, c.y].join(",")] = c;
		});
	}
	_scanForDirection(cell, direction) {
		
        let currentSibling;
        let vm = this;

        if (direction == "leftTopDiagonal") {
            currentSibling = vm.cellMap[[cell.x - 1, cell.y - 1].join(",")];
        } else if (direction == "rightBottomDiagonal") {
            currentSibling = vm.cellMap[[cell.x + 1, cell.y + 1].join(",")];
        } else if (direction == "leftBottomDiagonal") {
            currentSibling = vm.cellMap[[cell.x - 1, cell.y + 1].join(",")];
        } else if (direction == "rightTopDiagonal") {
            currentSibling = vm.cellMap[[cell.x + 1, cell.y - 1].join(",")];
        } else if (direction == "rightHorizontal") {
            currentSibling = vm.cellMap[[cell.x + 1, cell.y].join(",")];
        } else if (direction == "leftHorizontal") {
            currentSibling = vm.cellMap[[cell.x - 1, cell.y].join(",")];
        } else if (direction == "topVertical") {
            currentSibling = vm.cellMap[[cell.x, cell.y - 1].join(",")];
        } else if (direction == "bottomVertical") {
            currentSibling = vm.cellMap[[cell.x, cell.y + 1].join(",")];
        }

        function isProperSibling(siblingCell) {
            return siblingCell && siblingCell.color.name === cell.color.name;
        }

        return {
            cell: currentSibling,
            valid: isProperSibling(currentSibling)
        }
	}
	getSiblings(cell) {

        let directions =  {
            "leftTopDiagonal": 0,
            "rightBottomDiagonal": 0,
            "leftHorizontal": 0,
            "rightHorizontal": 0,
            "leftBottomDiagonal": 0,
            "rightTopDiagonal": 0,
            "topVertical": 0,
            "bottomVertical": 0
        };

        var metaDirections = {
            "--": {
                dirNames: ['leftHorizontal', 'rightHorizontal'],
                counter: 1,
                siblings: []
            },
            "||": {
                dirNames: ['topVertical', 'bottomVertical'],
                counter: 1,
                siblings: []
            },
            "\\": {
                dirNames: ['leftTopDiagonal', 'rightBottomDiagonal'],
                counter: 1,
                siblings: []
            },
            "//": {
                dirNames: ['leftBottomDiagonal', 'rightTopDiagonal'],
                counter: 1,
                siblings: []
            }
        };

        Object.keys(directions).forEach((directionName) => {
            let siblingOk = true;
            let lastCell = cell;
            let counter = 0;
            let cellInfo = {valid: true, cell: cell};
            //console.log("scan direction" + directionName + " -> start");
            while (cellInfo.valid) {
                
                cellInfo = this._scanForDirection(cellInfo.cell, directionName);
                if (cellInfo.valid) {
                    counter++;

                    Object.keys(metaDirections).forEach((mt) => {
                        if (metaDirections[mt].dirNames.indexOf(directionName) != -1) {
                            metaDirections[mt].siblings.push(cellInfo.cell);
                        }
                    });
                }
                //console.log("sibling info", cellInfo);
            }
            //console.log("scan direction" + directionName + " -> stop");
            directions[directionName] = counter;
        });

        Object.keys(metaDirections).forEach((md) => {
            metaDirections[md].directions = [];
            metaDirections[md].dirNames.forEach((dn) => {
                metaDirections[md].directions.push(directions[dn]);
            })                
        })
        
        var maxByDirection = 0;
        var maxInMeta = null;

        Object.keys(metaDirections).forEach((metaDirectionName) => {
            var sum = 1;
            var metaDirection = metaDirections[metaDirectionName];

            metaDirection.directions.forEach((direction_counter) => {
                sum += direction_counter;
            });
            metaDirection.counter = sum;
            if (maxByDirection < sum) {
                maxByDirection = sum;
                maxInMeta = metaDirectionName;
            }
        });

        //if (metaDirections[maxInMeta].siblings.length > 1) {
            //console.log("MAX_LENGTH = ", cell.x + "," + cell.y, maxByDirection, metaDirections[maxInMeta].siblings);
        //}

        return metaDirections[maxInMeta].siblings;

	}
}