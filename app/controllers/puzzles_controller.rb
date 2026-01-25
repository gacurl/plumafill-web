class PuzzlesController < ApplicationController
  def demo
    @grid = PuzzleDemo.grid
    @slots = PuzzleDemo.slots(@grid)
  end
end
