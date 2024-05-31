let element = document.getElementById('newTaskModal');
let newTaskModal = new bootstrap.Modal(element);
function $(id) {
    return document.getElementById(id);
}
window.onload = function () {
    let newGameBtn = document.getElementById("new_game");
    newGameBtn.onclick = createNewGame;
    document.getElementById("roll").onclick = rollDie;
    document.getElementById("hold").onclick = holdDie;
};
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
    let currTotal = getCurrentTotal();
    let dieImg = getDieImageElement();
    let rollNumber = generateRandomValue(1, 6);
    let sound = document.getElementById('diceSound');
    sound.play();
    updateDieImage(dieImg, rollNumber);
    updateDieValue(rollNumber);
    if (rollNumber == 1) {
        changePlayers();
        currTotal = 0;
    }
    else {
        currTotal = handleRollGreaterThanOne(currTotal, rollNumber);
    }
    updateTotalValue(currTotal);
    checkForWinner(currTotal);
}
function getCurrentTotal() {
    return parseInt(document.getElementById("total").value);
}
function getDieImageElement() {
    return document.getElementById("diceIMG");
}
function updateDieImage(dieImg, rollNumber) {
    dieImg.src = "../pics/dice-" + rollNumber + ".png";
}
function updateDieValue(rollNumber) {
    document.getElementById("die").value = rollNumber.toString();
}
function handleRollGreaterThanOne(currTotal, rollNumber) {
    return currTotal += rollNumber;
}
function updateTotalValue(currTotal) {
    document.getElementById("total").value = currTotal.toString();
}
function checkForWinner(currTotal) {
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
        announceWinner(currentPlayerName, player1Name);
    }
}
function announceWinner(currentPlayerName, player1Name) {
    let player2Name = document.getElementById("player2").value;
    let winner = "";
    if (currentPlayerName == player1Name) {
        winner = player1Name + " is the winner";
    }
    else {
        winner = player2Name + " is the winner";
    }
    document.getElementById("winner").innerText = winner;
    document.getElementById("winner").style.color = "red";
    document.getElementById("winner").style.visibility = "visible";
    newTaskModal.hide();
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
    let dieImg = document.getElementById("diceIMG");
    dieImg.src = "";
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
