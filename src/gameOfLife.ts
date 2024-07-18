export enum CellState {
  ALIVE,
  DEAD
}

export type Grid = CellState[][]

type Coordinates = { row: number; col: number }

export function computeNextGeneration(grid: Grid): Grid {
  return grid
    .map((row, rowIndex) =>
      row.map((_, colIndex) =>
        computeCellNextGeneration(grid, { row: rowIndex, col: colIndex })))
}

function computeCellNextGeneration(grid: Grid, cellCoordinates: Coordinates): CellState {
  const liveNeighboursCount = getLiveNeighboursCount(grid, cellCoordinates)
  const cellState = grid[cellCoordinates.row][cellCoordinates.col]

  if (isDeadly(liveNeighboursCount)) {
    return CellState.DEAD
  } else if (isGenerative(liveNeighboursCount)) {
    return CellState.ALIVE
  } else {
    return cellState
  }
}

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

function getLiveNeighboursCount(grid: Grid, cellCoordinates: Coordinates): number {
  return getCellNeighbours(grid, cellCoordinates)
    .filter(neighbour => neighbour === CellState.ALIVE)
    .length
}

type CoordinatesShift = { rowShift: number; colShift: number }

const TOP_LEFT_NEIGHBOUR_SHIFT = { rowShift: -1, colShift: -1 }
const TOP_CENTER_NEIGHBOUR_SHIFT = { rowShift: -1, colShift: 0 }
const TOP_RIGHT_NEIGHBOUR_SHIFT = { rowShift: -1, colShift: 1 }
const CENTER_LEFT_NEIGHBOUR_SHIFT = { rowShift: 0, colShift: -1 }
const CENTER_RIGHT_NEIGHBOUR_SHIFT = { rowShift: 0, colShift: 1 }
const BOTTOM_LEFT_NEIGHBOUR_SHIFT = { rowShift: 1, colShift: -1 }
const BOTTOM_CENTER_NEIGHBOUR_SHIFT = { rowShift: 1, colShift: 0 }
const BOTTOM_RIGHT_NEIGHBOUR_SHIFT = { rowShift: 1, colShift: 1 }

const possibleNeighbourShifts: CoordinatesShift[] = [
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
    .map(({ row, col }) => grid[row][col])
}

function shiftCoordinates({ row, col }: Coordinates, { rowShift, colShift }: CoordinatesShift): Coordinates {
  return { row: row + rowShift, col: col + colShift }
}

function isCellInGrid(grid: Grid, { row, col }: Coordinates): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length
}
