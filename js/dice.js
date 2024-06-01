class Player {
}
class Game {
}
let element = $('newTaskModal');
let newTaskModal = new bootstrap.Modal(element);
let p1 = new Player();
let p2 = new Player();
let game = new Game();
function $(id) {
    return document.getElementById(id);
}
window.onload = function () {
    let newGameBtn = $("new_game");
    newGameBtn.onclick = createNewGame;
    $("roll").onclick = rollDie;
    $("hold").onclick = holdDie;
};
function createNewGame() {
    resetForm();
    if (!isPresent()) {
        alert("Please enter a name for both players");
        return;
    }
    $("current").innerText = $("player1").value;
    $("lblPlayer1").textContent = $("player1").value + "'s score";
    $("lblPlayer2").textContent = $("player2").value + "'s score";
    newTaskModal.show();
    $("total").value = "0";
    $("score1").value = "0";
    $("score2").value = "0";
    $("player1").setAttribute("disabled", "disabled");
    $("player2").setAttribute("disabled", "disabled");
    p1.name = $("player1").value;
    p1.totalScore = parseInt($("score1").value);
    p2.name = $("player2").value;
    p2.totalScore = parseInt($("score2").value);
    game.whoseTurn = p1.name;
    game.currTotal = parseInt($("total").value);
    game.stateOfGame = "Playing...";
}
function generateRandomValue(minValue, maxValue) {
    var random = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return random;
}
function changePlayers() {
    if (game.whoseTurn == p1.name) {
        game.whoseTurn = p2.name;
    }
    else {
        game.whoseTurn = p1.name;
    }
    $("current").innerText = game.whoseTurn;
}
function rollDie() {
    let dieImg = getDieImageElement();
    let rollNumber = generateRandomValue(1, 6);
    let sound = $('diceSound');
    sound.play();
    updateDieImage(dieImg, rollNumber);
    updateDieValue(rollNumber);
    if (rollNumber == 1) {
        changePlayers();
        game.currTotal = 0;
    }
    else {
        game.currTotal = handleRollGreaterThanOne(rollNumber);
    }
    updateTotalValue();
    checkForWinner();
}
function getDieImageElement() {
    return $("diceIMG");
}
function updateDieImage(dieImg, rollNumber) {
    dieImg.src = "../pics/dice-" + rollNumber + ".png";
}
function updateDieValue(rollNumber) {
    $("die").value = rollNumber.toString();
}
function handleRollGreaterThanOne(rollNumber) {
    return game.currTotal += rollNumber;
}
function updateTotalValue() {
    $("total").value = game.currTotal.toString();
}
function checkForWinner() {
    let finalScore = 0;
    if (game.whoseTurn == p1.name) {
        finalScore = p1.totalScore + game.currTotal;
    }
    else {
        finalScore = p2.totalScore + game.currTotal;
    }
    if (finalScore >= 20) {
        announceWinner();
    }
}
function announceWinner() {
    let winner = "";
    if (game.whoseTurn == p1.name) {
        winner = p1.name;
    }
    else {
        winner = p2.name;
    }
    game.stateOfGame = winner + " is the winner";
    $("winner").innerText = game.stateOfGame;
    $("winner").style.color = "red";
    $("winner").style.visibility = "visible";
    newTaskModal.hide();
}
function holdDie() {
    if (game.whoseTurn == p1.name) {
        p1.totalScore += game.currTotal;
        $("score1").value = p1.totalScore.toString();
    }
    else {
        p2.totalScore += game.currTotal;
        $("score2").value = p2.totalScore.toString();
    }
    $("total").value = "0";
    $("die").value = "0";
    game.currTotal = 0;
    changePlayers();
}
function resetForm() {
    let dieImg = $("diceIMG");
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
