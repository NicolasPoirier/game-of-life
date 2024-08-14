# Game of life

## Problem Description

This Kata is about calculating the next generation of Conway’s game of life, given any starting position. See http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life for background.

You start with a two dimensional grid of cells, where each cell is either alive or dead. In this version of the problem, the grid is finite, and no life can exist off the edges. When calcuating the next generation of the grid, follow these rules:

1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
2. Any live cell with more than three live neighbours dies, as if by overcrowding.
3. Any live cell with two or three live neighbours lives on to the next generation.
4. Any dead cell with exactly three live neighbours becomes a live cell.

Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. A cell at the edges has less neighbours

You should write a program that can accept an arbitrary grid of cells, and will output a similar grid showing the next generation.

## Refactoring explained

### Compute grid next generation

#### Count live neighbours

```typescript
// This code has been writen during an iteration where the grid was only 3x3 and only the cell in the middle was checked
function computeNextGeneration(grid: State[][]): State[][] {
  let liveNeighboursCount = 0

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === State.ALIVE && (row != 1 || col != 1)) {
        liveNeighboursCount++
      }
    }
  }
  
  // ... Do something with live neighbours count
}
```

The function `computeNextGeneration` is polluted by lines of code counting live neighbours.
How live neighbours are counted is a detail for `computeNextGeneration`. It doesn't care. When we read `computeNextGeneration`, we just want to know that it needs live neighbours count.

After refactoring, `computeNextGeneration` just calls a function to get live neighbours count.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/08a74bb49c4303485eec4257051a3daf5ea1d51f)

```typescript
function computeNextGeneration(grid: State[][]): State[][] {
  const liveNeighboursCount = getLiveNeighboursCount(grid)

  // ... Do something with live neighbours count
}
```

#### Compute cell next generation

```typescript
function computeNextGeneration(grid: Grid): Grid {
  return grid
    .map((row, rowIndex) =>
      row.map((_, colIndex) => {
        const liveNeighboursCount = getLiveNeighboursCount(grid, rowIndex, colIndex)

        if (isDeadly(liveNeighboursCount)) {
          return State.DEAD
        } else if (grid[rowIndex][colIndex] === State.ALIVE || isGenerative(liveNeighboursCount)) {
          return State.ALIVE
        } else {
          return State.DEAD
        }
      }))
}
```

This function iterates through a two dimensional grid (complex use of two map functions) and for each cell, it computes its next generation (complex computation). Here, we don't have to know how a cell next generation is computed. Only that it is computed. 

To improve readability, we can extract the computation of the next generation of a cell in another function `computeCellNextGeneration`.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/70e22ae9ec348e236ce3961dad356ad1b631319f)

```typescript
function computeNextGeneration(grid: Grid): Grid {
  return grid
    .map((row, rowIndex) =>
      row.map((_, colIndex) =>
        computeCellNextGeneration(grid, rowIndex, colIndex)
      ))
}
```

#### Iterate through a two dimensional grid

To go further, we can hide the complexity of iterating through a two dimensional grid.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/d610c5b85c5cfff2fc5be0199c2d9eabba876a34)

```typescript
function computeNextGeneration(grid: Grid): Grid {
  return mapCells(grid, computeCellNextGeneration)
}

function mapCells(grid: Grid, callbackfn: (grid: Grid, cellCoordinates: Coordinates) => CellState): Grid {
  return grid
    .map((row, rowIndex) =>
      row.map((_, colIndex) =>
        callbackfn(grid, { rowIndex, colIndex })))
}
```

Now, the code literally expresses what we want it to do: 
> Iterate through a two dimensional grid and for each cell, compute its next generation.

### Count live neighbours

#### Get Neighbours

```typescript
function getLiveNeighboursCount(grid: Grid, cellRow: number, cellCol: number): number {
  let liveNeighboursCount = 0

  const aboveRow = cellRow - 1
  const belowRow = cellRow + 1
  const leftCol = cellCol - 1
  const rightCol = cellCol + 1
  for (let row = aboveRow; row <= belowRow; row++) {
    for (let col = leftCol; col <= rightCol; col++) {
      if (!isCellInGrid(row, col, grid) || (row === cellRow && col === cellCol)) {
        continue;
      }

      if (grid[row][col] === State.ALIVE) {
        liveNeighboursCount++
      }
    }
  }

  return liveNeighboursCount
}
```

The function `getLiveNeighboursCount` finds the neighbours and counts live neighbours. The code is hard to read. Especially the code to find neighbours. So let's extract it into a function `getCellNeighbours`.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/8bdb6ecbaa965755734d23d847122cd32fc63da1)

