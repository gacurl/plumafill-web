// app/javascript/controllers/cell_controller.js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="cell"
export default class extends Controller {
  input(event) {
    let value = event.target.value

    //Allow letters only
    value = value.replace(/[^a-zA-Z]/g, "")

    //Uppercase
    event.target.value = value.toUpperCase()

    //Auto-advance if a letter was entered
    if (value.length === 1) {
      const inputs = Array.from(document.querySelectorAll('input[data-controller="cell"]'))
      const index = inputs.indexOf(event.target)

      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus()
      }
    }
  }
}
