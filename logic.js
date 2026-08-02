const modes={
    easy:{
        image:"assets/easy.png",
        hints:5,
        cooldown:5,
        correctFeedback:true
    },
    regular:{
        image:"assets/regular.png",
        hints:3,
        cooldown:15,
        correctFeedback:false
    },
    hard:{
        image:"assets/hard.png",
        hints:0,
        cooldown:0,
        correctFeedback:false
    }
};

const dbModes={
    easy:"easy",
    regular:"medium",
    hard:"hard"
};

const size=4;
let tiles=[];
let emptyIndex=15;
let moves=0;
let seconds=0;
let timerInterval=null;
let paused=false;
let currentMode="easy";
let hintsRemaining=5;
let hintCooldown=false;
let cooldownTimer=null;
let gameStarted = false;

document.addEventListener("DOMContentLoaded",()=>{
    if(document.getElementById("puzzleBoard")){
        initializeGame();
        setupGameEvents();
    }
    if(document.getElementById("leaderboardData")){
        loadLeaderboard();
    }
});

document.addEventListener("keydown",(event)=>{
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)){
        event.preventDefault();
    }

    if(paused || !gameStarted){
        return;
    }

    let target=-1;

    let row=Math.floor(emptyIndex/size);
    let col=emptyIndex%size;

    switch(event.key){

        case "ArrowUp":
            if(row<size-1){
                target=emptyIndex+size;
            }
            break;

        case "ArrowDown":
            if(row>0){
                target=emptyIndex-size;
            }
            break;

        case "ArrowLeft":
            if(col<size-1){
                target=emptyIndex+1;
            }
            break;

        case "ArrowRight":
            if(col>0){
                target=emptyIndex-1;
            }
            break;
    }

    if(target!==-1){
        moveTile(target);
    }
});



function initializeGame(){
    currentMode="easy";
    resetGame();
}

function setupGameEvents(){
    document.querySelectorAll(".mode-btn").forEach(button=>{
        button.addEventListener("click",()=>{
            document.querySelectorAll(".mode-btn").forEach(btn=>btn.classList.remove("active"));
            button.classList.add("active");
            currentMode=button.dataset.mode;
            resetGame();
            updateHintButton();
        });
    });

    document.getElementById("shuffleBtn").onclick=shuffle;
    document.getElementById("resetBtn").onclick=resetGame;
    document.getElementById("pauseBtn").onclick=togglePause;
    document.getElementById("hintBtn").onclick=requestHint;

    document.getElementById("playAgainBtn").onclick=()=>{
        document.getElementById("winModal").classList.add("hidden");
        resetGame();
    };

    setupModals();
}

function createBoard(){
    const board=document.getElementById("puzzleBoard");
    board.innerHTML="";

    tiles=[];

    for(let i=0;i<16;i++){
        tiles.push(i);

        let tile=document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.position=i;

        tile.addEventListener("click",()=>{
            if(!paused){
                moveTile(Number(tile.dataset.position));
            }
        });

        board.appendChild(tile);
    }

    emptyIndex=15;
    updateTiles();
}

function updateTiles(){
    const board=document.getElementById("puzzleBoard");
    const elements=[...board.children];

    elements.forEach((tile,index)=>{
        tile.dataset.position=index;

        tile.classList.remove("correct");
        tile.classList.remove("hint");

        let value=tiles[index];

        if(value===15){
            tile.className="tile empty";
            tile.style.backgroundImage="none";
        }else{
            tile.className="tile";
            setTileImage(tile,value);

            if(modes[currentMode].correctFeedback && value===index){
                tile.classList.add("correct");
            }
        }
    });

    emptyIndex=tiles.indexOf(15);
}

function setTileImage(tile,value){
    let row=Math.floor(value/4);
    let col=value%4;

    tile.style.backgroundImage=`url("${modes[currentMode].image}")`;
    tile.style.backgroundSize="400% 400%";
    tile.style.backgroundPosition=`${col*33.333}% ${row*33.333}%`;
}

function shuffle(){
    let shuffleCount=300;

    for(let i=0;i<shuffleCount;i++){
        let possible=getAdjacent(emptyIndex);
        let move=possible[Math.floor(Math.random()*possible.length)];
        swapTiles(move,emptyIndex);
    }

    moves=0;
    seconds=0;
    paused=false;

    clearInterval(timerInterval);
    startTimer();
    gameStarted = true;

    updateStats();
}

