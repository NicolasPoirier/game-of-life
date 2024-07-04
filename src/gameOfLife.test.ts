describe('Game of life', () => {
  describe(`A two dimensional grid of cells, where each cell is either alive or dead
    The grid is finite, and no life can exist off the edges
    We calcuate the next generation of the grid following rules
    Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. A cell at the edges has less neighbours`, () => {

    it('Any live cell with fewer than two live neighbours dies, as if caused by underpopulation', () => {
      const gridZeroNeighbour = [[State.DEAD, State.DEAD, State.DEAD], [State.DEAD, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
      const nextGenerationZeroNeighbour = computeNextGeneration(gridZeroNeighbour)
      expect(nextGenerationZeroNeighbour[1][1]).toEqual(State.DEAD)

      const gridOneNeighbour = [[State.ALIVE, State.DEAD, State.DEAD], [State.DEAD, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
      const nextGenerationOneNeighbour = computeNextGeneration(gridOneNeighbour)
      expect(nextGenerationOneNeighbour[1][1]).toEqual(State.DEAD)
    })
  })
})