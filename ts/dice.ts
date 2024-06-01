// Because I you're using Bootstrap from a CDN in your HTML file, 
// I don't need to import it in your TypeScript file. Instead, I can use the bootstrap object directly in your TypeScript file.
declare var bootstrap: any;
/**
 * Object to keep information for player
 */
class Player {
    name: string;
    totalScore: number;
}

/**
 * Object to keep information for the game
 */
class Game {
    whoseTurn: string;
    stateOfGame: string;
    currTotal: number;
}

// declare the form for playing game
let element = $('newTaskModal') as HTMLElement;
let newTaskModal = new bootstrap.Modal(element);

let p1:Player = new Player();
let p2:Player = new Player();
let game:Game = new Game();

/**
 * This function return the element by ID 
 */ 
function $(id:string): HTMLElement {
    return document.getElementById(id);
}

window.onload = function(){
    let newGameBtn = $("new_game") as HTMLButtonElement;
    newGameBtn.onclick = createNewGame;
    // add the event for button roll and hold
    (<HTMLButtonElement>$("roll")).onclick = rollDie;
    (<HTMLButtonElement>$("hold")).onclick = holdDie;
}

/**
 * To create a new game
 */
function createNewGame():void{
    //set player 1 and player 2 scores to 0
    resetForm();
    //verify each player has a name
    //if both players don't have a name display error
    if(!isPresent()){
        alert("Please enter a name for both players");
        return;
    }
    (<HTMLElement>$("current")).innerText = (<HTMLInputElement>$("player1")).value;
    (<HTMLElement>$("lblPlayer1")).textContent = (<HTMLInputElement>$("player1")).value + "'s score";
    (<HTMLElement>$("lblPlayer2")).textContent = (<HTMLInputElement>$("player2")).value + "'s score";
    // open the form to start play the game
    
    newTaskModal.show();
    //if both players do have a name start the game!
    (<HTMLInputElement>$("total")).value = "0";
    (<HTMLInputElement>$("score1")).value = "0";
    (<HTMLInputElement>$("score2")).value = "0";
    //lock in player names and then change players
    (<HTMLInputElement>$("player1")).setAttribute("disabled", "disabled");
    (<HTMLInputElement>$("player2")).setAttribute("disabled", "disabled");

    // add player1 and player2 to object player
    p1.name = (<HTMLInputElement>$("player1")).value;
    p1.totalScore = parseInt((<HTMLInputElement>$("score1")).value);
    p2.name = (<HTMLInputElement>$("player2")).value;
    p2.totalScore = parseInt((<HTMLInputElement>$("score2")).value);

    game.whoseTurn = p1.name;
    game.currTotal = parseInt((<HTMLInputElement>$("total")).value);
    game.stateOfGame = "Playing...";
}

/**
 * Generate the random value between min and max value
 * @param minValue the min value of the range
 * @param maxValue the max value of the range
 * @returns return the number in the between min and max value
 */
function generateRandomValue(minValue:number, maxValue:number):number{
    //TODO: use random to generate a number between min and max
    var random = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    
    return random;
}

/**
 * To change to next player when needed
 */
function changePlayers():void{
    
    //swap from player to player by comparing current name to player names
    //set currentPlayerName to the next player
    if (game.whoseTurn == p1.name) {
        game.whoseTurn = p2.name;
    } else {
        game.whoseTurn = p1.name;
    }
    (<HTMLElement>$("current")).innerText = game.whoseTurn;
}

/**
 * Main function for roll a dice
 */
function rollDie(): void {
    // Get the current total from the form
    //let currTotal = getCurrentTotal();

    // Get the image element for the die
    let dieImg = getDieImageElement();

    // Roll the die and get a random value 1 - 6
    let rollNumber = generateRandomValue(1, 6);

    // Add sound
    let sound = $('diceSound') as HTMLAudioElement;
    sound.play();

    // Update the image of the die based on the roll number
    updateDieImage(dieImg, rollNumber);

    // Update the value of the die in the form
    updateDieValue(rollNumber);

    // If the roll is 1, change players and set current total to 0
    if (rollNumber == 1) {
        changePlayers();
        game.currTotal = 0;
    } else {
        // If the roll is greater than 1, add roll value to current total
        game.currTotal = handleRollGreaterThanOne(game.currTotal, rollNumber);
    }

    // Update the total value in the form
    updateTotalValue(game.currTotal);

    // Check if total is greater or equal to 100, if so, announce the winner and stop the game
    checkForWinner(game.currTotal);
}


