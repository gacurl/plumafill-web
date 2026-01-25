// app/javascript/controllers/cell_controller.js
// Issue 2-1: data-driven grid input + navigation (no hard-coded dimensions)
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // =========================
  // Targets (Stimulus scope)
  // =========================
  static targets = ["input", "feedback"]

  // =========================
  // Lifecycle (wire/unwire)
  // =========================
  connect() {
    // Cache playable inputs in DOM order (this defines navigation order)
    this.inputsList = this.inputTargets

    // Paste is handled explicitly so we can control multi-char paste behavior
    this.onPaste = (event) => this.handlePaste(event)
    this.inputs().forEach((input) => input.addEventListener("paste", this.onPaste))
  }

  disconnect() {
    if (!this.onPaste) return
    this.inputs().forEach((input) => input.removeEventListener("paste", this.onPaste))
  }

  // =========================
  // Event handlers (behavior)
  // =========================

  input(event) {
    // If we just handled a paste, ignore the follow-up input event
    if (this.justHandledPaste) {
      this.justHandledPaste = false
      return
    }

    const currentInput = event.target

    // Keep only the last A–Z character (typing or multi-char input)
    const rawValue = currentInput.value || ""
    const letters = rawValue.match(/[a-z]/gi)

    if (!letters || letters.length === 0) {
      currentInput.value = ""
      return
    }

    const lastChar = letters[letters.length - 1].toUpperCase()

    // Guard: only allow A–Z
    if (!/^[A-Z]$/.test(lastChar)) {
      currentInput.value = ""
      return
    }

    currentInput.value = lastChar

    // Auto-advance to next playable cell (DOM order)
    const currentIndex = this.indexOf(currentInput)
    const nextInput = this.inputAtIndex(currentIndex + 1)
    this.focus(nextInput)
  }

  keydown(event) {
    const currentInput = event.target

    switch (event.key) {
      case "Enter":
        event.preventDefault()
        return

      // Arrow navigation (skip blocked cells by searching for next playable input)
      case "ArrowLeft":
        event.preventDefault()
        this.moveFocus(currentInput, 0, -1)
        return

      case "ArrowRight":
        event.preventDefault()
        this.moveFocus(currentInput, 0, 1)
        return

      case "ArrowUp":
        event.preventDefault()
        this.moveFocus(currentInput, -1, 0)
        return

      case "ArrowDown":
        event.preventDefault()
        this.moveFocus(currentInput, 1, 0)
        return

      // Backspace: clear current; if empty, move back and clear previous
      case "Backspace":
        event.preventDefault()

        if ((currentInput.value || "").length > 0) {
          currentInput.value = ""
          return
        }

        const prevInput = this.previousInput(currentInput)
        if (!prevInput) return

        prevInput.value = ""
        this.focus(prevInput)
        return

      default:
        return
    }
  }

  handlePaste(event) {
    // Own paste so we can keep the last letter and avoid multi-cell fills for now
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

    // Mirror typing behavior: advance once
    const currentIndex = this.indexOf(currentInput)
    const nextInput = this.inputAtIndex(currentIndex + 1)
    this.focus(nextInput)
  }

  // =========================
  // Navigation helpers
  // =========================

  previousInput(currentInput) {
    const currentIndex = this.indexOf(currentInput)
    return this.inputAtIndex(currentIndex - 1)
  }

  moveFocus(currentInput, rowStep, colStep) {
    const startRow = Number(currentInput.dataset.row)
    const startCol = Number(currentInput.dataset.col)

    const maxRow = this.maxRow()
    const maxCol = this.maxCol()

    let nextRow = startRow + rowStep
    let nextCol = startCol + colStep

    // Walk in a direction until we find a playable cell or leave bounds
    while (nextRow >= 0 && nextRow <= maxRow && nextCol >= 0 && nextCol <= maxCol) {
      const candidate = this.inputAt(nextRow, nextCol)
      if (candidate) {
        this.focus(candidate)
        return
      }
      nextRow += rowStep
      nextCol += colStep
    }
  }

  // =========================
  // Grid helpers (data-driven)
  // =========================

  inputs() {
    // Always use Stimulus-scoped playable inputs (blocked cells are not inputs)
    return this.inputsList
  }

  indexOf(input) {
    return this.inputs().indexOf(input)
  }

  inputAtIndex(index) {
    const list = this.inputs()
    if (index < 0 || index >= list.length) return null
    return list[index]
  }

  inputAt(row, col) {
    const rowNum = Number(row)
    const colNum = Number(col)

    // Find by dataset row/col (no hard-coded grid size)
    return this.inputs().find((input) => {
      return Number(input.dataset.row) === rowNum && Number(input.dataset.col) === colNum
    })
  }

  maxRow() {
    const rows = this.inputs().map((input) => Number(input.dataset.row))
    return rows.length ? Math.max(...rows) : 0
  }

  maxCol() {
    const cols = this.inputs().map((input) => Number(input.dataset.col))
    return cols.length ? Math.max(...cols) : 0
  }

  // =========================
  // UX helpers
  // =========================

  focus(input) {
    if (!input) return
    input.focus()
    input.select?.()
  }

  setFeedback(text) {
    if (!this.hasFeedbackTarget) return
    this.feedbackTarget.textContent = text
  }
}
