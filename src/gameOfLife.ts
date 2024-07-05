export enum State {
  ALIVE,
  DEAD
}

export function computeNextGeneration(grid: State[][]): State[][] {
  let liveNeighboursCount = 0

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === State.ALIVE && (row != 1 || col != 1)) {
        liveNeighboursCount++
      }
    }
  }

  if (liveNeighboursCount < 2 || liveNeighboursCount > 3) {
    return [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
  } else {
    return [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
  }
}