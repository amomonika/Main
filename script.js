let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

//Variablen initialisieren

let score = 0;
let scores=[];
let restart=false;
let start=false;
let direction="right";
let lastDirection="right";
let cols = 17;
let rows = 15;
let snake = [
    {x:7,y:8},
    {x:6,y:8},
    {x:5,y:8}
];
let apple = {
    x: 11,
    y: 8
};

let interval = document.getElementById("speed").value;
let gameInterval;



gameInterval = setInterval(gameLoop, interval);

//gameloop an Speed anpassen

document.getElementById("speed").addEventListener("input", function () {
   
    interval = document.getElementById("speed").value;

    clearInterval(gameInterval);

    gameInterval = setInterval(gameLoop, interval);
});

//Funktionen


//Tastatur abfragen
document.addEventListener("keydown", keyDown)

function keyDown(e){
    if (e.key == 'a' && direction != "right" && lastDirection != "right") {
        direction = "left";
    }
    if (e.key == 'w' && direction != "bot" && lastDirection != "bot") {
        direction = "top";
    }
    if (e.key == 'd' && direction != "left" && lastDirection != "left") {
        direction = "right";
    }
    if (e.key == 's' && direction != "top" && lastDirection != "top") {
        direction = "bot";
    }
    restart=false;
    if (e.key == ' ') {
        start = true;
        restart=true;
    }
}

//Hintergrund erstellen
function bg(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'grey';
    let x = 4;
    let y = 4;
    for(let j=0; j<rows;j++){
        for (let i = 0; i < cols; i++){
            ctx.fillRect(x,y,32,32);
            x = x+36;
        }
        x = 4
        y = y+36;
    }
    y = 4
}

//
function snk(){

    //Richtung ändern

    if(start==true){
        if(direction=="right" && lastDirection!="left"){
            temp = {x:snake[0].x+1, y:snake[0].y}
            snake.unshift(temp);
            lastDirection = direction;
        }
        if(direction=="left" && lastDirection!="right"){
            temp = {x:snake[0].x-1, y:snake[0].y}
            snake.unshift(temp);
            lastDirection = direction;
        }
        if(direction=="top" && lastDirection!="bot"){
            temp = {x:snake[0].x, y:snake[0].y-1}
            snake.unshift(temp);
            lastDirection = direction;
        }
        if(direction=="bot" && lastDirection!="top"){
            temp = {x:snake[0].x, y:snake[0].y+1}
            snake.unshift(temp);
            lastDirection = direction;
        }

        //Apfel essen

        if((snake[0].x)==(apple.x) && (snake[0].y)==(apple.y)){
            randApple();
            score++;
        }
        else{
            f = snake.pop();    //letztes Element der Schlange entfernen
        }
    }
    //Schlange auf canvas zeichnen
    for(let l=0;l<snake.length;l++){
        let a = snake[l].x;
        ax = (a*36)-36+4;
        let b = snake[l].y;
        bx = (b*36)-36+4;
        ctx.fillStyle = document.getElementById("col").value;
        ctx.fillRect(ax,bx,32,32);
    }
}

//Apfel zeichnen
function apl(){
    let a = apple.x;
    let ax = (a*36)-36+4
    let b = apple.y;
    let bx = (b*36)-36+4
    ctx.fillStyle = 'red';
    ctx.fillRect(ax,bx,32,32);
}
function randApple(){
    let x = apple.x;
    let y = apple.y;    

    while(existInSnake(x,y)==true){         //es wird ein Fald welches NICHT in der Schlange ist gesucht
        x = Math.floor(Math.random() * cols) + 1;       //math.floor --> abrunden, danach +1
        y = Math.floor(Math.random() * rows) + 1;       
    }
    apple = {x:x, y:y}
}
function existInSnake(x,y){
    return snake.some(coord => coord.x === x && coord.y === y);     //some --> mind. ein treffer, überprüft ob neuer Apfel in der Schlange vorkommt
}


function gameOver(){
    let snakeH = snake[0];
    let snakeB = snake.slice(1);
    let double = snakeB.find(f => f.x == snakeH.x && f.y == snakeH.y)   //checkt ob erste Element des Arrays Snake die gleichen Koordinaten wie eines der anderen hat


    if(snake[0].x<1 || snake[0].x>cols || snake[0].y<1 || snake[0].y>rows || double){   //Bedingungen fürs Verlieren
        start=false;
        if(score!=0){
            let speedSelect = document.getElementById("speed");
            let speedText = speedSelect.options[speedSelect.selectedIndex].text;
            scores.unshift({score: score, speed: speedText});                       // fügt Score zom Scoreboard hinzu
            score = 0;
        }
        
    }    
}



function playAgain(){                       //resettet alle variablen beim restarten
    if(start==false && restart==true){
        direction="right";
        lastDirection="right";
        snake = [
            {x:7,y:8},
            {x:6,y:8},
            {x:5,y:8}
        ]
        apple = {
            x: 11,
            y: 8
        };
    }
    
}


function updateTable(){                     //Scoreboard update
    var tab = "<table border='1|1'>"

    tab+='<tr>';
    tab+='<td>'+'Score'+'</td>';
    tab+='<td>'+'Speed'+'</td>';

    tab+='</tr>';

    if(scores.length<=20){
        len=scores.length
    }
    else{
        len=19
    }

        for(var i =0; i<len; i++){ 
            tab+='<tr>';
            tab+='<td>'+scores[i].score+'</td>';
            tab+='<td>'+scores[i].speed+'</td>';
            tab+='</tr>';
        }

        document.getElementById("table").innerHTML = tab
}



function gameLoop(){
    gameOver()
    playAgain()
    bg()
    snk()
    apl()
    updateTable()
}