/**
 * Function to get the current total from the form
 * @returns the currently total for that turn
 */
function getCurrentTotal(): number {
    return parseInt((<HTMLInputElement>$("total")).value);
}


/**
 * Function to get the image element for the die
 * @returns the image tag by ID
 */
function getDieImageElement(): HTMLImageElement {
    return (<HTMLImageElement>$("diceIMG"));
}


/**
 * Function to update the image of the die based on the roll number
 * @param dieImg the id of the image tag
 * @param rollNumber the number that rolled out
 */
function updateDieImage(dieImg: HTMLImageElement, rollNumber: number): void {
    dieImg.src = "../pics/dice-" + rollNumber + ".png";
}


/**
 * Function to update the value of the die in the form
 * @param rollNumber the number that rolled out
 */
function updateDieValue(rollNumber: number): void {
    (<HTMLInputElement>$("die")).value = rollNumber.toString();
}


/**
 * Function to handle the case when the roll is greater than 1
 * @param currTotal the currently total for that turn
 * @param rollNumber the number that rolled out
 * @returns return the total after roll is greater than 1
 */
function handleRollGreaterThanOne(currTotal: number, rollNumber: number): number {
    return game.currTotal += rollNumber;
}


/**
 * Function to update the total value in the form
 * @param currTotal the currently total for that turn
 */
function updateTotalValue(currTotal: number): void {
    (<HTMLInputElement>$("total")).value = game.currTotal.toString();
}


/**
 * Function to check if total is greater or equal to 100, if so, announce the winner and stop the game
 * @param currTotal the currently total in that turn
 */
function checkForWinner(currTotal: number): void {
    //let currentPlayerName = (<HTMLElement>$("current")).innerText;
    let finalScore = 0;

    // Check who is the current player to get the total score
    if (game.whoseTurn == p1.name) {
        finalScore = p1.totalScore + game.currTotal;
    } else {
        finalScore = p2.totalScore + game.currTotal;
    }

    // If total score is greater or equal to 100, announce the winner
    if (finalScore >= 20) {
        announceWinner(game.whoseTurn, p1.name);
    }
}


/**
 * Function to announce the winner
 * @param currentPlayerName name of the current player
 * @param player1Name name of player 1
 */
function announceWinner(currentPlayerName: string, player1Name: string): void {
    let winner = "";

    // Determine the winner based on the current player
    if (currentPlayerName == p1.name) {
        winner = p1.name;
    } else {
        winner = p2.name;
    }

    game.stateOfGame = winner + " is the winner";
    // Display the winner and make the winner element visible
    $("winner").innerText = game.stateOfGame;
    $("winner").style.color = "red";
    (<HTMLElement>$("winner")).style.visibility = "visible";
    

    // Close the form if needed
    newTaskModal.hide();
}

/**
 * To hold the currently total and change to other player
 */
function holdDie():void{
    
    //determine who the current player is
    //add the current turn total to the player's total score
    if(game.whoseTurn == p1.name) {
        //p1.totalScore = parseInt((<HTMLInputElement>$("score1")).value);
        //game.currTotal = parseInt((<HTMLInputElement>$("total")).value);
        p1.totalScore += game.currTotal;
        (<HTMLInputElement>$("score1")).value = p1.totalScore.toString();
    } else {
        //p2.totalScore = parseInt((<HTMLInputElement>$("score2")).value);
        //let total = parseInt((<HTMLInputElement>$("total")).value);
        p2.totalScore += game.currTotal;
        (<HTMLInputElement>$("score2")).value = p2.totalScore.toString();
    }

    //reset the turn total to 0
    (<HTMLInputElement>$("total")).value = "0";    
    (<HTMLInputElement>$("die")).value = "0";
    game.currTotal = 0;
    //change players
    changePlayers();
}
/**
 * This function to reset the value of the form
 */
function resetForm():void {
    let dieImg = (<HTMLImageElement>$("diceIMG"));
    dieImg.src = "";
    ($("score1") as HTMLInputElement).value = "";
    ($("score2") as HTMLInputElement).value = "";
    ($("die") as HTMLInputElement).value = "";
    ($("total") as HTMLInputElement).value = "";
}

/**
 * This function to check if the user input the name or not
 * @returns return true if both player name are input. Otherwise return false
 */
function isPresent():boolean {
    let player1 = ($("player1") as HTMLInputElement).value;
    let player2 = ($("player2") as HTMLInputElement).value;
    if(player1 == "" || player2 == ""){
        return false;
    }
    return true;
}
