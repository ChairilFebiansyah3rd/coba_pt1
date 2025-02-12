const display = document.querySelector('#display');
const buttons = document.querySelectorAll('button');
const operators = ['+', '-', '*', '/'];

display.innerText = '0';

function updateDisplay(value) {
    let lastChar = display.innerText.slice(-1);

    // Ubah "x" menjadi "*" agar bisa dikalkulasi
    if (value === "x") value = "*";

    // Jika input pertama adalah operator selain '-', jangan tampilkan
    if (display.innerText === "0" && operators.includes(value)) return;

    // Mencegah dua operator berturut-turut
    if (operators.includes(value) && operators.includes(lastChar)) return;

    // Tangani desimal (koma)
    if (value === ",") {
        // Mencegah koma berturut-turut atau setelah operator
        if (lastChar === "," || operators.includes(lastChar)) return;

        // Cek jika angka sebelumnya sudah memiliki koma
        let lastNumber = display.innerText.split(/[\+\-\*\/]/).pop();
        if (lastNumber.includes(",")) return;

        display.innerText += ",";
        return;
    }

    // Tangani input persen agar tetap tampil "50%" di layar
    if (value === "%") {
        if (operators.includes(lastChar) || lastChar === "%") return;
        display.innerText += "%";
        return;
    }

    // Jika display masih '0', ganti kecuali angka yang ditekan adalah titik
    if (display.innerText === "0" && value !== ",") {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}

function calculate() {
    try {
        let expression = display.innerText;

        // Mengonversi koma ke titik sebelum dihitung
        expression = expression.replace(/,/g, ".");

        // Mengonversi persentase: "50%" → "50 / 100"
        expression = expression.replace(/(\d+)%/g, "($1 / 100)");

        let lastChar = expression.slice(-1);

        // Mencegah kalkulasi jika input kosong atau diakhiri operator
        if (expression === "0" || operators.includes(lastChar)) return;

        // Cegah pembagian oleh nol
        if (expression.includes("/0")) {
            display.innerText = "tidak dapat dibagi 0";
            return;
        }

        // Evaluasi ekspresi dengan Function() untuk keamanan
        let result = Function(`"use strict"; return (${expression})`)();

        // Batasi jumlah digit hasil ke 10 digit
        display.innerText = Number(result.toFixed(10)).toString().replace(".",",");
    } catch (error) {
        display.innerText = "Error"; // Tampilkan "Error" jika terjadi kesalahan
    }
}

function clear() {
    display.innerText = "0";
}

function backspace() {
    display.innerText = display.innerText.slice(0, -1) || "0";
}

buttons.forEach((item) => {
    item.addEventListener('click', function () {
        let value = this.innerText;

        if (this.id === "clear") {
            clear();
        } else if (this.id === "backspace") {
            backspace();
        } else if (this.id === "equal") {
            calculate();
        } else {
            updateDisplay(value);
        }
    });
});