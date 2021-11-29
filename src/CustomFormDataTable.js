/* eslint-disable */
function MagnusValidator(value) {
  this.value = value;
  this.errorList = [];
  this.ok = true;
}

function appendError(errorMessage, context) {
  context.errorList = [...context.errorList, errorMessage];
  context.ok = false;
}

MagnusValidator.prototype.required = function (errorMessage = 'Debe completar el campo.') {
  if (!this.value.trim()) {
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
  if (minNumber === null || typeof minNumber !== 'number') throw new Error('Debe agregar el primer parámetro.');
  const parsedNumber = +this.value;
  if (!isNaN(parsedNumber)) {
    if (minNumber > this.value) {
      appendError(errorMessage, this);
    }
  }
  return this;
};

MagnusValidator.prototype.maxNumber = function (maxNumber = null, errorMessage = 'No cumple con el valor máximo.') {
  if (maxNumber === null || typeof maxNumber !== 'number') throw new Error('Debe agregar el primer parámetro.');
  const parsedNumber = +this.value;
  if (!isNaN(parsedNumber)) {
    if (maxNumber < this.value) {
      appendError(errorMessage, this);
    }
  }
  return this;
};

MagnusValidator.prototype.minText = function (minLength = null, errorMessage = 'No cumple con la longitud mínima.') {
  if (minLength === null || typeof minLength !== 'number') throw new Error('Debe agregar el primer parámetro.');
  if (minLength > this.value.length) {
    appendError(errorMessage, this);
  }
  return this;
};

MagnusValidator.prototype.maxText = function (maxLength = null, errorMessage = 'No cumple con la longitud máxima.') {
  if (maxLength === null || typeof maxLength !== 'number') throw new Error('El primer parámetro debe ser un número.');
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

MagnusValidator.prototype.noValidate = function () {
  this.errorList = [];
  this.ok = true;
  return this;
};

function initialConfigDataTable(headers) {
  const columns = [];
  const columnDefs = [];
  headers.forEach((column, index) => {
    const { orderable = true, searchable = true, ...others } = column;
    columns.push({ ...others });

    if (!orderable || !searchable) {
      columnDefs.push({ targets: [index], searchable, orderable });
    }
    
  });
  return [columns, columnDefs];
}

function InitStore() {
  Alpine.store('list', {
    currentIndex: -1,
    values: {},
    changeId(index) {
      this.currentIndex = index;
    },
  });
}

function InitDatatable({ title, headers, data, ...others }) {
  const [columns, columnDefs] = initialConfigDataTable(headers);
  new DataTable('#powertable', {
    processing: true,
    deferRender: true,
    columns,
    columnDefs,
    data,
    ...others,
  });
  Alpine.data('tablecontainer', () => ({
    title: title || 'Listado',
  }));
}

function InitForm(form, list = []) {
  const baseInput = {
    placeholder: '',
    small: '',
    class: 'col-lg-12',
    value: '',
    error: '',
  };

  let inputsPK = [];
  if (form.inputsPK !== undefined) {
    inputsPK = form.inputsPK.map((e) => ({ ...baseInput, ...e }));
  }

  const inputs = form.inputs.map((e) => ({ ...baseInput, ...e }));

  Alpine.effect(() => {
    const index = Alpine.store('list').currentIndex;
    if (index !== -1) {
      const currentRow = list[index];
      Alpine.store('list').values = { ...currentRow };
    }
  });

  Alpine.data('formcontainer', () => ({
    title: form.title || 'Gestionar',
    _token: form._token,
    url: form.url || '',
    inputsPK,
    inputs,

    get currentMethod() {
      const currentIndex = this.$store.list.currentIndex;
      return currentIndex === -1 ? 'POST' : 'PUT';
    },

    get getNameSubmitBtn() {
      const valuesInRow = this.$store.list.values;
      const currentIndex = this.$store.list.currentIndex;

      if (currentIndex !== -1) {
        this.inputs = this.inputs.map((i) => {
          const value = valuesInRow[i.name] + '' || '';
          return { ...i, error: '', value };
        });

        this.inputsPK = this.inputsPK.map((i) => {
          const value = valuesInRow[i.name] + '' || '';
          return { ...i, error: '', value };
        });
      }

      return currentIndex === -1 ? 'Agregar' : 'Editar';
    },

    checkInput(index) {
      let errors = [];
      const currentInput = this.inputs[index];

      if (currentInput.validator && typeof currentInput.validator === 'function') {
        const { errorList } = currentInput.validator(currentInput.value);
        errors = errorList;
      }

      this.inputs[index] = {
        ...currentInput,
        error: errors.join(' '),
      };
    },

    resetForm() {
      this.$store.list.currentIndex = -1;
      this.inputs = this.inputs.map((i) => ({ ...i, error: '', value: '' }));
    },

    validateForm() {
      this.inputs.forEach((_, i) => this.checkInput(i));
    },

    handleSubmit(e) {
      this.validateForm();
      this.$nextTick(() => {
        const formIsValid = !this.$refs.formulario.querySelectorAll('.has-error').length;
        if (formIsValid) {
          this.$refs.formulario.submit();
        }
      });
    },
  }));
}

function mountComponents(form, datatable = null) {
  document.addEventListener('alpine:init', () => {
    InitStore();
    if (datatable !== null) InitDatatable(datatable);
    InitForm(form, datatable.data);
  });
}
