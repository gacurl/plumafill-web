class PuzzlesController < ApplicationController
  def demo
    @grid = PuzzleDemo.grid
  end
end
