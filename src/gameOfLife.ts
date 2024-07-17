export enum State {
  ALIVE,
  DEAD
}

export type Grid = State[][]

const GENERATIVE_LIVE_NEIGHBOURS_COUNT = 3
const OVERCROWDED_ABOVE_LIVE_NEIGHBOURS_COUNT = 3
const UNDERPOPULATED_BELOW_LIVE_NEIGHBOURS_COUNT = 2

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

function isCellInGrid(row: number, col: number, grid: Grid): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length
}

function getCellNeighbours(grid: Grid, cellRow: number, cellCol: number): State[] {
  return possibleNeighbourShifts
    .map(({ row, col }) => ({ row: cellRow + row, col: cellCol + col }))
    .filter(({ row, col }) => isCellInGrid(row, col, grid))
    .map(({ row, col }) => grid[row][col])
}

function getLiveNeighboursCount(grid: Grid, cellRow: number, cellCol: number): number {
  return getCellNeighbours(grid, cellRow, cellCol)
    .filter(neighbour => neighbour === State.ALIVE)
    .length
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