import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["cell", "feedback"]

  answerKey() {
  // Demo-only: 5x5 grid indices 0..24. Use "#" to represent blocked squares.
    return [
      "H", "E", "L", "L", "O",
      "#", "#", "A", "#", "#",
      "W", "O", "R", "L", "D",
      "#", "#", "I", "#", "#",
      "R", "A", "I", "L", "S",
    ]
  }

  cells() {
  // Prefer scoping to this controller’s element (safer than document-wide)
    return Array.from(this.element.querySelectorAll('input[data-row][data-col]'))
  }

  check() {
    const key = this.answerKey()
    const inputs = this.cells()

    let wrong = 0
    let checked = 0

    inputs.forEach((input) => {
      const r = parseInt(input.dataset.row, 10)
      const c = parseInt(input.dataset.col, 10)
      const idx = r * 5 + c

      const expected = key[idx]
      if (!expected || expected === "#") return

      checked += 1

      const actual = (input.value || "").toUpperCase()

      // Clear prior state (IMPORTANT: remove border-transparent too)
      input.classList.remove("border-green-500", "border-red-500", "border-transparent")

      // Skip unfilled cells — no hints yet
      if (!actual) {
        input.classList.add("border-transparent")
        return
      }

      if (actual && actual === expected) {
        input.classList.add("border-green-500")
      } else {
        input.classList.add("border-red-500")
        wrong += 1
      }
    })

    if (this.hasFeedbackTarget) {
      if (checked === 0) {
        this.feedbackTarget.textContent = "Fill some letters, then check."
      } else if (wrong === 0) {
        this.feedbackTarget.textContent = "✅ Looks good so far!"
      } else {
        this.feedbackTarget.textContent = `❌ ${wrong} incorrect.`
      }
    }
  }

  clear() {
    const inputs = this.cells()

    inputs.forEach((input) => {
      input.value = ""
      input.classList.remove("border-green-500", "border-red-500", "border-transparent")
      input.classList.add("border-transparent")
    })

    if (this.hasFeedbackTarget) {
      this.feedbackTarget.textContent = ""
    }

    // Put the cursor back at the first playable cell
    if (inputs.length > 0) {
      inputs[0].focus()
      inputs[0].select()
    }
  }

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
