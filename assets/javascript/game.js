//declaration of array variables

//gameWords stores the possible words for Hangman game
var gameWords = ["awkward", "bagpipes", "banjo", "bungler", "croquet", "crypt", "dwarves", 
"fervid", "fishhook", "gazebo", "haphazard", "hangman", "jukebox", "numbskull", "phlegm", "rhythmic", "toad", "zealous"];
//alphabet array is created to ensure user input is limited to alphabetic characters only
var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", 
"l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

//array that stores file path to images
var img = ["assets/images/hangman9.png","assets/images/hangman8.png","assets/images/hangman7.png","assets/images/hangman6.png",
"assets/images/hangman5.png","assets/images/hangman4.png","assets/images/hangman3.png","assets/images/hangman2.png","assets/images/hangman1.png",
"assets/images/hangman0.png"];
//guesses is the array of guessed letters inputed by the player
var guesses = [];
//array that holds correct guesses, will also be used to display guesses in html file
var correct = [];
//array to be filled with ["_","_","_"...] in thinker object.
var unguessed = [];
//maybe used to tell first input.
var first = [];

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

	if(x.indexOf(y) === -1)
	{
		return false;
	}
	else
		return true;
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
	var counter = 0;

	for (var i = 0; i < x.length; i++) 
	{
		if(x[i] === y)
		{
			counter++;
		}
	}

	if(counter === 0)
	{
		return false;
	}
	else
	{
		return true;
	}
}

//function for checking if something is the first key press
//returns false if other keys have been pressed before. 
function isFirst()
{
		if(first.length === 0)
		{
			return true;
		}
		else
			return false;

}
//changes the image according to how many tries are left.
function changePic()
{
	document.getElementById("picture").src = img[tries];
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



//This triggers most of the code to run 
//and also has the added benefit of allowing us to log key presses
document.onkeyup = function(event) 
{	
	//saves user input to guess
	//ensures only lower case letters are used.
	guess = event.key.toLowerCase();
	//updates hang-word with the unguessed array.
	changeText("hang-word", unguessed.toString().replace(/,/g," "));
	
	changePic();

	//if goodGuess returns true the letters are displayed on screen.
	if(goodGuess(word,guess) && !isFirst())
	{
		thinker.writeAnswer(guess);
		changeText("hang-word", unguessed.toString().replace(/,/g," "));
	}

	//if goodGuess returns false and guess hasn't been guessed before then tries incremented by -1.
	if(!goodGuess(word,guess) && !isInArray(guesses,guess) && isInArray(alphabet, guess) && !isFirst())
	{	
		tries--;
		changePic();
	}		
	
	//guess stores user key input toLowerCase() ensures that user input is stored lowercase only.
	//guess will only be added to guesses if it is not a duplicate
	if (isInArray(alphabet, guess) && !isInArray(guesses, guess) && !isFirst())
	{	
		guesses.push(guess);
		//console.log(guesses);
	}
	
	//Used to make isFirst work. porbably a better way to do this.
	//Ensures that isFirst is not true past the first key being pressed
	//first array is reset in win and lose condition
	if(isFirst())
	{
		first.push(guess);
	}

	//lose condition when tries is 0. 
	//resets guesses and correct arrays, adds 1 to losses, and chooses a new word
	if (tries <= 0) 
	{
		clearArray(guesses);
		clearArray(correct);
		clearArray(unguessed);
		clearArray(first);
		losses++;
		tries = 9;
		ranWord();
		thinker.createArray();
		console.log(word);
		changeText("hang-word", "Press any key to play again!");
	}

	//win condition
	//clears arrays
	//picks new word and recreates new unguessed array for word. 
	if (isWin())
	{
		wins++;
		tries = 9;
		clearArray(guesses);
		clearArray(correct);
		clearArray(unguessed);
		clearArray(first);
		ranWord();
		thinker.createArray();
		console.log(word);
		changeText("hang-word", "Press any key to play again!");
	}

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
	//I think that is it, but I need to make sure I'm not using indexOf with any more arrays indexOf() !== charAt()	!!!!!
};        


