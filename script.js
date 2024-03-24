let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();

let bgCol="Green"
let playerTurn=true;
var turn = 0;
var seconds = 0;
var score = 0;
var OpenCard1 = null;
var OpenCard2 = null;
var cords = []
var cards = []

let timer = setInterval(function() {
    if(turn==2){
        if(OpenCard1.img.src == OpenCard2.img.src){
            score+=1
            turn=0;
            crossCard(OpenCard1);
            crossCard(OpenCard2);
            OpenCard1 = null;
            OpenCard2 = null;
            if(playerTurn){
                document.getElementById("score1").textContent = String(parseInt(document.getElementById("score1").textContent)+1);
            }
            else{
                document.getElementById("score2").textContent = String(parseInt(document.getElementById("score2").textContent)+1);
            }
        }
        else{
            seconds += .1;
            if(seconds>=1){
                turn=0;
                seconds=0;
                OpenCard1.hide(); OpenCard2.hide();
                OpenCard1 = null;
                OpenCard2 = null;
                playerTurn = !playerTurn;
            }
        }
        
    }
    if(playerTurn){
        bgCol = "Lightgreen"
    }
    else{
        bgCol = "Yellow"
    }
    document.body.style.backgroundColor = bgCol
}, 100);  


class Card {
    constructor(src, pos){
        this.pos = pos;
        this.img = new Image();
        this.img.src = src;
        this.open = false;
    }
    draw(){
        if(this.img.complete) {
            ctx.drawImage(this.img, this.pos.x, this.pos.y, 200, 200);
        } 
        else {
            this.img.onload = () => {
                ctx.drawImage(this.img, this.pos.x, this.pos.y, 200, 200);
            }
        }
        this.open = true;
    };
    hide(){
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.pos.x, this.pos.y, 200, 200);
        this.open = false;
    }
}

function fillBackground(){
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0,0,canvas.width, canvas.height);
}

function shuffleArray(array){
    for(let i=0; i<array.length; i++){
        let r = Math.floor(Math.random() * (i+1));
        let temp = array[i];
        array[i] = array[r];
        array[r] = temp;
    }
    return array
}


function hideAll(){
    for(c of cards){
        c.hide();
    }
}

function detectClick(mX,mY){
    for(let c of cards){
        if( mX >= c.pos.x &&
            mX <= c.pos.x + 200 &&
            mY >= c.pos.y &&
            mY <= c.pos.y + 200 
            ){
                return c;
        }
    }
    return null;
}

function createCords(){
    for(let i=10;i<800; i+=210){
        for(let j=10; j<800; j+=210)
            cords.push({x:i, y: j})
    }
}

function createCards(){
    cards = [];
    for(let i=0; i<16; i+=2){
        let c = new Card("images/card"+String(i/2+1)+".jpg", randCords[i])
        cards.push(c)
        c = new Card("images/card"+String(i/2+1)+".jpg", randCords[i+1])
        cards.push(c)
    }
}

function reset(){
    turn = 0;
    seconds =0;
    bgCol = "Lightgreen";
    playerTurn = true;
    randCords = shuffleArray(cords);
    createCards();
    hideAll();
    document.getElementById("score1").textContent = 0
    document.getElementById("score2").textContent = 0

}

function crossCard(c){
    let x = c.pos.x
    let y = c.pos.y
    if(playerTurn){
        ctx.strokeStyle = "Lightgreen"
    }
    else{
        ctx.strokeStyle = "Yellow"
    }
    ctx.beginPath()
    ctx.moveTo(x,y);
    ctx.lineTo(x+200,y+200)
    ctx.stroke();
    ctx.moveTo(x+200,y);
    ctx.lineTo(x,y+200)
    ctx.stroke();
}

createCords();
var randCords = shuffleArray(cords)
fillBackground();
createCards();
hideAll();

canvas.addEventListener('click', function(event) {
    var mouseX = event.clientX - rect.left
    var mouseY = event.clientY - rect.top
    let card = detectClick(mouseX,mouseY); 
    if(turn<2 && card != null && !card.open){  
        if(turn==0){
            OpenCard1 = card
        }
        else if(turn == 1){
            OpenCard2 = card
        }    
        card.draw(); 
        turn +=1;
    }
});
