// calculator.ts
enum Operation {
  Add = '+',
  Subtract = '-',
  Multiply = '*',
  Divide = '/',
  None = ''
}

class Calculator {
  private currentValue: string = '0';
  private previousValue: string = '';
  private operation: Operation = Operation.None;
  private shouldResetScreen: boolean = false;
  
  // DOM Elements
  private displayElement: HTMLElement;
  private historyElement: HTMLElement;

  constructor() {
    this.displayElement = document.getElementById('display') as HTMLElement;
    this.historyElement = document.getElementById('history') as HTMLElement;
    this.bindEvents();
    this.updateDisplay();
  }

  private bindEvents(): void {
    // Bind number buttons
    document.querySelectorAll('.number').forEach(button => {
      button.addEventListener('click', () => {
        this.appendNumber((button as HTMLElement).innerText);
      });
    });

    // Bind operation buttons
    document.querySelectorAll('.operation').forEach(button => {
      button.addEventListener('click', () => {
        this.setOperation((button as HTMLElement).innerText as Operation);
      });
    });

    // Bind equals button
    document.getElementById('equals')?.addEventListener('click', () => {
      this.calculate();
    });

    // Bind clear button
    document.getElementById('clear')?.addEventListener('click', () => {
      this.clear();
    });

    // Bind decimal button
    document.getElementById('decimal')?.addEventListener('click', () => {
      this.appendDecimal();
    });

    // Bind delete button
    document.getElementById('delete')?.addEventListener('click', () => {
      this.delete();
    });

    // Bind keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
      if (e.key === '.') this.appendDecimal();
      if (e.key === '=' || e.key === 'Enter') this.calculate();
      if (e.key === 'Escape') this.clear();
      if (e.key === 'Backspace') this.delete();
      if (['+', '-', '*', '/'].includes(e.key)) {
        this.setOperation(e.key as Operation);
      }
    });
  }

  private appendNumber(number: string): void {
    if (this.currentValue === '0' || this.shouldResetScreen) {
      this.currentValue = number;
      this.shouldResetScreen = false;
    } else {
      this.currentValue += number;
    }
    this.updateDisplay();
  }

  private appendDecimal(): void {
    if (this.shouldResetScreen) {
      this.currentValue = '0.';
      this.shouldResetScreen = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
    this.updateDisplay();
  }

  private setOperation(operation: Operation): void {
    if (this.operation !== Operation.None) {
      this.calculate();
    }
    
    this.operation = operation;
    this.previousValue = this.currentValue;
    this.shouldResetScreen = true;
    this.updateHistory();
  }

  private calculate(): void {
    if (this.operation === Operation.None || this.shouldResetScreen) return;

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    let result = 0;

    switch (this.operation) {
      case Operation.Add:
        result = prev + current;
        break;
      case Operation.Subtract:
        result = prev - current;
        break;
      case Operation.Multiply:
        result = prev * current;
        break;
      case Operation.Divide:
        if (current === 0) {
          this.currentValue = 'Error: Division by zero';
          this.updateDisplay();
          return;
        }
        result = prev / current;
        break;
    }

    // Format the result to avoid floating point precision issues
    this.currentValue = this.formatNumber(result);
    this.operation = Operation.None;
    this.shouldResetScreen = true;
    this.updateDisplay();
    this.historyElement.innerText = '';
  }

  private formatNumber(num: number): string {
    // Convert to string and handle floating point precision
    return Number.isInteger(num) ? num.toString() : num.toFixed(10).replace(/\.?0+$/, '');
  }

  private clear(): void {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = Operation.None;
    this.shouldResetScreen = false;
    this.updateDisplay();
    this.historyElement.innerText = '';
  }

  private delete(): void {
    if (this.currentValue.length === 1 || this.currentValue === 'Error: Division by zero') {
      this.currentValue = '0';
    } else {
      this.currentValue = this.currentValue.slice(0, -1);
    }
    this.updateDisplay();
  }

  private updateDisplay(): void {
    this.displayElement.innerText = this.currentValue;
  }

  private updateHistory(): void {
    this.historyElement.innerText = `${this.previousValue} ${this.operation}`;
  }
}

// Initialize the calculator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});

export {};
