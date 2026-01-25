// app/javascript/controllers/cell_controller.js
// Why this flows well in an interview
// -Lifecycle first: how the controller wires itself
// -Behavior next: what happens when the user interacts
// -Helpers later: implementation details
// -Reads like a story instead of a toolbox dump
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "feedback"]

  // lifecycle
  connect () {
    this.inputsList = this.inputTargets

    this.onPaste = (event) => this.handlePaste(event)
    this.inputs().forEach((input) => input.addEventListener("paste", this.onPaste))
  }

  disconnect() {
    if (!this.onPaste) return
    this.inputs().forEach((input) => input.removeEventListener("paste" , this.onPaste))
  }

  // Event handlers (user interaction)
  //typing behavior
  input(event) {
    if (this.justHandledPaste) {
      this.justHandledPaste = false
      return
    }

    const currentInput = event.target
    //normalize to a single Uppercase char
    const rawValue = (currentInput.value || "")
    // pull the last alpha char typed or pasted
    const letters = rawValue.match(/[a-z]/gi)

    if (!letters || letters.length === 0) {
      currentInput.value = ""
      return
    }

    //multiple chars? keep the last char
    const lastChar = letters[letters.length - 1].toUpperCase()

    //only accept A-Z
    if (!/^[A-Z]$/.test(lastChar)) {
      currentInput.value = ""
      return
    }

    currentInput.value = lastChar

    //auto-advance to next playable cell
    const currentIndex = this.indexOf(currentInput)
    const nextInput = this.inputAtIndex(currentIndex + 1)
    this.focus(nextInput)
  }

  // enter doesn't submit the form
  keydown(event) {
    if (event.key === "Enter") {
      event.preventDefault()
    }
  }

  handlePaste(event) {
    event.preventDefault()
    this.justHandledPaste = true

    const currentInput = event.target
    const pastedText = event.clipboardData?.getData("text") || ""

    const letters = pastedText.match(/[a-z]/gi)
    if (!letters || letters.length === 0) {
      currentInput.value = ""
      return
    }

    const lastChar = letters[letters.length - 1].toUpperCase()
    currentInput.value = lastChar

    const currentIndex = this.indexOf(currentInput)
    const nextInput = this.inputAtIndex(currentIndex + 1)
    this.focus(nextInput)
  }

  // Nav helpers
  indexOf(input) {
    return this.inputs().indexOf(input)
  }

  inputAtIndex(index) {
    const list = this.inputs()
    if (index < 0 || index >= list.length) return null
    return list[index]
  }

  // Helpers to find an input at row/col (skips blocked automatically)
  inputAt(row, col) {
    const rowNum = Number(row)
    const colNum = Number(col)

    return this.inputs().find((input) => {
      return Number(input.dataset.row) === rowNum && Number(input.dataset.col) === colNum
    })
  }

  // Grid helpers
  inputs() {
    return this.inputsList
  }

  // Grid metrics (dervied. Not hard coded)
  maxRow() {
    const rows = this.inputs().map((input) => Number(input.dataset.row))
    return rows.length ? Math.max(...rows) : 0
  }

  maxCol() {
    const cols = this.inputs().map((input) => Number(input.dataset.col))
    return cols.length ? Math.max(...cols) : 0
  }

  // UX helpers
  focus(input) {
    if (!input) return
    input.focus()
    input.select?.()
  }

  setFeedback(text) {
    if(!this.hasFeedbackTarget) return
    this.feedbackTarget.textContent = text
  }
}
