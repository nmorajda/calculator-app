class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement, memoryTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.memoryTextElement = memoryTextElement;
    this.readyToReset = false;
    this.memory = null;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    if (this.currentOperand.length) {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    } else {
      this.operation = '';
      this.currentOperand = this.previousOperand;
      this.previousOperand = '';
    }
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.currentOperand !== '' && this.previousOperand !== '') this.compute();
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;

      case '-':
        computation = prev - current;
        break;

      case 'x':
        computation = prev * current;
        break;

      case '/':
        computation = prev / current;
        break;

      default:
        return;
    }

    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  memoryClear() {
    this.memory = null;
  }

  memoryPlus() {
    if (this.currentOperand === '') return;
    this.memory ? this.memory += parseFloat(this.currentOperand) : this.memory = parseFloat(this.currentOperand);
  }

  memoryMinus() {
    if (this.currentOperand === '') return;
    this.memory ? this.memory -= parseFloat(this.currentOperand) : this.memory = -parseFloat(this.currentOperand);
  }

  memoryRead() {
    if (this.memory === null) return;
    this.currentOperand = this.memory;
  }

  updateDisplay() {
    if (this.memory !== null) {
      this.memoryTextElement.innerText = `M: ${this.memory}`;
    } else {
      this.memoryTextElement.innerText = '';
    }

    this.currentOperandTextElement.innerText = this.currentOperand;

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  // change theme selectors
  const inpsSwitchTheme = document.querySelectorAll('.calc__theme__selector input[type="checkbox"]'); // Calculator DOM elements

  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.querySelector('[data-equals]');
  const deleteButton = document.querySelector('[data-delete]');
  const allClearButton = document.querySelector('[data-all-clear]');
  const memoryTextElement = document.querySelector('[data-memory]');
  const previousOperandTextElement = document.querySelector('[data-previous-operand]');
  const currentOperandTextElement = document.querySelector('[data-current-operand]');
  const memoryClearButton = document.querySelector('[data-memory-clear]');
  const memoryPlusButton = document.querySelector('[data-memory-plus]');
  const memoryMinusButton = document.querySelector('[data-memory-minus]');
  const memoryReadButton = document.querySelector('[data-memory-read]');
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, memoryTextElement);
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.readyToReset) {
        calculator.currentOperand = '';
        calculator.readyToReset = false;
      }

      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    });
  });
  operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText);
      calculator.updateDisplay();
    });
  });
  allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
  });
  equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
  });
  deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
  });
  memoryClearButton.addEventListener('click', button => {
    calculator.memoryClear();
    calculator.updateDisplay();
  });
  memoryPlusButton.addEventListener('click', button => {
    calculator.memoryPlus();
    calculator.updateDisplay();
  });
  memoryMinusButton.addEventListener('click', button => {
    calculator.memoryMinus();
    calculator.updateDisplay();
  });
  memoryReadButton.addEventListener('click', button => {
    calculator.memoryRead();
    calculator.updateDisplay();
  });

  const mapKeyCode = code => {
    switch (code) {
      case 'NumpadAdd':
        return '+';

      case 'NumpadSubtract':
        return '-';

      case 'NumpadMultiply':
        return 'x';

      case 'NumpadDivide':
        return '/';
    }
  }; // numeric keypad support


  document.addEventListener('keydown', e => {
    const codes = ['Enter', 'Backspace', 'Delete', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'Numpad0', 'NumpadDecimal', 'NumpadAdd', 'NumpadSubtract', 'NumpadMultiply', 'NumpadDivide'];
    if (!codes.includes(e.code)) return;
    e.preventDefault();

    switch (e.code) {
      case 'Numpad1':
      case 'Numpad2':
      case 'Numpad3':
      case 'Numpad4':
      case 'Numpad5':
      case 'Numpad6':
      case 'Numpad7':
      case 'Numpad8':
      case 'Numpad9':
      case 'Numpad0':
        calculator.appendNumber(e.code.replace('Numpad', ''));
        break;

      case 'NumpadDecimal':
        calculator.appendNumber('.');
        break;

      case 'NumpadAdd':
      case 'NumpadSubtract':
      case 'NumpadMultiply':
      case 'NumpadDivide':
        calculator.chooseOperation(mapKeyCode(e.code));
        break;

      case 'Backspace':
        calculator.delete();
        break;

      case 'Delete':
        calculator.clear();
        break;

      case 'Enter':
        calculator.compute();
        break;
    }

    calculator.updateDisplay();
  }); // change theme support

  const removeCheckedState = inps => {
    inps.forEach(inp => {
      inp.checked = false;
    });
  };

  inpsSwitchTheme.forEach(inp => {
    inp.addEventListener('change', () => {
      removeCheckedState(inpsSwitchTheme);
      inp.checked = true;
      document.body.className = '';
      document.body.classList.add(inp.value);
    });
  });
});