/*
* MasterMind script.js
* created by Kinga Papay 13/01/23

* event functions: startGame(), chooseButton(), placeButton(), calcResult().
* helper functions: (array[string, int]) getHint(array1, array2); (string) getColorName(int); populateListeners().
*
* HTML web (local) storage API object used for storing:
* 1. sequence of colorcodes to guess in 'code1, int', 'code2, int', 'code3, int', 'code4, int' pairs.
* 2. spot-colorcode values in '1, int', '2, int', '3, int', '4, int' pairs.
* 3. active (picked) button's values: in 'activeColor color', 'activeValue int', 'activeButton buttonID' pairs.
*/


/* --- on load/refresh --- */
window.onload = function() {

  populateListeners();

  if (localStorage.getItem('activeButton')) {
    document.getElementById(localStorage.getItem('activeButton')).style.borderColor = "grey"; //remove highlight
  }
  localStorage.clear();
}

/* --- event functions --- */

/* event function 1/4: reset-initialize all fields and storage */
function startGame() {

  if (localStorage.getItem('activeButton')) {
    document.getElementById(localStorage.getItem('activeButton')).style.borderColor = "grey"; //remove highlight
  }

  localStorage.clear();
  document.getElementById('chosen_color').style.backgroundColor = "lightgrey";

  const resultFields = document.getElementsByClassName("result-field");
  for (let i=0; i<resultFields.length; i++) {
    resultFields[i].style.display = "none";
  }

  const dotBtns = document.getElementsByClassName("dot");
  for (let i=0; i<dotBtns.length; i++) {
    dotBtns[i].style.backgroundColor = "lightgrey";
    dotBtns[i].style.border = "none";
  }

  const boardBtns = document.getElementsByClassName("board-btn");
  for (let i=0; i<boardBtns.length; i++) {
    boardBtns[i].style.backgroundColor = "lightgrey";
  }

  const codeBtns = document.getElementsByClassName("code-btn");
  for (let i=0; i<codeBtns.length; i++) {
    codeBtns[i].style.backgroundColor = "lightgrey";
    codeBtns[i].innerHTML = "?";
    codeBtns[i].style.border = "3px solid grey";
  }

  document.getElementById("check_cross").innerHTML = "";
  document.getElementById("win_msg").style.display = "none";
  document.getElementById("lose_msg").style.display = "none";
  document.getElementById("start_msg").style.display = "block";
  document.getElementById("start_btn").style.visibility = "hidden";
  document.getElementById("10arrow").style.display = "block";

  const row10btns = document.getElementsByClassName("10btn");
  const row10dots = document.getElementsByClassName("10dot");

  for (let i=0; i<row10dots.length; i++) {
    row10dots[i].style.display = "none";
  }

  for (let i=0; i<row10btns.length; i++) {
    row10btns[i].style.display = "block";
  }

  const codeToGuess = [0, 0, 0, 0];
  for (let i=0; i<codeToGuess.length; i++) {
    codeToGuess[i] = (Math.floor(Math.random() * 8)) + 1; //returns a random integer from 1 to 8 (color to guess)
    localStorage.setItem('code' + (i+1), codeToGuess[i]); //save sequence (of colors) to guess to local storage
  }
  //console.log(codeToGuess);
}


/* event function 2/4 */
function chooseButton() {

  if (localStorage.getItem('activeButton')) {
    document.getElementById(localStorage.getItem('activeButton')).style.borderColor = "grey";
  }

  this.style.borderColor = "darkslategrey";
  document.getElementById('chosen_color').style.backgroundColor = this.style.backgroundColor;

  localStorage.setItem('activeColor', this.style.backgroundColor);  //save chosen buttons's color, value and ID to local storage
  localStorage.setItem('activeValue', this.value);
  localStorage.setItem('activeButton', this.id);
}


/* event function 3/4 */
function placeButton() {

  if (localStorage.getItem('activeColor')) {
    this.style.backgroundColor = localStorage.getItem('activeColor');
  }

  if (localStorage.getItem('activeValue')) {
    localStorage.setItem(this.value, localStorage.getItem('activeValue'));  //save chosen spot-colorcode value pair to local storage
  }

  if (localStorage.getItem("1") && localStorage.getItem("2") && localStorage.getItem("3") && localStorage.getItem("4")) { //if all 4 spots filled

    let parent = this.parentElement;
    let greatparent = parent.parentElement;
    //console.log(greatparent.id);
    let arrowId = greatparent.id + 'arrow';
    let goId = greatparent.id + 'go';
 
    document.getElementById(arrowId).style.display = 'none';  //hide arrow and show 'Go!' button
    document.getElementById(goId).style.display = 'block';
  }
}


