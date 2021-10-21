/*eslint-disable no-restricted-syntax*/
/*eslint-disable func-names */
/*eslint-disable no-trailing-spaces*/
/*eslint spaced-comment: ["error", "never"]*/
/*eslint linebreak-style: ["error", "windows"] */
function MagnusValidator(value) {
  try {
    this.value = value.trim();
    this.errorList = [];
    this.withError = false;
  } catch {
    throw new Error('Input no encontrado.');
  }
}

function appendError(errorMessage, context) {
  context.errorList = [...context.errorList, errorMessage];
  context.withError = true;
}

MagnusValidator.prototype.required = function (errorMessage = 'Debe completar el campo.') {
  if (!this.value) {
    appendError(errorMessage, this);
  }
  return this;
};

MagnusValidator.prototype.numeric = function (errorMessage = 'El campo no es un número.') {
  const parsedNumber = +this.value;
  if (isNaN(parsedNumber) || !this.value) {
    appendError(errorMessage, this);
  }
  return this;
};

MagnusValidator.prototype.minNumber = function (minNumber = null, errorMessage = 'No cumple con el valor mínimo.') {
  if (minNumber === null) throw new Error('Debe agregar el primer parámetro.');
  const parsedNumber = +this.value;
  if (!isNaN(parsedNumber)) {
    if (minNumber > this.value) {
      appendError(errorMessage, this);
    }
  }
  return this;
};

MagnusValidator.prototype.maxNumber = function (maxNumber = null, errorMessage = 'No cumple con el valor máximo.') {
  if (maxNumber === null) throw new Error('Debe agregar el primer parámetro.');
  const parsedNumber = +this.value;
  if (!isNaN(parsedNumber)) {
    if (maxNumber < this.value) {
      appendError(errorMessage, this);
    }
  }
  return this;
};

MagnusValidator.prototype.minText = function (minLength = null, errorMessage = 'No cumple con la longitud mínima.') {
  if (minLength === null) throw new Error('Debe agregar el primer parámetro.');
  if (minLength > this.value.length) {
    appendError(errorMessage, this);
  }
  return this;
};

MagnusValidator.prototype.maxText = function (maxLength = null, errorMessage = 'No cumple con la longitud máxima.') {
  if (maxLength === null) throw new Error('Debe agregar el primer parámetro.');
  if (maxLength < this.value.length) {
    appendError(errorMessage, this);
  }
  return this;
};

MagnusValidator.prototype.regexPattern = function (pattern, errorMessage = 'No cumple con el patrón.') {
  if (!pattern.test(this.value)) {
    appendError(errorMessage, this);
  }
  return this;
};
