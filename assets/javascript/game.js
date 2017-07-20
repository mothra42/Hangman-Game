//declaration of array variables

//gameWords stores the possible words for Hangman game
var gameWords = ["awkward", "bagpipes", "banjo", "bungler", "croquet", "crypt", "dwarves", 
"fervid", "fishhook", "gazebo", "haphazard", "hangman", "jukebox", "numbskull", "phlegm", "rhythmic", "toad", "zealous"];
//alphabet array is created to ensure user input is limited to alphabetic characters only
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", 
"l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
//guesses is the array of guessed letters inputed by the player
var guesses = [];
//array that holds correct guesses, will also be used to display guesses in html file
var correct = [];
//array to be filled with ["_","_","_"...] in thinker object.
var unguessed = [];

// tries, wins, losses are number variables that track how many times the player has won, lost, and current tries/guesses remaining
// tries is initally set to 9 and will decrease as game progresses
var tries = 9;
var wins = 0;
var losses = 0;

//word is the randomly chosen word for game
var word;

//guess is the user input
var guess;

//ranWord function randomly chooses a word from gameWords array to use for round.
function ranWord() 
{
	 word = gameWords[Math.floor(Math.random() * gameWords.length)];
} 

//clearArray is used when the player loses or wins the game to clear out previous guesses
function clearArray(x)
{
	x.length = 0;
}

//goodGuess is a function that checks that guess is in the chosen word.
//It adds correct guesses to correct and returns true if there is at least once match.
//x is the string you want to check against and y is the guess
function goodGuess(x,y)
{
	//counter is updated everytime there is a match between the guessed letter and a letter in word.
	//as long as counter is greater than 0 at the end of goodGuess then it returns true.
	var counter = 0;
	
	//logic for checking if guess is at least one letter in word
	//for loop goes through each letter of the word and compares it to guess
	for (var i = 0; i < x.length; i++) 
	{
			
		if (x.charAt(i) === y)
		{
			correct.push(y);
			counter++;
		}
			
	}
		if (counter > 0)
			return true;
		
		if (counter === 0)
		{
			return false;
			console.log("in else goodGuess");				
		}
}

//function to change text in html file
//x is a string that is the name of the id of the html element you want to change the text in.
//y is a variable that you want to be the replacement text to go inside of the html element.
function changeText(x,y)
{
	document.getElementById(x).innerHTML = y;
}

//checks win condition.
//since we replace "_" with correct guesses
//when no more "_" remain the word has been guessed
function isWin()
{
	if(isInArray(unguessed,"_") === false)
		return true;
	else
		return false;
}

//function checks that y a string is an element in the array x.
//returns true if string is in array.
//problem solved?
function isInArray(x,y)
{
	var counter =0;
	
	for (var i = 0; i < x.length; i++) 
	{
		if(x[i] === y)
		{
			counter++;
		}
	}
	if(counter > 0)
		return true;
	if(counter === 0)
		return false;
}

//thinker is an object with functions as properties that work to think about the hangman problem
//probably not a practical use of an object, but I wanted to practice the syntax and implementation.
var thinker = {
	//creates array like ["_","_","_"...] that is as long as word.
	createArray : function() 
	{
		for (var i = 0; i < word.length; i++) 
		{
			unguessed.push("_");
		}
		return unguessed;
	},
	//searches through wordArray to see what indices match up with guessed letter and writes those to unguessed
	//x here is the guessed letter
	writeAnswer : function(x) 
	{
		for (var i = 0; i < word.length; i++) 
		{
			if(word.charAt(i) === x )
			{
				unguessed.splice(i,1,x);
			}
		}
	} 
};
//generates first word for game
//others are generated in win and loss condition.
ranWord();
console.log(word);
thinker.createArray();
//This function logs key presses and most game logic will be written inside
document.onkeyup = function(event) 
{	
	isInArray(guesses,guess);
	guess = event.key.toLowerCase();
	changeText("hang-word", unguessed.toString());

	//guess stores user key input toLowerCase() ensures that user input is stored lowercase only.
	//guess will only be added to guesses if it is not a duplicate
	if (isInArray(alphabet, guess) && isInArray(guesses, guess) === false)
	{	
		guesses.push(guess);
	}
	else if (isInArray(guesses, guess))
	{
		alert("You have already guessed that!");
	}	
	else
	{
		alert("Only enter letters please...");
	}

	//if goodGuess returns true the letters are displayed on screen.
	if(goodGuess(word,guess))
	{
		thinker.writeAnswer(guess);
		changeText("hang-word", unguessed.toString());
	}

	//if goodGuess returns false and guess hasn't been guessed before then tries incremented by -1.
	if(isInArray(guesses,guess) && goodGuess(word,guess) === false)
	{	
		tries--;
	}		
	
	//lose condition when tries is 0. 
	//resets guesses and correct arrays, adds 1 to losses, and chooses a new word
	if (tries <= 0) 
	{
		alert("You Have Lost!");
		clearArray(guesses);
		clearArray(correct);
		clearArray(unguessed);
		losses++;
		tries = 9;
		ranWord();
		thinker.createArray();
		changeText("hang-word", unguessed.toString());
		console.log(word);
	}
	//win condition
	//clears arrays
	//picks new word and recreates new unguessed array for word. 
	if (isWin())
	{
		wins++;
		alert("You Have Won!")
		clearArray(guesses);
		clearArray(correct);
		clearArray(unguessed);
		ranWord();
		thinker.createArray();
		changeText("hang-word", unguessed.toString());
		console.log(word);
	}

	console.log(correct);
	//when game begins changes text to Hangman!
	changeText("name", "Hangman!");
	//displays number of wins
	changeText("win-text",wins);
	//display number of losses
	changeText("loss-text", losses);
	//display number of tries remaining
	changeText("try-text", tries);
	//display guessed letters
	changeText("guess-text", guesses.toString());	

	//CURRENT PROBLEMS!!!! 
	//tries is not working as expected
	//first user input should not be counted as a guess
	//fix isInArray function. problem listed above function
	//I think that is it, but I need to make sure I'm not using indexOf with any more arrays indexOf() !== charAt()	!!!!!
};        


