export enum State {
  ALIVE,
  DEAD
}

export type Grid = State[][]

const GENERATIVE_LIVE_NEIGHBOURS_COUNT = 3
const OVERCROWDED_ABOVE_LIVE_NEIGHBOURS_COUNT = 3
const UNDERPOPULATED_BELOW_LIVE_NEIGHBOURS_COUNT = 2

function isCellInGrid(row: number, col: number, grid: Grid): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length
}

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

function computeCellNextGeneration(grid: Grid, cellRow: number, cellCol: number): State {
  const liveNeighboursCount = getLiveNeighboursCount(grid, cellRow, cellCol)
  const cell = grid[cellRow][cellCol]

  if (isDeadly(liveNeighboursCount)) {
    return State.DEAD
  } else if (isGenerative(liveNeighboursCount)) {
    return State.ALIVE
  } else {
    return cell
  }
}

export function computeNextGeneration(grid: Grid): Grid {
  return grid
    .map((row, rowIndex) =>
      row.map((_, colIndex) =>
        computeCellNextGeneration(grid, rowIndex, colIndex)
      ))
}