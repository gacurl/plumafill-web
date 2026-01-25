# app/models/puzzle_demo.rb
class PuzzleDemo
  def self.grid
    [
      [ "C", "A", "T", nil, "D", "O", "G" ],
      [ "A", nil, "R", nil, "O", nil, "E" ],
      [ "R", "A", "T", "E", "S", nil, "E" ],
      [ nil, nil, nil, nil, "E", nil, nil ],
      [ "B", "I", "R", "D", "S", "E", "E" ]
    ]
  end

  def self.slots(grid = self.grid)
    slots = []
    rows = grid.length
    cols = grid.first.length

    rows.times do |r|
      cols.times do |c|
        next if grid[r][c].nil?

        # Across slot start: left is blocked/out-of-bounds
        if c == 0 || grid[r][c-1].nil?
          length = 0
          while (c + length) < cols && !grid[r][c + length].nil?
            length += 1
          end

          cells = (0...length).map { |offset| [r, c + offset] }
          slots << {
            orientation: "across",
            row: r,
            col: c,
            length: length,
            cells: cells
          } if length > 1
        end

        # Down slot start: above is blocked/out-of-bounds
        if r == 0 || grid[r - 1][c].nil?
          length = 0
          while (r + length) < rows && !grid[r + length][c].nil?
            length += 1
          end

          cells = (0...length).map { |offset| [r + offset, c] }
          slots << {
            orientation: "down",
            row: r,
            col: c,
            length: length,
            cells: cells
          } if length > 1
        end
      end
    end

    slots
  end
end
