/*eslint-disable no-trailing-spaces*/
/*eslint spaced-comment: ["error", "never"]*/
/*eslint linebreak-style: ["error", "windows"] */
export default class Magnus {
  constructor(selector) {
    this.value = document.querySelector(selector).value || '';
    this.errorList = [];
    this.ok = true;
  }

  appendError(errorMessage) {
    this.errorList = [...this.errorList, errorMessage];
    this.ok = false;
  }

  required(errorMessage = 'Debe completar el campo.') {
    if (!this.value) {
      this.appendError(errorMessage);
    }
    return this;
  }

  numeric(errorMessage = 'El campo no es un número.') {
    const parsedNumber = +this.value;

    if (isNaN(parsedNumber) || !this.value) {
      this.appendError(errorMessage);
    }
    return this;
  }

  minNumber(minNumber, errorMessage = 'No cumple con el valor mínimo.') { 
    const parsedNumber = +this.value; 

    if (!isNaN(parsedNumber)) {
      if (minNumber > this.value) {
        this.appendError(errorMessage);
      }
    }

    return this; 
  }

  maxNumber(maxNumber, errorMessage = 'No cumple con el valor máximo.') {
    const parsedNumber = +this.value; 

    if (!isNaN(parsedNumber)) {
      if (maxNumber < this.value) {
        this.appendError(errorMessage);
      }
    }
    return this; 
  }

  minText(minLength, errorMessage = 'No cumple con la longitud mínimo.') {
    if (minLength > this.value.length) {
      this.appendError(errorMessage);
    }
  
    return this; 
  }

  maxText(maxLength, errorMessage = 'No cumple con la longitud máxima.') {
    if (maxLength < this.value.length) {
      this.appendError(errorMessage);
    }
    return this; 
  }
  
  regexPattern(pattern, errorMessage = 'No cumple con el patrón.') {
    if (!pattern.test(this.value)) {
      this.appendError(errorMessage);
    }
    return this; 
  }
}

const g = new Magnus('10');
const hg = new Magnus('Hello World');

console.log(g.minNumber(5).maxNumber(10));
console.log(hg.minText(5).maxText(30).regexPattern(/^hello/));
