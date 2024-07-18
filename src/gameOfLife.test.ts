import { CellState, computeNextGeneration } from "./gameOfLife"

describe('Game of life', () => {
  describe(`A two dimensional grid of cells, where each cell is either alive or dead
    The grid is finite, and no life can exist off the edges
    We calcuate the next generation of the grid following rules
    Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. A cell at the edges has less neighbours`, () => {

    it('Any live cell with fewer than two live neighbours dies, as if caused by underpopulation', () => {
      const gridZeroNeighbour = [[CellState.DEAD, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationZeroNeighbour = computeNextGeneration(gridZeroNeighbour)
      expect(nextGenerationZeroNeighbour[1][1]).toEqual(CellState.DEAD)

      const gridOneNeighbour = [[CellState.ALIVE, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationOneNeighbour = computeNextGeneration(gridOneNeighbour)
      expect(nextGenerationOneNeighbour[1][1]).toEqual(CellState.DEAD)
    })

    it('Any live cell with more than three live neighbours dies, as if by overcrowding', () => {
      const gridFourNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationFourNeighbours = computeNextGeneration(gridFourNeighbours)
      expect(nextGenerationFourNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridFiveNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationFiveNeighbours = computeNextGeneration(gridFiveNeighbours)
      expect(nextGenerationFiveNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridSixNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.DEAD]]
      const nextGenerationSixNeighbours = computeNextGeneration(gridSixNeighbours)
      expect(nextGenerationSixNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridSevenNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.DEAD]]
      const nextGenerationSevenNeighbours = computeNextGeneration(gridSevenNeighbours)
      expect(nextGenerationSevenNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridEightNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE]]
      const nextGenerationEightNeighbours = computeNextGeneration(gridEightNeighbours)
      expect(nextGenerationEightNeighbours[1][1]).toEqual(CellState.DEAD)
    })

    it('Any live cell with two or three live neighbours lives on to the next generation', () => {
      const gridTwoNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationTwoNeighbours = computeNextGeneration(gridTwoNeighbours)
      expect(nextGenerationTwoNeighbours[1][1]).toEqual(CellState.ALIVE)

      const gridThreeNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.DEAD, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationThreeNeighbours = computeNextGeneration(gridThreeNeighbours)
      expect(nextGenerationThreeNeighbours[1][1]).toEqual(CellState.ALIVE)
    })

    it('Any dead cell with exactly three live neighbours becomes a live cell', () => {
      const gridThreeNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.DEAD, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationThreeNeighbours = computeNextGeneration(gridThreeNeighbours)
      expect(nextGenerationThreeNeighbours[1][1]).toEqual(CellState.ALIVE)
    })

    it('Any dead cell with more or less than three live neighbours stays a dead cell', () => {
      const gridZeroNeighbour = [[CellState.DEAD, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationZeroNeighbour = computeNextGeneration(gridZeroNeighbour)
      expect(nextGenerationZeroNeighbour[1][1]).toEqual(CellState.DEAD)

      const gridOneNeighbour = [[CellState.ALIVE, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationOneNeighbour = computeNextGeneration(gridOneNeighbour)
      expect(nextGenerationOneNeighbour[1][1]).toEqual(CellState.DEAD)

      const gridTwoNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationTwoNeighbours = computeNextGeneration(gridTwoNeighbours)
      expect(nextGenerationTwoNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridFourNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.DEAD], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationFourNeighbours = computeNextGeneration(gridFourNeighbours)
      expect(nextGenerationFourNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridFiveNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.ALIVE], [CellState.DEAD, CellState.DEAD, CellState.DEAD]]
      const nextGenerationFiveNeighbours = computeNextGeneration(gridFiveNeighbours)
      expect(nextGenerationFiveNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridSixNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.DEAD]]
      const nextGenerationSixNeighbours = computeNextGeneration(gridSixNeighbours)
      expect(nextGenerationSixNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridSevenNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.DEAD]]
      const nextGenerationSevenNeighbours = computeNextGeneration(gridSevenNeighbours)
      expect(nextGenerationSevenNeighbours[1][1]).toEqual(CellState.DEAD)

      const gridEightNeighbours = [[CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], [CellState.ALIVE, CellState.DEAD, CellState.ALIVE], [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE]]
      const nextGenerationEightNeighbours = computeNextGeneration(gridEightNeighbours)
      expect(nextGenerationEightNeighbours[1][1]).toEqual(CellState.DEAD)
    })

    it('All cells of the grib are impacted by the rules', () => {
      const grid =
        [[CellState.DEAD, CellState.DEAD, CellState.ALIVE],
        [CellState.ALIVE, CellState.ALIVE, CellState.DEAD],
        [CellState.ALIVE, CellState.DEAD, CellState.ALIVE]]
      /*
        [[Stays dead, Becomes alive, Dies of underpopulation],
        [Stays alive, Dies of overcrowding, Becomes alive],
        [Stays alive, Stays dead, Dies of underpopulation]]
      */
      const expectedNextGeneration =
        [[CellState.DEAD, CellState.ALIVE, CellState.DEAD],
        [CellState.ALIVE, CellState.DEAD, CellState.ALIVE],
        [CellState.ALIVE, CellState.DEAD, CellState.DEAD]]

      const nextGeneration = computeNextGeneration(grid)
      expect(nextGeneration).toEqual(expectedNextGeneration)
    })
  })
})