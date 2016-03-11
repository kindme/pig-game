'use strict';

/*
 * Helper functions.
 */

function getRandom() {
	return Math.floor(Math.random() * 6);
}

function addClassName(element, className) {
	element.className += ' ' + className;
	return element;
}

/*
 * Pig game.
 */

var pointsToStop1 = 10;/*min*/
var pointsToStop2 = 20;/*max*/
var scorePlayer = 0;
var scoreComputer = 0;
var scoreCurrent = 0;
var playerTurn = 1;
var computerPointsToStop = 10; // default is 10

var diceSides = [ 'front', 'back', 'right', 'left', 'top', 'bottom' ];/*1-6*/

/**
 * Load value from input field "Computer points to stop"
 */
function loadComputerPointsToStopValue() {
	/*temporary variable*/
	var elmComputerPointsToStop = document.getElementById('points-to-stop');
	
	/*from html file*/
	if (elmComputerPointsToStop.value === '') {
		elmComputerPointsToStop.value = computerPointsToStop;
	}
	/*if less than10 or more than 20*/
	if (elmComputerPointsToStop.value < pointsToStop1 || elmComputerPointsToStop.value > pointsToStop2) {
		window.alert('The "Computer points to stop" must be in range from 10 to 20');
	}

	elmComputerPointsToStop.setAttribute('min', pointsToStop1);
	elmComputerPointsToStop.setAttribute('max', pointsToStop2);

	/*computerPointsToStop = elmComputerPointsToStop.value;*/
}

/**
 * Disable game control buttons.
 */
function disableButtons() {
	document.getElementById('btn-roll').disabled = true;
	document.getElementById('btn-stop').disabled = true;
	document.getElementById('btn-reset').disabled = true;
	document.getElementById('points-to-stop').disabled = true;
}

/**
 * Enable game control buttons.
 */
function enableButtons() {
	document.getElementById('btn-roll').disabled = false;
	document.getElementById('btn-stop').disabled = false;
	document.getElementById('btn-reset').disabled = false;
	document.getElementById('points-to-stop').disabled = false;
}

/**
 * Reload onscreen scores.
 */
function reloadScores() {
	loadComputerPointsToStopValue();
	var elmPlayer = document.getElementById('player');
	var elmComputer = document.getElementById('computer');
	/*prints scores(from int to string)*/
	document.getElementById('score-player').innerHTML = scorePlayer.toString();
	document.getElementById('score-computer').innerHTML = scoreComputer.toString();
	document.getElementById('score-current').innerHTML = scoreCurrent.toString();

	if (playerTurn === 1) {
		addClassName(elmPlayer, 'turn');
		elmComputer.setAttribute('class', 'computer');
	} else {
		addClassName(elmComputer, 'turn');

		elmPlayer.setAttribute('class', 'player');
	}
}

/**
 * Reset game.
 */
function resetGame() {
	scorePlayer = 0;
	scoreComputer = 0;
	scoreCurrent = 0;
	playerTurn = 1;
	/*from html*/
	var elmDiceOne = document.getElementById('cube-one');
	var elmDiceTwo = document.getElementById('cube-two');
	/*setting by default class=cube(1)*/
	elmDiceOne.setAttribute('class', 'cube');
	elmDiceTwo.setAttribute('class', 'cube');

	reloadScores();
}

/**
 * Check for winner.
 */
function checkForWinner(){
	if (scorePlayer >= 100){
		console.log('Player has won!');
		window.alert('Player has won!');
	} else if(scoreComputer >= 100) {
		console.log('Computer has won...');
		window.alert('Computer has won...');
	}
}

/**
 * Make move as the player or as a computer.
 *
 * @param player
 */
function roll(player) {
	checkForWinner();

	if (player === 1) {
		console.log('Player makes a move...');
	}

	var elmDiceOne = document.getElementById('cube-one');
	var elmDiceTwo = document.getElementById('cube-two');
	/*animation css=cube.spin-one*/
	/*Adds the given CSS class to element*/
	addClassName(elmDiceOne, 'spin-one');
	addClassName(elmDiceTwo, 'spin-two');

	setTimeout(function () {
	
		var d1, d2, oneMovePoints;
		
		d1 = getRandom();
		d2 = getRandom();
		/*default values for cubes*/
		
		elmDiceOne.setAttribute('class', 'cube');
		elmDiceTwo.setAttribute('class', 'cube');
		/*getting a random value for cube's sides*/
		addClassName(elmDiceOne, 'show-' + diceSides[d1]);
		addClassName(elmDiceTwo, 'show-' + diceSides[d2]);

		// Because array starts from 0 and we need to add 1 manually
		d1++;
		d2++;

		// If one of the dices equals ONE and their values are not equal
		if ((d1 === 1 || d2 === 1) && (d1 !== d2)) { 
			oneMovePoints = 0;
			scoreCurrent = 0;

			reloadScores();

			if (player === 1) {
				console.log('Player dices: ' + d1 + ' and ' + d2 + '. No points...');
				console.log('Computer turn now');
			} else {
				console.log('Computer dices: ' + d1 + ' and ' + d2 + '. No points...');
				console.log('Player turn now');
			}
			/*if (player === 1) {  
			playerturn = 0;
			} else {
			playerturn = 1;
				}*/
			/*if player===1 then playerTurn zero, if !===1, then one*/
			playerTurn = (player === 1) ? 0 : 1;/*if player desides to move again*/

			scoreCurrent += oneMovePoints;

			computerMove();
			// If both dices have value of ONE, then current player gets 25 points
		} else {
			if (d1 === d2 && d1 === 1) {
				oneMovePoints = 25;
			} else if (d1 === d2) {
				oneMovePoints = 4 * d1;
			} else {
				oneMovePoints = d1 + d2;
			}

			scoreCurrent += oneMovePoints;

			if (player === 1) {
				console.log('Player dices: ' + d1 + ' and ' + d2 + '. Current score: ' + scoreCurrent + '. Total: ' + scorePlayer);
			} else {
				console.log('Computer dices: ' + d1 + ' and ' + d2 + '. Current score: ' + scoreCurrent + '. Total: ' + scoreComputer);
			}
		}

		reloadScores();
	}, 1500);//rolling duration
}

/**
 * Computer makes a move.
 */
function computerMove() {
	if (playerTurn === 0) {
		disableButtons();
	}
	/*if nobody has won yet*/
	if (scoreCurrent < computerPointsToStop && scoreComputer < 100 && playerTurn === 0) {
		setTimeout(function () {
			computerMove();
		}, 2000);/*interval between dices rolling for computer*/
		roll(2);/*roll after player/null and one are taken*/
	} else {
		if (playerTurn === 0) {/*to give points to computer, not player*/
			scoreComputer += scoreCurrent;
			scoreCurrent = 0;

			console.log('Computer has decided to stop');
			console.log('Player turn now');
		}

		playerTurn = 1;

		enableButtons();
		reloadScores();
	}
}

/**
 * Action that happens when user clicks on "Stop" button.
 *
 * @returns {*}
 */
function actionStop() {
	console.log('Player has decided to stop');
	scorePlayer += scoreCurrent;
	scoreCurrent = 0;
	playerTurn = 0;

	reloadScores();

	console.log('Computer turn now');

	computerMove();
}

/*
 * Mouse events.
 */

document.getElementById('btn-roll').onclick = function() {
	roll(1);
	
};

document.getElementById('btn-stop').onclick = function() {
	actionStop();

};

document.getElementById('btn-reset').onclick = function() {
	resetGame();

};

document.getElementById('points-to-stop').onchange = function() {
	resetGame();

};

reloadScores();
