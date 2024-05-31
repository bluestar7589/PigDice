// Because I you're using Bootstrap from a CDN in your HTML file, 
// I don't need to import it in your TypeScript file. Instead, I can use the bootstrap object directly in your TypeScript file.
declare var bootstrap: any;

// https://soundbible.com/182-Shake-And-Roll-Dice.html

// declare the form for playing game
let element = document.getElementById('newTaskModal') as HTMLElement;
let newTaskModal = new bootstrap.Modal(element);

/**
 * This function return the element by ID 
 */ 
function $(id:string): HTMLElement {
    return document.getElementById(id);
}

window.onload = function(){
    let newGameBtn = document.getElementById("new_game") as HTMLButtonElement;
    newGameBtn.onclick = createNewGame;

    (<HTMLButtonElement>document.getElementById("roll")).onclick = rollDie;

    (<HTMLButtonElement>document.getElementById("hold")).onclick = holdDie;
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
    let currentPlayerName = (<HTMLElement>document.getElementById("current")).innerText;
    let player1Name = (<HTMLInputElement>document.getElementById("player1")).value;
    let player2Name = (<HTMLInputElement>document.getElementById("player2")).value;

    
    //swap from player to player by comparing current name to player names
    //set currentPlayerName to the next player
    if (currentPlayerName == player1Name) {
        currentPlayerName = player2Name;
    } else {
        currentPlayerName = player1Name;
    }
    (<HTMLElement>document.getElementById("current")).innerText = currentPlayerName;
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
    (<HTMLElement>document.getElementById("current")).innerText = (<HTMLInputElement>document.getElementById("player1")).value;
    (<HTMLElement>document.getElementById("lblPlayer1")).textContent = (<HTMLInputElement>document.getElementById("player1")).value + "'s score";
    (<HTMLElement>document.getElementById("lblPlayer2")).textContent = (<HTMLInputElement>document.getElementById("player2")).value + "'s score";
    // open the form to start play the game
    
    newTaskModal.show();
    //if both players do have a name start the game!
    (<HTMLInputElement>document.getElementById("total")).value = "0";
    (<HTMLInputElement>document.getElementById("score1")).value = "0";
    (<HTMLInputElement>document.getElementById("score2")).value = "0";
    //lock in player names and then change players
    (<HTMLInputElement>document.getElementById("player1")).setAttribute("disabled", "disabled");
    (<HTMLInputElement>document.getElementById("player2")).setAttribute("disabled", "disabled");
}

/**
 * Main function for roll a dice
 */
function rollDie(): void {
    // Get the current total from the form
    let currTotal = getCurrentTotal();

    // Get the image element for the die
    let dieImg = getDieImageElement();

    // Roll the die and get a random value 1 - 6
    let rollNumber = generateRandomValue(1, 6);

    // Add sound
    let sound = document.getElementById('diceSound') as HTMLAudioElement;
    sound.play();

    // Update the image of the die based on the roll number
    updateDieImage(dieImg, rollNumber);

    // Update the value of the die in the form
    updateDieValue(rollNumber);

    // If the roll is 1, change players and set current total to 0
    if (rollNumber == 1) {
        changePlayers();
        currTotal = 0;
    } else {
        // If the roll is greater than 1, add roll value to current total
        currTotal = handleRollGreaterThanOne(currTotal, rollNumber);
    }

    // Update the total value in the form
    updateTotalValue(currTotal);

    // Check if total is greater or equal to 100, if so, announce the winner and stop the game
    checkForWinner(currTotal);
}


/**
 * Function to get the current total from the form
 * @returns the currently total for that turn
 */
function getCurrentTotal(): number {
    return parseInt((<HTMLInputElement>document.getElementById("total")).value);
}


/**
 * Function to get the image element for the die
 * @returns the image tag by ID
 */
function getDieImageElement(): HTMLImageElement {
    return (<HTMLImageElement>document.getElementById("diceIMG"));
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
    (<HTMLInputElement>document.getElementById("die")).value = rollNumber.toString();
}


/**
 * Function to handle the case when the roll is greater than 1
 * @param currTotal the currently total for that turn
 * @param rollNumber the number that rolled out
 * @returns return the total after roll is greater than 1
 */
function handleRollGreaterThanOne(currTotal: number, rollNumber: number): number {
    return currTotal += rollNumber;
}


/**
 * Function to update the total value in the form
 * @param currTotal the currently total for that turn
 */
function updateTotalValue(currTotal: number): void {
    (<HTMLInputElement>document.getElementById("total")).value = currTotal.toString();
}


/**
 * Function to check if total is greater or equal to 100, if so, announce the winner and stop the game
 * @param currTotal the currently total in that turn
 */
function checkForWinner(currTotal: number): void {
    let currentPlayerName = (<HTMLElement>document.getElementById("current")).innerText;
    let player1Name = (<HTMLInputElement>document.getElementById("player1")).value;
    let finalScore = 0;

    // Check who is the current player to get the total score
    if (currentPlayerName == player1Name) {
        finalScore = parseInt((<HTMLInputElement>document.getElementById("score1")).value) + currTotal;
    } else {
        finalScore = parseInt((<HTMLInputElement>document.getElementById("score2")).value) + currTotal;
    }

    // If total score is greater or equal to 100, announce the winner
    if (finalScore >= 100) {
        announceWinner(currentPlayerName, player1Name);
    }
}


/**
 * Function to announce the winner
 * @param currentPlayerName name of the current player
 * @param player1Name name of player 1
 */
function announceWinner(currentPlayerName: string, player1Name: string): void {
    let player2Name = (<HTMLInputElement>document.getElementById("player2")).value;
    let winner = "";

    // Determine the winner based on the current player
    if (currentPlayerName == player1Name) {
        winner = player1Name + " is the winner";
    } else {
        winner = player2Name + " is the winner";
    }

    // Display the winner and make the winner element visible
    document.getElementById("winner").innerText = winner;
    document.getElementById("winner").style.color = "red";
    (<HTMLElement>document.getElementById("winner")).style.visibility = "visible";

    // Close the form if needed
    newTaskModal.hide();
}

/**
 * To hold the currently total and change to other player
 */
function holdDie():void{
    //get the current turn total
    let currentPlayerName = (<HTMLElement>document.getElementById("current")).innerText;
    let player1Name = (<HTMLInputElement>document.getElementById("player1")).value;
    //let player2Name = (<HTMLInputElement>document.getElementById("player2")).value;
    //determine who the current player is
    //add the current turn total to the player's total score
    if(currentPlayerName == player1Name) {
        let score1 = parseInt((<HTMLInputElement>document.getElementById("score1")).value);
        let total = parseInt((<HTMLInputElement>document.getElementById("total")).value);
        score1 += total;
        (<HTMLInputElement>document.getElementById("score1")).value = score1.toString();
    } else {
        let score2 = parseInt((<HTMLInputElement>document.getElementById("score2")).value);
        let total = parseInt((<HTMLInputElement>document.getElementById("total")).value);
        score2 += total;
        (<HTMLInputElement>document.getElementById("score2")).value = score2.toString();
    }

    //reset the turn total to 0
    (<HTMLInputElement>document.getElementById("total")).value = "0";
    (<HTMLInputElement>document.getElementById("die")).value = "0";
    //change players
    changePlayers();
}
/**
 * This function to reset the value of the form
 */
function resetForm():void {
    let dieImg = (<HTMLImageElement>document.getElementById("diceIMG"));
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
