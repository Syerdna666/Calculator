class Calc {
    static reset() {
        Calc.sum = undefined;
        Calc.operatorMemory = undefined;
        Calc.equated = undefined;
    }
    static add(a, b) {
        return a + b;
    }
    static substract(a, b) {
        return a - b;
    }
    static multiply(a, b) {
        return a * b;
    }
    static divide(a, b) {
        return a / b;
    }

    static operate(input, operator) {

        //debugger;

        if (Calc.operatorMemory === undefined) {
            Calc.operatorMemory = operator;
        }

        if (Calc.sum === undefined) {
            Calc.sum = input;

        } else if (Calc.equated && Number.isNaN(input)) {
            Calc.equated = false;
        } else if (Number.isNaN(input) && Calc.sum != undefined) {
            Calc.operatorMemory = operator;
            return;
        } else {

            // Run Calculation
            Calc.sum = Calc[Calc.operatorMemory](Calc.sum, input);

            // Check if Operator is not equate
            if (!(operator === 'equate')) {

                Calc.operatorMemory = operator;
                Calc.equated = false;
            } else {
                // Reset Operator Memory 
                Calc.operatorMemory = undefined;
                Calc.equated = true;
            }

        }
        return (Calc.sum);

    }
}
// Declaring Calc Variables
Calc.sum;
Calc.operatorMemory;
Calc.equated;

class Event {
    static captureInput() {
        Event.inputSource.addEventListener('click', (e) => {


            // Check if User Clicked on a Number and then Capture Number as string
            if (e.target.className === 'numpad') {

                // Check if Last Input was Equate, If so Reset Calc for Fresh Calculation
                if (Event.inputMemory === 'equate') {
                    Event.reset();
                    Calc.reset();
                    UI.display(0);
                }

                // Adding on to Event.inputString the input values

                // This code is to prevent multiple decimal points in input
                // Check if Input is Decimal
                if (/\./.test(e.target.textContent)) {
                    // Check if Event.input already has a Decimal to Avoid Multiple Decimal Points
                    if (!(/\./.test(Event.inputString))) {
                        // Check if user input is within UI Display Limit
                        if (Event.inputString.length < UI.displayLimit) {
                            Event.inputString += e.target.textContent
                        }
                    }
                } else /*If Input is a number, skips the decimal logic*/ {
                    // Check if user input is within UI Display Limit
                    if (Event.inputString.length < UI.displayLimit) {
                        Event.inputString += e.target.textContent
                    }
                }

                // Display Input on UI
                UI.display(Event.inputString);

                // Since Clicked Event is Numpad, Sets lnput Memory as Number. See Line 107 and 119 for Clarity
                Event.inputMemory = 'number';

            }
            // Check if User Clicked on an Operator and Run Operation
            else if (e.target.className === 'key-op' || e.target.className === 'key-eq') {

                // To Prevent Same Operator being Clicked Multiple times, see line 119 and 107 for clarity
                if (!(Event.inputMemory === e.target.dataset.action)) {
                    Event.selectedOperator = e.target.dataset.action;

                    // Convert Input String to Floating Point Number, Run Calculation & Display in UI 
                    console.log(Event.inputString, Event.selectedOperator);
                    UI.display(Calc.operate(parseFloat(Event.inputString), Event.selectedOperator));

                    // Clear Input String
                    Event.inputString = '';

                    // Saves Clicked Operator to Memory
                    Event.inputMemory = e.target.dataset.action;
                }

            }
            // If User Clicked On Clear Reset Calc
            else if (e.target.dataset.action === 'clear') {
                Event.reset();
                Calc.reset();
                UI.display(0);
            }
        });
    }

    static reset() {
        Event.inputString = '';
        Event.selectedOperator = undefined;
        Event.inputMemory = '';
    }

    static init() {
        document.addEventListener("DOMContentLoaded", function () {
            console.log('Dom Loaded');
            Event.captureInput();
        });
    }
}
// Declaring Event Variables
Event.inputSource = document.querySelector('.calc-key');
Event.inputString = '';
Event.selectedOperator;
Event.inputMemory = '';

class UI {
    static display(value) {
        if (typeof (value) === "string") {
            // Limit String to Display Limit of Calculator
            UI.displayBar.textContent = value.substring(0, UI.displayLimit);
        } else if (typeof (value) === "number") {
            // Check if Computed Number is within UI display Limit
            if (value < ((Math.pow(10, UI.displayLimit)) - 1)) {

                // Compute Trailing Decimals That can be shown without UI Overflow
                UI.displayableDecimalTrail = (UI.displayLimit) - (value.toString().split(".")[0].length);
                // Limit Trailing Decimal's Digits
                if (value % 1 != 0) {
                    UI.displayBar.textContent = parseFloat(value.toFixed(UI.displayableDecimalTrail)); // parseFloat used to remove insignificant trailing zeros
                } else {
                    UI.displayBar.textContent = value;
                }

                // If number is more than UI display Limit, Show Error
            } else {
                UI.displayBar.textContent = 'E';
            }
        }
    }
}
// Declaring UI Variables
UI.displayBar = document.querySelector('.calc-display');
UI.displayLimit = 12;
UI.displayableDecimalTrail;



// Listen For Input
Event.init();