export enum State {
  ALIVE,
  DEAD
}

export type Grid = State[][]

function getLiveNeighboursCount(grid: Grid, cellRow: number, cellCol: number): number {
  let liveNeighboursCount = 0

  for (let row = cellRow - 1; row <= cellRow + 1; row++) {
    if (row < 0 || row >= grid.length) {
      continue
    }

    for (let col = cellCol - 1; col <= cellCol + 1; col++) {
      if (col < 0 || col >= grid[row].length || (row === cellRow && col === cellCol)) {
        continue;
      }

      if (grid[row][col] === State.ALIVE) {
        liveNeighboursCount++
      }
    }
  }

  return liveNeighboursCount
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

export function computeNextGeneration(grid: Grid): Grid {
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