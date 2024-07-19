export enum CellState {
  ALIVE,
  DEAD
}

export type Grid = CellState[][]

type Coordinates = { rowIndex: number; colIndex: number }

export function computeNextGeneration(grid: Grid): Grid {
  return mapCells(grid, cellNextGenerationComputer(grid))
}

function cellNextGenerationComputer(grid: Grid) {

  function computeCellNextGeneration(cellCoordinates: Coordinates): CellState {
    const liveNeighboursCount = getLiveNeighboursCount(cellCoordinates)
    const cellState = grid[cellCoordinates.rowIndex][cellCoordinates.colIndex]

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

  function getLiveNeighboursCount(cellCoordinates: Coordinates): number {
    return getCellNeighbours(cellCoordinates)
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

  function getCellNeighbours(cellCoordinates: Coordinates): CellState[] {
    return possibleNeighbourShifts
      .map(shift => shiftCoordinates(cellCoordinates, shift))
      .filter(possibleNeighbourCoordinates => isCellInGrid(possibleNeighbourCoordinates))
      .map(({ rowIndex, colIndex }) => grid[rowIndex][colIndex])
  }

  function shiftCoordinates({ rowIndex, colIndex }: Coordinates, { rowShift, colShift }: CoordinatesShift): Coordinates {
    return { rowIndex: rowIndex + rowShift, colIndex: colIndex + colShift }
  }

  function isCellInGrid({ rowIndex, colIndex }: Coordinates): boolean {
    return isRowInGrid(rowIndex) && isColInRow(grid[rowIndex], colIndex)
  }

  function isRowInGrid(rowIndex: number): boolean {
    return rowIndex >= 0 && rowIndex < grid.length
  }

  function isColInRow(row: CellState[], colIndex: number): boolean {
    return colIndex >= 0 && colIndex < row.length
  }

  return computeCellNextGeneration
}

function mapCells(grid: Grid, callbackfn: (cellCoordinates: Coordinates) => CellState): Grid {
  return grid
    .map((row, rowIndex) =>
      row.map((_, colIndex) =>
        callbackfn({ rowIndex, colIndex })))
}