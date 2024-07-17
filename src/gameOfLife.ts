export enum State {
  ALIVE,
  DEAD
}

export type Grid = State[][]

type Coordinates = { row: number; col: number }

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

function isCellInGrid(grid: Grid, { row, col }: Coordinates): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length
}

function getCellNeighbours(grid: Grid, cellCoordinates: Coordinates): State[] {
  return possibleNeighbourShifts
    .map(({ row, col }) => ({ row: cellCoordinates.row + row, col: cellCoordinates.col + col }))
    .filter(possibleNeighbourCoordinates => isCellInGrid(grid, possibleNeighbourCoordinates))
    .map(({ row, col }) => grid[row][col])
}

function getLiveNeighboursCount(grid: Grid, cellCoordinates: Coordinates): number {
  return getCellNeighbours(grid, cellCoordinates)
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

function computeCellNextGeneration(grid: Grid, cellCoordinates: Coordinates): State {
  const liveNeighboursCount = getLiveNeighboursCount(grid, cellCoordinates)
  const cell = grid[cellCoordinates.row][cellCoordinates.col]

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
        computeCellNextGeneration(grid, { row: rowIndex, col: colIndex })
      ))
}