// ---------------------------------------------- initialize global variables

var targetNumber  = 0;                          // the target number to guess
var guessCount    = 0;                          // the number of guesses used
var won           = 0;                          // number of games won
var lost          = 0;                          // number of games lost
var guessArchive  = null;                       // array to handle the repeat guesses
var guessValidate = /^([1-9]|[1-9][0-9]|100)$/; // regular expression for form validation

// ---------------------------------------------- private methods
function isAlreadyGuessed(guess) {
    'use strict';
    
    var passed = true;
    
    guessArchive.some(function (e) {
        if (e === guess) {
            passed = false;
        }
    });
    
    return passed;
}

// COOKIE FUNCTIONS ORIGINALLY FOUND @ W3Schools: http://www.w3schools.com/js/js_cookies.asp
// ALL MODIFIED BY MICHAEL CUNNINGHAM (www.michael-cunningham.ca)
function setCookie(cname, cvalue, exdays) {
    'use strict';
    
    // declare variables
    var d, expires;
    
    // populate all variables
    d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    
    expires = 'expires=' + d.toUTCString();
    
    // set the document.cookie string
    document.cookie = cname + '=' + cvalue + '; ' + expires;
}

// gets a cookie based on the cookie name
function getCookie(cname) {
    'use strict';
    
    // declare variables
    var name, ca, i, c, caLength;
    
    // populate variables
    name     = cname + '=';
    ca       = document.cookie.split(';');
    caLength = ca.length;
    
    // loop through the cookie and find the values to return
    for (i = 0; i < caLength; i += 1) {
        
        c = ca[i];
            
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    
    // if no name matches, return nothing
    return '';
}

function isCookieEmpty(cname) {
    'use strict';
    
    var cookie = getCookie(cname);

    if (cookie === '') {
        return true;
    }
    
    return false;
}

function resetMe() {
    'use strict';
    
    // initialization
    guessArchive = [];
    guessCount   = 0;
    targetNumber = Math.floor(Math.random() * 100) + 1;
    
    // get the cookie values if they exist
    if (!isCookieEmpty('lost')) {
        lost = parseInt(getCookie('lost'), 0);
    }
    
    if (!isCookieEmpty('won')) {
        won = parseInt(getCookie('won'), 0);
    }
    
    // cleanup the interface
    document.getElementById('lblGuessCount').innerHTML = guessCount + 1;
    document.getElementById('lblWon').innerHTML        = won;
    document.getElementById('lblLost').innerHTML       = lost;
}

// ---------------------------------------------- event handlers
function onGuess(e) {
    'use strict';
    
    // declare variables
    var lblFeedback, guess;
    
    // get reference to lblFeedback element
    lblFeedback = document.getElementById('lblFeedback');
    
    // get guess from textbox
    guess = document.getElementById('txtGuess').value;

    // check for repeat guess
    if (isAlreadyGuessed(guess)) {

        // validate for correct range and valid input
        if (guessValidate.test(guess)) {

            guessCount += 1;
            document.getElementById('lblGuessCount').innerHTML = guessCount;
            
            // save guess in array
            guessArchive.push(guess);

            // check for matches
            if (guess > targetNumber) {
                lblFeedback.innerHTML = 'The number is lower.';
            } else if (guess < targetNumber) {
                lblFeedback.innerHTML = 'The number is higher.';
            } else {
                
                // player won the game
                lblFeedback.innerHTML = 'You\'re the big winner!<br>' +
                                        guess + ' is the correct number!<br>It took you ' +
                                        guessCount + ' guess(es). Try to win again!';

                won += 1;
                setCookie('won', won, 3);
                resetMe();
            }

            if ((guessCount === 10) && (guess !== targetNumber)) {
                
                // the game is over - you lost!
                lblFeedback.innerHTML = 'Lose Lose Lose :(';
                
                lost += 1;
                setCookie('lost', lost, 3);
                resetMe();
            }

        } else {
            lblFeedback.innerHTML = guess + ' is an invalid guess. Please try again...';
        }

    } else {
        lblFeedback.innerHTML = guess + ' had already been guessed before. Please try again...';
    }

    // blank out the textbox
    document.getElementById('txtGuess').value = '';
    document.getElementById('txtGuess').focus();
}

function onLoadGame(e) {
    'use strict';
    
    //resetMe();
    
    // wire up event listeners
    //document.getElementById('btnSubmit').addEventListener('click', onGuess);
    //document.getElementById('form').addEventListener('submit', function (e) {
    //    onGuess();
    //    e.preventDefault();
    //}, true);
    
}

window.addEventListener('load', onLoadGame);