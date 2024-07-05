export enum State {
  ALIVE,
  DEAD
}

export type Grid = State[][]

function getLiveNeighboursCount(grid: Grid): number {
  let liveNeighboursCount = 0

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === State.ALIVE && (row != 1 || col != 1)) {
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
  const liveNeighboursCount = getLiveNeighboursCount(grid)

  if (isDeadly(liveNeighboursCount)) {
    return [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
  } else if (grid[1][1] == State.ALIVE || isGenerative(liveNeighboursCount)) {
    return [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
  } else {
    return [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
  }
}