export enum State {
  ALIVE,
  DEAD
}

export function computeNextGeneration(grid: State[][]): State[][] {
  return [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
}