/* event function 4/4 */
function calcResult() {

  /* query code sequence and user-guessed sequence from local storage */
  const codeToGuess = [0, 0, 0, 0];
  for (let i=0; i<codeToGuess.length; i++) {
     codeToGuess[i] = parseInt(localStorage.getItem('code' + (i+1)));
  }
  //console.log(codeToGuess);
  const userGuess = [0, 0, 0, 0];
  for (let i=0; i<userGuess.length; i++) {
    userGuess[i] = parseInt(localStorage.getItem(i+1));
  }
  //console.log(userGuess);

  const empty = [];
  const userGuessCpy = empty.concat(userGuess);
  let hint = getHint(codeToGuess, userGuessCpy);  //get result of comparing the two sequences
  let hintText = hint[0];
  let noOfMatches = hint[1];
  
  /* display results, change fields according to next state */
  let parent = this.parentElement;
  let greatparent = parent.parentElement;
  let goId = greatparent.id + 'go';
  let hintId = greatparent.id + 'hint';
  document.getElementById(goId).style.display = 'none';
  document.getElementById(hintId).innerHTML = "&nbsp;" + hintText;
  document.getElementById(hintId).style.display = 'block';
  let currentRowId = greatparent.id;  //get current class names for buttons and dots
  let currentBtnsClass = currentRowId + 'btn';
  let currentDotsClass = currentRowId + 'dot';
  let currentBtns = document.getElementsByClassName(currentBtnsClass);  //hide buttons, display dots
  let currentDots = document.getElementsByClassName(currentDotsClass);
  for (let i=0; i<currentDots.length; i++) {
    currentDots[i].style.backgroundColor = getColorName(userGuess[i]);
    currentDots[i].style.border = "3px solid grey";
    currentBtns[i].style.display = "none";
    currentDots[i].style.display = "block";
  }

  /* if game ends */
  if ((noOfMatches==4) || (greatparent.id == 1)) {

    const codeBtns = document.getElementsByClassName("code-btn"); //display solution
    for (let i=0; i<codeBtns.length; i++) {
      codeBtns[i].style.backgroundColor = getColorName(codeToGuess[i]);
      codeBtns[i].innerHTML = "";
    }

    if (localStorage.getItem('activeButton')) {
      document.getElementById(localStorage.getItem('activeButton')).style.borderColor = "grey";
    }
    localStorage.clear();
    document.getElementById('chosen_color').style.backgroundColor = "lightgrey";
    document.getElementById("start_msg").style.display = "none";
  }

  /* display according to win vs lose vs continue */
  if (noOfMatches==4) {
    document.getElementById("win_msg").style.display = "block";
    document.getElementById("check_cross").innerHTML = "&#10004";
  } else if (greatparent.id == "1") {
    document.getElementById("lose_msg").style.display = "block";
    document.getElementById("check_cross").innerHTML = "&#10008";
  } else {
    let nextArrowId = (parseInt(greatparent.id) - 1) + 'arrow';
    document.getElementById(nextArrowId).style.display = 'block';

    let nextRowId = (parseInt(greatparent.id) -1);  //activate next row of buttons
    let nextBtnsClass = nextRowId + 'btn';
    let nextDotsClass = nextRowId + 'dot';
    let nextBtns = document.getElementsByClassName(nextBtnsClass);
    let nextDots = document.getElementsByClassName(nextDotsClass);

    for (let i=0; i<nextDots.length; i++) {
      nextDots[i].style.display = "none";
    }

    for (let i=0; i<nextBtns.length; i++) {
      nextBtns[i].style.display = "block";
    }
  }

  localStorage.removeItem("1"); //clear user guess spot-colorcode value pairs from local storage before next round
  localStorage.removeItem("2");
  localStorage.removeItem("3");
  localStorage.removeItem("4");
}


/* --- helper functions --- */

function getColorName(colorNo) {
  if (colorNo == 1) { return "orangered"; }
    else if (colorNo == 2) { return "cornflowerblue"; }
    else if (colorNo == 3) { return "yellow"; }
    else if (colorNo == 4) { return "white"; }
    else if (colorNo == 5) { return "greenyellow"; }
    else if (colorNo == 6) { return "saddlebrown"; }
    else if (colorNo == 7) { return "purple"; }
    else if (colorNo == 8) { return "black"; }
    else { return "lightgrey"; }
}

function getHint(codeSequence, userSequence) {
  /* compare the two arrays, count and return matches */
  let k = 0;  //variable for holding number of full matches
  let l = 0;  //variable for holding number of matching colors inc. full matches

  for (let i=0; i<codeSequence.length; i++) {
    for (let j=0; j<userSequence.length; j++) {
      if ((codeSequence[i] == userSequence[j]) && (i==j)) {
        k++;
      }
    }
  }

  for (let i=0; i<codeSequence.length; i++) {
    for (let j=0; j<userSequence.length; j++) {
      if (codeSequence[i] == userSequence[j]) {
        l++;
        userSequence.splice(j, 1); //2nd parameter means remove one item only
        //console.log(userSequence);
        break;
      }
    }
  }
  //console.log('matching elements, but not the spot: ' + (l-k) + ' matching spots: ' + k);
  const results = [" .", " .", " .", " ."];
  for(let i=0; i<l; i++) {
    results[i] = "&#9899;"; //assign black dot
  }
  for(let i=0; i<k; i++) {
    results[i] = "&#9898;"; //assign white dot
  }
  results[1] = results[1] + " <br>";  //formatting dots: add line break and space, remove commas
  results[2] = "&nbsp;" + results[2];
  let jointResults = results.join(" ");
  const hint = [jointResults, k];     //return html text and number of full matches
  return hint;
}

function populateListeners() {

  document.getElementById("start_btn").addEventListener("click", startGame);

  const restartBtns =  document.getElementsByClassName("restart-btn");
  for (let i=0; i<restartBtns.length; i++) {
    restartBtns[i].addEventListener("click", startGame);
  }

  const pickBtns =  document.getElementsByClassName("pick-btn");
  for (let i=0; i<pickBtns.length; i++) {
    pickBtns[i].addEventListener("click", chooseButton);
  }

  const boardBtns =  document.getElementsByClassName("board-btn");
  for (let i=0; i<boardBtns.length; i++) {
    boardBtns[i].addEventListener("click", placeButton);
  }

  const calcBtns =  document.getElementsByClassName("calc-btn");
  for (let i=0; i<calcBtns.length; i++) {
    calcBtns[i].addEventListener("click", calcResult);
  }
}