function moveTile(index){
    if(getAdjacent(emptyIndex).includes(index)){
        swapTiles(index,emptyIndex);
        moves++;
        updateStats();

        if(checkWin()){
            finishGame();
        }
    }
}

function swapTiles(a,b){
    [tiles[a],tiles[b]]=[tiles[b],tiles[a]];
    emptyIndex=tiles.indexOf(15);
    updateTiles();
}

function getAdjacent(index){
    let result=[];
    let row=Math.floor(index/4);
    let col=index%4;

    if(row>0) result.push(index-4);
    if(row<3) result.push(index+4);
    if(col>0) result.push(index-1);
    if(col<3) result.push(index+1);

    return result;
}

function checkWin(){
    return tiles.every((value,index)=>value===index);
}

function resetGame(){
    stopTimer();

    moves=0;
    seconds=0;
    paused=false;    
    gameStarted = false;


    hintsRemaining=modes[currentMode].hints;
    hintCooldown=false;

    createBoard();
    updateStats();
    updateHintButton();
}

function startTimer(){
    timerInterval=setInterval(()=>{
        if(!paused){
            seconds++;
            updateTimer();
        }
    },1000);
}

function stopTimer(){
    clearInterval(timerInterval);
}

function togglePause(){
    paused=!paused;

    document.getElementById("pauseBtn").textContent=
        paused?"Resume Timer":"Pause Timer";
}

function updateStats(){
    document.getElementById("moves").textContent=moves;
    updateTimer();
}

function updateTimer(){
    let min=Math.floor(seconds/60).toString().padStart(2,"0");
    let sec=(seconds%60).toString().padStart(2,"0");

    document.getElementById("timer").textContent=`${min}:${sec}`;
}

function updateHintButton(){
    let button=document.getElementById("hintBtn");

    if(currentMode==="hard"){
        button.style.display="none";
    }else{
        button.style.display="block";
        button.textContent=`Hint (${hintsRemaining})`;
    }
}

function requestHint(){
    if(currentMode==="hard") return;

    if(hintsRemaining<=0 || hintCooldown){
        return;
    }

    let correctMove=getBestHintTile();

    if(correctMove!==null){
        let tile=document.querySelector(`[data-position="${correctMove}"]`);

        if(tile){
            tile.classList.add("hint");

            setTimeout(()=>{
                tile.classList.remove("hint");
            },1500);
        }
    }

    hintsRemaining--;
    updateHintButton();

    hintCooldown=true;

    let remaining=modes[currentMode].cooldown;

    cooldownTimer=setInterval(()=>{
        remaining--;

        if(remaining<=0){
            clearInterval(cooldownTimer);
            hintCooldown=false;
        }
    },1000);
}

function getBestHintTile(){
    let possible=getAdjacent(emptyIndex);

    if(possible.length===0){
        return null;
    }

    return possible[Math.floor(Math.random()*possible.length)];
}

function finishGame(){
    stopTimer();

    document.getElementById("finalTime").textContent=document.getElementById("timer").textContent;
    document.getElementById("finalMoves").textContent=moves;

    document.getElementById("winModal").classList.remove("hidden");

    saveScore();
}

function saveScore(){
    let player=prompt("You won! Enter your name for the leaderboard(or leave blank to be Anonymous):");

    if(player){
        player=player.trim();
    }

    if(!player){
        player="Anonymous";
    }

    fetch("api.php?action=save",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            player:player,
            variant:dbModes[currentMode],
            moves:moves,
            time:seconds
        })
    });
}


function loadLeaderboard(){
    //sends request
    fetch("api.php?action=leaderboard")
    .then(response=>response.json())
    .then(scores=>{
        let table=document.getElementById("leaderboardData");
        table.innerHTML="";
        //new table row
        scores.forEach((score,index)=>{
            table.innerHTML+=`
            <tr>
                <td>${index+1}</td>
                <td>${score.player}</td>
                <td>${score.variant}</td>
                <td>${score.moves}</td>
                <td>${formatTime(score.solve_time)}</td>
            </tr>`;
        });
    });
}

function formatTime(seconds){
    let min=Math.floor(seconds/60).toString().padStart(2,"0");
    let sec=(seconds%60).toString().padStart(2,"0");

    return `${min}:${sec}`;
}