```typescript
function getLiveNeighboursCount(grid: Grid, cellRow: number, cellCol: number): number {
  return getCellNeighbours(grid, cellRow, cellCol)
    .filter(neighbour => neighbour === State.ALIVE)
    .length
}

function getCellNeighbours(grid: Grid, cellRow: number, cellCol: number): State[] {
  const neighbours: State[] = []

  const aboveRow = cellRow - 1
  const belowRow = cellRow + 1
  const leftCol = cellCol - 1
  const rightCol = cellCol + 1
  
  for (let row = aboveRow; row <= belowRow; row++) {
    for (let col = leftCol; col <= rightCol; col++) {
      if (!isCellInGrid(row, col, grid) || (row === cellRow && col === cellCol)) {
        continue;
      }

      neighbours.push(grid[row][col])
    }
  }

  return neighbours
}
```

Now, the code literally expresses what we want it to do: 
> Count live neighbours

Note that we add an iteration through neighbours. But performance gain is less significant than readability gain here. 

### Get neighbours

#### Is neighbour in the grid?

```typescript
for (let row = cellRow - 1; row <= cellRow + 1; row++) {
  if (row < 0 || row >= grid.length) {
    continue
  }

  for (let col = cellCol - 1; col <= cellCol + 1; col++) {
    if (col < 0 || col >= grid[row].length || (row === cellRow && col === cellCol)) {
      continue;
    }

    ...
  }
}
```

There are two `if` with a lot of code to check if a cell is in the grid. Instead, we just need a function `isCellInGrid` that tells us if the cell is in the grid.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/c7f1b343b093990f107433dba0c7cd7d73c74044)

```javascript
  for (let row = cellRow - 1; row <= cellRow + 1; row++) {
    for (let col = cellCol - 1; col <= cellCol + 1; col++) {
      if (!isCellInGrid(row, col, grid) || (row === cellRow && col === cellCol)) {
        continue;
      }

      ...
    }
  }

function isCellInGrid(grid: Grid, { row, col }: Coordinates): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length
}
```

Note that the previous code avoided iterating through columns of a wrong row. But performance gain is less significant than readability gain here.

To go further, we can hide some complexity from `isCellInGrid`.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/2791431c9e1dda3cfbef060e6fb77469b91c48a5)

```typescript
function isCellInGrid(grid: Grid, { row, col }: Coordinates): boolean {
  return isRowInGrid(grid, row) && isColInRow(grid[row], col)
}

function isRowInGrid(grid: Grid, row: number): boolean {
  return row >= 0 && row < grid.length
}

function isColInRow(row: CellState[], col: number): boolean {
  return col >= 0 && col < row.length
}
```

#### Iterate through neighbours

```typescript
for (let row = cellRow - 1; row <= cellRow + 1; row++) {
  for (let col = cellCol - 1; col <= cellCol + 1; col++) {
    ...
  }
}
```

What does `-1` and `+1` in the for loop mean ?

We introduce the notion of row above and below, and column left and right.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/74d3907e598a53946a9a6dd06e8dbcadfa2c355d)

```typescript
const aboveRow = cellRow - 1
const belowRow = cellRow + 1
const leftCol = cellCol - 1
const rightCol = cellCol + 1

for (let row = aboveRow; row <= belowRow; row++) {
  for (let col = leftCol; col <= rightCol; col++) {
    if (!isCellInGrid(row, col, grid) || (row === cellRow && col === cellCol)) {
      continue;
    }
    ...
  }
}
```

We have to check that the cell is not the one whose neighbours we want.

