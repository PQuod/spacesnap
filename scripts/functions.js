// array of the current y axis
let currentImgsArray = [];

// Variables of positions
let horizonPosition = 3;
let nivHyper = 8;
let nivAtmos = 6;
let nivAbys = 0;

//X & Y first positions
let posX = 0;
let posY = horizonPosition;

let starter = true;

//Event listener on key down
document.onkeydown = checkKey;
document.onkeyup = keyboardWhite;
checkPosY();

//Check where on Y axis we are and which array to assign to currentImgsArray
function checkPosY() {
    currentImgsArray = imgsLatitudes[posY];
    // Repositioning to last posX on new Y axis in case former Y axis has fewer pics and posX is too far away
    if (posX > currentImgsArray.length) {
        posX = currentImgsArray.length;
    }
}


//Function on key down
function checkKey(event) {
    console.log(event);
    //Start (Hit 'Enter', display tuto)
    if(starter == true && (event.keyCode == '13' || event == '13')){
        document.canvas.src = "blank.jpg";
        playSound('sounds/launching.wav');
        document.getElementById("tuto").style.display = "inline-block";
        document.getElementById("demarrage").style.display = "none";
        document.getElementById("fintuto").style.display = "inline-block";
        starter = false;
        displayKeyboard();       
    }
    //Hit Enter again (display img posX = 1 and posY = horizon, hide start messages, display keyboard and menu)
    else if (posX == 0 && posY == horizonPosition) {
        if (event.keyCode == '13' || event == '13') {
            document.getElementById("tuto").style.display = "none";
            document.getElementById("fintuto").style.display = "none";
            document.getElementById("welcome").style.display = "none";
            posX += 1;
            loadImg();
            displayKeyboard();
            displayElement(document.getElementById("menu"));
            generateMap(document.getElementById("map"), document.
            getElementById("anchormap"));
            generateFeat();
            locateOnMap(document.getElementById("map"));
        }
    } else {
        // Hit 'Echap' to display credits
        if (event.keyCode == '27' || event == '27'){
            displayFeat();
        }
        if(document.getElementById("credits-container").style.display !== "inline-block"){
            // Hit 'i' to toggle legend
            if (event.keyCode == '73' || event == '73') {
                displayElement(document.getElementById("legende"));
            }
            // Hit 'm' to toggle map
            if (event.keyCode == '77' || event == '77'){
                displayElement(document.getElementById('map'));
            }

            //DIRECTIONS
            // If right arrow is pressed and we haven't reached last position on the X axis
            if ((event.keyCode == '39' || event == '39') && (posX < currentImgsArray.length) && (posX != 0 || posY != 0)) {
                posX += 1;
            }
            // If left arrow is pressed and we haven't reach first position on the X axis
            else if ((event.keyCode == '37' || event == '37') && (posX > 1)) {
                posX -= 1;
            }
            // If up arrow is pressed and we have not reached top of Y axis
            else if ((event.keyCode == '38' || event == '38') && (posY < imgsLatitudes.length - 1)) {
                posY += 1;
                checkPosY();
            }
            // If down arrow is pressed and we have not reached bottom of Y axis
            else if ((event.keyCode == '40' || event == '40') && (posY > 0)) {
                posY -= 1;
                checkPosY();
            }
        }
        //Function calls at each keydown
        locateOnMap(document.getElementById("map"));
        allSystemsDisconnected(document.getElementById("errormessage"));
        loadImg();
        keyboardRed(event);
        legendGenerate(document.getElementById("legende"));
    }
}


// Change canvas src with the corresponding X & Y img
function loadImg() {
    if (document.getElementById("credits-container").style.display == "none"){
        for (let i = 0; i < currentImgsArray.length; i++) {
            if (currentImgsArray.indexOf(currentImgsArray[i]) + 1 == posX) {
                document.canvas.src = currentImgsArray[i][0];
            }
        }
    }else{
        document.canvas.src = "imgs/sayonara.jpg";
    }
}

function displayElement(element){
    if(element.style.display == "none"){
        element.style.display = "inline-block";
    }else{
        element.style.display = "none";
    }
}

function displayFeat(){
    let creditsContainer = document.getElementById("credits-container");
    if(creditsContainer.style.display == "none"){
        document.getElementById("map").style.display = "none";
        document.getElementById("arrowkeyboard").style.display = "none";
        document.getElementById("legende").style.display = "none";
        creditsContainer.style.display = "inline-block";
        creditsContainer.style.height = "100vh";
    }else{
        creditsContainer.style.display = "none";
        document.getElementById("arrowkeyboard").style.display = "grid";
    }
}

// Coloration des touches activées
let activeKey = "";

