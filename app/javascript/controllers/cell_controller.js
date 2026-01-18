import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  input(event) {
    let value = event.target.value

    // Allow letters only
    value = value.replace(/[^a-zA-Z]/g, "")

    // Uppercase
    event.target.value = value.toUpperCase()

    // Auto-advance if a letter was entered
    if (value.length === 1) {
      const inputs = Array.from(document.querySelectorAll('input[data-controller="cell"]'))
      const index = inputs.indexOf(event.target)

      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus()
      }
    }
  }

  keydown(event) {
    console.log("KEYDOWN", event.key, event.target.dataset.row, event.target.dataset.col)
    const key = event.key

    // Backspace behavior
    if (key === "Backspace") {
      event.preventDefault()

      // If this cell has a value, clear it and stay
      if (event.target.value) {
        event.target.value = ""
        return
      }

      // If empty, move left to previous playable cell and clear it
      const size = 5
      let r = parseInt(event.target.dataset.row, 10)
      let c = parseInt(event.target.dataset.col, 10)

      // Walk backward through the grid, wrapping to the previous row
      while (true) {
        c -= 1
        if (c < 0) {
          r -= 1
          c = size -1
        }

        if (r < 0) break

        const prev = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`)
        if (prev) {
          prev.focus()
          prev.select()
          prev.value = ""
          break
        }
      }

      return
    }

    const directions = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }

    if (!directions[key]) return
    event.preventDefault()

    const [dr, dc] = directions[key]
    const size = 5

    let r = parseInt(event.target.dataset.row, 10)
    let c = parseInt(event.target.dataset.col, 10)

    while (true) {
      r += dr
      c += dc

      if (r < 0 || r >= size || c < 0 || c >= size) break

      const next = document.querySelector(`input[data-row="${r}"][data-col="${c}"]`)
      if (next) {
        next.focus()
        next.select()
        break
      }
    }
  }
}