We can have an explicit list of neighbours with coordinates relative to the cell whose neighbours we want.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/0bff0126d75053f5f69e25ba3e3f3d89aebc1b24), [commit](https://github.com/NicolasPoirier/game-of-life/commit/bc02e185de7097cdac3f204596a30c5738c19495) and [commit](https://github.com/NicolasPoirier/game-of-life/commit/17adbd06cd1ce7f7a8c7bc164c796ac3bdf49925)

```typescript
const TOP_LEFT_NEIGHBOUR_SHIFT = { row: -1, col: -1 }
const TOP_CENTER_NEIGHBOUR_SHIFT = { row: -1, col: 0 }
const TOP_RIGHT_NEIGHBOUR_SHIFT = { row: -1, col: 1 }
const CENTER_LEFT_NEIGHBOUR_SHIFT = { row: 0, col: -1 }
const CENTER_RIGHT_NEIGHBOUR_SHIFT = { row: 0, col: 1 }
const BOTTOM_LEFT_NEIGHBOUR_SHIFT = { row: 1, col: -1 }
const BOTTOM_CENTER_NEIGHBOUR_SHIFT = { row: 1, col: 0 }
const BOTTOM_RIGHT_NEIGHBOUR_SHIFT = { row: 1, col: 1 }

const possibleNeighbourShifts = [
  TOP_LEFT_NEIGHBOUR_SHIFT,
  TOP_CENTER_NEIGHBOUR_SHIFT,
  TOP_RIGHT_NEIGHBOUR_SHIFT,
  CENTER_LEFT_NEIGHBOUR_SHIFT,
  CENTER_RIGHT_NEIGHBOUR_SHIFT,
  BOTTOM_LEFT_NEIGHBOUR_SHIFT,
  BOTTOM_CENTER_NEIGHBOUR_SHIFT,
  BOTTOM_RIGHT_NEIGHBOUR_SHIFT
]

function getCellNeighbours(grid: Grid, cellCoordinates: Coordinates): CellState[] {
  return possibleNeighbourShifts
    .map(shift => shiftCoordinates(cellCoordinates, shift))
    .filter(possibleNeighbourCoordinates => isCellInGrid(grid, possibleNeighbourCoordinates))
    .map(({ rowIndex, colIndex }) => grid[rowIndex][colIndex])
}

function shiftCoordinates({ rowIndex, colIndex }: Coordinates, { rowShift, colShift }: CoordinatesShift): Coordinates {
  return { rowIndex: rowIndex + rowShift, colIndex: colIndex + colShift }
}

```

Now, we have a function that iterates through possible neighbours and check if it is in the grid. `map` and `filter` are more readable than two `for loops` and an `if` with `continue`.

### Compute cell next generation

#### Deadly or generative neighbourhood

```typescript
function computeNextGeneration(grid: Grid): Grid {
  const liveNeighboursCount = getLiveNeighboursCount(grid)

  if (liveNeighboursCount < 2 || liveNeighboursCount > 3) {
    // dead
    ...
  } else if (grid[1][1] == State.ALIVE || liveNeighboursCount === 3) {
    // alive
    ...
  } else {
    // dead
    ...
  }
}
```

What do `liveNeighboursCount < 2 || liveNeighboursCount > 3` and `grid[1][1] == State.ALIVE || liveNeighboursCount === 3` mean ?

We simply want to know if the neighbourhood is deadly or generative. So let's write it clearly to improve readability by using a function `isDeadly` and a function `isGenerative`.

Here, what is a deadly or generative neighbourhood is a detail.

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/85e0503934fffeed2d0ca3f8be5b6fe461969ac5)

```typescript
function computeNextGeneration(grid: Grid): Grid {
  const liveNeighboursCount = getLiveNeighboursCount(grid)

  if (isDeadly(liveNeighboursCount)) {
    // dead
    ...
  } else if (grid[1][1] == State.ALIVE || isGenerative(liveNeighboursCount)) {
    // alive
    ...
  } else {
    // dead
    ...
  }
}

function isOvercrowded(liveNeighboursCount: number): boolean {
  return liveNeighboursCount > 3
}

function isUnderpopulated(liveNeighboursCount: number): boolean {
  return liveNeighboursCount < 2
}

function isDeadly(liveNeighboursCount: number): boolean {
  return isUnderpopulated(liveNeighboursCount) || isOvercrowded(liveNeighboursCount)
}

function isGenerative(liveNeighboursCount: number): boolean {
  return liveNeighboursCount === 3
}
```

The condition `grid[1][1] == State.ALIVE || isGenerative(liveNeighboursCount)` is still complex. The conditions can be simpler :
- If the neighbourhood is deadly, the cell dies
- If the neighbourhood is generative, the cell remains or becomes alive
- Else, the cell remains in its previous state

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/7e59b83c998055ac2e61f4ab1ab80013def6fea9)

```typescript
function computeNextGeneration(grid: Grid): Grid {
  const liveNeighboursCount = getLiveNeighboursCount(grid)

  if (isDeadly(liveNeighboursCount)) {
    // dead
    ...
  } else if (isGenerative(liveNeighboursCount)) {
    // alive
    ...
  } else {
    // previous state
    ...
  }
}
```

Now, the code literally expresses what we want it to do 

We can also add meaning to these (magic) numbers by using constants

[See commit](https://github.com/NicolasPoirier/game-of-life/commit/8cc0b0dc8ba4a20fb5ecc2995e14ee2e761da821)

```typescript
const GENERATIVE_LIVE_NEIGHBOURS_COUNT = 3
const OVERCROWDED_ABOVE_LIVE_NEIGHBOURS_COUNT = 3
const UNDERPOPULATED_BELOW_LIVE_NEIGHBOURS_COUNT = 2

function isOvercrowded(liveNeighboursCount: number): boolean {
  return liveNeighboursCount > OVERCROWDED_ABOVE_LIVE_NEIGHBOURS_COUNT
}

function isUnderpopulated(liveNeighboursCount: number): boolean {
  return liveNeighboursCount < UNDERPOPULATED_BELOW_LIVE_NEIGHBOURS_COUNT
}

function isDeadly(liveNeighboursCount: number): boolean {
  return isUnderpopulated(liveNeighboursCount) || isOvercrowded(liveNeighboursCount)
}

function isGenerative(liveNeighboursCount: number): boolean {
  return liveNeighboursCount === GENERATIVE_LIVE_NEIGHBOURS_COUNT
}
```