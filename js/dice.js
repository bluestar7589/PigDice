let element = document.getElementById('newTaskModal');
let newTaskModal = new bootstrap.Modal(element);
function $(id) {
    return document.getElementById(id);
}
function generateRandomValue(minValue, maxValue) {
    var random = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return random;
}
function changePlayers() {
    let currentPlayerName = document.getElementById("current").innerText;
    let player1Name = document.getElementById("player1").value;
    let player2Name = document.getElementById("player2").value;
    if (currentPlayerName == player1Name) {
        currentPlayerName = player2Name;
    }
    else {
        currentPlayerName = player1Name;
    }
    document.getElementById("current").innerText = currentPlayerName;
}
window.onload = function () {
    let newGameBtn = document.getElementById("new_game");
    newGameBtn.onclick = createNewGame;
    document.getElementById("roll").onclick = rollDie;
    document.getElementById("hold").onclick = holdDie;
};
function createNewGame() {
    resetForm();
    if (!isPresent()) {
        alert("Please enter a name for both players");
        return;
    }
    document.getElementById("current").innerText = document.getElementById("player1").value;
    document.getElementById("lblPlayer1").textContent = document.getElementById("player1").value + "'s score";
    document.getElementById("lblPlayer2").textContent = document.getElementById("player2").value + "'s score";
    newTaskModal.show();
    document.getElementById("total").value = "0";
    document.getElementById("score1").value = "0";
    document.getElementById("score2").value = "0";
    document.getElementById("player1").setAttribute("disabled", "disabled");
    document.getElementById("player2").setAttribute("disabled", "disabled");
}
function rollDie() {
    let currTotal = parseInt(document.getElementById("total").value);
    let rollNumber = generateRandomValue(1, 6);
    document.getElementById("die").value = rollNumber.toString();
    if (rollNumber == 1) {
        changePlayers();
        currTotal = 0;
    }
    else {
        currTotal += rollNumber;
    }
    document.getElementById("total").value = currTotal.toString();
    let currentPlayerName = document.getElementById("current").innerText;
    let player1Name = document.getElementById("player1").value;
    let finalScore = 0;
    if (currentPlayerName == player1Name) {
        finalScore = parseInt(document.getElementById("score1").value) + currTotal;
    }
    else {
        finalScore = parseInt(document.getElementById("score2").value) + currTotal;
    }
    if (finalScore >= 100) {
        let currentPlayerName = document.getElementById("current").innerText;
        let player1Name = document.getElementById("player1").value;
        let player2Name = document.getElementById("player2").value;
        let winner = "";
        if (currentPlayerName == player1Name) {
            winner = player1Name + " is the winner";
        }
        else {
            winner = player2Name + " is the winner";
        }
        document.getElementById("winner").innerText = winner;
        document.getElementById("winner").style.visibility = "visible";
        newTaskModal.hide();
    }
}
function holdDie() {
    let currentPlayerName = document.getElementById("current").innerText;
    let player1Name = document.getElementById("player1").value;
    if (currentPlayerName == player1Name) {
        let score1 = parseInt(document.getElementById("score1").value);
        let total = parseInt(document.getElementById("total").value);
        score1 += total;
        document.getElementById("score1").value = score1.toString();
    }
    else {
        let score2 = parseInt(document.getElementById("score2").value);
        let total = parseInt(document.getElementById("total").value);
        score2 += total;
        document.getElementById("score2").value = score2.toString();
    }
    document.getElementById("total").value = "0";
    document.getElementById("die").value = "0";
    changePlayers();
}
function resetForm() {
    $("score1").value = "";
    $("score2").value = "";
    $("die").value = "";
    $("total").value = "";
}
function isPresent() {
    let player1 = $("player1").value;
    let player2 = $("player2").value;
    if (player1 == "" || player2 == "") {
        return false;
    }
    return true;
}