function displayKeyboard() {
    let tuto = document.getElementById("tuto");
    if ((posX != 0) && tuto.style.display == "none") {
        document.getElementById("enterkey").style.display = "none";
        let arrowkeys = document.getElementsByClassName("arrowkey");
        for(let i = 0; i < arrowkeys.length; i++){
            arrowkeys[i].style.display = "inline-block";
        }
    }
}

// Cartographie
function generateMap(parentDiv, anchorMap) {
    for (let i = imgsLatitudes.length - 1; i >= 0; i--) {
        let spanNiv = document.createElement("span");
        //Generating one box for each img
        for (let j = 0; j < imgsLatitudes[i].length; j++) {
            const newP = document.createElement("p");
            newP.classList.add('inline-p');
            newP.classList.add(i + '_' + j);
            parentDiv.insertBefore(newP, anchorMap);
        }
        //Generating spans for each big "step", according to variables declared previously
        if(i== nivHyper){         
            spanNiv.innerHTML = "<br>Hyperespace<br>";         
        }
        if(i == nivAtmos){
            spanNiv.innerHTML = "<br>Atmosphère<br>";
        }
        if (i == horizonPosition) {
            spanNiv.innerHTML = "<br>Niveau de la mer<br>";
        }
        if(i == nivAbys){
            spanNiv.innerHTML = "<br>Abysses<br>";
        }
        parentDiv.insertBefore(spanNiv, anchorMap);
        //Inserting <br> at the end of each Y positions
        const newBr = document.createElement("br");
        parentDiv.insertBefore(newBr, anchorMap);
    }
}

function locateOnMap(map) {
    let imgPosX = 0;
    let imgPosY = 0;
    let children = map.getElementsByTagName('p');
    for (let i = 0; i < children.length; i++) {
        imgPositions = children[i].className.slice(children[i].className.indexOf(' ') + 1).split('_');
        imgPosX = parseInt(imgPositions[1]) + 1;
        imgPosY = parseInt(imgPositions[0]);
        if (posX == imgPosX && posY == imgPosY) {
            children[i].style.borderColor = 'red';
            children[i].style.background = "red";
        } else {
            children[i].style.borderColor = 'white';
            children[i].style.background = "none";
        }
    }
}

// Affichage des légendes
function legendGenerate(legende) {
    for (let i = 0; i < currentImgsArray.length; i++) {
        if (i + 1 == posX) {
            legende.innerHTML = currentImgsArray[i][1] + ' &middot; ' + currentImgsArray[i][2];
        }
    }
}

function keyboardRed(event) {
    if (event.keyCode == '39') {
        activeKey = "arrowright";
    } else if (event.keyCode == '37') {
        activeKey = "arrowleft";
    } else if (event.keyCode == '38') {
        activeKey = "arrowup";
    } else if (event.keyCode == '40') {
        activeKey = "arrowdown";
    } else if (event.keyCode == '77') {
        activeKey = "mapkey";
    } else if (event.keyCode == '27') {
        activeKey = "creditskey";
    } else if (event.keyCode == '73') {
        activeKey = "legendkey";
    } else if (event.keyCode == '13') {
        activeKey = "enterkey";
    }
    if (activeKey !== "") {
        document.getElementById(activeKey).style.border = "1px solid red";
        document.getElementById(activeKey).style.color = "red";
    }
}

function keyboardWhite() {
    if (activeKey !== "") {
        document.getElementById(activeKey).style.border = "1px solid white";
        document.getElementById(activeKey).style.color = "white";
        activeKey = "";
    }
}

function allSystemsDisconnected(error) {
    let map = document.getElementById("map");
    let menu = document.getElementById("menu");
    if (posY == imgsLatitudes.length - 1) {
        playSound('sounds/error.wav');
        map.style.opacity = "0";
        menu.style.opacity = "0";
        error.style.display = "inline-block";
        error.innerHTML = "↓↓↓↓&²@k↓<br>Altitude maximale atteinte //<br>surch4uffe f&jk% des systèmesV3uillez reDesc3ndre avant la fus1on des roéaiohcteurs<br>"
    } else {
        error.style.display = "none";
        menu.style.opacity = "1";
        map.style.opacity = "1";
    }
}

function generateFeat(){
    const creditCont = document.getElementById("credits-container");
    const anchorFeat = document.getElementById("anchorfeat");
    let featList = [];
    
    for(i = 0; i < imgsLatitudes.length; i++){
        for(j = 0; j < imgsLatitudes[i].length; j++){
            featList.push(imgsLatitudes[i][j][1]);  
        }
    }
    featList.push(imgCredit);
    featList = featList.sort();
    featList.push(soundCredit);
    console.log(featList);
    for(i = 0; i < featList.length; i++){
        if(featList[i] != featList[i-1])
        {const newP = document.createElement("p");
        newP.innerHTML = featList[i];
        creditCont.insertBefore(newP, anchorFeat);}
    }
}

function playSound(sound){
    var audio = new Audio(sound);
        audio.volume = 0.4;
    audio.play();
}


