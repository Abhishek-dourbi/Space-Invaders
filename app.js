const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

for(let i = 0; i < 225; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

const squares = document.querySelectorAll('.grid div');

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39,
]

function drawInvader() {
    for(let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');
        }
    }
}

// Add aliens blocks
drawInvader();

function removeInvader() {
    for(let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
    }
}


// Add shooter block
squares[currentShooterIndex].classList.add('shooter');

// Move Shooter
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');

    switch(e.key) {
        case 'ArrowLeft':
            if(currentShooterIndex % width !== 0) currentShooterIndex--;
            break;
        case 'ArrowRight':
            if(currentShooterIndex % width < width - 1) currentShooterIndex++;
            break;
    }
    squares[currentShooterIndex].classList.add('shooter');
}
document.addEventListener('keydown', moveShooter);


function moveInvader() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    removeInvader();

    if(rightEdge && goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
        }
    }

    if(leftEdge && !goingRight) {
        for(let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for(let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }
    drawInvader();

    if(squares[currentShooterIndex].classList.contains('invader', 'shoooter')) {
        resultsDisplay.innerHTML = 'Game Over';
        clearInterval(invadersId);
    }

    // Games Over if alien hits the bottom
    for(let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i] > squares[squares.length]) {
            resultsDisplay.innerHTML = 'Game Over';
            clearInterval(invadersId);
        }
    }


    // check for the WIN
    if(aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN';
        clearInterval(invadersId);
    }
}

invadersId = setInterval(moveInvader, 100);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if(squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultsDisplay.innerHTML = results;
        }
    }

    switch(e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 200);
    }
}

document.addEventListener('keydown', shoot);