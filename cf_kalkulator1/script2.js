const display = document.querySelector('#display');
const buttonsContainer = document.querySelector('.buttons');
const operators = ['+', '-', '*', '/'];

display.innerText = '0';

function updateDisplay(value) {
    let lastChar = display.innerText.slice(-1);

    if (value === 'x') value = '*';
    if (display.innerText === '0' && operators.includes(value)) return;
    if (operators.includes(value) && operators.includes(lastChar)) return;

    if (value === ',') {
        if (/[,\+\-\*\/]/.test(lastChar)) return;
        let lastNumber = display.innerText.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes(',')) return;
        display.innerText += ',';
        return;
    }

    if (value === '%') {
        if (operators.includes(lastChar) || lastChar === '%') return;
        display.innerText += '%';
        return;
    }

    display.innerText = display.innerText === '0' && value !== ',' ? value : display.innerText + value;
}

function calculate() {
    try {
        let expression = display.innerText.replace(/,/g, ".").replace(/(\d+)%/g, "($1 / 100)");
        let lastChar = expression.slice(-1);
        
        if (expression === '0' || operators.includes(lastChar)) return;
        if (expression.includes('/0')) {
            display.innerText = "Tidak dapat dibagi 0";
            return;
        }
        
        let result = parseFloat(new Function(`return ${expression}`)());
        display.innerText = Number(result.toFixed(10)).toString().replace(".", ",");
    } catch (error) {
        display.innerText = "Error";
    }
}

function clearDisplay() {
    display.innerText = '0';
}

function backspace() {
    display.innerText = display.innerText.slice(0, -1) || '0';
}

buttonsContainer.addEventListener('click', function (event) {
    if (!event.target.matches("button")) return;
    let value = event.target.innerText;
    let id = event.target.id;

    switch (id) {
        case "clear":
            clearDisplay();
            break;
        case "backspace":
            backspace();
            break;
        case "equal":
            calculate();
            break;
        default:
            updateDisplay(value);
            break;
    }
});
