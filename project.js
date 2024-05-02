// 1. User deposits money
// 2. User places the bet on the number of lines
// 3. User collects the bet amount
// 4. User rolls the wheel
// 5. Check if the user won
// 6. Pay the user if he wins
// 7. Play again

// Why do we need to call a function seperately? 1. Functional seperation 2. reusability 3. Encapsulation
// add comments in vscode Cmd + /

//One way of writing functions in vscode
// function deposit(){
//     return 1;
// }
// How to store the value of a funtion in a constant: const x = deposit()

//Coding traidition :
//imports
//global variables (in const are all capitals)
//classes and function

const prompt = require("prompt-sync")();
// Here the require function is used to import module in nodejs. Here the module being imported in prompt-sync
// '()' means the module is being invoked immediately. require("prompt-sync")() returns a function which is then assigned to the variable prompt
const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNT = {
    A:2,
    B:3,
    C:4,
    D:6,
} 
//this is an object i.e. it has key value pairs
//abc_def -> snake case abcDef -> camel case

const SYMBOL_VALUES = {
    A:5,
    B:4,
    C:3,
    D:2,
} 

//other way of writing function
const deposit = () => { //Function to determine the deposit amount
    while(true){ //loop will continue indefinitely unless there's a mechanism to break out of it
        const depositAmount = prompt("Enter the deposit amount: "); 
        const numDepositAmount = parseFloat(depositAmount); //parseFloat is used to parse a string a return a floating point number
        if(isNaN(numDepositAmount) || numDepositAmount <= 0){ //isNaN means is 'Not A Number'
            console.log("Invalid deposit amount, please try again");
        } else{
            return numDepositAmount; //Break out of the while loop
        }
    }
};

const getNumberOfLines = () => { //function to determine the number of lines
    while(true){ //loop will continue indefinitely unless there's a mechanism to break out of it
        const lines = prompt("Enter the number of lines to bet on(1-3): "); 
        const numOfLines = parseFloat(lines); //parseFloat is used to parse a string a return a floating point number
        if(isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3){ //isNaN means is 'Not A Number'
            console.log("Invalid number of lines, please try again");
        } else{
            return numOfLines; //Break out of the while loop
        }
    }
};

const getBet = (balance, lines) => { //it is based on balance and lines as user cannot have a value more than their balance / lines
    while(true){ //loop will continue indefinitely unless there's a mechanism to break out of it
        const bet = prompt("Enter the bet per line: "); 
        const numOfBet = parseFloat(bet); //parseFloat is used to parse a string a return a floating point number
        if(isNaN(numOfBet) || numOfBet <= 0 || numOfBet > (balance / lines)){ //isNaN means is 'Not A Number'
            console.log("Invalid number of bets, please try again");
        } else{
            return numOfBet; //Break out of the while loop
        }
    }
};

const spin = () => {
    const symbols = []; //Empty array to store symbols
    // Iterating over the key-value pairs of the object SYMBOL_COUNT
    for(const [symbol, count] of Object.entries(SYMBOL_COUNT)){ //Object.entries converts the SYMBOL_COUNT object into an array of its key-value pairs.
        for(let i=0; i< count; i++){
            symbols.push(symbol);
        }
    }
    const reels = []; //Array inside array, will represent a column inside slot machine
    for(let i=0; i<COLS; i++){ //for each one of our reels
        reels.push([]);
        const reelSymbols = [...symbols]; //make a copy of the symbols array for each reel so that the original array remains unchanged
        for(let j=0; j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); //Within the inner loop, a random index is generated using Math.random() to get a random floating-point number between 0 (inclusive) and 1 (exclusive). This number is then multiplied by the length of the reelSymbols array, and Math.floor() is used to round it down to the nearest integer. This index represents a random position within the reelSymbols array.
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for(let i=0; i<ROWS; i++){
        rows.push([]);
        for(let j=0; j<COLS;j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
};

const printRows = (rows) => {
    for(const row of rows){
        let rowString = ""
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            if(i != rows.length -1){
                rowString += " | "
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for(let row = 0; row<lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

//const depositAmount = deposit();
const game = () => {
    let balance = deposit(); // let syntax is used as the value of balance needs to be reassigned later based on how much the person is betting and how much he's winning
    while(true){
    console.log("You have a balance of $" +balance)
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines )
    balance += winnings; 
    console.log("You won, $" + winnings.toString())

    if(balance <= 0){
        console.log("You ran out of money!"); 
        break;
    }

    const playAgain = prompt("Do you want to play again (y/n)?")
    if(playAgain != "y") break;
    }
};

//console.log(reels);
// console.log(depositAmount);
// console.log(numberOfLines);

game()