import { State, computeNextGeneration } from "./gameOfLife"

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

    it('Any live cell with more than three live neighbours dies, as if by overcrowding', () => {
      const gridFourNeighbours = [[State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
      const nextGenerationFourNeighbours = computeNextGeneration(gridFourNeighbours)
      expect(nextGenerationFourNeighbours[1][1]).toEqual(State.DEAD)

      const gridFiveNeighbours = [[State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.ALIVE], [State.DEAD, State.DEAD, State.DEAD]]
      const nextGenerationFiveNeighbours = computeNextGeneration(gridFiveNeighbours)
      expect(nextGenerationFiveNeighbours[1][1]).toEqual(State.DEAD)

      const gridSixNeighbours = [[State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.DEAD, State.DEAD]]
      const nextGenerationSixNeighbours = computeNextGeneration(gridSixNeighbours)
      expect(nextGenerationSixNeighbours[1][1]).toEqual(State.DEAD)

      const gridSevenNeighbours = [[State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.DEAD]]
      const nextGenerationSevenNeighbours = computeNextGeneration(gridSevenNeighbours)
      expect(nextGenerationSevenNeighbours[1][1]).toEqual(State.DEAD)

      const gridEightNeighbours = [[State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.ALIVE], [State.ALIVE, State.ALIVE, State.ALIVE]]
      const nextGenerationEightNeighbours = computeNextGeneration(gridEightNeighbours)
      expect(nextGenerationEightNeighbours[1][1]).toEqual(State.DEAD)
    })

    it('Any live cell with two or three live neighbours lives on to the next generation', () => {
      const gridTwoNeighbours = [[State.ALIVE, State.ALIVE, State.DEAD], [State.DEAD, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
      const nextGenerationTwoNeighbours = computeNextGeneration(gridTwoNeighbours)
      expect(nextGenerationTwoNeighbours[1][1]).toEqual(State.ALIVE)

      const gridThreeNeighbours = [[State.ALIVE, State.ALIVE, State.ALIVE], [State.DEAD, State.ALIVE, State.DEAD], [State.DEAD, State.DEAD, State.DEAD]]
      const nextGenerationThreeNeighbours = computeNextGeneration(gridThreeNeighbours)
      expect(nextGenerationThreeNeighbours[1][1]).toEqual(State.ALIVE)
    })
  })
})